const { Events, ActivityType } = require('discord.js');
const { logger } = require('../utils/logger.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	
	execute(client) {
		// console.clear();
		logger.phase('>> Starting the bot...');
		setTimeout(function() { 
			logger.ok(`>> ${client.user.username} connected and ready.`);
		}, 1000); // 1000 milliseconds = 1 second
        // Set bot's acticity
        client.user.setPresence({ activities: [{ name: '/ help | V1.0.0', type: ActivityType.Watching }], status: 'online' });
	},
};