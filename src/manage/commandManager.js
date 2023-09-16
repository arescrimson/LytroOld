function commandManager() {
    //COMMAND IMPORTS 
    const commandNames = [
        'getHelp',
        'getAnime',
        'getCharacter',
        'getImages',
        'getRandom'
    ];

    const commandList = [];

    for (const commandName of commandNames) {
        const command = require(`../commands/${commandName}`);
        commandList.push(command);
    }

    return commandList; 
}

module.exports = { commandManager }
