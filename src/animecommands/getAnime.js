// getAnime.js

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
 * Gets Anime Information from the animeID passed. 
 * 
 * @param {*} message is the discord message. 
 * @param {*} animeID is the animeID passed. 
 */
async function getAnimeInfo(message, animeID) {
    try {

        //GETS ANIME INFORMATION
        const anime = await client.anime.get(animeID);
        const stats = await client.anime.getStatistics(animeID);
        const genres = anime.genres.map(genre => genre.name).join(', ');

        //GENRES AS A STRING LIST WITH COMMAS 
        let genreText = "";

        for (let i = 0; i < anime.genres.length; i++) {
            genreText += anime.genres[i].name;

            if (i < anime.genres.length - 1) {
                genreText += ", "; // Adds a comma and space between genres
            }
        }

        //RATINGS AS AN AVERAGED SCORE STRING 
        let totalScore = 0;
        let totalVotes = 0;

        for (const obj of stats.scores) {
            totalScore += obj.score * obj.votes;
            totalVotes += obj.votes;
        }

        const averageScore = totalScore / totalVotes;

        const ratings = `Average score based off ${totalVotes.toLocaleString()} votes: ${averageScore.toFixed(2) + ' / 10'}`;

        //SYNOPSIS, URL, EPISODES, RANK, GENRES, RATINGS
        const SYNOPSIS = commandNullCheck(anime.synopsis, 'Synopsis not found.');
        const URL = commandNullCheck(anime.url, 'URL not found.');
        const EPISODES = commandNullCheck(anime.episodes, 'Episodes not found.');
        const RANK = commandNullCheck(anime.rank, 'Rank not found.');
        const GENRES = commandNullCheck(genres, 'Genres not found.')
        const RATINGS = commandNullCheck(ratings, 'Ratings not found.')

        //FORMATTED SENT MESSAGE 
        message.channel.send(`**Synopsis:**\n\n${SYNOPSIS}\n\n` +
            `**Anime Rank:**\n\n${RANK}\n\n` +
            `**Episodes:**\n\n${EPISODES}\n\n` +
            `**Ratings**\n\n${RATINGS}\n\n` +
            `**Genres:**\n\n${GENRES}\n\n` +
            `**MyAnimeList URL:**\n\n${URL}
                            `)
    } catch (error) {
        console.error('Error:', error.message);
    }
}

module.exports = {
    name: 'a',
    description: '!a [anime_name] Returns Anime Information.',
    async execute(message, args) {

        //Gets passed manga name. 
        const passedMangaName = args.join(' ');


        try {
            //Gets anime ID from ID get function. 
            const animeID = await getAnimeIDFromString(message, passedMangaName);
            //Gets anime information Info get function. 
            getAnimeInfo(message, animeID);
        } catch (error) {
            console.error('Error:', error.message);
            message.channel.send('An error occurred: ' + error.message);
        }
    }
}