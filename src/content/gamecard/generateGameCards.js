const { createGameInfoEmbed } = require('./createGameCard');
const { createLogger } = require('../../utils/logger/logger');
const GameCard = require('../../database/schemas/game_card');
const CurrentGame = require('../../database/schemas/current_game');

const debugLog = false;
const logger = createLogger(debugLog);

/**
 * 
 * @param {*} activeGames 
 * @returns 
 */
async function generateGameCards(activeGames) {
    try {
        const embeds = [];
        
        // Check the length of activeGames
        if (activeGames.length === 0) {
            logger.ko('activeGames array is empty.');
        } else {
            logger.ok(`activeGames array contains ${activeGames.length} element(s).`);
        }

        // Get rid of duplicates gameId
        const uniqueGames = [...new Set(activeGames)];
        const duplicateCount = activeGames.length - uniqueGames.length;
        
        if (duplicateCount > 0) {
            logger.info(`We found ${duplicateCount} duplicate(s), removing them...`);
            activeGames = uniqueGames;
            logger.ok(`Successfully removed duplicates. New activeGames List: ${JSON.stringify(activeGames, null, 2)}`);
        } /*else {
            logger.ok('activeGames array contains only unique element(s).');
        }*/

        // Start looping to create/update game cards
        for (const gameId of activeGames) {
            const fetchCurrentGame = await CurrentGame.findOne({ currentGame_id: gameId });

            if (!fetchCurrentGame) {
                // logger.warning(`No current game found for gameId: ${gameId}`);
                continue;
            }

            let fetchGameCard = await GameCard.findOne({ gameCard_fk_currentGame: fetchCurrentGame._id });

            if (fetchGameCard) {
                // Updating the existing embed
                const updatedEmbed = await createGameInfoEmbed(fetchCurrentGame, fetchCurrentGame.currentGame_server);
                
                fetchGameCard.gameCard_data = updatedEmbed;
                await fetchGameCard.save();
                
                embeds.push({ embed: updatedEmbed, gameId: gameId });
                
            } else {
                // Creating a new game card
                const newEmbed = await createGameInfoEmbed(fetchCurrentGame, fetchCurrentGame.currentGame_server);
                
                const newGameCard = new GameCard({
                    gameCard_fk_currentGame: fetchCurrentGame._id,
                    gameCard_data: newEmbed,
                });
                await newGameCard.save();
                
                embeds.push({ embed: newEmbed, gameId: gameId });
                // logger.info(`New embed added: ${JSON.stringify(embeds, null, 4)}`);
            }
        }

        return embeds;
        
    } catch (error) {
        logger.warning(`/!\\ generateGameCards`)
        logger.error(`Error generating game info cards: ${error.message}`);
        // throw error;
        return [];
    }
}

module.exports = { generateGameCards };
