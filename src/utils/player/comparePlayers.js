/**
 * Compare two players based on their tier, rank, and league points.
 * @param {Object} a - First player to compare.
 * @param {Object} b - Second player to compare.
 * @returns {number} - Negative if a is stronger, positive if b is stronger, 0 if they are equal.
 */
function comparePlayersByRank(a, b) {
    const tierOrder = {
        'Unranked': 1,
        'IRON': 2,
        'BRONZE': 3,
        'SILVER': 4,
        'GOLD': 5,
        'PLATINUM': 6,
        'EMERALD': 7,
        'DIAMOND': 8,
        'MASTER': 9,
        'GRANDMASTER': 10,
        'CHALLENGER': 11
    };

    const rankOrder = {
        'IV': 1,
        'III': 2,
        'II': 3,
        'I': 4
    };

    if (tierOrder[a.tier] !== tierOrder[b.tier]) {
        return tierOrder[b.tier] - tierOrder[a.tier];
    }
    if (rankOrder[a.rank] !== rankOrder[b.rank]) {
        return rankOrder[b.rank] - rankOrder[a.rank];
    }
    return b.lp - a.lp;
}

module.exports = { comparePlayersByRank };