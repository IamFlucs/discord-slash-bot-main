const { Events, ChannelType } = require('discord.js');
const { logger } = require('../utils/logger.js');
const fs = require('fs');

// ID of the channel where users will join to create temporary channels
const joinChannelFolder = './src/database/joinToCreate/';
const tempChannelFolder = './src/database/tempChannels/';

module.exports = {
    name: Events.VoiceStateUpdate,
    async execute(oldState, newState) {
        // const member = newState.guild.members.cache.get(newState.id) || (await newState.guild.members.fetch(newState.id));

        fs.readdir(joinChannelFolder, (err, files) => {
            if (err) {
                logger.warning(`Error reading joinToCreate folder. ${err}`);
                return;
            }

            files.forEach(file => {
                fs.readFile(`${joinChannelFolder}${file}`, 'utf-8', (err, data) => {
                    if (err) {
                        logger.warning(`Error reading file ${file}: ${err.stack}`);
                        return;
                    }
                    const joinChannel = JSON.parse(data);
                    const joinChannelId = joinChannel?.id;

                    // Check if user join a channel & if the channel is in joinChannels Collection
                    if (newState.channel !== null && newState?.channel?.id === joinChannelId) {
                        // Create a new temporary channel for the user
                        newState.guild.channels.create({
                            name: `${newState.member.user.displayName}'s Channel`,
                            type: ChannelType.GuildVoice, // Discord v14 api
                            parent: newState.channel.parent, 
                        }).then((channel) => { // move the user to the newly channel
                            logger.info(`\x1b[1mchannel-voice-update.js:\x1b[0m \x1b[32mCreating\x1b[0m ${channel.name}.`);
                            newState.member.voice.setChannel(channel);
                            // Create a json of the tempChannel
                            fs.writeFileSync(`${tempChannelFolder}${channel.id}.json`, JSON.stringify({ owner: newState.member.user.id }, null, 4));
                        }).catch(error => {
                            logger.warning(`Error creating channel: ${error.stack}`);
                        });
                    }
                });
            });
        });

        // Check if user leaves a channel & if the channel is empty & if the channel is different from joinChannels Collection
        if (oldState.channel !== null && oldState?.channel?.members?.size === 0 /*  && oldState?.channel?.id != joinChannel  */ && fs.existsSync(`${tempChannelFolder}${oldState?.channel?.id}.json`)) {
            // Delete json file first
            if (fs.existsSync(`${tempChannelFolder}${oldState?.channel?.id}.json`)) {
                fs.unlinkSync(`${tempChannelFolder}${oldState?.channel?.id}.json`);
            }
            // Delete the temporary channel
            logger.info(`\x1b[1mchannel-voice-update.js:\x1b[0m \x1b[31mDeleting\x1b[0m ${oldState.channel.name}.`); // logger need to be first
            await oldState.channel.delete().catch(error => logger.warning(`No permissions to delete channels.`));
        }
    }
};