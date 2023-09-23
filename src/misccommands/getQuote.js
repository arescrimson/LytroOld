// getQuote.js

//IMPORTS

const { EmbedBuilder } = require('discord.js');

//AXIOS 
const axios = require('axios');

//QUOTE API URL 
const { QUOTE_URL, ICON_URL , QUOTE_TOKEN } = require('../../config')

/**
 * Gets data object from quote API. 
 * 
 * @returns data.
 */
async function getData() {
    try {
        const { data } = await axios.get(QUOTE_URL, {
            headers: {
                Authorization: QUOTE_TOKEN,
            }
        });

        return data;

    } catch (err) {
        throw new Error(err.message);
    }
};


module.exports = {
    name: 'quote',
    description: '!quote Returns a quote from a character in a random anime.',
    async execute(message, args) {
        try {
            const quoteData = await getData();

            const embedMessage = new EmbedBuilder()
                .setColor(0x0099FF)
                .addFields({
                    name: '\n',
                    value: `"${quoteData.quote}" by **${quoteData.author}** from **${quoteData.anime}**`
                })
                .setTimestamp()
                .setFooter({ text: 'Information from Lytro', iconURL: ICON_URL });

            message.channel.send(({ embeds: [embedMessage] }));
        } catch (error) {
            console.error('Error:', error.message);
            message.channel.send('An error occurred: ' + error.message);
        }
    }
}
