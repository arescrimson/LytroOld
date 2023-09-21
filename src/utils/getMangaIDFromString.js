//getMangaIDFromString.js 

//IMPORTS

//JIKAN API LIBRARY 
const Jikan = require('jikan4.js')
//JIKANJS WRAPPER LIBRARY
const client = new Jikan.Client();

/**
 * Gets manga ID from String. 
 * 
 * Firstly, Math.ceil rounds to the nearest integer greater to or equal to that number, preventing 
 * any cases where the returned array of search string are less than 4. Although, I think that 
 * MAL search will always return more than 4 entries, but this is also there since the manga that 
 * people will be searching for will pretty much always be in the top 4 of returned searches, as 
 * their algorithim does the matching work(I hope). 
 * 
 * It then iterates through that, and if the manga name is an exact match with what the user searched for, i.e. hunter x hunter, it returns that immediately. 
 * else, it returns the first index of the searchResults array, which is usually close to what they are looking for. 
 * Although this step needs some further work, it solved the issue of demon slayer, and you can now search demon 
 * slayer and it will return the correct manga despite it being listed as kimetsu no yaiba, because we let MAL 
 * search do the work. 
 * 
 * Then, we do a simple null check on the returned foundID and either return the foundID, or say that the manga was not found. 
 * 
 * @param {*} message is the discord message.
 * @param {*} searchString is the searched manga name. 
 * @returns best result manga ID. 
 */
async function getMangaIDFromString(message, searchString) {
    try {

        //array of manga objects returned from the searched string. 
        const searchResults = await client.manga.search(searchString)

        //takes the first quarter indexes of  searchResults array. 
        const quarterLength = Math.ceil(searchResults.length / 4);

        //initializes the ID of found manga. 
        let foundID;

        for (let i = 0; i < quarterLength; i++) {
            const mangaName = (searchResults[i].title.default).toLowerCase();


            if (searchString === mangaName) {
                return searchResults[i].id;
            } 
            
            else {
                foundID = searchResults[0].id;
            }
        }

        if (foundID !== undefined || null) {
            return foundID;
        } 
        
        else {
            message.channel.send('manga not found.');
        }

    } catch (error) {
        console.error('Error in getting mangaIDFromString:', error.message);
    }
}

module.exports = { getMangaIDFromString };