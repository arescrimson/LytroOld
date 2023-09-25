// getRandom.js

//IMPORTS

const { EmbedBuilder } = require('discord.js');

const { jikanClient, THUMBNAIL, MAX_VALUE_LENGTH, ICON_URL, ANIME_MODE, SYNOPSIS_NOT_FOUND, GENRES_NOT_FOUND, RATINGS_NOT_FOUND, EPISODES_NOT_FOUND } = require('../../config')

function createEmbed(TITLE, URL, THUMBNAIL, SYNOPSIS, SYNOPSIS2, EPISODES, GENRES, RATINGS, image) {
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

        const anime = await jikanClient.anime.random(true);

        const stats = await jikanClient.anime.getStatistics(anime.id);
        let genres = anime.genres.map(genre => genre.name).join(', ');

        if (!genres || genres.trim() === '') {
            genres = GENRES_NOT_FOUND;
        }

        //INITIALIZES SPLIT FOR SYNOPSIS THAT ARE OVER 1020 CHARACTERS 
        let synopsis = '';
        let synopsis2 = '\n';

        //SPLITS SYNOPSIS IF TOO LONG INTO 2-3 PARAGRAPHS. 
        if (anime.synopsis) {
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
                synopsis = anime.synopsis;
            }
        } else { 
            synopsis = SYNOPSIS_NOT_FOUND;
        }

        let ratings = '';

        //RATINGS AS AN AVERAGED SCORE STRING 
        if (stats.scores !== null) {
            let totalScore = 0;
            let totalVotes = 0;

            for (const obj of stats.scores) {
                totalScore += obj.score * obj.votes;
                totalVotes += obj.votes;
            }

            const averageScore = totalScore / totalVotes;

            ratings = `Average score based off ${totalVotes.toLocaleString()} votes: ${averageScore.toFixed(2) + ' / 10'}`;
        } else {
            ratings = RATINGS_NOT_FOUND;
        }

        //SYNOPSIS, URL, EPISODES, GENRES, RATINGS
        const SYNOPSIS = synopsis;
        const SYNOPSIS2 = synopsis2;
        const URL = anime.url ?? EPISODES_NOT_FOUND;
        const EPISODES = anime.episodes ?? EPISODES_NOT_FOUND;
        const GENRES = genres;
        const RATINGS = ratings;

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