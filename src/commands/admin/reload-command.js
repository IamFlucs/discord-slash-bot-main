const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { createLogger } = require('../../utils/logger/logger.js');
const fs = require('node:fs');
const path = require('node:path');

// Path to the commands folder
const commandsPath = path.join(__dirname, '..');

// Function to find the full path of a command file
function findCommandFile(directory, commandName) {
    const files = fs.readdirSync(directory);

    for (const file of files) {
        const fullPath = path.join(directory, file);
        const type = fs.lstatSync(fullPath);

        if (type.isDirectory()) {
            const result = findCommandFile(fullPath, commandName);
            if (result) {
                return result;
            }
        } else if (type.isFile() && file === `${commandName}.js`) {
            return fullPath;
        }
    }

    return null;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reload-command')
        .setDescription('Reload a specific command')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption(option => option
            .setName('command')
			.setDescription('The command to reload.')
			.setRequired(true)),

	async execute(interaction) {
        const debugLog = true;
        const logger = createLogger(debugLog);

        const commandName = interaction.options.getString('command', true).toLowerCase();
        const command = interaction.client.commands.get(commandName);

        if (!command) {
            return interaction.reply({ content: `There is no command with name \`${commandName}\`!`, ephemeral: true });
        }
        
        const commandFilePath = findCommandFile(commandsPath, commandName);
        if (!commandFilePath) {
            return interaction.reply({ content: `Could not find command file for \`${commandName}\`!`, ephemeral: true });
        }

        delete require.cache[require.resolve(commandFilePath)];

        try {
            const newCommand = require(commandFilePath);
            interaction.client.commands.set(newCommand.data.name, newCommand);
            await interaction.reply({ content: `Command \`${newCommand.data.name}\` was reloaded!`, ephemeral: true });
        } catch (error) {
            logger.error(error);
            await interaction.reply({ content: `There was an error while reloading a command \`${command.data.name}\`:\n\`${error.message}\``, ephemeral: true });
        }
    },
};

