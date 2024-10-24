const { REST, Routes, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { clientId, guildId, token } = require('../../../config.json');
const { createLogger } = require('../../utils/logger/logger');
const fs = require('node:fs');
const path = require('node:path');

// Command folder path
const commandsFolderPath = path.join(__dirname, '../commands');
const commands = [];

console.clear();

const debugLog = true;
const logger = createLogger(debugLog);

// BROWSE SLASH COMMANDS
function loadCommandsFromDirectory(directory) {
	const files = fs.readdirSync(directory);

	for (const file of files) {
		const fullPath = path.join(directory, file);
		const type = fs.lstatSync(fullPath);
		
		if (type.isDirectory()) {
			// If it's a folder, we go through it recursively
			loadCommandsFromDirectory(fullPath);
		} else if (type.isFile() && file.endsWith('.js')) {
			// If it's a .js file, add it to commands
			const command = require(fullPath);
			if ('data' in command && 'execute' in command) {
				commands.push(command.data.toJSON());
			} else {
				logger.warning(`The command at ${fullPath} is missing a required "data" or "execute" property. Please check your command code.`);
			}	
		}
	}
}

const rest = new REST().setToken(token);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reload-commands')
        .setDescription('Reload all global slash commands.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption(option => option
			.setName('command')
            .setDescription('The command to reload.')
            .setRequired(true)
        ),
    // Need an admin protection for this command !
    // ToDo !!
	async execute(interaction) {
    const commandName = interaction.options.getString('command', true).toLowerCase();
		const command = interaction.client.commands.get(commandName);

		if (!command) {
			return interaction.reply({
                content: `There is no command with name \`${commandName}\`!`,
                ephemeral: true
            });
		}

        // Call the browse slash commands function
        loadCommandsFromDirectory(commandsFolderPath)

        // Commands deployment
        try {
            logger.info(`>> Started refreshing ${commands.length} application (/) commands.`);
    
            const data = await rest.put(
                // For guild deployment only - pasted the id 
                // // Routes.applicationGuildCommands(clientId, '1153242981319577611'),

                // For gloabl deployment - publish to all guilds that your bot is in
                Routes.applicationCommands(clientId),
                { body: commands },
            );
            
            logger.ok(`>> Successfully reloaded ${data.length} application (/) commands.`);
        } catch(error) {
            logger.warning(error);
        }

    }
};