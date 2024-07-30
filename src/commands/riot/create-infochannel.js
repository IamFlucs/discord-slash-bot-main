const { SlashCommandBuilder, PermissionsBitField, PermissionFlagsBits, ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { createInfoPanel } = require('../../utils/content/createInfoPanel');
const { createTimestamp } = require('../../utils/tools/timestamp');
const { logger } = require('../../utils/tools/logger');
const InfoChannel = require('../../schemas/info_channel');
const InfoPanel = require('../../schemas/info_panel_message');
const Guild = require('../../schemas/guild');

/**
 * Perms: @administrator.
 * Description: create a new infochannel with registered users.
 * Dependance: /
 */
module.exports = {
    data: new SlashCommandBuilder()
        .setName('create-infochannel')
        .setDescription('Create a new information channel where I can send information about players.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption(option => option
            .setName('infochannel-name')
            .setDescription('The name for the infochannel')
            .setRequired(true)),        

    async execute(interaction) {
        const guildId = interaction.guild.id;
        const guildName = interaction.guild.name;
        const channelName = interaction.options.getString('infochannel-name');
        const timestamp = createTimestamp();

        try {
            // Find the server in the db
            let searchedGuild = await Guild.findOne({ guild_guildId: guildId });

            // Check if an infoChannel already exists for this server
            const searchedInfoChannel = await InfoChannel.findOne({ infoChannel_fk_guild: searchedGuild ? guildId : null });

            if (searchedInfoChannel) {
                return interaction.reply({
                    content: `An infochannel already exists: <#${searchedInfoChannel.infoChannel_channelId}>.`,
                    ephemeral: true
                });
            }

            // Create the info channel
            const infoChannel = await interaction.guild.channels.create({
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
                        allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory],
                    },
                ]
            });

            // Create the panel message
            const panelContent = await createInfoPanel(guildId, timestamp);
            const message = await infoChannel.send({
                content: panelContent,
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

            // Save new information in the database
            const newInfoChannel = new InfoChannel({
                infoChannel_fk_guild: searchedGuild.guild_guildId,
                infoChannel_channelId: infoChannel.id,
            });
            const newInfoPanel = new InfoPanel({
                infoPanel_fk_infoChannel: newInfoChannel._id,
                infoPanel_messageId: message.id,
            });
            await newInfoChannel.save();
            await newInfoPanel.save();

            interaction.reply({ 
                content: `Information channel <#${infoChannel.id}> created successfully.`,
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