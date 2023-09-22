function commandManager() {

    //ANIME COMMAND LIST 
    const commandNames = [
        'getHelp',
        'getAnime',
        'getInfo',
        'getCharacter',
        'getImages',
        'getRandom', 
        'getQuote',
    ];

    //MANGA COMMAND LIST 
    const commandMNames = [ 
        'getManga',
        'getMCharacter',
        'getMImages',
        'getMRandom', 
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

    return commandList; 
}

module.exports = { commandManager }
