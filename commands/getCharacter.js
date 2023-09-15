// getAnime.js

//IMPORTS

//STRING SIMILARITY LIBRARY 
const stringSimilarity = require('string-similarity');
//JIKAN API LIBRARY 
const Jikan = require('jikan4.js')
//JIKANJS WRAPPER LIBRARY
const client = new Jikan.Client();

/**
 * Gets Anime ID from String. Since Jikan can only access specific animes through an ID, 
 * this utilizes a string-similarity to parse the string results and gets the ID from the 
 * one that is the best result. However, this is still in testing, and is not entirely accurate, 
 * sometimes even returning wrong results for correct searches, i.e. demon slayer does not return 
 * demon slayer, you have to search kimetsu no yaiba etc . 
 * 
 * @param {*} message is the discord message.
 * @param {*} searchString is the searched anime name. 
 * @returns best result anime ID. 
 */
async function getAnimeIDFromString(message, searchString) {
    try {
        const searchResults = await client.anime.search(searchString)

        const bestMatch = searchResults.reduce((best, anime) => {
            const similarity = stringSimilarity.compareTwoStrings(searchString, anime.title.default);
            if (similarity > best.similarity) {
                return { similarity, anime };
            }
            return best;
        }, { similarity: 0, anime: null });

        if (bestMatch.anime) {
            const result = {
                animeID: bestMatch.anime.id,
                url: bestMatch.anime.url,
                name: bestMatch.anime.name
            };
            return result.animeID;
        } else {
            message.channel.send('No match found.');
        }
    } catch (error) {
        console.error('Error:', error.message);
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
