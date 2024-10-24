const { SlashCommandBuilder } = require('discord.js');
const { searchAccount } = require('../../api/riot/account-v1');
const { searchSummoner } = require('../../api/riot/summoner-v4');
const { createLogger } = require('../../utils/logger/logger');
const Player = require('../../database/schemas/player');
const LeagueAccount = require('../../database/schemas/league_account');

const debugLog = true;
const logger = createLogger(debugLog);

/** 
 * Perms: this command is for @everyone
 * Description: register the author of the command with the given information
 * Dependance: / 
 */
module.exports = {
    data: new SlashCommandBuilder()
        .setName('register')
        .setDescription('Registers the author of the command with the given information.')
        .addStringOption(option => option
            .setName('region')
            .setDescription('The region of the account.')
            .setRequired(true)
            .addChoices(
                { name: 'EUW', value: JSON.stringify({ region: 'europe', subRegion: 'euw1' }) },
                { name: 'EUNE', value: JSON.stringify({ region: 'europe', subRegion: 'eun1' }) },
                { name: 'ME', value: JSON.stringify({ region: 'europe', subRegion: 'me1' }) },
                { name: 'TR', value: JSON.stringify({ region: 'europe', subRegion: 'tr1' }) },
                { name: 'RU', value: JSON.stringify({ region: 'europe', subRegion: 'ru1' }) },
                { name: 'NA', value: JSON.stringify({ region: 'americas', subRegion: 'na1' }) },
                { name: 'BR', value: JSON.stringify({ region: 'americas', subRegion: 'br1' }) },
                { name: 'LAN', value: JSON.stringify({ region: 'americas', subRegion: 'la1' }) },
                { name: 'LAS', value: JSON.stringify({ region: 'americas', subRegion: 'la2' }) },
                { name: 'KR', value: JSON.stringify({ region: 'asia', subRegion: 'kr' }) },
                { name: 'JP', value: JSON.stringify({ region: 'asia', subRegion: 'jp1' }) },
                { name: 'OCE', value: JSON.stringify({ region: 'sea', subRegion: 'oc1' }) },
                { name: 'PH', value: JSON.stringify({ region: 'sea', subRegion: 'ph2' }) },
                { name: 'SG', value: JSON.stringify({ region: 'sea', subRegion: 'sg2' }) },
                { name: 'TH', value: JSON.stringify({ region: 'sea', subRegion: 'th2' }) },
                { name: 'TW', value: JSON.stringify({ region: 'sea', subRegion: 'tw2' }) },
                { name: 'VN', value: JSON.stringify({ region: 'sea', subRegion: 'vn2' }) },
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
        const userName = interaction.user.username;
        const discordId = interaction.user.id;
        // Riot data
        const choice = JSON.parse(interaction.options.getString('region')); // Need to be split for account-v1 (region) et summoner-v4 (subRegion)
        const gameName = interaction.options.getString('game-name');
        const tag = interaction.options.getString('tag').toUpperCase();

        try {
            // Search the given discordId in the database + Param @guild so register works globally
            let player = await Player.findOne({ player_discordId: discordId, player_fk_guildId: interaction.guild.id });

            if (player) {
                return interaction.reply(`You are already registered on this server. If you want to add another League of Legends account, please use the command </add-account:1259943141050421331>.`);
            }

            // Call Riot API functions
            const accountData = await searchAccount(gameName, choice.region, tag);
            const summonerData = await searchSummoner(accountData.puuid, choice.subRegion);

            player = new Player({
                player_fk_guildId: interaction.guild.id,
                player_fk_leagueAccounts: [],
                player_discordName: userName,
                player_discordId: discordId,
                player_mentionnable: false,
            });

            const leagueAccount = new LeagueAccount({
                leagueAccount_fk_player: player._id,
                leagueAccount_name: accountData.gameName, // Mr Flucs
                leagueAccount_nameId: `${accountData.gameName}#${accountData.tagLine}`, // Mr Flucs#EUW
                leagueAccount_summonerId: summonerData.id, //1j0miQbViwN0QKI90IMF_NN_WXuoG49P0bXOqHuvqZ8JeH8
                leagueAccount_accountId: summonerData.accountId, //rFWCfZUr1XMzH4mQsRD9UaHYuADxe1dZf4yJyU3hmkeeRiI
                leagueAccount_puuid: accountData.puuid, //0Z6K4rkBJZJNFbQXnPHfs4fRsjVyRiIjpwo_ykhrh0cffNDRmtcXwponhMc9k1QcTQYt7xrm7glz9Q
                leagueAccount_server: choice.subRegion.toUpperCase(), //#EUW
                
            });

            await leagueAccount.save();
            
            player.player_fk_leagueAccounts.push(leagueAccount._id);
            await player.save();

            await interaction.reply(`You have been added with the account *${accountData.tagLine}*"${accountData.gameName}#${accountData.tagLine}".`);

        } catch (error) {
            let errorMessage = 'An unknown error occurred.';
            // Check if error comes from http request
            if (error.response && error.response.data) {
                errorMessage = JSON.stringify(error.response.data, null, 2);
            // else, error type not handle
            } else if (error.message) {
                errorMessage = error.message;
            }
            logger.error(`${userName} failed to register account:\n${errorMessage}`);

            await interaction.reply({
                content: 'Failed to register your account.',
                ephemeral: true
            });
        }
    }
};
