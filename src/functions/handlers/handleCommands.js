const { REST, Routes } = require('discord.js');
const { token, clientId } = require('../../../config.json');
const { createLogger } = require('../../utils/logger/logger');
const fs = require('fs');

const debugLog = true;
const logger = createLogger(debugLog);

module.exports = (client) => {
    client.handleCommands = async () => {

        const commandFolders = fs.readdirSync("./src/commands").filter((file) => {
            return fs.statSync(`./src/commands/${file}`).isDirectory();
        });
        
        for (const folder of commandFolders) {
            const commandFiles = fs.readdirSync(`./src/commands/${folder}`).filter((file) => file.endsWith(".js"));

            const { commands, commandArray } = client;
            for (const file of commandFiles) {
                const command = require(`../../commands/${folder}/${file}`);
                if ('data' in command && 'execute' in command) {
                    commands.set(command.data.name, command);
                    commandArray.push(command.data.toJSON());
                } else {
                    logger.warning(`The command at ../../commands/${folder}/${file} is missing a required "data" or "execute" property. Please check your command code.`);
                }	
            }
        }

        const rest = new REST().setToken(token);
        try {
            logger.phase(`Started refreshing application (/) commands.`);
            
            const data = await rest.put(Routes.applicationCommands(clientId), {
                body : client.commandArray,
            });

            logger.ok(`>> Successfully reloaded ${data.length} application (/) commands.`)
        } catch (error) {
            logger.error(`${__filename}: `, error);
        }
    };
};

