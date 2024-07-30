const fs = require('fs');
const connectDB = require('./src/events/client/readyDB.js');
const { token } = require('./config.json');
const { logger } = require('./src/utils/tools/logger.js');
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
client.login(token);