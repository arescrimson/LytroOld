// getRandom.js

//IMPORTS

const { EmbedBuilder } = require('discord.js');

const { client, THUMBNAIL, MAX_VALUE_LENGTH, ICON_URL, ANIME_MODE } = require('../../config')

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


function createEmbed(TITLE, URL, THUMBNAIL, SYNOPSIS, SYNOPSIS2, SYNOPSIS3, EPISODES, GENRES, RATINGS, image) {

    const createdEmbed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle(`${TITLE}`)
        .setURL(`${URL}`)
        .setAuthor({ name: `Currently Searching ${ANIME_MODE} : ${TITLE}`, iconURL: ICON_URL })
        .setThumbnail(THUMBNAIL)
        .addFields(
            { name: '\n\u200b', value: '\n\u200b' },
            { name: 'Synopsis: \n\u200b', value: `${SYNOPSIS}` },
            { name: '\n', value: `${SYNOPSIS2}` },
            { name: '\n', value: `${SYNOPSIS3}\n\u200b` },
            { name: 'Episodes:', value: `${EPISODES}`, inline: true },
            { name: 'Genres:', value: `${GENRES}`, inline: true },
            { name: 'Ratings:', value: `${RATINGS}`, inline: true }
        )
        .setImage(`${image}`)
        .setTimestamp()
        .setFooter({ text: 'Information from Lytro', iconURL: ICON_URL });

    return createdEmbed;
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
        let synopsis = '';
        let synopsis2 = '\n';
        let synopsis3 = '\n';

        //SPLITS SYNOPSIS IF TOO LONG INTO 2-3 PARAGRAPHS. 
        if (anime.synopsis.length > MAX_VALUE_LENGTH) {
            const splitSynopsis = anime.synopsis.split('\n');
            //Because some synopsis are too long, yet are only 2 paragraphs, use ternary to check. 
            //However, this means that if a synopsis is too long yet contains say, 4 paragraphs, this will not work. 
            synopsis = splitSynopsis[0];
            synopsis2 = (splitSynopsis[2] !== null) ? splitSynopsis[2] : '';
            synopsis3 = (splitSynopsis[4] !== null) ? splitSynopsis[4] : '';
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
        const SYNOPSIS2 = synopsis2;
        const SYNOPSIS3 = synopsis3;
        const URL = commandNullCheck(anime.url, 'URL not found.');
        const EPISODES = commandNullCheck(anime.episodes, 'Episodes not found.');
        const GENRES = commandNullCheck(genres, 'Genres not found.');
        const RATINGS = commandNullCheck(ratings, 'Ratings not found.');

        //if synopsis has been split, use the split synopsis' as embed does not support more than 1024 characters per value. 
        const embedMessage = createEmbed(
            anime.title.default,
            URL,
            THUMBNAIL,
            SYNOPSIS,
            SYNOPSIS2,
            SYNOPSIS3,
            EPISODES,
            GENRES,
            RATINGS,
            anime.image.webp.default
        )

        message.channel.send({ embeds: [embedMessage] });

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