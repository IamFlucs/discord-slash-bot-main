const { tierDict, tierOrder, tierEmojiDict, gameTypeDict, rankDict } = require('../../utils/api/riotMessageUtil');
const { comparePlayersByRank } = require('../../utils/player/comparePlayers');
const { searchCurrentGame } = require('../../api/riot/spectator-v5');
const { getTimeDifference } = require ('../../utils/date/timestamp');
const { rankVariation } = require('../../database/updateRanks');
const { searchRank } = require('../../api/riot/league-v4');
const { createLogger } = require('../../utils/logger/logger');
const Player = require('../../database/schemas/player');
const LeagueAccount = require('../../database/schemas/league_account');
const InfoChannel = require('../../database/schemas/info_channel');
const CurrentGame = require('../../database/schemas/current_game');

const debugLog = false;
const logger = createLogger(debugLog);

/**
 * This function retrieves the IDs of guild members, checks whether they are registered in the database
 * and returns the contents of the information panel.
 * @param {Object} guild - Discord's guild object.
 * @param {number} timestamp - Panel generation timestamp.
 * @returns {string} - The contents of the information panel.
 */
async function createInfoPanel(guildId, timestamp) {
    logger.info('');
    logger.info(`[createInfoPanel] Called with guildId=${guildId}, timestamp=${timestamp}`);
    // Initialization
    let content = "__**Information Panel ⭐**__\n\n";
    
    const playersInGame = [];
    const playersNotInGame = [];

    const fetchInfoChannel = await InfoChannel.findOne({ infoChannel_fk_guild: guildId });

    // Empty activeGames
    fetchInfoChannel.infoChannel_activeGames = [];
    await fetchInfoChannel.save();

    if (!fetchInfoChannel) {
        // logger.warning('[createInfoPanel] Failed to find the info channel entry.');
        // We don't log this case because all guild that don't have infoChannel will pop an Error.
        // TODO: create a boolean in guild.js to quickly filter which guild has an infoChannel.
        return;
    }

    // Get all registered players of the server and processing them
    const registeredPlayers = await Player.find({ player_fk_guildId: guildId });
    for (const player of registeredPlayers) {
        const playerAccounts = await LeagueAccount.find({ _id: { $in: player.player_fk_leagueAccounts } });
        let inGameFound = false;
        const notInGameAccounts = [];

        // Processing player accounts
        for (const account of playerAccounts) {
            const currentGame = await searchCurrentGame(account.leagueAccount_puuid, account.leagueAccount_server);
            const rankData = await searchRank(account.leagueAccount_puuid, account.leagueAccount_server);

            const fetchCurrentGame = await CurrentGame.findOne({ currentGame_fk_leagueAccount: account._id });
            
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
                logger.error(`[createInfoPanel] Error while fetching Solo/Duo. Why? ${error}`);
            }

            const translatedSoloQtier = tierDict[soloQtier] || soloQtier;
            const translatedSoloQrank = rankDict[soloQrank] || soloQrank;
            const soloQrankEmoji = tierEmojiDict[soloQtier] || '';
            const soloQRankedStats = soloQtier === "Unranked" ? "Unranked" : `${soloQrankEmoji} ${translatedSoloQtier} ${translatedSoloQrank}, ${soloQlp} LP`; /*${soloQVariation}*/

            if (currentGame) {
                // Player in game
                playersInGame.push({
                    message: `<@${player.player_discordId}> : ${gameTypeDict[currentGame.gameQueueConfigId]} with account **${account.leagueAccount_nameId}** (${getTimeDifference(Math.floor((currentGame.gameStartTime + currentGame.gameLength) / 1000))})\n`
                });
                inGameFound = true;

                // Check if this account have a currentGame stored in the database
                if (fetchCurrentGame) {
                    // logger.debug(`[createInfoPanel] ${fetchCurrentGame.currentGame_id}, type: ${typeof fetchCurrentGame.currentGame_id}`);
                    // logger.debug(`[createInfoPanel] ${currentGame.gameId}, type: ${typeof currentGame.gameId}`);
                    if (fetchCurrentGame.currentGame_id === String(currentGame.gameId)) {
                        logger.ok(`${account.leagueAccount_nameId} still in the same game.`);

                    } else {
                        // logger.info(`${account.leagueAccount_nameId} find a new game. We are going to delete his old game and create a new one.`);
                        /*const deletedResult =*/ await CurrentGame.deleteMany({ currentGame_fk_leagueAccount: account._id });
                        // Test to find out if the database was correctly delete before recreation
                        // if (deletedResult.deletedCount > 0) {
                        //     logger.ok(`[createInfoPanel] Successfully deleted ${deletedResult.deletedCount} game(s) for account ${account.leagueAccount_nameId}.`);
                        // } else {
                        //     logger.ko(`[createInfoPanel] Failed to delete games for account ${account.leagueAccount_nameId}. Database still has existing records.`);
                        // }

                        const newGame = new CurrentGame({
                            currentGame_fk_leagueAccount: account._id,
                            currentGame_id: currentGame.gameId, 
                            currentGame_data: currentGame, 
                            currentGame_server: account.leagueAccount_server, 
                        });
                        await newGame.save();
                    }
                } else if (!fetchCurrentGame) {
                    // logger.ok(`[createInfoPanel] ${account.leagueAccount_nameId} is in a new game - Creation of the gamecard entry.`);
                    const newGame = new CurrentGame({
                        currentGame_fk_leagueAccount: account._id,
                        currentGame_id: currentGame.gameId, 
                        currentGame_data: currentGame, 
                        currentGame_server: account.leagueAccount_server,
                    });
                    await newGame.save();
                } else {
                    logger.ko(`[createInfoPanel] You are in the wrong place buddy.`);
                }
                // Save the id of the game
                await InfoChannel.updateOne(
                    { _id: fetchInfoChannel._id },
                    { $push: { infoChannel_activeGames: currentGame.gameId } }
                );

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

                // Delete old currentGame entries
                if (fetchCurrentGame) {
                    logger.info(`[createInfoPanel] Existing currentGame entry found for ${account.leagueAccount_nameId} (not in game). Attempting to delete...`);

                    const result = await CurrentGame.deleteOne({ _id: fetchCurrentGame._id });

                    if (result.deletedCount > 0) {
                        logger.ok(`[createInfoPanel] Successfully deleted currentGame entry for ${account.leagueAccount_nameId}.`);
                    } else {
                        logger.ko(`[createInfoPanel] Failed to delete currentGame entry for ${account.leagueAccount_nameId}.`);
                    }
                } else {
                    // logger.info(`[createInfoPanel] No currentGame entry found for ${account.leagueAccount_nameId}, skipping deletion.`);
                    continue;
                }
            }
        }
        
        // Analyze players not in game
        if (!inGameFound) {
            // Player with 1 account
            if (playerAccounts.length === 1) {
                const account = notInGameAccounts[0];
                playersNotInGame.push({
                    message: `<@${player.player_discordId}> : Currently not in game | Rank: ${account.rankStats}\n`,
                    tier: account.tier,
                    rank: account.rank,
                    lp: account.lp
                });
            } else {
                // Players with multiple accounts
                notInGameAccounts.sort(comparePlayersByRank);

                // Compile rank information
                let message = `<@${player.player_discordId}> : Currently not in game | Account list:\n`;
                for (const account of notInGameAccounts) {
                    message += account.rankStats === "Unranked" 
                        ? `- ${account.accountName} : Unranked\n`
                        : `- ${account.accountName} : Rank | ${account.rankStats}\n`;                
                }
                
                // Find best account (best rank)
                const highestRankAccount = notInGameAccounts.reduce((prev, current) => {
                    if (tierOrder[prev.tier] !== tierOrder[current.tier]) {
                        return (tierOrder[prev.tier] > tierOrder[current.tier]) ? prev : current;
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
