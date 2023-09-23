//ANIME COMMAND LIST 
const commandNames = [
    'getAnime',
    'getInfo',
    'getCharacter',
    'getImages',
    'getRandom'
];

//MANGA COMMAND LIST 
const commandMNames = [
    'getManga',
    'getMCharacter',
    'getMImages',
    'getMInfo',
    'getMRandom'
]

const commandMisc = [
    'getQuote',
    'getHelp',
]

//COMMAND LIST CONTAINING ALL POSSIBLE COMMANDS
const commandList = [];

for (const commandName of commandNames) {
    const command = require(`../animecommands/${commandName}`);
    commandList.push(command);
}

for (const commandName of commandMNames) {
    const command = require(`../mangacommands/${commandName}`);
    commandList.push(command);
}

for (const commandName of commandMisc) {
    const command = require(`../misccommands/${commandName}`);
    commandList.push(command);
}

module.exports = { commandList }
