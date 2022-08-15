let pool = require('../pool.js');

module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
        pool.connect( (err, clients, done) => {
            clients.connection.on('message', console.log)
            clients.query('CREATE TABLE IF NOT EXISTS GAMES ( \
                channelid INT(255) primary key, \
                gamedata VARCHAR(MAX))', (err, result) => {
                    console.log(result ? result : "no result?");
                    //disconnent from database on error
                    done(err);
            });
        });
		console.log(`Ready! Logged in as ${client.user.tag}`);
	},
};