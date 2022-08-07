const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('uno')
		.setDescription('Start an UNO game! (Not functional yet)'),
	async execute(interaction) {
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

            const userReactions = await message.reactions.cache.get('✅').users.fetch();
            userReactions.forEach(user => console.log(user))
            userReactions.forEach(user => console.log(user.bot))
            userReactions.filter(user => {
                if(user.bot) return false;
                else return true;
            })
            console.log(userReactions.size + " before");
            userReactions.filter(user => user.bot === false)

            //Game cannot start cases:
            //if less than 2 players
            console.log(userReactions.size);
            //if game is already happening in this channel/with these people?


            if(userReactions.size >= 2) {
                //Game is starting cases: (2+ people)
                startCheck = true;
                await i.update({
                    content: 'The Game has Started!',
                    ephemeral: true,
                    components: []
                });
                
                let peopleInGame = [];
                userReactions.forEach(user => peopleInGame.push(user.id));
                interaction.followUp(`The following users are in: ${peopleInGame}`)
            } else {
                //await i.deferUpdate(); //defer it, reset it.
                
                if(userReactions.size < 2) await i.update('Not enough people have joined the game!')
                else await i.deferUpdate();
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
