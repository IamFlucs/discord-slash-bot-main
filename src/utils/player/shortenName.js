/**
 * Shortens the summoner name if it exceeds 13 characters.
 * @param {string} summonerName - The summoner name.
 * @returns {string} - The shortened name.
 */
function shortenSummonerName(summonerName) {
    return summonerName.length > 14 ? `${summonerName.slice(0, 13)}...` : summonerName;
}

module.exports = { shortenSummonerName };