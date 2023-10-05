/**
 * @file getRandom.js
 * @description Retrieve information about a random anime. 
 * @license MIT
 * @author Ares
 */

//IMPORTS

const { EmbedBuilder } = require('discord.js');
 
const { getInfo } = require('../animecommands/getInfo');

const {
    jikanClient,
    discordClient,
    THUMBNAIL,
    MAX_VALUE_LENGTH,
    ICON_URL,
    ANIME_MODE,
    SYNOPSIS_NOT_FOUND,
    GENRES_NOT_FOUND,
    RATINGS_NOT_FOUND,
    EPISODES_NOT_FOUND,
    bannedList, 
    rightArrow,
    leftArrow
} = require('../../config');

/**
 * Creates an embed message for anime information.
 *
 * @param {string} TITLE - The title of the anime.
 * @param {string} URL - The URL of the anime.
 * @param {string} THUMBNAIL - The URL of the thumbnail image.
 * @param {string} SYNOPSIS - The main synopsis of the anime.
 * @param {string} SYNOPSIS2 - Additional synopsis text (optional).
 * @param {string} EPISODES - The number of episodes of the anime.
 * @param {string} GENRES - The genres of the anime.
 * @param {string} RATINGS - The ratings information of the anime.
 * @param {string} image - The URL of the anime's image.
 * @returns {MessageEmbed} - The created embed message.
 */
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
 * Gets Random Anime. Returns information identical to getAnime. 
 * 
 * @param {Message} message is the discord message. 
 */

async function getRandomAnime(message) {

    try {

        let random = ''; 
        let embedMessage = null; 
        let found = false; 

        do {
            random = await jikanClient.anime.random();

            if (random.genres) {

                const genres = random.genres.map(genre => genre.name).join(', ');
                const foundManga = !(bannedList.some(value => genres.includes(value)));

                if (foundManga) { 
                    found = true; 
                    break;
                } 
            } 
        } while (!found)

        const anime = random; 

        const stats = await jikanClient.anime.getStatistics(anime.id);
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

        embedMessage = await message.channel.send({ embeds: [animeEmbed] });
            
        embedMessage.react(leftArrow);
        embedMessage.react(rightArrow); 

        async function handleReaction(reaction, user) {
            if (user.bot) return;

            if (reaction.emoji.name === leftArrow) {
                embedMessage.edit({embeds: [animeEmbed]}).catch(console.error);
            } else {
                const updatedEmbed = await getInfo(message, anime.id);
                embedMessage.edit({ embeds: [updatedEmbed] }).catch(console.error);
            }

            reaction.users.remove(user);
        };

        discordClient.removeAllListeners('messageReactionAdd');
        discordClient.on('messageReactionAdd', async (reaction, user) => {
            await handleReaction(reaction, user);
        });

    } catch (error) {
        console.error('Error:', error.message);
        message.channel.send('An error occured: ' + error.message)
    }
}

module.exports = {
    name: 'rand',
    description: '!rand Returns information about a random anime.',
    /**
     * Execute the !rand command.
     *
     * @param {Message} message - The Discord message object.
     */
    async execute(message) {
        try {
            await getRandomAnime(message)
        } catch (error) {
            console.error('Error:', error.message);
            message.channel.send('An error occurred.');
        }
    }
}