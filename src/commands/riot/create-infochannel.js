const { SlashCommandBuilder, PermissionsBitField, PermissionFlagsBits, ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { createInfoPanel } = require('../../content/infochannel/createInfoPanel');
const { createTimestamp } = require('../../utils/date/timestamp');
const { createLogger } = require('../../utils/logger/logger');
const InfoChannel = require('../../database/schemas/info_channel');
const InfoPanel = require('../../database/schemas/info_panel_message');
const Guild = require('../../database/schemas/guild');

const debugLog = true;
const logger = createLogger(debugLog);

/**
 * Perms: @administrator.
 * Description: create a new infochannel with registered users.
 * Dependance: /
 */
module.exports = {
    data: new SlashCommandBuilder()
        .setName('create-infochannel')
        .setDescription('Creates a new infochannel in which I send information about registered players.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption(option => option
            .setName('infochannel-name')
            .setDescription('The name for the infochannel')
            .setRequired(true)),        

    async execute(interaction) {
        const guildId = interaction.guild.id;
        const channelName = interaction.options.getString('infochannel-name');
        const timestamp = createTimestamp();

        try {
            // Find the server in the db
            let searchedGuild = await Guild.findOne({ guild_guildId: guildId });
            
            logger.info(`create-infochannel.js : We find the guild in the DB ${searchedGuild.guild_guildId}`)

            // Check if an infoChannel already exists for this server
            const searchedInfoChannel = await InfoChannel.findOne({ infoChannel_fk_guild: searchedGuild ? guildId : null });
            if (searchedInfoChannel) {
                return interaction.reply({
                    content: `An infochannel already exists: <#${searchedInfoChannel.infoChannel_channelId}>.`,
                    ephemeral: true
                });
            }

            logger.phase(`> Verifying if an infoChannel already exist ${searchedInfoChannel}`);

            // Create the info channel
            const infoChannelText = await interaction.guild.channels.create({
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
            const newInfoChannel = new InfoChannel({
                infoChannel_fk_guild: searchedGuild.guild_guildId,
                infoChannel_channelId: infoChannelText.id,
                infoChannel_activeGames: []
            });
            await newInfoChannel.save();
            
            logger.phase(`> Creation of the channel ${infoChannelText.id}`);

            // Create the panel message
            const panelContent = await createInfoPanel(guildId, timestamp);
            const message = await infoChannelText.send({
                content: panelContent,
                allowedMentions: { parse: [] },
                components: [
                    new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setCustomId('refresh-infochannel-button')
                            .setLabel('Quick Refresh')
                            .setStyle(ButtonStyle.Primary)
                            .setEmoji('🔄')
                            .setDisabled(false)
                    )
                ]
            });

            const newInfoPanel = new InfoPanel({
                infoPanel_fk_infoChannel: newInfoChannel._id,
                infoPanel_messageId: message.id,
            });
            await newInfoPanel.save();

            logger.ok(`c-ip.js : New infoChannel created: ${newInfoChannel.infoChannel_channelId}`);
            logger.ok(`c-ip.js : New infoPanel created: ${newInfoPanel.infoPanel_messageId}`);

            interaction.reply({ 
                content: `Information channel <#${infoChannelText.id}> created successfully.`,
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