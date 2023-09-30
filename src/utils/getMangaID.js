/**
 * @file getMangaID.js
 * @description Retrieves the manga ID from a search string.
 * @license MIT
 * @author Ares
 */

//IMPORT JIKAN CLIENT
const { jikanClient } = require('../../config')

/**
 * Retrieves the manga ID from a search string.
 *
 * This function performs a search for manga based on the provided search string and returns the ID
 * of the best-matching manga. It uses the Jikan API to perform the search.
 *
 * @param {Message} message - The Discord message object.
 * @param {string} searchString - The manga name or search string.
 * @returns {Promise<number>} The ID of the best-matching manga, or null if not found.
 */
async function getMangaID(message, searchString) {
    try {

        //array of manga objects returned from the searched string. 
        const searchResults = await jikanClient.manga.search(searchString);

        // Determine the number of results to consider (approximately the top quarter). 
        const quarterLength = Math.ceil(searchResults.length / 4);

        let foundID;

        for (let i = 0; i < quarterLength; i++) {
            const mangaName = (searchResults[i].title.default).toLowerCase();

            // If an exact match is found, return its ID.
            if (searchString === mangaName) {
                return searchResults[i].id;
            }
            else {
                foundID = searchResults[0].id; // Store the ID of the first result.
            }
        }

        // Check if a manga ID was found or not.
        if (foundID !== undefined || null) {
            return foundID;
        }

    } catch (error) {
        console.error('Error in getting mangaIDFromString:', error.message);
    }
}

module.exports = { getMangaID };