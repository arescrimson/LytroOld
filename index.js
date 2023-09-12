require('dotenv').config();
const axios = require('axios');

const { Client, IntentsBitField } = require('discord.js');
const PREFIX = '!';

const JIKAN_API_BASE_URL = 'https://api.jikan.moe/v3';

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

        if (command === 'test') { 
            message.channel.send('testing message.');
        }
    }
    
})


client.login(process.env.TOKEN);

