/**
 * @file getHelp.js
 * @description Retrieve a list of available commands and their descriptions.
 * @license MIT
 * @author Ares
 */

//IMPORTS 

// DISCORD EMBEDBUILDER
const { EmbedBuilder } = require('discord.js');

// COMMAND LISTS
const { animeCommandList, mangaCommandList, miscCommandList } = require('../manage/commandManager');

/**
 * Display a list of available commands and their descriptions.
 *
 * @param {Message} message - The Discord message object.
 */
function getHelp(message) {
    const embedMessage = new EmbedBuilder()
        .setTitle('Available Commands')
        .setDescription(
            '**Anime Commands**\n\n' + 
            animeCommandList.map((command, index) => `${index + 1}. ${command.description}`).join('\n') + '\n\n' + 
            '**Manga Commands**\n\n' + 
            mangaCommandList.map((command, index) => `${index + 1}. ${command.description}`).join('\n') + '\n\n' +
            '**Misc Commands**\n\n' + 
            miscCommandList.map((command, index) => `${index + 1}. ${command.description}`).join('\n') + '\n\n'         
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
     */
    async execute(message) {
        try {
            getHelp(message);
        } catch (error) {
            console.error('Error:', error.message);
            message.channel.send('An error occurred: ' + error.message);
        } 
    },
};
