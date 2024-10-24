/**
 * Formats a number to a shortened string representation.
 * If the number is 1,000 or greater, it is represented in "K" (thousands).
 * If the number is 1,000,000 or greater, it is represented in "M" (millions).
 * For example:
 *  - 235883 -> "235K"
 *  - 1500000 -> "1.5M"
 *  - 999 -> "999"
 *
 * @param {number} num - The number to format.
 * @returns {string} - The formatted number as a string with "K" or "M" suffix if applicable.
 */
function formatNumber(num) {
    if (num >= 1000000) {
        // If the number is in the millions
        return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    } else if (num >= 1000) {
        // If the number is in the thousands
        return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    } else {
        // If the number is less than 1000, return it as is
        return num.toString();
    }
}

module.exports = { formatNumber };