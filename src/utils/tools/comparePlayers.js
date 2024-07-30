/**
 * Compare two players based on their tier, rank, and league points.
 * @param {Object} a - First player to compare.
 * @param {Object} b - Second player to compare.
 * @returns {number} - Negative if a is stronger, positive if b is stronger, 0 if they are equal.
 */
function comparePlayersByRank(a, b) {
    const tierOrder = {
        'Unranked': 0,
        'IRON': 1,
        'BRONZE': 2,
        'SILVER': 3,
        'GOLD': 4,
        'PLATINUM': 5,
        'EMERALD': 6,
        'DIAMOND': 7,
        'MASTER': 8,
        'GRANDMASTER': 9,
        'CHALLENGER': 10
    };

    const rankOrder = {
        'IV': 0,
        'III': 1,
        'II': 2,
        'I': 3
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