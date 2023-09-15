//IMPORT DOTENV FOR TOKEN 
require('dotenv').config();
//IMPORT DISCORDJS / CLIENT AND INTENTS FOR MESSAGE SENDING 
const { Client, IntentsBitField } = require('discord.js');

//COMMAND PREFIX
const PREFIX = '!';

//COMMAND IMPORTS 
const getCharacterCommand = require('./commands/getCharacter');
const getAnimeCommand = require('./commands/getAnime');
const getImageCommand = require('./commands/getImages');

//CREATE CLIENT 
const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.MessageContent,
    ],
});

//DISPLAYS BOT STATUS IN TERMINAL ON START 
client.on('ready', (c) => {
    console.log(`${c.user.tag + " is ready."}`);
})

//STARTS BOT FUNCTION ON MESSAGE CREATE 
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
        
        if (command === getAnimeCommand.name) {
            getAnimeCommand.execute(message, args);
        }

        if (command === getImageCommand.name) {
            getImageCommand.execute(message, args);
        }
    }
    
})

//LOGINS USING BOT TOKEN FROM ENV 
client.login(process.env.TOKEN);

//SHUTS DOWN BOT AND NODE INSTANCES TO PREVENT MULTIPLE RUNNING INSTANCES
process.on('SIGINT', () => {
    console.log('Received SIGINT signal. Shutting down.');
    client.destroy(); // Close the Discord.js client connection
    process.exit(0); // Exit the Node.js process
});

process.on('SIGTERM', () => {
    console.log('Received SIGTERM signal. Shutting down.');
    client.destroy(); // Close the Discord.js client connection
    process.exit(0); // Exit the Node.js process
});

