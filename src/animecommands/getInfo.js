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
 * Gets more information from the animeID passed. 
 * 
 * @param {*} message is the discord message. 
 * @param {*} animeID is the animeID passed. 
 */
async function getInfo(message, animeID) {
    try {

        //GETS ANIME INFORMATION
        const anime = await client.anime.get(animeID);

        //SYNOPSIS, URL, EPISODES, RANK, GENRES, RATINGS
        const BACKGROUND = commandNullCheck(anime.background, 'Background not found.');
        const YEAR = commandNullCheck(anime.year, 'Year not found.');
        const TRAILER = commandNullCheck(anime.trailer?.embedUrl.href, 'Trailer not found.');

        //FORMATTED SENT MESSAGE 
        message.channel.send(`**Background:**\n\n${BACKGROUND}\n\n`+
                            `**Year Released:**\n\n${YEAR}\n\n`+
                            `**Latest Trailer:**\n\n${TRAILER}\n\n`
                            );

    } catch (error) {
        console.error('Error:', error.message);
    }
}

module.exports = {
    name: 'info',
    description: '!info [anime_name] Returns Anime Information.',
    async execute(message, args) {

        //Gets passed manga name. 
        const passedAnimeName = args.join(' ');

        try {
            //Gets anime ID from ID get function. 
            const animeID = await getAnimeIDFromString(message, passedAnimeName);
            //Gets anime information Info get function. 
            getInfo(message, animeID);
        } catch (error) {
            console.error('Error:', error.message);
            message.channel.send('An error occurred: ' + error.message);
        }
    }
}