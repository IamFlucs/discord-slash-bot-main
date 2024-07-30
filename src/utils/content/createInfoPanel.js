const { tierDict, tierEmojiDict, gameTypeDict, rankDict } = require('../tools/riotMessageUtil');
const { comparePlayersByRank } = require('../tools/comparePlayers');
const { searchCurrentGame } = require('../api/spectator-v5');
const { getTimeDifference } = require ('../tools/timestamp');
const { rankVariation } = require('../content/updateRanks');
const { searchRank } = require('../api/league-v4');
const { logger } = require('../tools/logger');
const Player = require('../../schemas/player');
const LeagueAccount = require('../../schemas/league_account');

/**
 * This function retrieves the IDs of guild members, checks whether they are registered in the database
 * and returns the contents of the information panel.
 * @param {Object} guild - Discord's guild object.
 * @param {number} timestamp - Panel generation timestamp.
 * @returns {string} - The contents of the information panel.
 */
async function createInfoPanel(guildId, timestamp) {
    // Initialization
    let content = "__**Information Panel ⭐**__\n\n";
    
    const playersInGame = [];
    const playersNotInGame = [];

    // Get all registered users
    const registeredPlayers = await Player.find({ player_fk_guildId: guildId });

    // Processing registered players
    for (const player of registeredPlayers) {
        const playerAccounts = await LeagueAccount.find({ _id: { $in: player.player_fk_leagueAccounts } });
        let inGameFound = false;
        const notInGameAccounts = [];

        // Processing player accounts
        for (const account of playerAccounts) {
            const currentGame = await searchCurrentGame(account.leagueAccount_puuid, account.leagueAccount_server);
            const rankData = await searchRank(account.leagueAccount_summonerId, account.leagueAccount_server);

            let soloQtier = "Unranked";
            let soloQrank = "";
            let soloQlp = 0;
            let soloQVariation = "";
            
            try {
                for (let x = 0; x < rankData.length; x++) {
                    if (rankData[x].queueType === "RANKED_SOLO_5x5") {
                        soloQtier = rankData[x].tier;
                        soloQrank = rankData[x].rank;
                        soloQlp = rankData[x].leaguePoints;
                        // Get rank variation for solo queue
                        soloQVariation = (await rankVariation(account._id)).soloQVariation;

                        break;
                    }
                }
            } catch (error) { 
                logger.warning(`/!\\ createInfoPanel.js - part 1`);
                logger.error(`Error while fetching Solo/Duo. Why? ${error}`);
            }

            const translatedSoloQtier = tierDict[soloQtier] || soloQtier;
            const translatedSoloQrank = rankDict[soloQrank] || soloQrank;
            const soloQrankEmoji = tierEmojiDict[soloQtier] || '';
            const soloQRankedStats = soloQtier === "Unranked" ? "Unranked" : `${soloQrankEmoji} ${translatedSoloQtier} ${translatedSoloQrank} ${soloQlp} LP ${soloQVariation}`;

            if (currentGame) {
                // Player in game
                playersInGame.push({
                    message: `<@${player.player_discordId}> : ${gameTypeDict[currentGame.gameQueueConfigId]} with account **${account.leagueAccount_nameId}** (${getTimeDifference(Math.floor((currentGame.gameStartTime + currentGame.gameLength) / 1000))})\n`
                });
                inGameFound = true;
                break;
            } else {
                // Player not in game
                notInGameAccounts.push({
                    accountName: account.leagueAccount_nameId,
                    rankStats: soloQRankedStats,
                    tier: soloQtier,
                    rank: soloQrank,
                    lp: soloQlp
                });
            }
        }

        if (!inGameFound) {
            if (playerAccounts.length === 1) {
                const account = notInGameAccounts[0];
                playersNotInGame.push({
                    message: `<@${player.player_discordId}> : Currently not in game | Rank: ${account.rankStats}\n`,
                    tier: account.tier,
                    rank: account.rank,
                    lp: account.lp
                });
            } else {
                notInGameAccounts.sort(comparePlayersByRank);

                // For players with multiple accounts, compile rank information
                let message = `<@${player.player_discordId}> : Currently not in game | Account list:\n`;
                for (const account of notInGameAccounts) {
                    message += account.rankStats === "Unranked" 
                        ? `- ${account.accountName} : Unranked\n`
                        : `- ${account.accountName} : Rank | ${account.rankStats}\n`;                
                }
                
                const highestRankAccount = notInGameAccounts.reduce((prev, current) => {
                    if (tierDict[prev.tier] !== tierDict[current.tier]) {
                        return (tierDict[prev.tier] > tierDict[current.tier]) ? prev : current;
                    }
                    if (rankDict[prev.rank] !== rankDict[current.rank]) {
                        return (rankDict[prev.rank] > rankDict[current.rank]) ? prev : current;
                    }
                    return (prev.lp > current.lp) ? prev : current;
                });
                playersNotInGame.push({
                    message: message,
                    tier: highestRankAccount.tier,
                    rank: highestRankAccount.rank,
                    lp: highestRankAccount.lp
                });
            }
        }
    }
    
    playersInGame.forEach(player => {
        content += `${player.message}`;
    });

    playersNotInGame.sort(comparePlayersByRank);
    playersNotInGame.forEach(player => {
        content += `${player.message}`;
    });
    
    content += `\n*Refreshed every 20 minutes | Generated ${timestamp}*\n`;
    content += `\n*This is an open source project by <@287384042431709184>. Please send any feedbacks or bug reports to contribute.*`;

    return content;
}

module.exports = { createInfoPanel };
