// getQuote.js
require('dotenv').config();

//IMPORTS

//AXIOS 
const axios = require('axios');

const QUOTE_URL = "https://waifu.it/api/quote";
const ACCESS_TOKEN = process.env.ACCESS_TOKEN

async function getData() {
    try {
        const { data } = await axios.get(QUOTE_URL, {
            headers: {
                Authorization: ACCESS_TOKEN,
            }
        });
   
        return data; 
        
    } catch (err) {
        throw new Error(err.message);
    }
};


module.exports = {
    name: 'quote',
    description: '!quote [character_name] [anime_name] Returns a quote from the character.',
    async execute(message, args) {      
        try {
            const quoteData = await getData();
            message.channel.send(`'${quoteData.quote}' by **${quoteData.author}** from **${quoteData.anime}**`);
        } catch (error) {
            console.error('Error:', error.message);
            message.channel.send('An error occurred: ' + error.message);
        }
    }
}