//IMPORT DOTENV FOR TOKEN 
require('dotenv').config();

//IMPORT DISCORDJS / CLIENT AND INTENTS FOR MESSAGE SENDING 
const { Client, IntentsBitField } = require('discord.js');

//IMPORT COMMAND LIST 
const { commandManager } = require('./src/manage/commandManager')
const commandList = commandManager();

//IMPORT COMMAND SEARCH 
const { getSearch } = require('./src/utils/getSearch')

//COMMAND PREFIX
const PREFIX = '!';

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

let currentSearchName = '';

//STARTS BOT FUNCTION ON MESSAGE CREATE 
client.on('messageCreate', async (message) => {

    if (message.author.bot) return;

    if (message.content.startsWith(PREFIX)) {

        /**
         * Returns all words after command in an array. 
         * ex. !a one piece would return ['one', 'piece']
         * ex. !chr luffy would return ['luffy']
         * 
         */
        const args = message.content.slice(PREFIX.length).trim().split(/ +/);

        //command is the command i.e. !url One Piece would be url 
        const command = args.shift().toLowerCase();

        currentSearchName = await getSearch(args, command, currentSearchName);

        let found = false;

        //Iterates through command list to find command
        for (const commandType of commandList) {
            if (commandType.name === command) {
                commandType.execute(message, args, currentSearchName, commandList);
                found = true;
                break;
            }
        }

        if (!found) {
            message.channel.send('Command not found :(');
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

