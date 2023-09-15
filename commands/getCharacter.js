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
function getFirstName(message, characterName) {
    const nameParts = characterName.split(',').map(part => part.trim());
    
    if (nameParts.length === 2) {
        // Extract and return the first part (firstname)
        return nameParts[1];
      } else if (nameParts.length === 1) {
        // If there's only one part, assume it's the first name
        return nameParts[0];
      } else {
        // Return an error message or handle the case where the format is not as expected
        message.channel.send('invalid')
        return "Invalid format";
      }
}

/**
 * Gets Anime Information from the animeID passed. 
 * 
 * @param {*} message is the discord message. 
 * @param {*} animeID is the animeID passed. 
 * @param {*} characterName is the character name specified in the discord command. 
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
                if (getFirstName(message,(ch[i].character.name).toLowerCase()) === characterName) { 
                    message.channel.send(`${ch[i].character.name}: ${ch[i].character.url}`)
                    characterFound = true; 
                } 
            }
        }

        if(!characterFound) { 
            message.channel.send('Character not found :(')
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

module.exports = {
    name: 'chr',
    description: 'Gets Character Information.',
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
