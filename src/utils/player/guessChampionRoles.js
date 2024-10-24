const { championIdDict, championRoles } = require('../api/riotMessageUtil');
const { createLogger } = require('../logger/logger');

const logEnabled = false;
const logger = createLogger(logEnabled);

/**
 * Assign roles to champions in a team
 * @param {*} team - Object containing participants, championId, ranks, masteries
 * @returns An object with the assigned roles
 */
function assignRolesToTeam(team) {
    logger.info('');
    logger.info('Calling assignRolesToTeam');
    logger.info('');

    const assignedRoles = {};  // Stores the assigned roles
    let championsInWaiting = [];  // List of champions without a defined role yet
    let availableRoles = ['top', 'jungle', 'mid', 'adc', 'support'];

    const assignedPlayers = new Set();  // Set to track players who are already assigned

    // First pass: assign champions with a 1.0 probability to their respective roles
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

        // Find a role with a 1.0 probability
        const definiteRole = availableRoles.find(role => roleProbabilities && roleProbabilities[role] === 1.0);

        if (definiteRole && !assignedRoles[definiteRole]) {
            // Assign the role if available
            logger.ok(`${definiteRole} to ${championName}.`);
            assignedRoles[definiteRole] = player;
            availableRoles = availableRoles.filter(role => role !== definiteRole); // Remove this role from available ones
            assignedPlayers.add(i);  // Mark this player as already assigned
        } else {
            // Add to the waiting list if no assignment
            championsInWaiting.push(player);
        }
    }

    // Second pass: assign remaining champions based on their highest probability for the available roles
    while (availableRoles.length > 1 && championsInWaiting.length > 0) {
        let bestPlayer = null;
        let bestRole = null;
        let bestProbability = 0;

        // Loop through the remaining champions to find the best role-probability match
        for (const player of championsInWaiting) {
            for (const role of availableRoles) {
                const prob = championRoles[player.championId][role] || 0;
                if (prob > bestProbability && !assignedRoles[role]) {
                    bestPlayer = player;
                    bestRole = role;
                    bestProbability = prob;
                }
            }
        }

        // If a player and role are found, assign them
        if (bestPlayer && bestRole) {
            const championName = championIdDict[bestPlayer.championId];
            logger.ok(`${bestRole} to ${championName} with probability ${bestProbability}.`);
            assignedRoles[bestRole] = bestPlayer;
            availableRoles = availableRoles.filter(role => role !== bestRole); // Remove the role from available ones
            championsInWaiting = championsInWaiting.filter(player => player !== bestPlayer); // Remove the assigned player
        }
    }

    // Third pass: assign the last remaining champion to the last available role
    if (availableRoles.length === 1 && championsInWaiting.length === 1) {
        const lastPlayer = championsInWaiting[0];
        const lastRole = availableRoles[0];
        const championName = championIdDict[lastPlayer.championId];

        logger.ok(`${lastRole} to ${championName}, by default.`);
        assignedRoles[lastRole] = lastPlayer;
    }

    // Retrieve the results and order them as top > jungle > mid > adc > support
    const result = {
        participants: [],
        ranks: [],
        masteries: []
    };

    const roleOrder = ['top', 'jungle', 'mid', 'adc', 'support']; // Order for the output
    for (const role of roleOrder) {
        if (assignedRoles[role]) {
            result.participants.push(assignedRoles[role].participant);
            result.ranks.push(assignedRoles[role].rank);
            result.masteries.push(assignedRoles[role].mastery);
        }
    }

    return result;
}

module.exports = { assignRolesToTeam };
