// getRandom.js

//IMPORTS

const { EmbedBuilder } = require('discord.js');

//JIKAN API LIBRARY 
const Jikan = require('jikan4.js');

//JIKANJS WRAPPER LIBRARY
const client = new Jikan.Client();

const { MAX_VALUE_LENGTH } = require('../../config')

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
 * Gets Random Anime. Returns information identical to getAnime. 
 * 
 * @param {*} message is the discord message. 
 */
async function getRandomAnime(message) {

    try {

        let random = await client.anime.random(true);
        const animeID = random.id;

        //GETS ANIME INFORMATION
        const anime = random;
        const stats = await client.anime.getStatistics(animeID);
        const genres = anime.genres.map(genre => genre.name).join(', ');

        //INITIALIZES SPLIT FOR SYNOPSIS THAT ARE OVER 1020 CHARACTERS 
        let split = false;
        let synopsis = '';
        let synopsis2 = '';
        let synopsis3 = '';

        //SPLITS SYNOPSIS IF TOO LONG INTO 2-3 PARAGRAPHS. 
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

        //SYNOPSIS, URL, EPISODES, GENRES, RATINGS
        const SYNOPSIS = commandNullCheck(synopsis, 'Synopsis not found.');
        const URL = commandNullCheck(anime.url, 'URL not found.');
        const EPISODES = commandNullCheck(anime.episodes, 'Episodes not found.');
        const GENRES = commandNullCheck(genres, 'Genres not found.');
        const RATINGS = commandNullCheck(ratings, 'Ratings not found.');

        //if synopsis has been split, use the split synopsis' as embed does not support more than 1024 characters per value. 
        if (split) {
            const exampleEmbed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle(`${anime.title.default}`)
                .setURL(`${URL}`)
                .setAuthor({ name: `Currently Searching: ${anime.title.default}` })
                .setThumbnail('https://github.com/arescrimson/Lytro/blob/master/img/profile.jpg?raw=true')
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
                .setFooter({ text: 'Information from Lytro' });

            message.channel.send({ embeds: [exampleEmbed] });
        }
        // if not split, simply just use the regular synopsis that was assigned to the anime synopsis. 
        else {
            const exampleEmbed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle(`${anime.title.default}`)
                .setURL(`${URL}`)
                .setAuthor({ name: `Currently Searching: ${anime.title.default}` })
                .setThumbnail('https://github.com/arescrimson/Lytro/blob/master/img/profile.jpg?raw=true')
                .addFields(
                    { name: '\n\u200b', value: '\n\u200b' },
                    { name: 'Synopsis: \n\u200b', value: `${SYNOPSIS}\n\u200b` },
                    { name: 'Episodes:', value: `${EPISODES}`, inline: true },
                    { name: 'Genres:', value: `${GENRES}`, inline: true },
                )
                .addFields({ name: 'Ratings:', value: `${RATINGS}`, inline: true })
                .setImage(`${anime.image.webp.default}`)
                .setTimestamp()
                .setFooter({ text: 'Information from Lytro' });

            message.channel.send({ embeds: [exampleEmbed] });
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

module.exports = {
    name: 'rand',
    description: '!rand Returns random anime',
    async execute(message) {
        try {
            await getRandomAnime(message)
        } catch (error) {
            console.error('Error:', error.message);
            message.channel.send('An error occurred: ' + error.message);
        }
    }
}