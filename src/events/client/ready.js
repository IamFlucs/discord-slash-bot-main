const { ActivityType } = require('discord.js');
const { createLogger } = require('../../utils/logger/logger.js');

const debugLog = true;
const logger = createLogger(debugLog);

module.exports = {
	name: 'ready',
	once: true,

	async execute(client) {

        client.user.setPresence({
			activities: [{ name: '/help | v1.2.0', type: ActivityType.Playing }], 
			status: 'online' 
		});
		logger.info(`${client.user.username} is up and running!`);
	}
};