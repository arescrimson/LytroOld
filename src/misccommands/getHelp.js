// getHelp.js

const { EmbedBuilder } = require('discord.js')
/**
 * Gets list of possible commands. REWRITE ENTIRE COMMAND MANAGER SYSTEM TO BE ABLE TO ACCESS COMMAND DESCRIPTIONS INSTEAD 
 * OF INDEXES!
 * 
 * @param {*} message is the discord message. 
 * @param {*} commandList is the list of commands passed. 
 */
async function getHelp(message, commandList) {

    //console.log(commandList.length); // Temporary counter of command list. 

    const embedMessage = new EmbedBuilder()
        .setTitle('Available Commands')
        .setDescription(
            commandList
                .map((command, index) => `${index + 1}. ${command.description}`)
                .join('\n')
        );

    message.channel.send({ embeds: [embedMessage] });
}

module.exports = {
    name: 'help',
    description: '!help returns a list of available commands.',
    async execute(message, args, searchName, commandList) {
        try {
            await getHelp(message, commandList)
        } catch (error) {
            console.error('Error:', error.message);
            message.channel.send('An error occurred: ' + error.message);
        }
    }
}

