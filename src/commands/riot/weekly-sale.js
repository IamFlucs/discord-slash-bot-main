const { SlashCommandBuilder, ChannelType, MessageFlags, PermissionFlagsBits } = require('discord.js');
const { createLogger } = require('../../utils/logger/logger');
const wsSchema = require('../../database/schemas/weekly_sale');

const debugLog = true;
const logger = createLogger(debugLog);

/**
 * This command enable a specific text channel to be post weekly sale League of Legends.
 * Channel ID is stock in MongoDB.
 * ChannelType option is used to select only GuildText channels.
 */
module.exports = {
    data: new SlashCommandBuilder()
        .setName(`weekly-sale`)
        .setDescription('Manage League of Legends weekly sale channels.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand((subcommand) => subcommand
            .setName('setup')
            .setDescription('Sets up a channel to post weekly sale.')
            .addChannelOption((option) => option
                .setName('channel')
                .setDescription('The channel you want post to appear.')
                .addChannelTypes(
                    ChannelType.GuildText,
                    ChannelType.GuildAnnouncement
                )
                .setRequired(true)
            )
        )
        .addSubcommand((subcommand) => subcommand
            .setName('disable')
            .setDescription('Disable your weekly sale channel.')
            .addChannelOption((option) => option
                .setName('channel')
                .setDescription('The channel you want to disable.')
                .addChannelTypes(
                    ChannelType.GuildText,
                    ChannelType.GuildAnnouncement
                )
                .setRequired(true)
            )
        )
        .addSubcommand((subcommand) => subcommand
            .setName('list')
            .setDescription('List all the weekly sale channels.')
        ),
    async execute(interaction){
        const channel = interaction.options.getChannel('channel');
        const guildId = interaction.guild.id;
        const subCommand = interaction.options.getSubcommand();
        
        // SETUP WEEKLY SALE CHANNEL
        if (subCommand === 'setup') {
            const channelId = channel.id;
            const existingChannel = await wsSchema.findOne({ ws_channelId: channelId, ws_fk_guildId: guildId });

            if (existingChannel) {
                return await interaction.reply({
                    content: `The channel <#${channelId}> is already set for weekly sale posts.`,
                    flags: MessageFlags.Ephemeral
                });
            }

            try {
                const new_joinToCreateChannel = new wsSchema({
                    ws_fk_guildId: guildId,
                    ws_channelName: channel.name,
                    ws_channelId: channelId,
                });
                await new_joinToCreateChannel.save();

                await interaction.reply({
                    content: `The channel <#${channelId}> has been set to post weekly sale every monday around 7 PM.`,
                    flags: MessageFlags.Ephemeral
                });
            } catch (error) {
                const decode = JSON.stringify(error, null, 2);
                logger.debug(`Phase Z :: decoding in JSON: ${decode}`);

                logger.critical('Error saving weekly sale channel to database:', error);
                await interaction.reply({
                    content: `There was an error setting <#${channelId}> to weekly sale channels. Please try again later.`,
                    flags: MessageFlags.Ephemeral
                });
            }

        // DISABLE WEEKLY SALE CHANNEL
        } else if (subCommand === 'disable') {
            const channelId = channel.id;
            const existingChannel = await wsSchema.findOne({ ws_channelId: channelId, ws_fk_guildId: guildId });

            if (!existingChannel) {
                return await interaction.reply({
                    content: `The channel <#${channelId}> is not set to weekly sale channels.`,
                    flags: MessageFlags.Ephemeral
                });
            }

            try {
                await wsSchema.deleteOne({ ws_channelId: channelId/*, GuildID: guildId*/ }); //TODO: To be tested
                await interaction.reply({
                    content: `The channel <#${channelId}> has been disabled from weekly sale channels.`,
                    flags: MessageFlags.Ephemeral
                });
            } catch (error) {
                logger.error('Error removing weekly sale channel from database:', error);
                await interaction.reply({
                    content: 'There was an error disabling the weekly sale channels. Please try again later.',
                    flags: MessageFlags.Ephemeral
                });
            }

        // LIST WEEKLY SALE CHANNEL(S) OF GUILD
        } else if (subCommand === 'list') {
            try {
                const wsChannels = await wsSchema.find({ ws_fk_guildId: guildId });
                if (wsChannels.length === 0) {
                    await interaction.reply({
                        content: 'There are no channels set to post weekly sale in this server.',
                        flags: MessageFlags.Ephemeral
                    });
                } else {
                    const channelList = wsChannels.map(channel => `<#${channel.ws_channelId}>`).join('\n');
                    await interaction.reply({
                        content: `The following channels are set to post weekly sale:\n${channelList}`,
                        flags: MessageFlags.Ephemeral
                    });
                }
            } catch (error) {
                logger.error('Error fetching weekly sale channels from database:', error);
                await interaction.reply({
                    content: 'There was an error fetching the list of weekly sale channels. Please try again later.',
                    flags: MessageFlags.Ephemeral
                });
            }
        }
    }
};