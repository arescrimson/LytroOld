/**
 * @file getAnime.js
 * @description Retrieve information from an anime. 
 * @license MIT
 * @author Ares
 */

const { EmbedBuilder } = require('discord.js');

const { getID } = require('../utils/getIDUtil');

const { getInfo } = require('../animecommands/getInfo');

const {
    JIKAN_CLIENT,
    DISCORD_CLIENT,
    THUMBNAIL,
    ICON_URL,
    MAX_VALUE_LENGTH,
    ANIME_MODE,
    BUTTON_ROW
} = require('../../config');

// ERROR MESSAGES
const {
    SYNOPSIS_NOT_FOUND,
    URL_NOT_FOUND,
    EPISODES_NOT_FOUND,
    GENRES_NOT_FOUND,
    RATINGS_NOT_FOUND,
} = require('../../config');

/**
 * Creates an embedded message for displaying information about an anime.
 *
 * @param {string} TITLE - The title of the anime.
 * @param {string} URL - The URL associated with the anime.
 * @param {string} THUMBNAIL - The URL of the anime's thumbnail image.
 * @param {string} SYNOPSIS - The synopsis of the anime.
 * @param {string} SYNOPSIS2 - Additional synopsis if the first is too long.
 * @param {string} EPISODES - The number of episodes in the anime.
 * @param {string} GENRES - The genres associated with the anime.
 * @param {string} RATINGS - The ratings and scores of the anime.
 * @param {string} image - The URL of the anime's image.
 * @returns {EmbedBuilder} - An EmbedBuilder object for anime information.
 */

//Collects all related information based on User's message
function createEmbed(TITLE, URL, THUMBNAIL, SYNOPSIS, SYNOPSIS2, EPISODES, GENRES, RATINGS, image) {

    const createdEmbed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle(`${TITLE}`)
        .setURL(`${URL}`)
        .setAuthor({ name: `Currently Searching ${ANIME_MODE} : ${TITLE}`, iconURL: ICON_URL })
        .setThumbnail(THUMBNAIL)
        .addFields(
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
 * Gets Anime Information from the animeID passed. 
 * 
 * @param {Message} message is the discord message. 
 * @param {number} animeID is the animeID passed. 
 */
async function getAnimeInfo(message, animeID) {
    try {

        let embedMessage = null;

        //GETS ANIME INFORMATION
        const anime = await JIKAN_CLIENT.anime.get(animeID);
        const stats = await JIKAN_CLIENT.anime.getStatistics(animeID);
        let genres = anime.genres.map(genre => genre.name).join(', ');

        if (!genres || genres.trim() === '') {
            genres = GENRES_NOT_FOUND;
        }

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
                synopsis = anime.synopsis;
            }
        } else {
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

        //SYNOPSIS, URL, EPISODES, GENRES, RATINGS
        const SYNOPSIS = synopsis;
        const SYNOPSIS2 = synopsis2;
        const URL = anime.url ?? URL_NOT_FOUND;
        const EPISODES = anime.episodes?.toLocaleString() ?? EPISODES_NOT_FOUND;
        const GENRES = genres;
        const RATINGS = ratings;

        const animeEmbed = createEmbed(
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

        embedMessage = await message.channel.send({ embeds: [animeEmbed], components: [BUTTON_ROW] })

        async function handleButton(interaction) {
            if (interaction.user.bot) return;

            if (interaction.customId === 'left') {
                embedMessage.edit({embeds: [animeEmbed]}).catch(console.error);
            } else {
                const updatedEmbed = await getInfo(message, animeID);
                embedMessage.edit({embeds: [updatedEmbed]}).catch(console.error);
            }
            
            interaction.deferUpdate();
        };

        DISCORD_CLIENT.removeAllListeners('interactionCreate');

        DISCORD_CLIENT.on('interactionCreate', async (interaction) => {
            if (!interaction.isButton()) return;
            await handleButton(interaction);
        });
    } catch (error) {
        message.channel.send('Error with searching Anime.');
        console.error('Error:', error.message);
    }
}

module.exports = {
    name: 'a',
    description: '!a [anime_name] Returns anime information.',
    /**
     * Executes the `a` command to retrieve information about an anime. 
     *
     * @param {Message} message - The Discord message object representing the user's command.
     * @param {Array} args - An array of arguments passed with the command, typically containing the anime name.
     * @param {string} searchAnime - The anime name specified for the search.
     */
    async execute(message, args, animeName) {
        try {
            const animeID = await getID(message, ANIME_MODE, animeName);
            getAnimeInfo(message, animeID);
        } catch (error) {
            console.error('Error:', error.message);
            message.channel.send('Error: please make sure you have specified an anime.');
        }
    }
}
