/**
 * @file getQuote.js
 * @description Retrieve a random quote from a character in an anime.
 * @license MIT
 * @author Ares
 */

// IMPORTS

// DISCORD EMBEDBUILDER
const { EmbedBuilder } = require('discord.js');

// AXIOS
const axios = require('axios');

// QUOTE API URL
const { QUOTE_URL, ICON_URL, QUOTE_TOKEN } = require('../../config');

/**
 * Gets data object from a quote API.
 *
 * @returns {Promise<Object>} A promise that resolves to the quote data.
 */
async function getData() {
    try {
        const { data } = await axios.get(QUOTE_URL, {
            headers: {
                Authorization: QUOTE_TOKEN,
            },
        });

        return data;
    } catch (err) {
        console.error('Error: ' + err.message)
    }
}

module.exports = {
    name: 'quote',
    description: '!quote Returns a quote from a character in a random anime.',
    /**
     * Execute the !quote command.
     *
     * @param {Message} message - The Discord message object.
     * @param {string[]} args - The command arguments (unused in this command).
     */
    async execute(message, args) {
        try {
            const quoteData = await getData();

            const embedMessage = new EmbedBuilder()
                .setColor(0x0099FF)
                .addFields({
                    name: '\n',
                    value: `"${quoteData.quote}" by **${quoteData.author}** from **${quoteData.anime}**`,
                })
                .setTimestamp()
                .setFooter({ text: 'Information from Lytro', iconURL: ICON_URL });

            message.channel.send({ embeds: [embedMessage] });
        } catch (error) {
            console.error('Error:', error.message);
            message.channel.send('An error occurred: ' + error.message);
        }
    },
};
