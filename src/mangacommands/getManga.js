/**
 * @file getManga.js
 * @description Retrieve information about a manga.
 * @license MIT
 * @author Ares
 */

//IMPORTS

const { EmbedBuilder } = require('discord.js');

const { getID } = require('../utils/getIDUtil');

const { getMInfo } = require('../mangacommands/getMInfo');

const { 
    jikanClient,
    discordClient, 
    MANGA_MODE, 
    THUMBNAIL, 
    ICON_URL, 
    MAX_VALUE_LENGTH, 
    leftArrow, 
    rightArrow,
} = require('../../config')

//ERROR MESSAGES
const { SYNOPSIS_NOT_FOUND, URL_NOT_FOUND, AUTHOR_NOT_FOUND, VOLUMES_NOT_FOUND, GENRES_NOT_FOUND, RATINGS_NOT_FOUND } = require('../../config')

/**
 * Create an embed message with manga information.
 *
 * @param {string} TITLE - The title of the manga.
 * @param {string} URL - The URL of the manga.
 * @param {string} THUMBNAIL - The thumbnail image URL.
 * @param {string} AUTHOR - The author's name (or "Author not found" if null).
 * @param {string} SYNOPSIS - The manga's synopsis (first part).
 * @param {string} SYNOPSIS2 - The manga's synopsis (second part).
 * @param {string|number} VOLUMES - The number of volumes (or "Volumes not found" if null).
 * @param {string} GENRES - The genres of the manga (or "Genres not found" if null).
 * @param {string} RATINGS - The ratings information.
 * @param {string} image - The image URL.
 * @returns {MessageEmbed} The created embed message.
 */
function createEmbed(TITLE, URL, THUMBNAIL, AUTHOR, SYNOPSIS, SYNOPSIS2, VOLUMES, GENRES, RATINGS, image) {
    const createdEmbed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle(`${TITLE}`)
        .setURL(`${URL}`)
        .setAuthor({ name: `Currently Searching ${MANGA_MODE}: ${TITLE}`, iconURL: ICON_URL })
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
 * Get information about a manga and send it as an embed message.
 *
 * @param {Message} message - The Discord message object.
 * @param {number} mangaID - The ID of the manga to retrieve information for.
 */
async function getMangaInfo(message, mangaID) {
    try {   

        let embedMessage = null; 

        //GETS MANGA INFORMATION
        const manga = await jikanClient.manga.get(mangaID);
        const stats = await jikanClient.manga.getStatistics(mangaID);
        let genres = manga.genres.map(genre => genre.name).join(', ');

        if (!genres || genres.trim() === '') {
            genres = GENRES_NOT_FOUND;
        }

        //INITIALIZES SPLIT FOR SYNOPSIS THAT ARE OVER 1020 CHARACTERS 
        let synopsis = '';
        let synopsis2 = '\n';

        //SPLITS SYNOPSIS IF TOO LONG INTO 2-3 PARAGRAPHS. 
        if (manga.synopsis !== null) {
            if (manga.synopsis.length > MAX_VALUE_LENGTH) {
                const midPoint = manga.synopsis.lastIndexOf('.', MAX_VALUE_LENGTH);
                if (midPoint !== -1) {
                    const synopsisFirstPart = manga.synopsis.substring(0, midPoint + 1);
                    const synopsisSecondPart = manga.synopsis.substring(midPoint + 1);
                    synopsis = synopsisFirstPart;
                    synopsis2 = synopsisSecondPart;
                }

                if (synopsis2 === undefined) {
                    synopsis2 = '\n';
                }
            }
            else {
                synopsis = manga.synopsis;
            }
        } 
        else {
            synopsis = SYNOPSIS_NOT_FOUND;
        }

        //RATINGS AS AN AVERAGED SCORE STRING 
        let ratings = '';

        if (stats.scores !== null) {
            let totalScore = 0;
            let totalVotes = 0;

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

        //SYNOPSIS, AUTHOR, URL, VOLUMES, GENRES, RATINGS
        const SYNOPSIS = synopsis;
        const SYNOPSIS2 = synopsis2;
        const AUTHOR = manga.authors[0].name ?? AUTHOR_NOT_FOUND;
        const URL = manga.url ?? URL_NOT_FOUND;
        const VOLUMES = manga.volumes?.toLocaleString() ?? VOLUMES_NOT_FOUND;
        const GENRES = genres;
        const RATINGS = ratings;

        const mangaEmbed = createEmbed(
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
        )

        embedMessage = await message.channel.send({ embeds: [mangaEmbed] })
        embedMessage.react(leftArrow);
        embedMessage.react(rightArrow);

        async function handleReaction(reaction, user) {
            if (user.bot) return;

            if (reaction.emoji.name === leftArrow) {
                embedMessage.edit({embeds: [mangaEmbed]}).catch(console.error);
            } else {
                const updatedEmbed = await getMInfo(message, mangaID);
                embedMessage.edit({ embeds: [updatedEmbed] }).catch(console.error);
            }

            reaction.users.remove(user);
        };

        discordClient.removeAllListeners('messageReactionAdd');
        discordClient.on('messageReactionAdd', async (reaction, user) => {
            await handleReaction(reaction, user);
        });
    } catch (error) {
        console.error('Error in finding Manga:', error.message);
    }
}

module.exports = {
    name: 'm',
    description: '!m [manga_name] Returns manga information.',
    /**
     * Execute the !m command.
     *
     * @param {Message} message - The Discord message object.
     * @param {Array<string>} args - Arguments provided with the command.
     * @param {string} searchName - The name of the manga being searched.
     */
    async execute(message, args, searchName) {
        const passedMangaName = searchName

        try {
            const mangaID = await getID(message, MANGA_MODE, passedMangaName);
            getMangaInfo(message, mangaID);
        } catch (error) {
            console.error('Error:', error.message);
            message.channel.send('An error occurred: ' + error.message);
        }
    }
}
