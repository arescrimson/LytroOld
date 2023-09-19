// getMCharacter.js

//IMPORTS

//IMPORT GETID 
const { getMangaIDFromString } = require('../utils/getMangaIDFromString')
//JIKAN API LIBRARY 
const Jikan = require('jikan4.js')
//JIKANJS WRAPPER LIBRARY
const client = new Jikan.Client();

/**
 * Gets first name from either a single first name, or a lastname, firstname format. 
 * Ex. !chr gon hunter x hunter would return gon, even though the api lists it as Freecss, Gon. 
 * 
 * @param {*} message is the discord message. 
 * @param {*} characterName is the character Name. 
 * @returns the first name. 
 */
function getFirstName(message, characterName, databaseNames) {
    const nameParts = databaseNames.split(',').map(part => part.trim().toLowerCase());

    if (nameParts.includes(characterName.toLowerCase())) {
        return true;
    }
}

/**
 * Gets manga Characters from the mangaID passed. 
 * 
 * @param {*} message is the discord message. 
 * @param {*} mangaID is the mangaID passed. 
 * @param {*} characterName is the lowercased character Name being searched. 
 */
async function getMangaCharacters(message, mangaID, characterName) {

    try {
        const ch = await client.manga.getCharacters(mangaID);

        let maxIndex = 0;
        let characterFound = false;
        for (let i = 0; i < ch.length; i++) {

            //if character name is main, indexes ALL MAIN CHARACTERS.
            if (characterName === 'main') {
                if (ch[i].role === 'Main') {
                    message.channel.send(`Main Characters: ${ch[i].character.url}`)
                    characterFound = true;
                }
            }
            //if character name is sup, indexes ALL SUPPORTING CHARACTERS. 
            else if (characterName === 'sup') {
                if (ch[i].role === 'Supporting' && maxIndex < 5) {
                    message.channel.send(`Supporting Characters: ${ch[i].character.url}`)
                    maxIndex++;
                    characterFound = true;
                }
            }
            //if character name is specified as a name, first extracts first name and compares it to 
            //passed characterName. toLowerCase because of case sensitivity in equality. 
            else {
                if (getFirstName(message, characterName, (ch[i].character.name).toLowerCase())) {
                    message.channel.send(`**Character Name:** ${ch[i].character.name}\n\n` +
                                        `**Role:** ${ch[i].role}\n\n` +
                                        `${ch[i].character.url}`
                                        );
                    characterFound = true;
                    break;
                }
            }
        }

        if (!characterFound) {
            message.channel.send('Character not found :(')
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

module.exports = {
    name: 'mchr',
    description: '!mchr [main, sup, character_name] [manga_name] Returns Character Information. Use main for main characters, sup for supporting characters, and specify name for a specific character.',
    async execute(message, args, searchedName) {
        //takes character name from zero index. Needs reworking for 2 word character names. 
        const characterName = args[0].toLowerCase();
        //takes manga name from index one. Needs reworking for 2 word character names. 
        const passedMangaName = searchedName;
        
        try {
            const mangaID = await getMangaIDFromString(message, passedMangaName);
            getMangaCharacters(message, mangaID, characterName)
        } catch (error) {
            console.error('Error:', error.message);
            message.channel.send('An error occurred: ' + error.message);
        }
    }
}
