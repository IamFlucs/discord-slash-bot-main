const fs = require('fs');
const connectDB = require('./src/events/client/readyDB.js');
const { token } = require('./config.json');
const { createLogger } = require('./src/utils/logger/logger.js');
const { EmbedBuilder, GatewayIntentBits, Client, Collection, Events, /*, ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle, AttachmentBuilder, codeBlock*/ } = require('discord.js');
const client = new Client({ intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers, // for Welcome msg
    GatewayIntentBits.GuildPresences, // for Leaving msg
    GatewayIntentBits.GuildVoiceStates, // for Voice channel activity
    GatewayIntentBits.GuildMessageReactions
] });

client.commands = new Collection();
client.buttons = new Collection();
client.commandArray = [];

console.clear();

// DATABASE CONNECTION
connectDB();

// HANDLE FUNCTIONS
const functionFolders = fs.readdirSync(`./src/functions`);
for (const folder of functionFolders) {
	const functionFiles = fs.readdirSync(`./src/functions/${folder}`).filter((file) => file.endsWith(".js"));
	for (const file of functionFiles)
		require(`./src/functions/${folder}/${file}`)(client);
}

client.handleEvents();
client.handleCommands();
client.handleComponents();

const debugLog = true;
const logger = createLogger(debugLog);

// Reconnection logic
const loginWithRetry = async (retries = 5, delay = 5000) => {
    try {
        await client.login(token);
        logger.info('Client logged in successfully.');
    } catch (error) {
        if (retries === 0) {
            logger.error(`Failed to login after multiple attempts: ${error.message}`);
            process.exit(1);  // Stop the application after exhausting attempts
        } else {
            logger.warn(`Login failed, retrying in ${delay / 1000} seconds... Retries left: ${retries}`);
            setTimeout(() => loginWithRetry(retries - 1, delay), delay);  // Réessayer après un délai
        }
    }
};

// Handling Discord Client Errors
client.on('error', (error) => {
    logger.error(`Discord client error: ${error.message}`);
});

client.on('shardError', (error) => {
    logger.error(`A websocket connection encountered an error: ${error.message}`);
});

process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled promise rejection:', reason);
});

process.on('uncaughtException', (error) => {
    logger.error('Uncaught exception:', error);
    process.exit(1);  // Optional: Close the application after an unhandled exception
});

// Start bot with reconnection attempt
loginWithRetry();