// getmanga.js

//IMPORTS

//IMPORT GETID 
const { getMangaIDFromString } = require('../utils/getMangaIDFromString')
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
 * Gets manga Information from the mangaID passed. 
 * 
 * @param {*} message is the discord message. 
 * @param {*} mangaID is the mangaID passed. 
 */
async function getMangaInfo(message, mangaID) {
    try {

        //GETS manga INFORMATION
        const manga = await client.manga.get(mangaID);
        const stats = await client.manga.getStatistics(mangaID);
        const genres = manga.genres.map(genre => genre.name).join(', ');

        //GENRES AS A STRING LIST WITH COMMAS 
        let genreText = "";

        for (let i = 0; i < manga.genres.length; i++) {
            genreText += manga.genres[i].name;

            if (i < manga.genres.length - 1) {
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
        const SYNOPSIS = commandNullCheck(manga.synopsis, 'Synopsis not found.');
        const URL = commandNullCheck(manga.url, 'URL not found.');
        const EPISODES = commandNullCheck(manga.chapters, 'Chapters not found.');
        const RANK = commandNullCheck(manga.rank, 'Rank not found.');
        const GENRES = commandNullCheck(genres, 'Genres not found.')
        const RATINGS = commandNullCheck(ratings, 'Ratings not found.')

        //FORMATTED SENT MESSAGE 
        message.channel.send(`**Synopsis:**\n\n${SYNOPSIS}\n\n` +
            `**Manga Rank:**\n\n${RANK}\n\n` +
            `**Chapters:**\n\n${EPISODES}\n\n` +
            `**Ratings**\n\n${RATINGS}\n\n` +
            `**Genres:**\n\n${GENRES}\n\n` +
            `**MyAnimeList URL:**\n\n${URL}
                            `)
    } catch (error) {
        console.error('Error:', error.message);
    }
}

module.exports = {
    name: 'm',
    description: '!m [manga_name] Returns manga Information.',
    async execute(message, args) {

        //Gets passed manga name. 
        const passedMangaName = args.join(' ');

        try {
            //Gets manga ID from ID get function. 
            const mangaID = await getMangaIDFromString(message, passedMangaName);
            //Gets manga information Info get function. 
            getMangaInfo(message, mangaID);
        } catch (error) {
            console.error('Error:', error.message);
            message.channel.send('An error occurred: ' + error.message);
        }
    }
}