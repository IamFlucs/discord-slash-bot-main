const { SlashCommandBuilder } = require('discord.js');
const { searchAccount } = require('../../api/riot/account-v1');
const { searchSummoner } = require('../../api/riot/summoner-v4');
const { logger } = require('../../utils/logger/logger');
const Player = require('../../database/schemas/player');
const LeagueAccount = require('../../database/schemas/league_account');

/** 
 * Perms: @everyone.
 * Description: register another account to the author of the command.
 * Dependance: author have to be registered.
 */
module.exports = {
    data: new SlashCommandBuilder()
        .setName('add-account')
        .setDescription('Add a Riot games account to a Discord user.')
        .addUserOption(option => option
                .setName('user')
                .setDescription('The Discord account you want to link.')
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
            // Search the given discordId in the database
            let player = await Player.findOne({ player_discordId: discordId, player_fk_guildId: interaction.guild.id });
            
            if (!player) {
                return await interaction.reply({
                    content: `The mentioned user is not registered, let an eligible create it with </create-player:1259943141050421333> or register yourself using </register:1259943141050421336>.`,
                    ephemeral: false
                });
            }
            if (discordId !== requesterId && !interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                return interaction.reply('You can only add your own accounts.');
            }

            // Call Riot API functions
            const accountData = await searchAccount(gameName, choice.region, tag);
            const summonerData = await searchSummoner(accountData.puuid, choice.subRegion);            

            if (summonerData) {
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

                await interaction.reply(`The account "${accountData.gameName}" has been added to the player ${user}.`);
            }
        } catch (error) {
            let errorMessage = 'An unknown error occured.';
            // Check if error comes from http request
            if (error.response && error.response.data) {
                errorMessage = JSON.stringify(error.response.data, null, 2);
            // else, error type not handle
            } else if (error.message) {
                errorMessage = error.message;
            }
            logger.error(`${userName} failed to add account: ${errorMessage}`);

            await interaction.reply({
                content: 'Failed to add your account.',
                ephemeral: true
            });
        }
    },
};
