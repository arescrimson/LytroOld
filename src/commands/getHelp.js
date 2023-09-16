// getHelp.js

const commandManager = require('../manage/commandManager')
/**
 * Gets list of possible commands. 
 * 
 * @param {*} message is the discord message. 
 */
async function getHelp(message, commandType) {
    message.channel.send('hi')
}

module.exports = {
    name: 'help',
    description: 'Gets Discord Command Info.',
    async execute(message, args, commandType) {
        try {
            await getHelp(message, commandType)
        } catch (error) {
            console.error('Error:', error.message);
            message.channel.send('An error occurred: ' + error.message);
        }
    }
}

