// getInfo.js

//IMPORTS

//IMPORT GETID 
const { getAnimeIDFromString } = require('../utils/getAnimeIDFromString')
//JIKAN API LIBRARY 
const Jikan = require('jikan4.js')
//JIKANJS WRAPPER LIBRARY
const client = new Jikan.Client();

/**
 * Checks if value passed is null. If null, instead returns error Message 
 * as to display 'Value not found.' instead of null in message response. 
 * 
 * @param {*} value is the Jikan get value. 
 * @param {*} errMessage is the message if value is null.  
 * @returns either value or error Message depending on if value is null. 
 */
function commandNullCheck(value, errMessage) {
    return (value !== null) ? value : errMessage;
}

/**
 * Gets additional information from the animeID passed. 
 * 
 * @param {*} message is the discord message. 
 * @param {*} animeID is the animeID passed. 
 */
async function getInfo(message, animeID) {
    try {

        //GETS ANIME INFORMATION
        const anime = await client.anime.get(animeID);
        const rec = await client.anime.getRecommendations(animeID);

        //TEMPORARY WAY OF DISPLAYING RECOMMENDATION TITLES
        const recList = []; 
        recList.push(rec[0].entry.title);
        recList.push(rec[1].entry.title);

        const recListString = recList.map(item => item).join(', ');

        //SYNOPSIS, URL, EPISODES, RANK, GENRES, RATINGS
        const BACKGROUND = commandNullCheck(anime.background, 'Background not found.');
        const YEAR = commandNullCheck(anime.year, 'Year not found.');
        const TRAILER = commandNullCheck(anime.trailer?.embedUrl.href, 'Trailer not found.');
        const STUDIO = commandNullCheck(anime.studios[0].name, 'Studios not found.');
        const RECOMMENDATIONS = commandNullCheck(recListString, 'Recommendations not found.')

        //FORMATTED SENT MESSAGE 
        message.channel.send(`**Background:**\n\n${BACKGROUND}\n\n`+
                            `**Year Released:**\n\n${YEAR}\n\n`+
                            `**Animation Studio:**\n\n${STUDIO}\n\n`+
                            `**Related Animes:**\n\n${RECOMMENDATIONS}\n\n`+
                            `**Latest Trailer:**\n\n${TRAILER}\n\n`
                            );
    } catch (error) {
        console.error('Error:', error.message);
    }
}

module.exports = {
    name: 'info',
    description: '!info [anime_name] Returns Anime Information.',
    async execute(message, args, currentSearchName) {

        const passedAnimeName = currentSearchName;

        try {
            message.channel.send(`**Currently Searching:** ${passedAnimeName}`);
            message.channel.send(`** **`); //blank message for formatting
            const animeID = await getAnimeIDFromString(message, passedAnimeName);
            getInfo(message, animeID);
        } catch (error) {
            console.error('Error in getInfo:', error.message);
            message.channel.send('An error occurred in getInfo: ' + error.message);
        }
    }
}