// getHelp.js

/**
 * Gets list of possible commands. 
 * 
 * @param {*} message is the discord message. 
 */
async function getHelp(message, commandList) {

    try {
        message.channel.send(`List of possible commands: ${getAnimeCommand.description}`);      
    } catch (error) {
        message.channel.send('An error occurred: ' + error.message);
        console.error('Error:', error.message);
    }
}

module.exports = {
    name: 'help',
    description: 'Gets Discord Command Info.',
    async execute(message, commandList) {
        try {
            await getHelp(message, commandList)
        } catch (error) {
            console.error('Error:', error.message);
            message.channel.send('An error occurred: ' + error.message);
        }
    }
}

