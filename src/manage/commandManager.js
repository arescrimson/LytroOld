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
    'getMInfo',
    'getMCharacter',
    'getMImages',
    'getMRandom'
]

//MISC COMMAND LIST
const miscCommands = [
    'getQuote',
]

//COMMAND LIST CONTAINING ALL POSSIBLE COMMANDS
const commandList = [];
const animeCommandList = [];
const mangaCommandList = []; 
const miscCommandList = [];


for (const commandName of animeCommands) {
    const command = require(`../animecommands/${commandName}`);
    commandList.push(command);
    animeCommandList.push(command);
}

for (const commandName of mangaCommands) {
    const command = require(`../mangacommands/${commandName}`);
    commandList.push(command);
    mangaCommandList.push(command);
}

for (const commandName of miscCommands) {
    const command = require(`../misccommands/${commandName}`);
    commandList.push(command);
    miscCommandList.push(command);
}

module.exports = { commandList, animeCommandList, mangaCommandList, miscCommandList }
