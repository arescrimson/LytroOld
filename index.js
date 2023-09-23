//IMPORT DOTENV FOR TOKEN 
require('dotenv').config();

const { discordClient, DISCORD_TOKEN } = require('./config');
//IMPORT COMMAND LIST 
const { commandList } = require('./src/manage/commandManager')

//IMPORT COMMAND SEARCH 
const { getSearch } = require('./src/utils/getSearch')

//COMMAND PREFIX
const PREFIX = '!';

//DISPLAYS BOT STATUS IN TERMINAL ON START 
discordClient.on('ready', (c) => {
    console.log(`${c.user.tag + " is ready."}`);
})

let currentCommandType = '';
let currentSearchName = '';

//STARTS BOT FUNCTION ON MESSAGE CREATE 
discordClient.on('messageCreate', async (message) => {
    try {
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
    } catch (error) {
        console.error('error in index', error.message);
    }
})

//LOGINS USING BOT TOKEN FROM ENV 
discordClient.login(DISCORD_TOKEN);

//SHUTS DOWN BOT AND NODE INSTANCES TO PREVENT MULTIPLE RUNNING INSTANCES
process.on('SIGINT', () => {
    console.log('Received SIGINT signal. Shutting down.');
    discordClient.destroy(); // Close the Discord.js client connection
    process.exit(0); // Exit the Node.js process
});

process.on('SIGTERM', () => {
    console.log('Received SIGTERM signal. Shutting down.');
    discordClient.destroy(); // Close the Discord.js client connection
    process.exit(0); // Exit the Node.js process
});

