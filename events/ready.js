const { Pool, Client } = require('pg');
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({
  connectionString,
})

module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
        pool.connect( (err, client, done) => {
            client.query('CREATE TABLE IF NOT EXISTS GAMES ( \
                channelid INT(255) primary key, \
                gamedata VARCHAR(MAX))', (err, result) => {
                    console.log("well it hadn't existed");
                    //disconnent from database on error
                    done(err);
            });
        });
		console.log(`Ready! Logged in as ${client.user.tag}`);
	},
};