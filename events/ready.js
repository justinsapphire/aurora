const { Pool, Client } = require('pg');
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({
  connectionString,
})

module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		/*;(async () => {
            await pool.query('CREATE TABLE IF NOT EXISTS games (channelid INT(255) NOT NULL, gamedata VARCHAR(max) NOT NULL, PRIMARY KEY (channelid))')
        })().catch(err =>
            setImmediate(() => {
				console.log("error");
                throw err
            })
        )*/
        pool.connect( (err, client, done) => {
            client.query('create table if not exists games( \
                channelid INT(255) primary key, \
                gamedata VARCHAR(MAX))', (err, result) => {
                    //disconnent from database on error
                    done(err);
            });
        });
		console.log(`Ready! Logged in as ${client.user.tag}`);
	},
};