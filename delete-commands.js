const { REST } = require('@discordjs/rest');
const { Routes } = require('discord.js');
const { clientId, guildId } = require('./config.json');
const token = process.env.TOKEN;

const rest = new REST({ version: '10' }).setToken(token);

// replace 'commandID' with the command ID

// for guild-based commands
/*
rest.delete(Routes.applicationGuildCommand(clientId, guildId, 'commandId'))
	.then(() => console.log('Successfully deleted guild command'))
	.catch(console.error);
*/

// for global commands
///*
rest.delete(Routes.applicationCommand(clientId, 'commandId'))
	.then(() => console.log('Successfully deleted application command'))
	.catch(console.error);
//*/


//delete all commands
// for guild-based commands
/*
rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: [] })
	.then(() => console.log('Successfully deleted all guild commands.'))
	.catch(console.error);
*/

// for global commands
/*
rest.put(Routes.applicationCommands(clientId), { body: [] })
	.then(() => console.log('Successfully deleted all application commands.'))
	.catch(console.error);
*/