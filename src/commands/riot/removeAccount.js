const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const { searchAccount } = require('../../api/riot/account-v1');
const { createLogger } = require('../../utils/logger/logger');
const Player = require('../../database/schemas/player');
const LeagueAccount = require('../../database/schemas/league_account');
const LastRank = require('../../database/schemas/last_rank');

const debugLog = true;
const logger = createLogger(debugLog);

/**
 * Perms: @everyone.
 * Description: remove a Riot account from user.
 * Dependance: non-admins can only remove their own account.
 */
module.exports = {
    data: new SlashCommandBuilder()
        .setName('remove-account')
        .setDescription('Remove a Riot account from a user')
        .addUserOption(option => option
            .setName('user')
            .setDescription('The Discord user to create the player for.')
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName('region')
            .setDescription('The region of the account.')
            .setRequired(true)
            .addChoices(
                { name: 'EUW', value: JSON.stringify({ region: 'europe', subRegion: 'euw1' }) },
                { name: 'EUNE', value: JSON.stringify({ region: 'europe', subRegion: 'eun1' }) },
                { name: 'BR', value: JSON.stringify({ region: 'americas', subRegion: 'br1' }) },
                { name: 'JP', value: JSON.stringify({ region: 'asia', subRegion: 'jp1' }) },
                { name: 'KR', value: JSON.stringify({ region: 'asia', subRegion: 'kr' }) },
                { name: 'LAN', value: JSON.stringify({ region: 'americas', subRegion: 'la1' }) },
                { name: 'LAS', value: JSON.stringify({ region: 'americas', subRegion: 'la2' }) },
                { name: 'NA', value: JSON.stringify({ region: 'americas', subRegion: 'na1' }) },
                { name: 'OCE', value: JSON.stringify({ region: 'asia', subRegion: 'oc1' }) },
                { name: 'TR', value: JSON.stringify({ region: 'asia', subRegion: 'tr1' }) },
                { name: 'RU', value: JSON.stringify({ region: 'asia', subRegion: 'ru1' }) },
                { name: 'SG', value: JSON.stringify({ region: 'asia', subRegion: 'sg2' }) },
                { name: 'PH', value: JSON.stringify({ region: 'asia', subRegion: 'ph2' }) },
                { name: 'VN', value: JSON.stringify({ region: 'asia', subRegion: 'vn2' }) },
                { name: 'TH', value: JSON.stringify({ region: 'asia', subRegion: 'th2' }) },
                { name: 'TW', value: JSON.stringify({ region: 'asia', subRegion: 'tw2' }) },
                { name: 'ME', value: JSON.stringify({ region: 'europe', subRegion: 'me1' }) },
            )
        )
        .addStringOption(option => option
            .setName('game-name')
            .setDescription('The Riot "Game Name" of the wanted league account.')
            .setRequired(true)
            .setMinLength(3)
            .setMaxLength(16)
        )
        .addStringOption(option => option
            .setName('tag')
            .setDescription('The Riot "Tag" or "#" of the wanted league account.')
            .setRequired(true)
            .setMinLength(3)
            .setMaxLength(5)
        ),
    
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const userName = user.username;
        const discordId = user.id;
        const requesterId = interaction.user.id;
        // Riot data
        const choice = JSON.parse(interaction.options.getString('region')); // Need to be split for account-v1 (region) et summoner-v4 (subRegion)
        const gameName = interaction.options.getString('game-name');
        const tag = interaction.options.getString('tag').toUpperCase();

        try {
            // Search the given discordId in the database + Param @guild so register works globally
            const player = await Player.findOne({ player_discordId: discordId, player_fk_guildId: interaction.guild.id });

            if (!player) {
                return interaction.reply({ content: 'User not found.', ephemeral: true });
            }

            if (discordId !== requesterId && !interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                return interaction.reply({ content: 'You can only remove your own accounts.', ephemeral: true });
            }
            // Call Riot API functions
            const accountData = await searchAccount(gameName, choice.region, tag);

            const myLeagueAccount = await LeagueAccount.findOne({ 
                leagueAccount_name: accountData.gameName,
                leagueAccount_fk_player: player._id 
            });
            if (!myLeagueAccount) {
                return interaction.reply({ content: 'Account not found.', ephemeral: true });
            }
            await LastRank.deleteMany({ lastRank_fk_leagueAccounts: myLeagueAccount._id });
            await myLeagueAccount.deleteOne();

            // Remove the deleted account from the player's leagueAccounts array
            if (player.player_fk_leagueAccounts && player.player_fk_leagueAccounts.length) {
                player.player_fk_leagueAccounts = player.player_fk_leagueAccounts.filter(accId => accId.toString() !== myLeagueAccount._id.toString());
            }
            let responseMessage = `Your account ${gameName}#${tag} has been removed successfully.`;
            // If no league accounts are left, delete the player
            if (!player.player_fk_leagueAccounts || player.player_fk_leagueAccounts.length === 0) {
                await Player.findByIdAndDelete(player._id);
                responseMessage = `Your account ${gameName}#${tag} has been removed successfully.\nThis was the last account, player deleted.\nPlease register again with another account.`;
            } else {
                await player.save();
            }

            await interaction.reply({ content: responseMessage, ephemeral: false });
        } catch (error) {
            let errorMessage = 'An unknown error occured.';
            // Check if error comes from http request
            if (error.response && error.response.data) {
                errorMessage = JSON.stringify(error.response.data, null, 2);
            // else, error type not handle
            } else if (error.message) {
                errorMessage = error.message;
            }
            logger.error(`Error removing account:\n${error}`);

            await interaction.reply({content: 'Failed to remove the account.',ephemeral: true });
        }
    }
};
