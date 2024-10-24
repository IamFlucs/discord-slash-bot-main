const { SlashCommandBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');
const { createLogger } = require('../../utils/logger/logger');
const voiceSchema = require('../../database/schemas/jointocreate');

const debugLog = true;
const logger = createLogger(debugLog);

/**
 * This command enable a specific voice channel to be a temporary voice channels creator.
 * Voice Channel ID is stock in MongoDB.
 * ChannelType option is used to select only GuildVoice channels.
 */
module.exports = {
    data: new SlashCommandBuilder()
        .setName(`join-to-create`)
        .setDescription('Manage join to create voice channels.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand((subcommand) => subcommand
            .setName('setup')
            .setDescription('Sets up your join to create channel.')
            .addChannelOption((option) => option
                .setName('channel')
                .setDescription('The channel you want to a join to create vc.')
                .addChannelTypes(ChannelType.GuildVoice)
                .setRequired(true)
            )
        )
        .addSubcommand((subcommand) => subcommand
            .setName('disable')
            .setDescription('Disable your join to create voice channel.')
            .addChannelOption((option) => option
                .setName('channel')
                .setDescription('The join to create vc you want to disable.')
                .addChannelTypes(ChannelType.GuildVoice)
                .setRequired(true)
            )
        )
        .addSubcommand((subcommand) => subcommand
            .setName('list')
            .setDescription('List all the join to create voice channels.')
        ),
    async execute(interaction){
        const channel = interaction.options.getChannel('channel');
        const guildId = interaction.guild.id;
        const subCommand = interaction.options.getSubcommand();
        
        // SETUP TEMPORARY CHANNEL
        if (subCommand === 'setup') {
            const channelId = channel.id;
            const existingChannel = await voiceSchema.findOne({ jtc_channelId: channelId, jtc_fk_guildId: guildId });

            if (existingChannel) {
                return await interaction.reply({
                    content: `The channel <#${channelId}> is already set to create temporary voice channels.`,
                    ephemeral: true
                });
            }

            try {
                const new_joinToCreateChannel = new voiceSchema({
                    jtc_fk_guildId: guildId,
                    jtc_channelName: channel.name,
                    jtc_channelId: channelId,
                    jtc_isPermanent: true,
                });
                await new_joinToCreateChannel.save();

                await interaction.reply({
                    content: `The channel <#${channelId}> has been set to create join to create voice channels.`,
                    ephemeral: true
                });
            } catch (error) {
                const decode = JSON.stringify(error, null, 2);
                logger.debug(`Phase Z :: decoding in JSON: ${decode}`);

                logger.critical('Error saving temp voice channel to database:', error);
                await interaction.reply({
                    content: `There was an error setting <#${channelId}> to temporary voice channels. Please try again later.`,
                    ephemeral: true
                });
            }

        // DISABLE TEMPORARY CHANNEL
        } else if (subCommand === 'disable') {
            const channelId = channel.id;
            const existingChannel = await voiceSchema.findOne({ jtc_channelId: channelId, jtc_fk_guildId: guildId });

            if (!existingChannel) {
                return await interaction.reply({
                    content: `The channel <#${channelId}> is not set to create temporary voice channels.`,
                    ephemeral: true
                });
            }

            try {
                await voiceSchema.deleteOne({ jtc_channelId: channelId/*, GuildID: guildId*/ }); //TODO: To be tested
                await interaction.reply({
                    content: `The channel <#${channelId}> has been disabled from join to create voice channels.`,
                    ephemeral: true
                });
            } catch (error) {
                logger.error('Error removing temp voice channel from database:', error);
                await interaction.reply({
                    content: 'There was an error disabling the temporary voice channels. Please try again later.',
                    ephemeral: true
                });
            }

        // LIST TEMPORARY CHANNEL(S) OF GUILD
        } else if (subCommand === 'list') {
            try {
                const jtcChannels = await voiceSchema.find({ jtc_fk_guildId: guildId });
                if (jtcChannels.length === 0) {
                    await interaction.reply({
                        content: 'There are no channels set to create temporary voice channels in this server.',
                        ephemeral: true
                    });
                } else {
                    const channelList = jtcChannels.map(channel => `<#${channel.jtc_channelId}>`).join('\n');
                    await interaction.reply({
                        content: `The following channels are set to create temporary voice channels:\n${channelList}`,
                        ephemeral: true
                    });
                }
            } catch (error) {
                logger.error('Error fetching temp voice channels from database:', error);
                await interaction.reply({
                    content: 'There was an error fetching the list of temporary voice channels. Please try again later.',
                    ephemeral: true
                });
            }
        }
    }
};