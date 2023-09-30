/**
 * @file getAnimeID.js
 * @description Retrieves the anime ID from a search string.
 * @license MIT
 * @author Ares
 */

//IMPORT JIKAN CLIENT
const { jikanClient } = require('../../config')

/**
 * Gets an anime ID from a search string.
 *
 * This function performs a search for anime based on the provided search string and returns the ID
 * of the best-matching anime. It uses the Jikan API to perform the search.
 *
 * @param {Message} message - The Discord message object.
 * @param {string} searchString - The anime name or search string.
 * @returns {Promise<number>} The ID of the best-matching anime, or null if not found.
 */
async function getAnimeID(message, searchString) {
    try {
        // Perform a search for anime based on the search string.
        const searchResults = await jikanClient.anime.search(searchString);

        // Determine the number of results to consider (approximately the top quarter).
        const quarterLength = Math.ceil(searchResults.length / 4);

        let foundID;

        // Iterate through the results to find the best match.
        for (let i = 0; i < quarterLength; i++) {
            const animeName = searchResults[i].title.default.toLowerCase();

            // If an exact match is found, return its ID.
            if (searchString === animeName) {
                return searchResults[i].id;
            } else {
                foundID = searchResults[0].id; // Store the ID of the first result.
            }
        }

        // Check if a manga ID was found or not.
        if (foundID !== undefined && foundID !== null) {
            return foundID;
        } 

    } catch (error) {
        console.error('Error in getting AnimeID', error.message);
    }
}

module.exports = { getAnimeID };
