const { ActivityType } = require('discord.js');
const { logger } = require('../../utils/logger/logger.js');

module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {

        client.user.setPresence({
			activities: [{ name: '/help | v1.1.0', type: ActivityType.Playing }], 
			status: 'online' 
		});
		logger.info(`${client.user.username} is up and running!`);
	}
};