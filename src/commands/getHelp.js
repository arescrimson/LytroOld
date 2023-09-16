// getHelp.js

const commandNames = [
    'getHelp',
    'getAnime',
    'getCharacter',
    'getImages',
    'getRandom'
];
/**
 * Gets list of possible commands. REWRITE ENTIRE COMMAND MANAGER SYSTEM TO BE ABLE TO ACCESS COMMAND DESCRIPTIONS INSTEAD 
 * OF INDEXES!
 * 
 * @param {*} message is the discord message. 
 */
async function getHelp(message, commandList) {

    message.channel.send(`**Available Commands:**\n\n` +
                     `!info [anime_name] ${commandList[1].description}\n\n` +
                     `!chr [main, sup, character_name] [anime_name] ${commandList[2].description}\n\n` +
                     `!img [anime_name] ${commandList[3].description}\n\n` + 
                     `!rand ${commandList[4].description}`);

}

module.exports = {
    name: 'help',
    description: 'Gets Discord Command Info.',
    async execute(message, args, commandList) {
        try {
            await getHelp(message, commandList)
        } catch (error) {
            console.error('Error:', error.message);
            message.channel.send('An error occurred: ' + error.message);
        }
    }
}

