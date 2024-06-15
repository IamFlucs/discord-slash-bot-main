const fs = require('fs');
const path = require('path');
const { token } = require('./config.json');
const { logger } = require('./src/utils/logger.js');

const { EmbedBuilder, GatewayIntentBits, Client, Collection, Events, /*, ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle, AttachmentBuilder, codeBlock*/ } = require('discord.js');
const client = new Client({ intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers, // for Welcome msg
    GatewayIntentBits.GuildPresences, // for Leaving msg
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessageReactions
] });

client.commands = new Collection();
const foldersPath = path.join(__dirname, '/src/commands');
const commandFiles = fs.readdirSync(foldersPath).filter(file => file.endsWith('.js'));
// const commandFolders = fs.readdirSync(foldersPath);

for (const file of commandFiles) {
    const filePath = path.join(foldersPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    } else {
        logger.warning(`The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}

const eventsPath = path.join(__dirname, '/src/events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

// Number of interruptions asked during the current test
let ASKED_INTERRUPTION_NUMBER = 0;
// Prevent accidental closing of the script by handling SIGINT signal
process.on('SIGINT', () => {
    ASKED_INTERRUPTION_NUMBER++;
    if (ASKED_INTERRUPTION_NUMBER === 1) {
        logger.error('Are you really sure you want to exit this session ?');
        logger.warning('If so, press CTRL+C again, the next one will really end this session');
    } else {
        logger.warning('Exiting session...')
        process.exit();
    }
});

client.login(token);
// module.exports = client;