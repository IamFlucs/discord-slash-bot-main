const fs = require('fs');
const path = require('path');
const { createLogger } = require('../logger/logger');

const debugLog = true;
const logger = createLogger(debugLog);

// Function to extract champion keys and names from JSON file
function extractChampionKeys() {
    // Corrected Paths for input and output files
    const inputFilePath = path.join(__dirname, '..', 'json', 'champion.json');
    const outputFilePath = path.join(__dirname, '..', 'json', 'champions_output.json');

    // Log the corrected input file path
    logger.debug('Input File Absolute Path:', inputFilePath);
    
    // Read the input JSON file
    fs.readFile(inputFilePath, 'utf8', (err, data) => {
        if (err) {
            logger.error('Error reading input file:', err);
            return;
        }

        // Parse the JSON data
        const jsonData = JSON.parse(data);

        // Extract the necessary information
        const outputData = {};
        for (const champion in jsonData.data) {
            if (jsonData.data.hasOwnProperty(champion)) {
                const champData = jsonData.data[champion];
                outputData[champData.key] = champData.name;
            }
        }

        // Write the extracted data to a new JSON file
        fs.writeFile(outputFilePath, JSON.stringify(outputData, null, 2), 'utf8', err => {
            if (err) {
                logger.error('Error writing output file:', err);
                return;
            }
            logger.info('Output file created successfully:', outputFilePath);
        });
    });
}

// Export the function
module.exports = { extractChampionKeys };
