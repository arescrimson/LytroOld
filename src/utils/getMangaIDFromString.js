//getMangaIDFromString.js 

//IMPORTS

//STRING SIMILARITY LIBRARY 
const stringSimilarity = require('string-similarity');
//JIKAN API LIBRARY 
const Jikan = require('jikan4.js')
//JIKANJS WRAPPER LIBRARY
const client = new Jikan.Client();

/**
 * Gets manga ID from String. Since Jikan can only access specific manga through an ID, 
 * this utilizes a string-similarity to parse the string results and gets the ID from the 
 * one that is the best result. However, this is still in testing, and is not entirely accurate.
 * Also not sure that this is entirely necessary, given that Jikan already searches the searchString, 
 * but this will be addressed in the future. 
 * 
 * @param {*} message is the discord message.
 * @param {*} searchString is the searched manga name. 
 * @returns best result manga ID. 
 */
async function getMangaIDFromString(message, searchString) {
    try {
        const searchResults = await client.manga.search(searchString)


        const bestMatch = searchResults.reduce((best, manga) => {
            const similarity = stringSimilarity.compareTwoStrings(searchString, manga.title.default);
            if (similarity > best.similarity) {
                return { similarity, manga };
            }
            return best;
        }, { similarity: 0, manga: null });

        if (bestMatch.manga) {
            const result = {
                mangaID: bestMatch.manga.id,
                url: bestMatch.manga.url
            };
            
            return result.mangaID 
        } else {
            message.channel.send('No match found.');
        }

    } catch (error) {
        console.error('Error:', error.message);
    }
}

module.exports = { getMangaIDFromString };