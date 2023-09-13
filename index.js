//IMPORT DOTENV, AXIOS, DISCORD
require('dotenv').config();
const axios = require('axios');
const { Client, IntentsBitField } = require('discord.js');

//COMMAND PREFIX
const PREFIX = '!';

//COMMAND IMPORTS 
const getCharacterCommand = require('./commands/getCharacter');
const getUrlCommand = require('./commands/getURL');

//JIKAN URL 
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
        //args is the argument, i.e. !url One Piece would be One Piece
        const args = message.content.slice(PREFIX.length).trim().split(/ +/);
        //command is the command i.e. !url One Piece would be url 
        const command = args.shift().toLowerCase();

        if (command === getCharacterCommand.name) {
            getCharacterCommand.execute(message, args);
        } 
        
        if (command === getUrlCommand.name) {
            getUrlCommand.execute(message, args);
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

