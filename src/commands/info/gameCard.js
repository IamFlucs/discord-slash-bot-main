const { championIconDict, championIdDict, championRoles, tierDict, queueType, rankDict, tierEmojiDict, emblemDict, gameTypeDict } = require('../../utils/api/riotMessageUtil');
const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { searchCurrentGame } = require('../../api/riot/spectator-v5');
const { shortenSummonerName } = require('../../utils/player/shortenName');
const { getPlayerRankInfo } = require('../../content/gamecard/getPlayerRank');
const { getTimeDifference } = require('../../utils/date/timestamp');
const { getMasteryInfo } = require('../../content/gamecard/getMasteryInfo');
const { searchRank } = require('../../api/riot/league-v4');
const { formatNumber } = require('../../utils/formatters/formatNumber');
const { createLogger } = require('../../utils/logger/logger');
const LeagueAccount = require('../../database/schemas/league_account');

const debugLog = true;
const logger = createLogger(debugLog);

/**
 * Current test command to get the correct gameCard
 * This use champs emojis, game rank, and mastery with the champ
 */
module.exports = {
    data: new SlashCommandBuilder()
        .setName('gamecard')
        .setDescription('Get info about current game of a given player.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption(option => option
                .setName('game-name')
                .setDescription('The Riot "Game Name" of the wanted league account.')
                .setRequired(true)
                .setMinLength(3)
                .setMaxLength(16)
        ),

    async execute(interaction) {
        // Get game Name 
        const gameName = interaction.options.getString('game-name');
        
        try {
            // Fetch account data from the database
            let fetchAccountData = await LeagueAccount.findOne({ leagueAccount_name: gameName });

            if (!fetchAccountData) {
                logger.warning(`No account found for ${gameName} when trying to create a gamecard.`);
                return interaction.reply({ content: `No account found for ${gameName}.`, ephemeral: true });
            }

            await interaction.deferReply(); // Very important to not crash : command not responding
            
            // Look if player is in game and fetch information about current game
            const currentGame = await searchCurrentGame(fetchAccountData.leagueAccount_puuid, fetchAccountData.leagueAccount_server);
            
            if (!currentGame) {
                logger.warning(`${gameName} is not in game.`)
                return interaction.reply({ content: `No game found for ${gameName} when trying to create a gamecard.`, ephemeral: true });
            }
            // Prepare the embed
            const gameCardEmbed = new EmbedBuilder()
                .setTitle(`${gameName}: ${gameTypeDict[currentGame.gameQueueConfigId]}`)
                .setColor('#00FE00')
                .setFooter({ text: `Current duration of the game: ${getTimeDifference(Math.floor((currentGame.gameStartTime + currentGame.gameLength) / 1000), 'short')}` });

            // Process game participants and divide them into teams
            const blueTeam = { participants: [], championId: [], ranks: [], masteries: [] };
            const redTeam = { participants: [], championId: [], ranks: [], masteries: [] };


            for (const participant of currentGame.participants) {
                const { puuid, riotId, summonerId, championId, teamId } = participant;

                // With the puuid, search for player information
                const fetchPlayer = await searchRank(summonerId, 'euw1');

                // Process SummonerName
                let summonerName = shortenSummonerName(riotId);
                const fetchLeagueAccount = await LeagueAccount.findOne({ leagueAccount_puuid: puuid });
                
                if (fetchLeagueAccount) {
                    summonerName = `__**${summonerName}**__`;
                }
                
                // Process champion emoji
                const championName = championIdDict[championId]; // from '1': 'Annie'
                const champEmoji = championIconDict[championName];  // from 'Annie': '<:Annie:1261656789980545106>'
                
                // Process ranking depending on "gameQueueConfigId": {int}
                const playerRankInfo = await getPlayerRankInfo(currentGame, summonerId, 'euw1');

                // Process Mastery
                const masteryInfo = await getMasteryInfo(puuid, championId);

                // Formatting information
                const participantField = `${champEmoji} | ${summonerName}`;
                const rankField = `${playerRankInfo.rank}`;
                const masteryField = `${masteryInfo.emblem} ${formatNumber(masteryInfo.points) || 0}`;

                // Add participantInfo to the correct team
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

            switch (currentGame.gameQueueConfigId) {
                case 420:
                case 440: // Mode Flex
                    logger.info(`Mode ranked detected: ${currentGame.gameQueueConfigId}`);
                    createRankedCards(gameCardEmbed, currentGame, blueTeam, redTeam);

                    break;
                case 450: // Mode ARAM
                    logger.info(`Mode 450 detected: ${currentGame.gameQueueConfigId}`);

                    break;
                default: // Solo/Duo ou autre
                    logger.info(`Mode default detected: ${currentGame.gameQueueConfigId}`);
            }

            

            // await interaction.deleteReply({ embeds: [exampleEmbed] });
            // Send the embed
            await interaction.editReply({ 
                content: `Info about the game of ${gameName}`,
                embeds: [gameCardEmbed] 
            });

        } catch (error) {
            let errorMessage = 'An unknown error occured.';
            // Check if error comes from http request
            if (error.response && error.response.data) {
                errorMessage = JSON.stringify(error.response.data, null, 2);
            // else, error type not handle
            } else if (error.message) {
                errorMessage = error.message;
            }
            logger.error(`Error fetching game data for ${gameName}: ${errorMessage}`);

            return interaction.reply({
                content: 'An error occurred while fetching game data.',
                ephemeral: true
            });
        }
    }
};

function createRankedCards(gameCardEmbed, currentGame, blueTeam, redTeam) {
    const blueTeamWithRoles = assignRolesToTeam(blueTeam);
    const redTeamWithRoles = assignRolesToTeam(redTeam);

    let currentGameQueue = 'Solo/Duo';
    if (currentGame.gameQueueConfigId === 440) {
        currentGameQueue = queueType[currentGame.gameQueueConfigId];
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

function assignRolesToTeam(team) {
    logger.info('');
    logger.info('Call function assignRolesToTeam');

    const assignedRoles = {};
    const championsInWaiting = []; // File d'attente pour les champions en conflit
    const availableRoles = ['top', 'jungle', 'mid', 'adc', 'support'];

    const assignedPlayers = new Set(); // Set pour suivre les joueurs déjà assignés

    // 1ère passe : assigner les champions avec des rôles certains (1.0)
    for (let i = 0; i < team.championId.length; i++) {
        const championId = team.championId[i];
        const championName = championIdDict[championId];
        const roleProbabilities = championRoles[championId];
        const player = {
            participant: team.participants[i],
            championId: team.championId[i],
            rank: team.ranks[i],
            mastery: team.masteries[i]
        };

        logger.info(`Champion: ${championName}, roleProbabilities: ${JSON.stringify(roleProbabilities)}`);

        // Vérification explicite des rôles avec probabilité de 1.0
        const definiteRole = availableRoles.find(role => roleProbabilities && roleProbabilities[role] === 1.0);

        if (definiteRole && !assignedRoles[definiteRole]) {
            // Assigner un rôle si disponible
            logger.info(`Assigned role ${definiteRole} to ${championName} (1.0 probability).`);
            assignedRoles[definiteRole] = player;
            assignedPlayers.add(i); // Marquer ce joueur comme déjà assigné
        } else if (definiteRole) {
            // Ajouter à la file d'attente si le rôle est déjà pris
            logger.info(`${championName} has 1.0 probability but role ${definiteRole} is already taken, adding to waiting list.`);
            championsInWaiting.push(player);
        }
    }

    // 2e passe : assigner les autres rôles par probabilité
    for (let i = 0; i < team.championId.length; i++) {
        if (assignedPlayers.has(i)) {
            continue; // Passer si le joueur a déjà été assigné
        }

        const player = {
            participant: team.participants[i],
            championId: team.championId[i],
            rank: team.ranks[i],
            mastery: team.masteries[i]
        };

        const roleProbabilities = championRoles[player.championId];
        const bestAvailableRole = availableRoles
            .filter(role => !assignedRoles[role])
            .sort((a, b) => (roleProbabilities[b] || 0) - (roleProbabilities[a] || 0))[0];

        if (bestAvailableRole) {
            logger.info(`Assigned role ${bestAvailableRole} to ${championIdDict[player.championId]} by probability.`);
            assignedRoles[bestAvailableRole] = player;
            assignedPlayers.add(i); // Marquer ce joueur comme déjà assigné
        }
    }

    // 3e passe : attribuer les champions en attente (conflits) aux rôles restants
    for (const player of championsInWaiting) {
        const availableRole = availableRoles.find(role => !assignedRoles[role]);
        if (availableRole) {
            logger.ok(`Assigned remaining role ${availableRole} to ${championIdDict[player.championId]} (conflict resolution).`);
            assignedRoles[availableRole] = player;
        }
    }

    // Transformer les résultats pour les retourner au bon format
    const result = {
        participants: [],
        ranks: [],
        masteries: []
    };

    for (const role of availableRoles) {
        if (assignedRoles[role]) {
            result.participants.push(assignedRoles[role].participant);
            result.ranks.push(assignedRoles[role].rank);
            result.masteries.push(assignedRoles[role].mastery);
        }
    }

    return result;
}