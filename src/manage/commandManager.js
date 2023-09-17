function commandManager() {
    //COMMAND IMPORTS 
    const commandNames = [
        'getHelp',
        'getAnime',
        'getCharacter',
        'getImages',
        'getRandom', 
        'getQuote'
    ];

    const commandMNames = [ 
        'getManga',
        'getMCharacter',
        'getMImages',
        'getMRandom', 
    ]

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
