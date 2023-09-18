//getAnimeIDFromString.js 

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
 * one that is the best result. However, this is still in testing, and is not entirely accurate.
 * Also not sure that this is entirely necessary, given that Jikan already searches the searchString, 
 * but this will be addressed in the future. 
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
                url: bestMatch.anime.url
            };
            
            return result.animeID 
        } else {
            message.channel.send('No match found.');
        }

    } catch (error) {
        console.error('Error in getting AnimeIDFromString:', error.message);
    }
}

module.exports = { getAnimeIDFromString };