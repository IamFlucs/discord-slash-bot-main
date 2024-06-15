// Add a voice-channel to the joinToCreate channels list
const { SlashCommandBuilder } = require('discord.js');
const { logger } = require('../utils/logger.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('add-jtc-channel')
        .setDescription('Add the voice channel from the JoinToCreate channels list.')
        .addChannelOption(option => 
            option.setName('channel')
                .setDescription('Select a voice channel')
                .setRequired(true)),
    async execute(interaction) {
        const selectedChannel = interaction.options.getChannel('channel');
        const folder = `./src/database/joinToCreate`;

        // Check if the selected channel is a voice channel
        if (selectedChannel.type !== 2) { // GUILD_VOICE = 2
            return interaction.reply({ content: 'Please select a voice channel.', ephemeral: true });
        }

        // Check if the selected channel is in the join-to-create list
        if (fs.existsSync(`${folder}/${selectedChannel.id}.json`)) {
            return interaction.reply({ content: `${selectedChannel.name} already in the joinToCreate list.`, ephemeral: true });
        }

        // Create json of the selected channel
        fs.writeFileSync(`${folder}/${selectedChannel.id}.json`, JSON.stringify({ name: selectedChannel.name, id: selectedChannel.id }, null, 4));
        
        // Log the join-to-create list in console
        logger.info(`\x1b[1madd-jtc-channel.js:\x1b[0m \x1b[32m${selectedChannel.name} added\x1b[0m to the joinToCreate list.`);
        logger.info(`List of join-to-create channels:`);
        for (const file of fs.readdirSync(folder).filter(file => file.endsWith('.json'))) {
            fs.readFile(`${folder}/${file}`, 'utf-8', (err, data) => {                
                var channel = JSON.parse(data)
                logger.info(`- ${channel.name} (${channel.id})`);
            });
        }
        return interaction.reply({ content: `**${selectedChannel.name}** has been added to the joinToCreate list.`, ephemeral: true });
    }
};
