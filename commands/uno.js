const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');
const fs = require('node:fs');
//let uno = require('../uno.json'); //change this to the postgresql
/*const { Pg } = require('pg');
const pg = new Pg();
await pg.connect();
const res = await pg.query('SELECT $1::text as message', ['Hello world!'])
console.log(res.rows[0].message) // Hello world!
await client.end()*/
const { Pool, Client } = require('pg');
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({
  connectionString,
})
/*pool.query('SELECT NOW()', (err, res) => {
  console.log(err, res)
  pool.end()
})
const client = new Client({
  connectionString,
})
client.connect()
client.query('SELECT NOW()', (err, res) => {
  console.log(err, res)
  client.end()
})*/


module.exports = {
	data: new SlashCommandBuilder()
		.setName('uno')
		.setDescription('Start an UNO game! (Not functional yet)'),
	async execute(interaction) {
        
        
        let channel = String(interaction.channel.id);
        console.log(channel);
        /*if(uno.games[channel]) { //If a game has already been started
            return interaction.reply('A game has already started in this channel!')
        }*/

		const message = await interaction.reply({ 
            content: 'Click ✅ to join the game!', 
            fetchReply: true 
        });
		message.react('✅').catch(error => console.error('Failed to react with checkmark', error));
        const messageId = message.id;

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`startUno: ${messageId}`)
                    .setLabel('Start')
                    .setStyle(ButtonStyle.Success),
            );

        const hostMessage = await interaction.followUp({
            content: 'Click **Start** to start this game!',
            ephemeral: true,
            components: [row],
            fetchReply: true
        })

        const collector = hostMessage.createMessageComponentCollector({ componentType: ComponentType.Button, time: 30000 });
        let startCheck = false;

        collector.on('collect', async i => {
            // Start is clicked
            let gameExist = false;
            ;(async () => {
                const { rows } = await pool.query('SELECT channelid FROM games WHERE EXISTS (SELECT channelid FROM games WHERE channelid = $1)', [Number(channel)])
                console.log(rows);
                gameExist = rows[0] ? false : true
                console.log(gameExist);
              })().catch(err =>
                setImmediate(() => {
                  throw err
                })
              )
            if(gameExist) { //If a game is already happening in the channel
                startCheck = true;
                await interaction.editReply(`There is already an active game in this channel.`)
                await i.update({
                    content: 'Could not start the game; one is already in progress in this channel.',
                    ephemeral: true,
                    components: []
                });
                return;
            }
            //get all humans who reacted with check
            let userReactions = await message.reactions.cache.get('✅').users.fetch();
            userReactions = userReactions.filter(user => user.bot === false)

            
            //Game cannot start cases:
            //if less than 2 players
            //if game is already happening in this channel

            if(userReactions.size >= 2 && userReactions.size <= 4) {
                //Game is starting cases: (2+ people)
                startCheck = true;
                await i.update({
                    content: 'The Game has Started!',
                    ephemeral: true,
                    components: []
                });
                
                let peopleInGame = [];
                userReactions.forEach(user => peopleInGame.push(String(user.id)));
                await interaction.editReply(`The following users are in: ${peopleInGame.map(userid => `<@${userid}>`)}`)
                
                function dealHand(amount, array) {
                    let hand = [];
                    for(let index = 0; index < amount; index++) {
                        hand.push(array[array.length - 1]);
                        array.pop();
                    }
                    return hand;
                }
                function shuffle(array) {
                    let currentIndex = array.length,  randomIndex;
                
                    // While there remain elements to shuffle.
                    while (currentIndex != 0) {
                
                        // Pick a remaining element.
                        randomIndex = Math.floor(Math.random() * currentIndex);
                        currentIndex--;
                    
                        // And swap it with the current element.
                        [array[currentIndex], array[randomIndex]] = [
                            array[randomIndex], array[currentIndex]];
                    }
                    return array;
                }

                let deck = [];
                function addCards(color, name, amount) {
                    for(let index = 0; index < amount; index++) {
                        deck.push(`${color}${name === false ? "" : "_" + name}`);
                    }
                }
                let colors = ["Green", "Red", "Blue", "Yellow"];
                for(let color of colors) {
                    for(let index = 1; index < 10; index++) {
                        addCards(color, index, 2);
                    }
                    addCards(color, "0", 1);
                    addCards(color, "Draw_2", 2);
                    addCards(color, "Skip", 2);
                    addCards(color, "Reverse", 2);
                }
                addCards("Wild", false, 4);
                addCards("Wild", "Draw_4", 4);
                deck = shuffle(deck);

                let gameObject = {
                    "deck": deck,
                    "played": deck[deck.length - 1],
                    "users": {},
                    "turns": 0,
                    "activeTurn": 0,
                    "direction": "forward",
                    "order": peopleInGame
                }
                deck.pop();
                userReactions.forEach(user => {
                    let userObject = {
                        "username": user.username,
                        "hand": dealHand(7, deck),
                        "turnsPlayed": 0,
                        "plusFours": 0,
                        "unoCalls": 0
                    }
                    gameObject.users[String(user.id)] = userObject;
                })
                gameObject = JSON.stringify(gameObject);
                console.log(gameObject);
                pool.connect( (err, client, done) => {
                    //insert the game into database
                    client.query('INSERT INTO games (channelid, gamedata) VALUES ($1, $2)',
                    [Number(channel), gameObject], (err, result) => {
        
                        done(err);
                        console.log(result.rowCount);
                    });
                });
                //uno.games[channel] = gameObject;

                /* fs.writeFile('userdata.json', JSON.stringify(userData), (err) => {
                    if(err) console.error(err);
                }); */ //get postgreSQL to work!
            } else {
                //await i.deferUpdate(); //defer it, reset it.
                
                if(userReactions.size < 2) await i.update('Not enough people have joined the game!')
                else await i.update('Too many (more than 4) people have joined the game!')
            }
            
        });

        collector.on('end', async collected => {
            if(!startCheck) {
                //Timed out
                await interaction.editReply('The game has timed out.')
            }
        });
	},
};
/*
{
    "games": {
        "channelid": {
            "deck": [],
            "played": [],
            "users": {
                "userid": {
                    "username": "",
                    "hand": [],
                    "turnsPlayed": 0,
                    "plusFours": 0,
                    "unoCalls": 0
                }
            },
            "turns": 0,
            "activeturn": 0,
            "direction": "forward",
            "order": []
        }
    },
    "stats": {
        "userid": {
            "wins": 0,
            "plusFours": 0,
            "turnsPlayed": 0,
            "unoCalls": 0
        }
    }
}
*/