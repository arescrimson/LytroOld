// getImages.js

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
 * @returns 
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
            //Stores the best match anime ID result, i.e One Piece's MAL ID is 23. 
            const result = {
                animeID: bestMatch.anime.id,
            };

            //returns MAL ID for usage by command function. 
            return result.animeID;
        } else {
            message.channel.send('No match found.');
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

/**
 * Gets Anime Images from the animeID passed. 
 * 
 * @param {*} message is the discord message. 
 * @param {*} animeID is the animeID passed. 
 */
async function getAnimeImages(message, animeID) {

    try {
        const ch = await client.anime.getPictures(animeID);

        const randomImageIndex = Math.floor(Math.random() * ch.length);

        const testlink = ch[randomImageIndex].jpg.default.href

        message.channel.send({
            files: [{ 
                attachment: testlink
            }]
        })
    } catch (error) {
        console.error('Error:', error.message);
    }
}

module.exports = {
    name: 'img',
    description: 'Gets Anime Images.',
    async execute(message, args) {
        const passedMangaName = args.join(' ');

        try {
            const animeID = await getAnimeIDFromString(message, passedMangaName);
            getAnimeImages(message, animeID)
        } catch (error) {
            console.error('Error:', error.message);
            message.channel.send('An error occurred: ' + error.message);
        }
    }
}
