//ANIME COMMAND LIST 
const animeCommands = [
    'getAnime',
    'getInfo',
    'getCharacter',
    'getImages',
    'getRandom'
];

//MANGA COMMAND LIST 
const mangaCommands = [
    'getManga',
    'getMCharacter',
    'getMImages',
    'getMInfo',
    'getMRandom'
]

//MISC COMMAND LIST
const miscCommands = [
    'getQuote',
    'getHelp',
]

//COMMAND LIST CONTAINING ALL POSSIBLE COMMANDS
const commandList = [];

for (const commandName of animeCommands) {
    const command = require(`../animecommands/${commandName}`);
    commandList.push(command);
}

for (const commandName of mangaCommands) {
    const command = require(`../mangacommands/${commandName}`);
    commandList.push(command);
}

for (const commandName of miscCommands) {
    const command = require(`../misccommands/${commandName}`);
    commandList.push(command);
}

module.exports = { commandList }
