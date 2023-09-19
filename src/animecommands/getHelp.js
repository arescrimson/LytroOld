// getHelp.js

/**
 * Gets list of possible commands. REWRITE ENTIRE COMMAND MANAGER SYSTEM TO BE ABLE TO ACCESS COMMAND DESCRIPTIONS INSTEAD 
 * OF INDEXES!
 * 
 * @param {*} message is the discord message. 
 * @param {*} commandList is the list of commands passed. 
 */
async function getHelp(message, commandList) {

    console.log(commandList.length); // Temporary counter of command list. 

    message.channel.send(`**Available Commands:**\n\n` +
                     `${commandList[1].description}\n\n` +
                     `${commandList[2].description}\n\n` +
                     `${commandList[3].description}\n\n` + 
                     `${commandList[4].description}\n\n` +
                     `${commandList[5].description}\n\n` + 
                     `${commandList[6].description}\n\n` 
                     );

}

module.exports = {
    name: 'help',
    description: 'Gets Discord Command Info.',
    async execute(message, args, searchName, commandList) {
        try {
            await getHelp(message, commandList)
        } catch (error) {
            console.error('Error:', error.message);
            message.channel.send('An error occurred: ' + error.message);
        }
    }
}

