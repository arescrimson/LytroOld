// getRandom.js

//IMPORTS

const { EmbedBuilder } = require('discord.js');

const { jikanClient, THUMBNAIL, VOLUMES_NOT_FOUND, MAX_VALUE_LENGTH, ICON_URL, MANGA_MODE, SYNOPSIS_NOT_FOUND, URL_NOT_FOUND, GENRES_NOT_FOUND, RATINGS_NOT_FOUND } = require('../../config')

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

function createEmbed(TITLE, URL, THUMBNAIL, SYNOPSIS, SYNOPSIS2, VOLUMES, GENRES, RATINGS, image) {

    const createdEmbed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle(`${TITLE}`)
        .setURL(`${URL}`)
        .setAuthor({ name: `Currently Searching ${MANGA_MODE} : ${TITLE}`, iconURL: ICON_URL })
        .setThumbnail(THUMBNAIL)
        .addFields(
            { name: '\n\u200b', value: '\n\u200b' },
            { name: 'Synopsis: \n\u200b', value: `${SYNOPSIS}` },
            { name: '\n', value: `${SYNOPSIS2}\n\u200b` },
            { name: 'VOLUMES:', value: `${VOLUMES}`, inline: true },
            { name: 'Genres:', value: `${GENRES}`, inline: true },
            { name: 'Ratings:', value: `${RATINGS}`, inline: true }
        )
        .setImage(`${image}`)
        .setTimestamp()
        .setFooter({ text: 'Information from Lytro', iconURL: ICON_URL });

    return createdEmbed;
}

/**
 * Gets Random manga. Returns information identical to getmanga. 
 * 
 * @param {*} message is the discord message. 
 */
async function getRandomManga(message) {

    try {

        let random = await jikanClient.manga.random(true);
        const mangaID = random.id;

        //GETS manga INFORMATION
        const manga = random;
        const stats = await jikanClient.manga.getStatistics(mangaID);
        const genres = manga.genres.map(genre => genre.name).join(', ');

        //INITIALIZES SPLIT FOR SYNOPSIS THAT ARE OVER 1020 CHARACTERS 
        let synopsis = '';
        let synopsis2 = '\n';

        //SPLITS SYNOPSIS IF TOO LONG INTO 2-3 PARAGRAPHS. 
        if (manga.synopsis.length > MAX_VALUE_LENGTH) {
            const midPoint = manga.synopsis.lastIndexOf('.', MAX_VALUE_LENGTH);
                if (midPoint !== -1) {
                    const synopsisFirstPart = manga.synopsis.substring(0, midPoint + 1);
                    const synopsisSecondPart = manga.synopsis.substring(midPoint + 1);
                    synopsis = synopsisFirstPart;
                    synopsis2 = synopsisSecondPart;
                }
        }
        //else, simply assign synopsis to the manga synopsis. 
        else {
            synopsis = manga.synopsis;
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
        const SYNOPSIS = commandNullCheck(synopsis, SYNOPSIS_NOT_FOUND);
        const SYNOPSIS2 = synopsis2;
        const URL = commandNullCheck(manga.url, URL_NOT_FOUND);
        const GENRES = commandNullCheck(genres, GENRES_NOT_FOUND);
        const VOLUMES = (manga.volumes !== null) ? manga.volumes : VOLUMES_NOT_FOUND;
        const RATINGS = commandNullCheck(ratings, RATINGS_NOT_FOUND);

        //if synopsis has been split, use the split synopsis' as embed does not support more than 1024 characters per value. 
        const embedMessage = createEmbed(
            manga.title.default,
            URL,
            THUMBNAIL,
            SYNOPSIS,
            SYNOPSIS2,
            VOLUMES,
            GENRES,
            RATINGS,
            manga.image.webp.default
        )

        message.channel.send({ embeds: [embedMessage] });

    } catch (error) {
        console.error('Error:', error.message);
    }
}

module.exports = {
    name: 'mrand',
    description: '!mrand Returns random manga',
    async execute(message) {
        try {
            await getRandomManga(message);
        } catch (error) {
            console.error('Error:', error.message);
            message.channel.send('An error occurred: ' + error.message);
        }
    }
}