require('dotenv').config();
const axios = require('axios');

const { Client, IntentsBitField } = require('discord.js');
const PREFIX = '!';

const JIKAN_API_BASE_URL = 'https://api.jikan.moe/v4';

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.MessageContent,
    ],
});

client.on('ready', (c) => {
    console.log(`${c.user.tag + " is ready."}`);
})



client.on('messageCreate', async (message) => {

    if (message.author.bot) return;

    if (message.content.startsWith(PREFIX)) { 
        const commandArgs = message.content.slice(PREFIX.length).trim().split(/ +/);
        const command = commandArgs.shift().toLowerCase();

        if (command === 't') { 
            const mangaName = commandArgs.join(' ');

            try {
                //message.channel.send(mangaName);
                const response = await axios.get(`${JIKAN_API_BASE_URL}/manga?q=${mangaName}`)
                const jsonData = JSON.stringify(response.data);
                const parsedData = JSON.parse(jsonData);
                const testurl = parsedData.data[0].url;
                //const jsonData = JSON.stringify(response.data);

                message.channel.send(testurl)
            } catch (error) {
                console.error('Error fetching manga data:', error);
                message.channel.send('An error occurred while fetching manga data.');
            }
        }
    }
    
})


client.login(process.env.TOKEN);

process.on('SIGINT', () => {
    console.log('Received SIGINT signal. Shutting down gracefully.');
    client.destroy(); // Close the Discord.js client connection
    process.exit(0); // Exit the Node.js process
});

process.on('SIGTERM', () => {
    console.log('Received SIGTERM signal. Shutting down gracefully.');
    client.destroy(); // Close the Discord.js client connection
    process.exit(0); // Exit the Node.js process
});

