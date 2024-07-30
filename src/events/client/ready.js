const { ActivityType } = require('discord.js');
const { logger } = require('../../utils/tools/logger.js');

module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {

        client.user.setPresence({
			activities: [{ name: '/ register', type: ActivityType.Watching }], 
			status: 'online' 
		});
		logger.info(`${client.user.username} is up and running!`);
	}
};