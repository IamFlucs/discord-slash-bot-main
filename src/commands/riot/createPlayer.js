const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { searchAccount } = require('../../api/riot/account-v1');
const { searchSummoner } = require('../../api/riot/summoner-v4');
const { createLogger } = require('../../utils/logger/logger');
const Player = require('../../database/schemas/player');
const LeagueAccount = require('../../database/schemas/league_account');

const debugLog = true;
const logger = createLogger(debugLog);

/** 
 * Perms: @administrator.
 * Description: register a player. Same as /register but for admins.
 * Dependance: /
 */
module.exports = {
    data: new SlashCommandBuilder()
        .setName('create-player')
        .setDescription('Create a new player with the given information.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
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
        const user = interaction.options.getUser('user');
        const userName = user.username;
        const discordId = user.id;
        // Riot data
        const choice = JSON.parse(interaction.options.getString('region')); // Need to be split for account-v1 et summoner-v4
        const gameName = interaction.options.getString('game-name');
        const tag = interaction.options.getString('tag').toUpperCase();

        // Old Method with PermissionsBitField, everyone can see the slash command but not use it.
        // if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        //     return interaction.reply('You do not have permission to use this command.');
        // }

        try {
            // Search the given discordId in the database + Param @guild so register works globally
            let player = await Player.findOne({ player_discordId: discordId, player_fk_guildId: interaction.guild.id });

            if (player) {
                return interaction.reply('The mentioned member is already registered. If you want to add a secondary League of Legends account to this member, please use the command </add-account:1259943141050421331>.');
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
                leagueAccount_name: accountData.gameName, 
                leagueAccount_nameId: `${accountData.gameName}#${accountData.tagLine}`, 
                leagueAccount_summonerId: summonerData.id,
                leagueAccount_accountId: summonerData.accountId, 
                leagueAccount_puuid: accountData.puuid,
                leagueAccount_server: choice.subRegion.toUpperCase(),
                
            });

            await leagueAccount.save();

            player.player_fk_leagueAccounts.push(leagueAccount._id);
            await player.save();

            await interaction.reply(`The player ${userName} has been created with the account *${accountData.tagLine}*"${accountData.gameName}#${accountData.tagLine}".`);

        } catch (error) {
            let errorMessage = 'An unknown error occured.';
            // Check if error comes from http request
            if (error.response && error.response.data) {
                errorMessage = JSON.stringify(error.response.data, null, 2);
            // else, error type not handle
            } else if (error.message) {
                errorMessage = error.message;
            }
            logger.error(`Error creating player:\n${errorMessage}`);

            await interaction.reply({
                content: 'Failed to create the player.',
                ephemeral: true
            });
        }
    },
};
