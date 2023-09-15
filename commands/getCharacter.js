// getAnime.js

//IMPORTS

//IMPORT GETID 
const {getAnimeIDFromString} = require('../utils/getAnimeIDFromString')
//JIKAN API LIBRARY 
const Jikan = require('jikan4.js')
//JIKANJS WRAPPER LIBRARY
const client = new Jikan.Client();

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
        for (let i = 0; i < ch.length; i++) {

            //if character name is main, indexes ALL MAIN CHARACTERS.
            if (characterName === 'main') {
                if (ch[i].role === 'Main') {
                    message.channel.send(`Main Characters: ${ch[i].character.url}`)
                }
            } 
            
            //if character name is sup, indexes ALL SUPPORTING CHARACTERS.
            if (characterName === 'sup') {
                if (ch[i].role === 'Supporting' && maxIndex < 5) {
                    message.channel.send(`Supporting Characters: ${ch[i].character.url}`)
                    maxIndex++;
                }
            }
            
            //if character name is specified as a name, searches for name in index.
            if (characterName === (ch[i].character.name).toLowerCase()) {
                message.channel.send(`**ID:** ${ch[i].character.id}\n\n**Character Role:** ${ch[i].role}\n\nCharacter: ${ch[i].character.url}`)
            }
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
