let pool = require('../pool.js');

module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
        let clients = await pool.connect()
        let result = await clients.query({
            rowMode: 'array',
            text: 'CREATE TABLE IF NOT EXISTS GAMES ( \
                channelid INT(255) primary key, \
                gamedata VARCHAR(MAX))'
        })
        console.log(result ? result.rows : "no result") // [ [ 1, 2 ] ]
        await clients.end()

		console.log(`Ready! Logged in as ${client.user.tag}`);
	},
};