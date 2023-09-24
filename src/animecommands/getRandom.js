// getRandom.js

//IMPORTS

const { EmbedBuilder } = require('discord.js');

const { jikanClient, THUMBNAIL, MAX_VALUE_LENGTH, ICON_URL, ANIME_MODE, SYNOPSIS_NOT_FOUND, GENRES_NOT_FOUND } = require('../../config')

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


function createEmbed(TITLE, URL, THUMBNAIL, SYNOPSIS, SYNOPSIS2, EPISODES, GENRES, RATINGS, image) {
    //console.log("TITLE:", TITLE);
    //console.log("URL:", URL);
    //console.log("SYNOPSIS:", SYNOPSIS);
    //console.log("SYNOPSIS2:", SYNOPSIS2);
    //console.log("EPISODES:", EPISODES);
    //console.log("GENRES:", GENRES);
    //console.log("RATINGS:", RATINGS);
    const createdEmbed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle(`${TITLE}`)
        .setURL(`${URL}`)
        .setAuthor({ name: `Currently Searching ${ANIME_MODE} : ${TITLE}`, iconURL: ICON_URL })
        .setThumbnail(THUMBNAIL)
        .addFields(
            { name: '\n\u200b', value: '\n\u200b' },
            { name: 'Synopsis: \n\u200b', value: `${SYNOPSIS}` },
            { name: '\n', value: `${SYNOPSIS2}\n\u200b` },
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

        let random = await jikanClient.anime.random(true);
        const animeID = random.id;

        //GETS ANIME INFORMATION
        const anime = random;
        const stats = await jikanClient.anime.getStatistics(animeID);
        //console.log('Stats:' + stats);
        let genres = anime.genres.map(genre => genre.name).join(', ');

        if (!genres || genres.trim() === '') {
            genres = GENRES_NOT_FOUND;
        }
        //console.log('Genres' + genres);

        //INITIALIZES SPLIT FOR SYNOPSIS THAT ARE OVER 1020 CHARACTERS 
        let synopsis = '';
        let synopsis2 = '\n';

        //SPLITS SYNOPSIS IF TOO LONG INTO 2-3 PARAGRAPHS. 
        if (anime.synopsis !== null) {
            if (anime.synopsis.length > MAX_VALUE_LENGTH) {
                const midPoint = anime.synopsis.lastIndexOf('.', MAX_VALUE_LENGTH);
                if (midPoint !== -1) {
                    const synopsisFirstPart = anime.synopsis.substring(0, midPoint + 1);
                    const synopsisSecondPart = anime.synopsis.substring(midPoint + 1);
                    synopsis = synopsisFirstPart;
                    synopsis2 = synopsisSecondPart;
                }
            }
            //else, simply assign synopsis to the anime synopsis. 
            else {
                synopsis = SYNOPSIS_NOT_FOUND;
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
        const SYNOPSIS = synopsis;
        const SYNOPSIS2 = synopsis2;
        const URL = commandNullCheck(anime.url, 'URL not found.');
        const EPISODES = commandNullCheck(anime.episodes, 'Episodes not found.');
        const GENRES = genres;
        const RATINGS = commandNullCheck(ratings, 'Ratings not found.');

        //if synopsis has been split, use the split synopsis' as embed does not support more than 1024 characters per value. 
        const embedMessage = createEmbed(
            anime.title.default,
            URL,
            THUMBNAIL,
            SYNOPSIS,
            SYNOPSIS2,
            EPISODES,
            GENRES,
            RATINGS,
            anime.image.webp.default
        )

        message.channel.send({ embeds: [embedMessage] });

    } catch (error) {
        console.error('Error:', error.message);
        message.channel.send('An error occured: ' + error.message)
    }
}

module.exports = {
    name: 'rand',
    description: '!rand Returns random anime.',
    async execute(message) {
        try {
            await getRandomAnime(message)
        } catch (error) {
            console.error('Error:', error.message);
            message.channel.send('An error occurred.');
        }
    }
}