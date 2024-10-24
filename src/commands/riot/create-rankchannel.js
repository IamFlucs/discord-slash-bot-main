const { SlashCommandBuilder, PermissionsBitField, PermissionFlagsBits, ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { createLogger } = require('../../utils/logger/logger');
const RankChannel = require('../../database/schemas/rank_channel');
const Guild = require('../../database/schemas/guild');

const debugLog = true;
const logger = createLogger(debugLog);

/**
 * Perms: @administrator.
 * Description: create a new rankUpdate channel with registered users.
 * Dependance: /
 */
module.exports = {
    data: new SlashCommandBuilder()
        .setName('create-rankchannel')
        .setDescription('Creates a new rankchannel in which I send updates about the rank of registered players.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption(option => option
            .setName('rankchannel-name')
            .setDescription('The name for the rankchannel')
            .setRequired(true)),        

    async execute(interaction) {
        const guildId = interaction.guild.id;
        const channelName = interaction.options.getString('rankchannel-name');
        const timestamp = Math.floor(Date.now() / 1000);

        try {
            // Find the server in the db
            let searchedGuild = await Guild.findOne({ guild_guildId: guildId });

            // Check if an rankChannel already exists for this server
            const searchedRankChannel = await RankChannel.findOne({ rankChannel_fk_guild: searchedGuild ? guildId : null });
            if (searchedRankChannel) {
                return interaction.reply({
                    content: `A rankchannel already exists: <#${searchedRankChannel.rankChannel_channelId}>.`,
                    ephemeral: true
                });
            }

            // Create the rank channel
            const rankChannelText = await interaction.guild.channels.create({
                name: channelName,
                type: ChannelType.GuildText,
                permissionOverwrites: [
                    {
                        id: interaction.guild.id, // @everyone role
                        allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.ReadMessageHistory],
                        deny: [PermissionsBitField.Flags.SendMessages],
                    },
                    {
                        id: interaction.client.user.id, // Bot role
                        allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.ReadMessageHistory, PermissionsBitField.Flags.SendMessages],
                    },
                ]
            });

            // Save new information in the database
            const newRankChannel = new RankChannel({
                rankChannel_fk_guild: searchedGuild.guild_guildId,
                rankChannel_channelId: rankChannelText.id,
                rankChannel_updateDaily: timestamp,
                rankChannel_updateWeekly: timestamp,
                rankChannel_updateMonthly: timestamp
            });
            await newRankChannel.save();

            interaction.reply({ 
                content: `Rankchannel <#${rankChannelText.id}> created successfully.`,
                ephemeral: true,
            });

        } catch (error) {
            logger.error(`Error creating info channel: ${error}`);
            interaction.reply({ 
                content: 'Failed to create information channel.',
                ephemeral: true,
            });
        }
    }
};