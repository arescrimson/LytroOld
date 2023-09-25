/**
 * @file getInfo.js
 * @description Retrieve additional information about an anime. 
 * @license MIT
 * @author Ares
 */

//IMPORTS

const { EmbedBuilder } = require('discord.js');

const { getAnimeID } = require('../utils/getAnimeID')

const { jikanClient,
        THUMBNAIL,
        ICON_URL,
        MAX_VALUE_LENGTH,
        ANIME_MODE
} = require('../../config')


const { BACKGROUND_NOT_FOUND,
        YEAR_NOT_FOUND,
        TRAILER_NOT_FOUND,
        STUDIO_NOT_FOUND,
        RECOMMENDATIONS_NOT_FOUND
} = require('../../config')

/**
 * Creates an embed message for additional anime information.
 *
 * @param {string} TITLE - The title of the anime.
 * @param {string} URL - The URL of the anime.
 * @param {string} THUMBNAIL - The URL of the thumbnail image.
 * @param {string} BACKGROUND - The main background information about the anime.
 * @param {string} BACKGROUND2 - Additional background information (optional).
 * @param {string} YEAR - The release year of the anime.
 * @param {string} STUDIO - The studio that produced the anime.
 * @param {string} RELATED - Related anime recommendations.
 * @param {string} image - The URL of the anime's image.
 * @returns {MessageEmbed} - The created embed message.
 */
function createEmbed(TITLE, URL, THUMBNAIL, BACKGROUND, BACKGROUND2, YEAR, STUDIO, RELATED, IMAGE) {

    const createdEmbed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle(`${TITLE}`)
        .setURL(`${URL}`)
        .setAuthor({ name: `Currently Searching ${ANIME_MODE} : ${TITLE}`, iconURL: ICON_URL })
        .setThumbnail(THUMBNAIL)
        .addFields(
            { name: 'Background: \n\u200b', value: `${BACKGROUND}` },
            { name: '\n', value: `${BACKGROUND2}\n\u200b` },
            { name: 'Release Date:', value: `${YEAR}`, inline: true },
            { name: 'Studio:', value: `${STUDIO}`, inline: true },
            { name: 'Related:', value: `${RELATED}`, inline: true }
        )
        .setImage(`${IMAGE}`)
        .setTimestamp()
        .setFooter({ text: 'Information from Lytro', iconURL: ICON_URL });

    return createdEmbed;
}

/**
 * Gets additional information from the animeID passed. 
 * 
 * @param {Message} message is the discord message. 
 * @param {number} animeID is the animeID passed. 
 */
async function getInfo(message, animeID) {
    try {

        //GETS ANIME INFORMATION
        const anime = await jikanClient.anime.get(animeID);
        const rec = await jikanClient.anime.getRecommendations(animeID);

        //INITIALIZES SPLIT FOR BACKGROUNDS THAT ARE OVER 1020 CHARACTERS 
        let background = '';
        let background2 = '\n';

        //SPLITS BACKGROUND IF TOO LONG INTO 2 PARAGRAPHS.  
        if (anime.background !== null) {
            if (anime.background.length > MAX_VALUE_LENGTH) {
                const midPoint = anime.background.lastIndexOf('.', MAX_VALUE_LENGTH);
                if (midPoint !== -1) {
                    const backgroundFirstPart = anime.background.substring(0, midPoint + 1);
                    const backgroundSecondPart = anime.background.substring(midPoint + 1);
                    background = backgroundFirstPart;
                    background2 = backgroundSecondPart;
                }
            }
            //else, simply assign background to the anime background. 
            else {
                background = anime.background;
            }
        }
        //if background is null, error message. 
        else {
            background = BACKGROUND_NOT_FOUND;
        }

        //DISPLAY RECOMMENDED TITLES 
        let recList = [];
        let recListString = '';

        //If at least 2 indexes in recommendation array, add them to recList String. 
        if (rec.length > 2) {
            recList.push(rec[0].entry.title);
            recList.push(rec[1].entry.title);
            recListString = recList.map(item => item).join(', ');
        }
        //If no length on recList, i.e. null, recommendation string becomes not found error message.  
        else {
            recListString = RECOMMENDATIONS_NOT_FOUND;
        }

        //BACKGROUND, YEAR, TRAILER, STUDIO, RECOMMENDATIONS
        const BACKGROUND = background;
        const BACKGROUND2 = background2;
        const YEAR = anime.year ?? YEAR_NOT_FOUND;
        const TRAILER = (anime.trailer?.embedUrl.href !== null) ? anime.trailer.embedUrl.href : TRAILER_NOT_FOUND;
        const STUDIO = anime.studios[0]?.name ?? STUDIO_NOT_FOUND;
        const RECOMMENDATIONS = recListString

        const exampleEmbed = createEmbed(
            anime.title.default,
            anime.url,
            THUMBNAIL,
            BACKGROUND,
            BACKGROUND2,
            YEAR,
            STUDIO,
            RECOMMENDATIONS,
            anime.image.webp.default
        )

        message.channel.send({ embeds: [exampleEmbed] });

    } catch (error) {
        console.error('Error in getInfo:', error.message);
        message.channel.send(`Couldn't find additional info :(`)
    }
}

module.exports = {
    name: 'info',
    description: '!info [anime_name] Returns additional anime information.',
    /**
     * Executes the `info` command to retrieve and display additional information about an anime.
     * 
     * @param {Message} message - the Discord message being sent. 
     * @param {Array} args - An array of arguments passed with the command, typically containing the anime name.
     * @param {string} searchAnime - The anime name specified for the search.
     */    
    async execute(message, args, searchAnime) {

        const animeName = searchAnime;

        try {
            const animeID = await getAnimeID(message, animeName);
            getInfo(message, animeID);
        } catch (error) {
            console.error('Error in info:', error.message);
            message.channel.send('Error: please make sure you have specified an anime.');
        }
    }
}