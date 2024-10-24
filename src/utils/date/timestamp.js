/**
 * Creates a Discord timestamp.
 * @param {Date} date - The date for which to create the timestamp. If no date is provided, uses the current date.
 * @param {string} style - The style of the Discord timestamp (default: 'f' for full date and time). Options: 't', 'T', 'd', 'D', 'f', 'F', 'R'.
 * @returns {string} - The formatted Discord timestamp.
 */
function createTimestamp(date = new Date(), style = 'R') { // Style used: Relative Time
    const timestamp = Math.floor(date.getTime() / 1000); // Convert the date in Unix Timestamp (seconds)
    return `<t:${timestamp}:${style}>`;
}

/**
 * Calculate the time difference between a given timestamp and the current time.
 * Returns the difference in either 'MMm SSs' format or 'MM:SS' format.
 * 
 * @param {number} t0 - The initial time in Unix timestamp format (in seconds).
 * @param {string} [format='long'] - The format of the output.
 *                                  Use 'long' for 'MMm SSs' or short for 'MM:SS'.
 *                                  Defaults to 'long' if not specified.
 * @returns {string} The formatted time difference as a string.
 * @throws {Error} If an invalid format is provided.
 */
function getTimeDifference(t0, format = 'long') {
    // Convert t0 to milliseconds (Unix timestamps are in seconds)
    const t0Date = new Date(t0 * 1000);
    
    const now = new Date();
    const diff = now - t0Date;

    // Convert the difference to minutes and seconds
    const diffInSeconds = Math.floor(diff / 1000);
    const minutes = Math.floor((diffInSeconds / 60));
    const seconds = diffInSeconds % 60;

    // Choose the format based on the 'format' parameter
    if (format === 'long') {
        // Format long: 'MMm SSs'
        return `${minutes}m ${seconds}s`;
    } else if (format === 'short') {
        // Format short: 'MM:SS'
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    } else {
        throw new Error("Invalid format. Use 'long' or 'short'.")
    }
}

module.exports = { createTimestamp, getTimeDifference };