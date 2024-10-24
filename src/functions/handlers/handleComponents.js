const fs = require('fs');
const { createLogger } = require('../../utils/logger/logger.js');

const debugLog = true;
const logger = createLogger(debugLog);

module.exports = (client) => {
    client.handleComponents = async () => {
        const componentFolders = fs.readdirSync(`./src/components`);
        for (const folder of componentFolders) {
            const componentFiles = fs
                .readdirSync(`./src/components/${folder}`)
                .filter((file) => file.endsWith('.js')
            );

            const { buttons } = client;

            switch (folder) {
                case 'buttons':
                    for (const file of componentFiles) {
                        const button = require(`../../components/${folder}/${file}`);
                        buttons.set(button.data.name, button);
                    }
                    break;
                
                default:
                    break;
            }
        }
    };
};