const { SlashCommandBuilder, PermissionsBitField  } = require('discord.js');
const { logger } = require('../../utils/tools/logger');
const Player = require('../../schemas/player');
const LeagueAccount = require('../../schemas/league_account');
const LastRank = require('../../schemas/last_rank');

/**
 * Perms: @everyone
 * Description: delete a player and all his accounts.
 * Dependance: non-admins can only remove their own player.
 */
module.exports = {
    data: new SlashCommandBuilder()
        .setName('delete-player')
        .setDescription('Remove the given player.')
        .addUserOption(option => option
            .setName('user')
            .setDescription('The Discord account you want to delete.')
            .setRequired(false)
        )
        .addStringOption(option => option
            .setName('discord-id')
            .setDescription('The Discord ID of the player you want to delete.')
            .setRequired(false)
        ),
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const userId = interaction.options.getString('discord-id');
        const discordId = user ? user.id : userId;
        const requesterId = interaction.user.id;

        // Check if no args
        if (!user && !userId) {
            return interaction.reply({
                content: 'Please specify a user or user ID to remove the accounts from.',
                ephemeral: true
            });
        }
        // Check if the requester (not admin) is trying to remove someone else's account
        if (discordId !== requesterId && !interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({
                content: 'You can only remove your own accounts.',
                ephemeral: true
            });
        }

        try {
            const myPlayer = await Player.findOneAndDelete({ player_discordId: discordId, player_fk_guildId: interaction.guild.id });

            // Search the given user in the database
            if (!myPlayer) {
                return interaction.reply({
                    content: `No accounts found for user ${user ? user.tag : `ID: ${userId}`}.`, //tag: theflucs
                    ephemeral: true
                });                
            }
            await LastRank.deleteMany({ lastRank_fk_leagueAccounts: { $in: myPlayer.player_fk_leagueAccounts } });
            await LeagueAccount.deleteMany({ leagueAccount_fk_player: myPlayer._id });

            await interaction.reply({
                content: `${user ? user.tag : `ID: \`${userId}\``} has been deleted!`,
                ephemeral: false
            });
        } catch (error) {
            // /* DEBUG */ logger.error('Error removing game accounts:', error);
            await interaction.reply({
                content: 'Failed to remove game accounts.',
                ephemeral: true
            });
        }
    },
};
