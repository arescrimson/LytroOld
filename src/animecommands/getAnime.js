// getAnime.js

//IMPORTS
const { EmbedBuilder } = require('discord.js');

//IMPORT GETID 
const { getAnimeIDFromString } = require('../utils/getAnimeIDFromString');

//JIKAN API LIBRARY 
const Jikan = require('jikan4.js');

//JIKANJS WRAPPER LIBRARY
const client = new Jikan.Client();

//LYTRO FOOTER ICON, MAX VALUE LENGTH FOR EMBEDS
const { THUMBNAIL, ICON_URL, MAX_VALUE_LENGTH } = require('../../config')

//ERROR MESSAGES
const {SYNOPSIS_NOT_FOUND, URL_NOT_FOUND, EPISODES_NOT_FOUND, GENRES_NOT_FOUND, RATINGS_NOT_FOUND } = require('../../config')

/**
 * Checks if value passed is null. If null, instead returns error Message 
 * as to display 'Value not found.' instead of null in message response. 
 * 
 * @param {*} value is the Jikan get value. 
 * @param {*} errMessage is the message if value is null.  
 * @returns either value or error Message depending on if value is null. 
 */
function nullCheck(value, errMessage) {
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
        const genres = nullCheck(anime.genres.map(genre => genre.name).join(', '), GENRES_NOT_FOUND);

        //INITIALIZES SPLIT FOR SYNOPSIS THAT ARE OVER 1020 CHARACTERS 
        let split = false;
        let synopsis = '';
        let synopsis2 = '';
        let synopsis3 = '';
        
        //SPLITS SYNOPSIS IF TOO LONG INTO 2-3 PARAGRAPHS. 
        if (anime.synopsis !== null) { 
            if (anime.synopsis.length > MAX_VALUE_LENGTH) {
                const splitSynopsis = anime.synopsis.split('\n');
                //Because some synopsis are too long, yet are only 2 paragraphs, use ternary to check. 
                //However, this means that if a synopsis is too long yet contains say, 4 paragraphs, this will not work. 
                synopsis = splitSynopsis[0];
                synopsis2 = (splitSynopsis[2] !== null) ? splitSynopsis[2] : '';
                synopsis3 = (splitSynopsis[4] !== null) ? splitSynopsis[4] : '';
                split = true;
            } 
            //else, simply assign synopsis to the anime synopsis. 
            else {
                synopsis = anime.synopsis;
            }
        } 
        
        else { 
            synopsis = SYNOPSIS_NOT_FOUND; 
        }

        //RATINGS AS AN AVERAGED SCORE STRING 
        let ratings = ''; 
        let totalScore = 0;
        let totalVotes = 0;

        if ( stats.scores !== null ) { 
            for (const obj of stats.scores) {
                totalScore += obj.score * obj.votes;
                totalVotes += obj.votes;
            }
    
            const averageScore = totalScore / totalVotes;
    
            ratings = `Average score based off ${totalVotes.toLocaleString()} votes: ${averageScore.toFixed(2) + ' / 10'}`;
        } 
        
        else { 
            ratings = RATINGS_NOT_FOUND;
        }
        

        //SYNOPSIS, URL, EPISODES, GENRES, RATINGS
        const SYNOPSIS = synopsis;
        const URL = ( anime.url !== null ) ? anime.url : URL_NOT_FOUND;
        const EPISODES = ( anime.episodes !== null ) ? anime.episodes : EPISODES_NOT_FOUND;
        const GENRES = genres;
        const RATINGS = ratings;

        //if synopsis has been split, use the split synopsis' as embed does not support more than 1024 characters per value. 
        if (split) {
            const exampleEmbed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle(`${anime.title.default}`)
                .setURL(`${URL}`)
                .setAuthor({ name: `Currently Searching: ${anime.title.default}` })
                .setThumbnail(THUMBNAIL)
                .addFields(
                    { name: '\n\u200b', value: '\n\u200b' },
                    { name: 'Synopsis: \n\u200b', value: `${SYNOPSIS}` },
                    { name: '\n', value: `${synopsis2}` },
                    { name: '\n', value: `${synopsis3}\n\u200b` },
                    { name: 'Episodes:', value: `${EPISODES}`, inline: true },
                    { name: 'Genres:', value: `${GENRES}`, inline: true },
                )
                .addFields({ name: 'Ratings:', value: `${RATINGS}`, inline: true })
                .setImage(`${anime.image.webp.default}`)
                .setTimestamp()
                .setFooter({ text: 'Information from Lytro' , iconURL: ICON_URL});

            message.channel.send({ embeds: [exampleEmbed] });
        } 
        // if not split, simply just use the regular synopsis that was assigned to the anime synopsis. 
        else {
            const exampleEmbed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle(`${anime.title.default}`)
                .setURL(`${URL}`)
                .setAuthor({ name: `Currently Searching: ${anime.title.default}` })
                .setThumbnail(THUMBNAIL)
                .addFields(
                    { name: '\n\u200b', value: '\n\u200b' },
                    { name: 'Synopsis: \n\u200b', value: `${SYNOPSIS}\n\u200b` },
                    { name: 'Episodes:', value: `${EPISODES}`, inline: true },
                    { name: 'Genres:', value: `${GENRES}`, inline: true },
                )
                .addFields({ name: 'Ratings:', value: `${RATINGS}`, inline: true })
                .setImage(`${anime.image.webp.default}`)
                .setTimestamp()
                .setFooter({ text: 'Information from Lytro', iconURL: ICON_URL });

            message.channel.send({ embeds: [exampleEmbed] });
        }

    } catch (error) {
        console.error('Error:', error.message);
    }
}

module.exports = {
    name: 'a',
    description: '!a [anime_name] Returns anime information.',
    async execute(message, args, searchName) {

        const passedAnimeName = searchName

        try {
            const animeID = await getAnimeIDFromString(message, passedAnimeName);
            getAnimeInfo(message, animeID);
        } catch (error) {
            console.error('Error:', error.message);
            message.channel.send('An error occurred: ' + error.message);
        }
    }
}
