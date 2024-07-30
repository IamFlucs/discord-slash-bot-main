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

function getTimeDifference(t0) {
        // Convertir t0 en millisecondes (Unix timestamps sont en secondes)
        const t0Date = new Date(t0 * 1000);
        
        const now = new Date();
        const diff = now - t0Date;
    
        // Convertir la différence en minutes et secondes
        const diffInSeconds = Math.floor(diff / 1000);
        const minutes = Math.floor((diffInSeconds / 60));
        const seconds = diffInSeconds % 60;
    
        // Formater le résultat en 'MM'min 'SS'sec
        return `${minutes}m ${seconds}s`;
}

module.exports = { createTimestamp, getTimeDifference };