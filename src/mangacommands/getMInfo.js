// getMInfo.js

//IMPORTS

//EMBEDBUILDER 
const { EmbedBuilder } = require('discord.js');

//GETID 
const { getMangaIDFromString } = require('../utils/getMangaIDFromString')

//LYTRO FOOTER ICON, MAX VALUE LENGTH FOR EMBEDS
const { client, THUMBNAIL, ICON_URL, MAX_VALUE_LENGTH, MANGA_MODE, YEAR_NOT_FOUND, POPULARITY_NOT_FOUND } = require('../../config')

//ERROR MESSAGES
const { BACKGROUND_NOT_FOUND, RANK_NOT_FOUND, SERIAL_NOT_FOUND, AUTHOR_NOT_FOUND} = require('../../config')

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
            { name: 'Publish Date:', value: `${DATE}`, inline: true},
            { name: 'Manga Serialization:', value: `${SERIAL}`, inline: true },
            { name: 'Manga Rank:', value: `#${POPULARITY}`, inline: true }
        )
        .setImage(`${IMAGE}`)
        .setTimestamp()
        .setFooter({ text: 'Information from Lytro', iconURL: ICON_URL });

    return createdEmbed;
}

/**
 * Gets additional information from the mangaID passed. 
 * 
 * @param {*} message is the discord message. 
 * @param {*} mangaID is the mangaID passed. 
 */
async function getInfo(message, mangaID) {
    try {

        //GETS MANGA INFORMATION
        const manga = await client.manga.get(mangaID);

        //INITIALIZES SPLIT FOR BACKGROUNDS THAT ARE OVER 1020 CHARACTERS 
        let background = '';
        let background2 = '\n';

        //SPLITS BACKGROUND IF TOO LONG INTO 2 PARAGRAPHS.  
        if (manga.background !== null) {
            if (manga.background.length > MAX_VALUE_LENGTH) {
                const midPoint = manga.background.length / 2;
                const backgroundFirstPart = manga.background.substring(0, midPoint);
                const backgroundSecondPart = manga.background.substring(midPoint);
                background = backgroundFirstPart;
                background2 = backgroundSecondPart;
            }
            //else, simply assign background to the manga background. 
            else {
                background = manga.background;
            }
        }
        //if background is null, error message. 
        else {
            background = BACKGROUND_NOT_FOUND;
        }

        //BACKGROUND, YEAR, TRAILER, STUDIO, RECOMMENDATIONS
        const BACKGROUND = background;
        const BACKGROUND2 = background2;
        const AUTHOR = (manga.authors[0].name !== null) ? manga.authors[0].name : AUTHOR_NOT_FOUND; 
        const DATE = (manga.publishInfo.publishedFrom.getFullYear() !== null) ? manga.publishInfo.publishedFrom.getFullYear() : YEAR_NOT_FOUND;
        const SERIAL = (manga.serializations[0].name !== null) ? manga.serializations[0].name : SERIAL_NOT_FOUND; 
        const POPULARITY = (manga.popularity.toLocaleString() !== null) ? manga.popularity.toLocaleString() : POPULARITY_NOT_FOUND;
        
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
        )
            
        message.channel.send({ embeds: [exampleEmbed] });

    } catch (error) {
        console.error('Error in getMInfo:', error.message);
        message.channel.send(`Couldn't find additional info :(`)
    }
}

module.exports = {
    name: 'minfo',
    description: '!minfo [manga_name] Returns additional manga information.',
    async execute(message, args, searchmanga) {

        const mangaName = searchmanga;

        try {
            const mangaID = await getMangaIDFromString(message, mangaName);
            getInfo(message, mangaID);
        } catch (error) {
            console.error('Error in info:', error.message);
            message.channel.send('An error occurred in getInfo: ' + error.message);
        }
    }
}