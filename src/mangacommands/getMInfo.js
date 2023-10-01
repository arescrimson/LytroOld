/**
 * @file getMInfo.js
 * @description Retrieve additional information about a manga.
 * @license MIT
 * @author Ares
 */

// IMPORTS

// EMBEDBUILDER
const { EmbedBuilder } = require('discord.js');

// GETMANGAID
const { getMangaID } = require('../utils/mangaIDUtil');

// LYTRO FOOTER ICON, MAX VALUE LENGTH FOR EMBEDS
const {
    jikanClient,
    THUMBNAIL,
    ICON_URL,
    MAX_VALUE_LENGTH,
    MANGA_MODE,
    YEAR_NOT_FOUND,
    POPULARITY_NOT_FOUND,
} = require('../../config');

// ERROR MESSAGES
const {
    BACKGROUND_NOT_FOUND,
    SERIAL_NOT_FOUND,
    AUTHOR_NOT_FOUND,
} = require('../../config');

/**
 * Create an embed message with manga information.
 *
 * @param {string} TITLE - The title of the manga.
 * @param {string} URL - The URL of the manga.
 * @param {string} THUMBNAIL - The thumbnail image URL.
 * @param {string} AUTHOR - The author of the manga.
 * @param {string} BACKGROUND - The background information (first part).
 * @param {string} BACKGROUND2 - The background information (second part).
 * @param {string|number} DATE - The publish date (or "Not found" if null).
 * @param {string} SERIAL - The manga serialization (or "Not found" if null).
 * @param {string} POPULARITY - The manga popularity rank (or "Not found" if null).
 * @param {string} IMAGE - The image URL.
 * @returns {MessageEmbed} The created embed message.
 */
function createEmbed(TITLE, URL, THUMBNAIL, AUTHOR, BACKGROUND, BACKGROUND2, DATE, SERIAL, POPULARITY, IMAGE) {
    const createdEmbed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle(`${TITLE}`)
        .setURL(`${URL}`)
        .setAuthor({ name: `Currently Searching ${MANGA_MODE} : ${TITLE}`, iconURL: ICON_URL })
        .setThumbnail(THUMBNAIL)
        .addFields(
            { name: 'Author: \n\u200b', value: `**${AUTHOR}** \n\u200b` },
            { name: 'Background: \n\u200b', value: `${BACKGROUND}` },
            { name: '\n', value: `${BACKGROUND2}\n\u200b` },
            { name: 'Publish Date:', value: `${DATE}`, inline: true },
            { name: 'Manga Serialization:', value: `${SERIAL}`, inline: true },
            { name: 'Manga Rank:', value: `#${POPULARITY}`, inline: true }
        )
        .setImage(`${IMAGE}`)
        .setTimestamp()
        .setFooter({ text: 'Information from Lytro', iconURL: ICON_URL });

    return createdEmbed;
}

/**
 * Get additional information about a manga and send it as an embed message.
 *
 * @param {Message} message - The Discord message object.
 * @param {number} mangaID - The manga ID to fetch information for.
 */
async function getInfo(message, mangaID) {
    try {
        // GET MANGA INFORMATION
        const manga = await jikanClient.manga.get(mangaID);

        // INITIALIZE SPLIT FOR BACKGROUNDS THAT ARE OVER 1020 CHARACTERS
        let background = '';
        let background2 = '\n';

        // SPLIT BACKGROUND IF TOO LONG INTO 2 PARAGRAPHS
        if (manga.background !== null) {
            if (manga.background.length > MAX_VALUE_LENGTH) {
                const midPoint = manga.background.lastIndexOf('.', MAX_VALUE_LENGTH);
                if (midPoint !== -1) {
                    const backgroundFirstPart = manga.background.substring(0, midPoint + 1);
                    const backgroundSecondPart = manga.background.substring(midPoint + 1);
                    background = backgroundFirstPart;
                    background2 = backgroundSecondPart;
                }
            }
            // ELSE, SIMPLY ASSIGN BACKGROUND TO THE MANGA BACKGROUND
            else {
                background = manga.background;
            }
        }
        // IF BACKGROUND IS NULL, ERROR MESSAGE
        else {
            background = BACKGROUND_NOT_FOUND;
        }

        // BACKGROUND, YEAR, TRAILER, STUDIO, RECOMMENDATIONS
        const BACKGROUND = background;
        const BACKGROUND2 = background2;
        const AUTHOR = manga.authors[0]?.name || AUTHOR_NOT_FOUND;
        const DATE = manga.publishInfo.publishedFrom?.getFullYear() || YEAR_NOT_FOUND;
        const SERIAL = manga.serializations[0]?.name || SERIAL_NOT_FOUND;
        const POPULARITY = manga.popularity?.toLocaleString() || POPULARITY_NOT_FOUND;

        const exampleEmbed = createEmbed(
            manga.title.default,
            manga.url,
            THUMBNAIL,
            AUTHOR,
            BACKGROUND,
            BACKGROUND2,
            DATE,
            SERIAL,
            POPULARITY,
            manga.image.webp.default
        );

        message.channel.send({ embeds: [exampleEmbed] });
    } catch (error) {
        console.error('Error in getInfo:', error.message);
        message.channel.send(`Couldn't find additional info :(`);
    }
}

module.exports = {
    name: 'minfo',
    description: '!minfo [manga_name] Returns additional manga information.',
    /**
     * Execute the !minfo command.
     *
     * @param {Message} message - The Discord message object.
     * @param {string[]} args - The command arguments.
     * @param {string} searchmanga - The searched manga name.
     */
    async execute(message, args, searchmanga) {
        const mangaName = searchmanga;

        try {
            const mangaID = await getMangaID(message, mangaName);
            getInfo(message, mangaID);
        } catch (error) {
            console.error('Error in info:', error.message);
            message.channel.send('An error occurred in getInfo: ' + error.message);
        }
    },
};
