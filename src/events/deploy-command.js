const { REST, Routes } = require('discord.js');
const { clientId, guildId, token } = require('../../config.json');
const { logger } = require('../utils/logger.js');
const fs = require('node:fs');
const path = require('node:path');

const commands = [];
const foldersPath = path.join(__dirname, '../commands');
const commandFiles2 = fs.readdirSync(foldersPath).filter(file => file.endsWith('.js'));

console.clear();

for (const file of commandFiles2) {
	const filePath = path.join(foldersPath, file);
	const command = require(filePath);
	if ('data' in command && 'execute' in command) {
		commands.push(command.data.toJSON());
	} else {
		logger.warning(`The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

const rest = new REST().setToken(token);

(async () => {
	try {
		logger.phase(`>> Started refreshing ${commands.length} application (/) commands.`);

		const data = await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands },
		);
		
		logger.ok(`>> Successfully reloaded ${data.length} application (/) commands.`);
	} catch(error) {
		logger.warning(error);
	}
})();

// Deleting all commands for global commands
rest.put(Routes.applicationCommands(clientId), { body: [] })
    .then(() => logger.ok('>> Successfully deleted all application commands.'))
    .catch(console.error);

// Grab all the command folders from the commands directory you created earlier
// const foldersPath = path.join(__dirname, '../../src/');
// const commandFolders = fs.readdirSync(foldersPath);

// for (const folder of commandFolders) {
// 	// Grab all the command files from the commands directory you created earlier
// 	const commandsPath = path.join(foldersPath, folder);
// 	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
// 	// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
// 	for (const file of commandFiles) {
// 		const filePath = path.join(commandsPath, file);
// 		const command = require(filePath);
// 		if ('data' in command && 'execute' in command) {
// 			commands.push(command.data.toJSON());
// 		} else {
// 			logger.warning(`The command at ${filePath} is missing a required "data" or "execute" property.`);
// 		}
// 	}
// }

// // Construct and prepare an instance of the REST module
// const rest = new REST().setToken(token);

// // and deploy your commands!
// (async () => {
// 	try {
// 		logger.info(`Started refreshing ${commands.length} application (/) commands.`);

// 		// The put method is used to fully refresh all commands in the guild with the current set
// 		const data = await rest.put(
// 			Routes.applicationGuildCommands(clientId, guildId),
// 			{ body: commands },
// 		);

// 		logger.ok(`Successfully reloaded ${data.length} application (/) commands.`);
// 	} catch (error) {
// 		// And of course, make sure you catch and log any errors!
// 		logger.error(error);
// 	}
// })();