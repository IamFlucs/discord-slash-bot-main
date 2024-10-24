/**
 * Capitalize the first letter of a string
 * @param {string} string - The input string
 * @returns {string} - The string with the first capitalized
 */
module.exports = function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};