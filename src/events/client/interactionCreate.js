const { createLogger } = require('../../utils/logger/logger.js')

const debugLog = true;
const logger = createLogger(debugLog);

module.exports = {
	name: 'interactionCreate',
    
	async execute(interaction, client) {
		if (interaction.isChatInputCommand()) {
            const { commands } = client;
            const { commandName } = interaction;
            const command = commands.get(commandName);            
            if (!command) return;

            try {
                await command.execute(interaction, client);
            } catch (error) {
                logger.warning(`./src/events/interactionCreate.js: something went wrong while processing this command...`)
                logger.error(error);
                await interaction.reply({ 
                    content: `There was an error while processing this command!`, 
                    ephemeral: true,
                });
            }
        } else if (interaction.isButton()) {
            const { buttons } = client;
            const { customId } = interaction;
            const button = buttons.get(customId);
            if (!button) return new Error('There is no code here bro. Check chatGPT.');

            try {
                await button.execute(interaction, client);
            } catch (error) {
                logger.warning(`./src/events/interactionCreate.js: something went wrong while processing this button...`)
                logger.error(error);
                await interaction.reply({ 
                    content: `There was an error while processing this button!`, 
                    ephemeral: true,
                });
            }
        }
	},
};