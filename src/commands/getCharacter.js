// getCharacter.js

//IMPORTS

//IMPORT GETID 
const { getAnimeIDFromString } = require('../utils/getAnimeIDFromString')
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
 * Gets Anime Characters from the animeID passed. 
 * 
 * @param {*} message is the discord message. 
 * @param {*} animeID is the animeID passed. 
 * @param {*} characterName is the lowercased character Name being searched. 
 */
async function getAnimeCharacters(message, animeID, characterName) {

    try {
        const ch = await client.anime.getCharacters(animeID);

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
                    `**Voice Actor:** ${ch[i].voiceActors[0].person.name} (${ch[i].voiceActors[0].language})\n\n` +
                    `${ch[i].character.url}`);                    
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
    name: 'chr',
    description: '!chr [main, sup, character_name] [anime_name] Gets Character Information.',
    async execute(message, args) {
        //takes character name from zero index. Needs reworking for 2 word character names. 
        const characterName = args[0].toLowerCase();
        //takes manga name from index one. Needs reworking for 2 word character names. 
        const passedMangaName = args.slice(1).join(' ');

        try {
            const animeID = await getAnimeIDFromString(message, passedMangaName);
            getAnimeCharacters(message, animeID, characterName)
        } catch (error) {
            console.error('Error:', error.message);
            message.channel.send('An error occurred: ' + error.message);
        }
    }
}
