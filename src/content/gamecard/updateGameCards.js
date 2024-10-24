const { generateGameCards } = require('./generateGameCards');
const { createTimestamp } = require('../../utils/date/timestamp');
const { createLogger } = require('../../utils/logger/logger');
const GameCard = require('../../database/schemas/game_card');
const CurrentGame = require('../../database/schemas/current_game');
const InfoChannel = require('../../database/schemas/info_channel');

const debugLog = false;
const logger = createLogger(debugLog);

/**
 * Updates the game cards for a given guild.
 * Fetches active games from the guild's info channel, retrieves existing game cards, and processes them for updates or deletions.
 * @param {*} client - Discord client instance
 * @param {*} guildId - ID of the guild to update the game cards for
 * @returns None
 */
async function updateGameCards(client, guildId) {
    try {
        const guild = client.guilds.cache.get(guildId);
        
        if (!guild) {
            // If the bot is no longer part of the guild, exit
            return;
        }
        
        const fetchInfoChannel = await InfoChannel.findOne({ infoChannel_fk_guild: guildId });
        
        if (!fetchInfoChannel) {
            // If no info channel is found, log and exit
            logger.ko(`No InfoChannel found for guildId: ${guildId}. Exiting.`);
            return;
        }
        if (!fetchInfoChannel.infoChannel_gameCardOption) {
            // If the game card option is disabled, log and exit
            logger.ko(`Option for game cards is disable for this InfoChannel. Exiting.`);
            return;
        }

        const channelId = fetchInfoChannel.infoChannel_channelId;
        const activeGames = fetchInfoChannel.infoChannel_activeGames;
        const channel = client.channels.cache.get(channelId);

        if (!activeGames || !Array.isArray(activeGames)) {
            // Log a warning if active games is undefined or not an array
            logger.warning(`activeGames is undefined or not an array. Ensure that updateInfoPanel is called before updateGameCards.`);
        }
        if (!channel) {
            // If the specified channel is not found, log an error and exit
            logger.error(`Channel not found: ${channelId}`);
            return;
        }

        // Retrieve all messages in the Discord channel
        const messages = await channel.messages.fetch();
        logger.info(`Fetched ${messages.size} messages from channel: ${channelId}`);

        // Retrieve all GameCard entries from the database
        const allGameCards = await GameCard.find({});
        logger.info(`Fetched ${allGameCards.length} GameCards from the database`);
        
        // Process each GameCard to check its validity
        for (const gameCard of allGameCards) {
            try {
                const correspondingMessage = messages.get(gameCard.gameCard_id);
                
                // Check if the GameCard is still linked to a CurrentGame entry
                const correspondingCurrentGame = await CurrentGame.findById(gameCard.gameCard_fk_currentGame);
                
                if (!correspondingCurrentGame) {
                    // If the CurrentGame entry is not found, this GameCard is orphaned
                    if (correspondingMessage) {
                        await correspondingMessage.delete(); // Delete the Discord message
                    }
                    // Delete the orphaned GameCard entry from the database
                    await GameCard.findByIdAndDelete(gameCard._id);
                }
            } catch (error) {
                logger.error(`Error processing GameCard with id: ${gameCard._id}. Error: ${error.message}`);
            }
        }

        // Process the active games and generate/update their GameCards
        const embedsToSend = await generateGameCards(activeGames);

        for (const { embed, gameId } of embedsToSend) {
            try {
                // Look for the current game in the database
                const fetchCurrentGame = await CurrentGame.findOne({ currentGame_id: gameId });

                if (!fetchCurrentGame) {
                    logger.warning(`Current Game not found for gameId: ${gameId}`);
                    continue;
                }

                // Look for a game card with the same foreign key as the current game
                let fetchGameCard = await GameCard.findOne({ gameCard_fk_currentGame: fetchCurrentGame._id });

                if (fetchGameCard) {
                    // If a GameCard exists, check if it has a valid message ID
                    if (fetchGameCard.gameCard_id) {
                        const oldMessage = await channel.messages.fetch(fetchGameCard.gameCard_id).catch(() => null);
                        if (oldMessage) {
                            // Update the existing game card message
                            await oldMessage.edit({ embeds: [embed] });
                            logger.ok(`Updated existing game card for gameId: ${gameId}`);
                        } else {
                            logger.warning(`Game Card message not found for update: id ${fetchGameCard.gameCard_id}`);
                        }
                    } else {
                        // Send a new message if the GameCard doesn't have a valid message ID
                        const newMessage = await channel.send({ embeds: [embed] });
                        fetchGameCard.gameCard_id = newMessage.id;
                        fetchGameCard.gameCard_data = embed;
                        fetchGameCard.gameCard_creationTime = createTimestamp();
                        await fetchGameCard.save();
                        logger.ok(`Updated incomplete GameCard with new data for gameId: ${gameId}`);
                    }
                    
                } else {
                    // If no GameCard exists, create a new one
                    const timestamp = createTimestamp();
                    const newMessage = await channel.send({ embeds: [embed] });

                    const newGameCard = new GameCard({
                        gameCard_fk_currentGame: fetchCurrentGame._id,
                        gameCard_id: newMessage.id,
                        gameCard_data: embed,
                        gameCard_creationTime: timestamp,
                    });

                    await newGameCard.save();
                    logger.ok(`Created and saved new game card for gameId: ${gameId}`);
                }
            } catch (error) {
                logger.error(`Error processing gameId: ${gameId}. Error: ${error.message}`);
            }
        }
    } catch (error) {
        logger.warning(`Failed to complete updateGameCards for guildId: ${guildId}`);
        logger.error(`Error updating game cards: ${error.message}`);
    }
}

module.exports = { updateGameCards };
