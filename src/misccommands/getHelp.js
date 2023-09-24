/**
 * @file getHelp.js
 * @description Retrieve a list of available commands and their descriptions.
 * @license MIT
 * @author Ares
 */

//IMPORTS 

// DISCORD EMBEDBUILDER
const { EmbedBuilder } = require('discord.js');

/**
 * Display a list of available commands and their descriptions.
 *
 * @param {Message} message - The Discord message object.
 * @param {string[]} commandList - The list of available commands.
 */
async function getHelp(message, commandList) {
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
    description: '!help Returns a list of available commands and their descriptions.',
    /**
     * Execute the !help command.
     *
     * @param {Message} message - The Discord message object.
     * @param {string[]} args - The command arguments (unused in this command).
     * @param {string} searchName - The currently cached searched anime or manga name.
     * @param {Object[]} commandList - The list of available commands with descriptions.
     */
    async execute(message, args, searchName, commandList) {
        try {
            await getHelp(message, commandList);
        } catch (error) {
            console.error('Error:', error.message);
            message.channel.send('An error occurred: ' + error.message);
        }
    },
};
