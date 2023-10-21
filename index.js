/**
 * @file index.js
 * @description Main entry point for Lytro. 
 * @license MIT
 * @author Ares
 * 
 */

//IMPORT DOTENV FOR TOKEN 
require('dotenv').config();

//IMPORT DISCORD CLIENT, DISCORD LOGIN TOKEN
const { DISCORD_CLIENT, DISCORD_TOKEN } = require('./config');

//IMPORT COMMAND LIST 
const { commandList } = require('./src/manage/commandManager')

//IMPORT COMMAND SEARCH 
const { getSearch } = require('./src/utils/getSearchUtil')

//IMPORT HELP COMMAND 
const { execute } = require('./src/misccommands/getHelp')

//COMMAND PREFIX
const PREFIX = '!';

//DISPLAYS BOT STATUS IN TERMINAL ON START 
DISCORD_CLIENT.on('ready', (c) => {
    console.log(`${c.user.tag + " is ready."}`);
})

//SAVES USER USERNAMES TO A HASHMAP FOR UNIQUE HASHING
const userSearchNames = new Map();

//STARTS BOT FUNCTION ON MESSAGE CREATE 
DISCORD_CLIENT.on('messageCreate', async (message) => {

    try {
        if (message.author.bot) return;

        if (message.content.startsWith(PREFIX)) {

            //Returns all words after command in an array. 
            const args = message.content.slice(PREFIX.length).trim().split(/ +/);

            //command is the command i.e. !url One Piece would be url 
            const command = args.shift().toLowerCase();

            if (command === 'help') {
                execute(message);
                return;
            }

            //currently saved search name now searches within the hashmap for the corresponding user id. 
            let currentSearchName = userSearchNames.get(message.author.id) || '';

            //sets currently searched name 
            currentSearchName = getSearch(args, command, currentSearchName);

            let found = false;

            //Iterates through command list to find command
            for (const commandType of commandList) {
                if (commandType.name === command) {
                    commandType.execute(message, args, currentSearchName);
                    found = true;
                    break;
                }
            }   

            if (!found) {
                message.channel.send('Command not found :(');
            }

            //Sets the currently saved search name to their unique user id key. 
            userSearchNames.set(message.author.id, currentSearchName);
        }
    } catch (error) {
        console.error('error in index', error.message);
        message.channel.send(error.message);
    }
})
  
//LOGINS USING BOT TOKEN FROM ENV 
DISCORD_CLIENT.login(DISCORD_TOKEN);

//SHUTS DOWN BOT AND NODE INSTANCES TO PREVENT MULTIPLE RUNNING INSTANCES
process.on('SIGINT', () => {
    console.log('Received SIGINT signal. Shutting down.');
    DISCORD_CLIENT.destroy(); // Close the Discord.js client connection
    process.exit(0); // Exit the Node.js process
});

process.on('SIGTERM', () => {
    console.log('Received SIGTERM signal. Shutting down.');
    DISCORD_CLIENT.destroy(); // Close the Discord.js client connection
    process.exit(0); // Exit the Node.js process
});

