const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
// const { searchAccount } = require('../../utils/api/account-v1');
const { searchSummoner } = require('../../utils/api/summoner-v4');
const { searchRank } = require('../../utils/api/league-v4');
const { logger } = require('../../utils/tools/logger');
const Player = require('../../schemas/player');
const LeagueAccount = require('../../schemas/league_account');
const { tierDict, tierEmojiDict, rankDict } = require('../../utils/tools/riotMessageUtil');

/**
 * Perms: this command is for @everyone
 * Description: send a stats Embed of the given player
 * Dependance: need to be a registered player
 */
module.exports = {
    data: new SlashCommandBuilder()
        .setName('stats')
        .setDescription('Get information with Riot API.')
        .addSubcommand(subcommand => subcommand
            .setName('profile')
            .setDescription('Get the information about the mentioned player or the given account.')
            .addUserOption(option => option
                .setName('user')
                .setDescription('The user you want to search.')
                .setRequired(false)
            )
            .addStringOption(option => option
                .setName('discord-id')
                .setDescription('The Discord ID of the player you want to search.')
                .setRequired(false)
            )
        ),
    async execute(interaction) {
        const subCommand = interaction.options.getSubcommand();
        
        if (subCommand === 'profile') {
            const user = interaction.options.getUser('user');
            const userId = interaction.options.getString('discord-id');
            const discordId = user ? user.id : userId;
            const userName = user ? `<@${user.id}>` : `<@${userId}>`;
        
            // Search if user is registered as player
            const searchedPlayer = await Player.findOne({ player_discordId: discordId, player_fk_guildId: interaction.guild.id });

            // If !player : return
            if (!searchedPlayer) {
                return interaction.reply({ content: `This user is not registered.`, ephemeral: true });
            }

            // Fetch player information from database
            const leagueAccounts = await LeagueAccount.find({ _id: { $in: searchedPlayer.player_fk_leagueAccounts } });
            if (!leagueAccounts || leagueAccounts.length === 0) {
                return interaction.reply({ content: `League account not found for this user`, ephemeral: true });
            }

            const embeds = [];

            for (const account of leagueAccounts) {
                const playerId = account.leagueAccount_summonerId;
                const playerPuuid = account.leagueAccount_puuid;
                const playerRegion = account.leagueAccount_server;
                
                // Call Riot API functions
                const summonerData = await searchSummoner(playerPuuid, playerRegion);
                const rank = await searchRank(playerId, playerRegion);

                // Initialize the data
                let soloQtier = "Unranked";
                let soloQrank = "";
                let soloQlp = 0;
                let soloQwins = 0;
                let soloQlosses = 0;

                let flexQtier = "Unranked";
                let flexQrank = "";
                let flexQlp = 0;
                let flexQwins = 0;
                let flexQlosses = 0;

                try {
                    // Assuming rank is the array you are iterating over
                    for (let x = 0; x < rank.length; x++) {
                        if (rank[x].queueType === "RANKED_SOLO_5x5") {
                            soloQtier = rank[x].tier;
                            soloQrank = rank[x].rank;
                            soloQlp = rank[x].leaguePoints;
                            soloQwins = rank[x].wins;
                            soloQlosses = rank[x].losses;
                            break; // Exit the loop once we find the desired element
                        }
                    }
                } catch (error) {
                    logger.warning(`/!\\ statsProfile.js`)
                    logger.error(`Error while fetching Solo/Duo.\n${error}`);
                }
                try {
                    // Assuming rank is the array you are iterating over
                    for (let x = 0; x < rank.length; x++) {
                        if (rank[x].queueType === "RANKED_FLEX_SR") {
                            flexQtier = rank[x].tier;
                            flexQrank = rank[x].rank;
                            flexQlp = rank[x].leaguePoints;
                            flexQwins = rank[x].wins;
                            flexQlosses = rank[x].losses;
                            break; // Exit the loop once we find the desired element
                        }
                    }
                } catch (error) {
                    logger.warning(`Error while fetching Flex.\n${error}`);
                }

                let soloQratio = soloQwins + soloQlosses > 0 ? Math.round(soloQwins / (soloQwins + soloQlosses) * 100) : 0;
                let flexQratio = flexQwins + flexQlosses > 0 ? Math.round(flexQwins / (flexQwins + flexQlosses) * 100) : 0;

                // Use the dictionary to translate the tier and get the emoji ID
                const translatedSoloQtier = tierDict[soloQtier] || soloQtier;
                const translatedSoloQrank = rankDict[soloQrank] || soloQrank;
                const soloQrankEmoji = tierEmojiDict[soloQtier] || '';
                const soloQRankedStats = soloQtier === "Unranked" ? "**Unranked**" : `**${soloQrankEmoji} ${translatedSoloQtier} ${translatedSoloQrank} ${soloQlp} LP**`;
                const soloQWinRates = soloQtier === "Unranked" ? "**Unranked**" : `**${soloQratio}% - ${soloQwins}V | ${soloQlosses}D**`;

                const translatedFlexQtier = tierDict[flexQtier] || flexQtier;
                const translatedFlexQrank = rankDict[flexQrank] || flexQrank;
                const flexQrankEmoji = tierEmojiDict[flexQtier] || '';
                const flexQRankedStats = flexQtier === "Unranked" ? "**Unranked**" : `**${flexQrankEmoji} ${translatedFlexQtier} ${translatedFlexQrank} ${soloQlp} LP**`;
                const FlexWinRates = flexQtier === "Unranked" ? "**Unranked**" : `**${flexQratio}% - ${flexQwins}V | ${flexQlosses}D**`;

                // Embed for each account
                const rankedMessage = new EmbedBuilder()
                    .setColor(0xD014DD)
                    .setAuthor({ name: `${searchedPlayer.player_discordName}'s Profile (${account.leagueAccount_nameId}): Lvl ${summonerData.summonerLevel}`, iconURL: `http://ddragon.leagueoflegends.com/cdn/14.13.1/img/profileicon/${summonerData.profileIconId}.png` })
                    .addFields(
                        { name: 'Ranked Stats', value: `Solo/Duo: ${soloQRankedStats}\nFlex: ${flexQRankedStats}`, inline: true },
                        { name: 'Win Rates', value: `Solo/Duo: ${soloQWinRates}\nFlex: ${FlexWinRates}`, inline: true },
                        { name: '\u200B', value: '\u200B', inline: true }, // Empty field to force a new line
                    );

                embeds.push(rankedMessage);
            }

            await interaction.reply({ embeds, ephemeral: false });
        }
    }
};