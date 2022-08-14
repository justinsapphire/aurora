let pool = require('../pool.js');

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