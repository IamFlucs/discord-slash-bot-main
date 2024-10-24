const { EmbedBuilder } = require('discord.js');
const { championIconDict, championIdDict, gameTypeDict, queueType } = require('../../utils/api/riotMessageUtil');
const { shortenSummonerName } = require('../../utils/player/shortenName');
const { getPlayerRankInfo } = require('../../content/gamecard/getPlayerRank');
const { assignRolesToTeam } = require('../../utils/player/guessChampionRoles');
const { getTimeDifference } = require('../../utils/date/timestamp');
const { getMasteryInfo } = require('../../content/gamecard/getMasteryInfo');
const { formatNumber } = require('../../utils/formatters/formatNumber');
const { createLogger } = require('../../utils/logger/logger');
const LeagueAccount = require('../../database/schemas/league_account');

const debugLog = false;
const logger = createLogger(debugLog);

/**
 * Creates a game embed for a player's current game.
 * @param {Object} currentGame - The current game data.
 * @param {string} server - The League account server to retrieve the data from.
 * @returns {Object} - The embed containing the game information.
 */
async function createGameInfoEmbed(currentGame, server) {
    const fetchLeagueAccount = await LeagueAccount.findById(currentGame.currentGame_fk_leagueAccount);

    const gameCardEmbed = new EmbedBuilder()
        .setTitle(`${fetchLeagueAccount.leagueAccount_nameId} : ${gameTypeDict[currentGame.currentGame_data.gameQueueConfigId]}`)
        .setColor('#00FE00')
        .setFooter({ text: `Current duration of the game: ${getTimeDifference(Math.floor((currentGame.currentGame_data.gameStartTime + currentGame.currentGame_data.gameLength) / 1000), 'short')}` });

    try {
        // Process game participants and divide them into teams
        const blueTeam = { participants: [], championId: [], ranks: [], masteries: [] };
        const redTeam = { participants: [], championId: [], ranks: [], masteries: [] };

        for (const participant of currentGame.currentGame_data.participants) {
            const { puuid, riotId, summonerId, championId, teamId } = participant;
            
            let summonerName = shortenSummonerName(riotId);

            const fetchLeagueAccount = await LeagueAccount.findOne({ leagueAccount_puuid: puuid });

            if (fetchLeagueAccount) {
                summonerName = `__**${summonerName}**__`; // If the player is registered, format their name in bold and underlined
            }

            // Get champion information
            const championName = championIdDict[championId];
            const champEmoji = championIconDict[championName];

            // Get Rank and LP
            const playerRankInfo = await getPlayerRankInfo(currentGame.currentGame_data, summonerId, server);

            // Get champion Mastery
            const masteryInfo = await getMasteryInfo(puuid, championId);
            
            // Formatting information
            const participantField = `${champEmoji} | ${summonerName}`;
            const rankField = `${playerRankInfo.rank}`;
            const masteryField = `${masteryInfo.emblem} ${formatNumber(masteryInfo.points) || 0}`;

            if (teamId === 100) {
                blueTeam.participants.push(participantField);
                blueTeam.championId.push(championId);
                blueTeam.ranks.push(rankField);
                blueTeam.masteries.push(masteryField);
            } else {
                redTeam.participants.push(participantField);
                redTeam.championId.push(championId);
                redTeam.ranks.push(rankField);
                redTeam.masteries.push(masteryField);
            }
        }

        switch (currentGame.currentGame_data.gameQueueConfigId) {
            case 400: // Normals
            case 420: // Solo/Duo
            case 440: // Flex
            case 490: // Normal quickplay
                logger.info(`Mode Ranked detected: ${currentGame.currentGame_data.gameQueueConfigId}`);
                createRankedCards(gameCardEmbed, currentGame, blueTeam, redTeam);
                
                break;
            case 450: // ARAM
                logger.info(`Mode Aram detected: ${currentGame.currentGame_data.gameQueueConfigId}`);
                createDefaultCard(gameCardEmbed, blueTeam, redTeam);

                break;
            case 1700: // Arena
                logger.info(`Mode Arena detected: ${currentGame.currentGame_data.gameQueueConfigId}`);
                createArenaCard(gameCardEmbed, blueTeam);

                break;
            default: // Autre
                logger.info(`Mode default detected: ${currentGame.currentGame_data.gameQueueConfigId}`);
                createDefaultCard(gameCardEmbed, blueTeam, redTeam);
        }

        return gameCardEmbed;
    } catch (error) {
        logger.error(`Error in createGameCard - ${error.message}`);
        throw error;
    }
    
}

// Function Arena game (1700)
function createArenaCard(gameCardEmbed, blueTeam) {
    let currentGameQueue = 'Solo/Duo';

    // Adding blue team fields to the embed
    gameCardEmbed.addFields(
        { name: 'Blue Team', value: blueTeam.participants.join('\n'), inline: true },
        { name: `${currentGameQueue} Rank`, value: blueTeam.ranks.join('\n'), inline: true },
        { name: 'Mastery', value: blueTeam.masteries.join('\n'), inline: true }
    );
}

// Function Default game (450)
function createDefaultCard(gameCardEmbed, blueTeam, redTeam) {
    let currentGameQueue = 'Solo/Duo';

    // Adding blue team fields to the embed
    gameCardEmbed.addFields(
        { name: 'Blue Team', value: blueTeam.participants.join('\n'), inline: true },
        { name: `${currentGameQueue} Rank`, value: blueTeam.ranks.join('\n'), inline: true },
        { name: 'Mastery', value: blueTeam.masteries.join('\n'), inline: true }
    );

    // Adding red team fields to the embed
    gameCardEmbed.addFields(
        { name: 'Red Team', value: redTeam.participants.join('\n'), inline: true },
        { name: `${currentGameQueue} Rank`, value: redTeam.ranks.join('\n'), inline: true },
        { name: 'Mastery', value: redTeam.masteries.join('\n'), inline: true }
    );
    return gameCardEmbed;
}

// Function Summoner's Rift game (420, 440)
function createRankedCards(gameCardEmbed, currentGame, blueTeam, redTeam) {
    const blueTeamWithRoles = assignRolesToTeam(blueTeam);
    const redTeamWithRoles = assignRolesToTeam(redTeam);

    let currentGameQueue = 'Solo/Duo';
    if (currentGame.currentGame_data.gameQueueConfigId === 440) {
        currentGameQueue = queueType[currentGame.currentGame_data.gameQueueConfigId];
    }

    // Adding blue team
    gameCardEmbed.addFields(
        { name: 'Blue Team', value: blueTeamWithRoles.participants.join('\n'), inline: true },
        { name: `${currentGameQueue} Rank`, value: blueTeamWithRoles.ranks.join('\n'), inline: true },
        { name: 'Mastery', value: blueTeamWithRoles.masteries.join('\n'), inline: true }
    );

    // Adding red team
    gameCardEmbed.addFields(
        { name: 'Red Team', value: redTeamWithRoles.participants.join('\n'), inline: true },
        { name: `${currentGameQueue} Rank`, value: redTeamWithRoles.ranks.join('\n'), inline: true },
        { name: 'Mastery', value: redTeamWithRoles.masteries.join('\n'), inline: true }
    );
    return gameCardEmbed;
}

module.exports = { createGameInfoEmbed };
