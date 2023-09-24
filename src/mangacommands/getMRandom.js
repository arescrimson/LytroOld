/**
 * @file getMRandom.js
 * @description Retrieve information about a random manga.
 * @license MIT
 * @author Ares
 */

// IMPORTS

const { EmbedBuilder } = require('discord.js');


const {
    jikanClient,
    THUMBNAIL,
    VOLUMES_NOT_FOUND,
    MAX_VALUE_LENGTH,
    ICON_URL,
    MANGA_MODE,
    SYNOPSIS_NOT_FOUND,
    URL_NOT_FOUND,
    GENRES_NOT_FOUND,
    RATINGS_NOT_FOUND,
    AUTHOR_NOT_FOUND
} = require('../../config');

/**
 * Checks if a value passed is null. If null, returns an error message to display 'Value not found.'
 * instead of null in the message response.
 *
 * @param {*} value - The value to check.
 * @param {string} errMessage - The error message to use if the value is null.
 * @returns {*} Either the value or the error message, depending on if the value is null.
 */
function commandNullCheck(value, errMessage) {
    return value !== null ? value : errMessage;
}

/**
 * Create an embed message with manga information.
 *
 * @param {string} TITLE - The title of the manga.
 * @param {string} URL - The URL of the manga.
 * @param {string} THUMBNAIL - The thumbnail image URL.
 * @param {string} SYNOPSIS - The manga's synopsis (first part).
 * @param {string} SYNOPSIS2 - The manga's synopsis (second part).
 * @param {string|number} VOLUMES - The number of volumes (or "Not found" if null).
 * @param {string} GENRES - The genres of the manga (or "Not found" if null).
 * @param {string} RATINGS - The ratings information.
 * @param {string} image - The image URL.
 * @returns {MessageEmbed} The created embed message.
 */
function createEmbed(TITLE, URL, THUMBNAIL, AUTHOR, SYNOPSIS, SYNOPSIS2, VOLUMES, GENRES, RATINGS, image) {
    const createdEmbed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle(`${TITLE}`)
        .setURL(`${URL}`)
        .setAuthor({ name: `Currently Searching ${MANGA_MODE} : ${TITLE}`, iconURL: ICON_URL })
        .setThumbnail(THUMBNAIL)
        .addFields(
            { name: 'Author: \n\u200b', value: `**${AUTHOR}** \n\u200b` },
            { name: 'Synopsis: \n\u200b', value: `${SYNOPSIS}` },
            { name: '\n', value: `${SYNOPSIS2}\n\u200b` },
            { name: 'Volumes:', value: `${VOLUMES}`, inline: true },
            { name: 'Genres:', value: `${GENRES}`, inline: true },
            { name: 'Ratings:', value: `${RATINGS}`, inline: true }
        )
        .setImage(`${image}`)
        .setTimestamp()
        .setFooter({ text: 'Information from Lytro', iconURL: ICON_URL });

    return createdEmbed;
}

/**
 * Get information about a random manga and send it as an embed message.
 *
 * @param {Message} message - The Discord message object.
 */
async function getRandomManga(message) {
    try {
        let random = await jikanClient.manga.random(true);
        const mangaID = random.id;

        // GET manga INFORMATION
        const manga = random;
        const stats = await jikanClient.manga.getStatistics(mangaID);
        const genres = manga.genres.map(genre => genre.name).join(', ');

        if (!genres || genres.trim() === '') {
            genres = GENRES_NOT_FOUND;
        }

        // INITIALIZE SPLIT FOR SYNOPSIS THAT ARE OVER 1020 CHARACTERS
        let synopsis = '';
        let synopsis2 = '\n';

        // SPLIT SYNOPSIS IF TOO LONG INTO 2-3 PARAGRAPHS
        if (manga.synopsis !== null) {
            if (manga.synopsis.length > MAX_VALUE_LENGTH) {
                const midPoint = manga.synopsis.lastIndexOf('.', MAX_VALUE_LENGTH);
                if (midPoint !== -1) {
                    const synopsisFirstPart = manga.synopsis.substring(0, midPoint + 1);
                    const synopsisSecondPart = manga.synopsis.substring(midPoint + 1);
                    synopsis = synopsisFirstPart;
                    synopsis2 = synopsisSecondPart;
                }
            }
            // ELSE, SIMPLY ASSIGN SYNOPSIS TO THE MANGA SYNOPSIS
            else {
                synopsis = manga.synopsis;
            }
        } else {
            synopsis = SYNOPSIS_NOT_FOUND;
        }

        // RATINGS AS AN AVERAGED SCORE STRING
        let ratings = '';

        if (stats.scores !== null) {
            let totalScore = 0;
            let totalVotes = 0;

            for (const obj of stats.scores) {
                totalScore += obj.score * obj.votes;
                totalVotes += obj.votes;
            }

            const averageScore = totalScore / totalVotes;
            ratings = `Average score based on ${totalVotes.toLocaleString()} votes: ${averageScore.toFixed(2)} / 10`;
        } else {
            ratings = RATINGS_NOT_FOUND
        }

        //SYNOPSIS, AUTHOR, URL, VOLUMES, GENRES, RATINGS
        const SYNOPSIS = synopsis;
        const SYNOPSIS2 = synopsis2;
        const AUTHOR = manga.authors[0].name ?? AUTHOR_NOT_FOUND;
        const URL = manga.url ?? URL_NOT_FOUND;
        const GENRES = genres;
        const VOLUMES = manga.volumes?.toLocaleString() ?? VOLUMES_NOT_FOUND;
        const RATINGS = ratings;

        // IF SYNOPSIS HAS BEEN SPLIT, USE THE SPLIT SYNOPSIS AS EMBED DOES NOT SUPPORT MORE THAN 1024 CHARACTERS PER VALUE
        const embedMessage = createEmbed(
            manga.title.default,
            URL,
            THUMBNAIL,
            AUTHOR,
            SYNOPSIS,
            SYNOPSIS2,
            VOLUMES,
            GENRES,
            RATINGS,
            manga.image.webp.default
        );

        message.channel.send({ embeds: [embedMessage] });
    } catch (error) {
        message.channel.send('Error finding random manga.')
        console.error('Error:', error.message);
    }
}

module.exports = {
    name: 'mrand',
    description: '!mrand Returns information about a random manga.',
    /**
     * Execute the !mrand command.
     *
     * @param {Message} message - The Discord message object.
     */
    async execute(message) {
        try {
            await getRandomManga(message);
        } catch (error) {
            console.error('Error:', error.message);
            message.channel.send('An error occurred: ' + error.message);
        }
    },
};
