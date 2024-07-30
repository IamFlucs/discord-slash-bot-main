const { Events, ChannelType } = require('discord.js');
const { logger } = require('../../utils/tools/logger');
const guildSchema = require('../../schemas/guild');
const voiceSchema = require('../../schemas/jointocreate');
const guild = require('../../schemas/guild');

/**
 * This event detects when user joins a voice channel set up.
 * This event create a temporary voice channel and move the user into it.
 * Also delete the channel when empty.
 */
module.exports = {
    name: Events.VoiceStateUpdate,
    async execute(oldState, newState) {

        try {
            // Get all channels from the database (permanent or not)
            const tempChannels = await voiceSchema.find({ jtc_isPermanent: true });
            // If user join channel && channel is 'join to create'
            if (newState.channel !== null) {
                const tempChannel = tempChannels.find(channel => channel.jtc_channelId === newState.channel.id && channel.jtc_isPermanent);
                if (tempChannel) {
                    // Create a new temporary channel for the user
                    const channel = await newState.guild.channels.create({
                        name: `${newState.member.user.displayName}'s Channel`,
                        type: ChannelType.GuildVoice,
                        parent: newState.channel.parent,
                    });

                    // logger.info(`\x1b[1mchannel-voice-update.js:\x1b[0m \x1b[32mCreating\x1b[0m ${channel.name}.`);

                    // Move user voice to the temporary channel
                    await newState.member.voice.setChannel(channel);

                    // Add the temporary channel to the database
                    const new_voiceSchema = new voiceSchema({
                        jtc_fk_guildId: newState.guild.id,
                        jtc_channelName: channel.name,
                        jtc_channelId: channel.id,
                        jtc_isPermanent: false,
                    });

                    await new_voiceSchema.save();
                }
            }

            // Check if the user leaves a channel, if the channel is empty & if the channel is different from tempChannels Collection
            if (oldState.channel !== null && oldState.channel.members.size === 0) {
                const tempChannel = await voiceSchema.findOne({ jtc_channelId: oldState.channel.id, jtc_isPermanent: false });
                if (tempChannel) {
                    // Delete temporary channel from database
                    await voiceSchema.deleteOne({ jtc_channelId: oldState.channel.id });

                    // logger.info(`\x1b[1mchannel-voice-update.js:\x1b[0m \x1b[31mDeleting\x1b[0m ${oldState.channel.name}.`);

                    // Delete temporary channel
                    await oldState.channel.delete();
                }
            }
        } catch (error) {
            logger.warning(`Error processing voice state update: ${error.stack}`);
        }
    }
};