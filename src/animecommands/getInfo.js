// getInfo.js

//IMPORTS

//EMBEDBUILDER 
const { EmbedBuilder } = require('discord.js');

//GETID 
const { getAnimeIDFromString } = require('../utils/getAnimeIDFromString')

//JIKAN API LIBRARY 
const Jikan = require('jikan4.js')

//JIKANJS WRAPPER LIBRARY
const client = new Jikan.Client();

//LYTRO FOOTER ICON, MAX VALUE LENGTH FOR EMBEDS
const { THUMBNAIL, ICON_URL, MAX_VALUE_LENGTH } = require('../../config')

//ERROR MESSAGES
const { BACKGROUND_NOT_FOUND, YEAR_NOT_FOUND, TRAILER_NOT_FOUND, STUDIO_NOT_FOUND, RECOMMENDATIONS_NOT_FOUND} = require('../../config')

/**
 * Gets additional information from the animeID passed. 
 * 
 * @param {*} message is the discord message. 
 * @param {*} animeID is the animeID passed. 
 */
async function getInfo(message, animeID) {
    try {

        //GETS ANIME INFORMATION
        const anime = await client.anime.get(animeID);
        const rec = await client.anime.getRecommendations(animeID);

        //INITIALIZES SPLIT FOR BACKGROUNDS THAT ARE OVER 1020 CHARACTERS 
        let split = false;
        let background = '';
        let background2 = '';

        //SPLITS BACKGROUND IF TOO LONG INTO 2 PARAGRAPHS.  
        if (anime.background !== null) {
            if (anime.background.length > MAX_VALUE_LENGTH) {
                const midPoint = anime.background.length / 2;
                const backgroundFirstPart = anime.background.substring(0, midPoint);
                const backgroundSecondPart = anime.background.substring(midPoint);
                background = backgroundFirstPart;
                background2 = backgroundSecondPart;
                split = true;
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
        const BACKGROUND = background
        const YEAR = (anime.year !== null) ? anime.year : YEAR_NOT_FOUND;
        const TRAILER = (anime.trailer?.embedUrl.href !== null) ? anime.trailer.embedUrl.href : TRAILER_NOT_FOUND;
        const STUDIO = (anime.studios[0].name !== null) ? anime.studios[0].name : STUDIO_NOT_FOUND;
        const RECOMMENDATIONS = recListString

        //if background has been split, use the split background as embed does not support more than 1024 characters per value. 
        if (split) {
            const exampleEmbed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle(`${anime.title.default}`)
                .setURL(`${anime.url}`)
                .setAuthor({ name: `Currently Searching: ${anime.title.default}` })
                .setThumbnail(THUMBNAIL)
                .addFields(
                    { name: '\n\u200b', value: '\n\u200b' },
                    { name: 'Background: \n\u200b', value: `${BACKGROUND}` },
                    { name: '\n', value: `${background2}` },
                    { name: 'Year:', value: `${YEAR}`, inline: true },
                    { name: 'Studio:', value: `${STUDIO}`, inline: true },
                )
                .addFields({ name: 'Related:', value: `${RECOMMENDATIONS}`, inline: true })
                .setImage(`${anime.image.webp.default}`)
                .setTimestamp()
                .setFooter({ text: 'Information from Lytro', iconURL: ICON_URL});

            message.channel.send({ embeds: [exampleEmbed] });
        }
        // if not split, simply just use the regular background that was assigned to the anime background. 
        else {
            const exampleEmbed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle(`${anime.title.default}`)
                .setURL(`${anime.url}`)
                .setAuthor({ name: `Currently Searching: ${anime.title.default}` })
                .setThumbnail(THUMBNAIL)
                .addFields(
                    { name: '\n\u200b', value: '\n\u200b' },
                    { name: 'Background: \n\u200b', value: `${BACKGROUND}` },
                    { name: 'Year:', value: `${YEAR}`, inline: true },
                    { name: 'Studio:', value: `${STUDIO}`, inline: true },
                )
                .addFields({ name: 'Related:', value: `${RECOMMENDATIONS}`, inline: true })
                .setImage(`${anime.image.webp.default}`)
                .setTimestamp()
                .setFooter({ text: 'Information from Lytro', iconURL: ICON_URL });

            message.channel.send({ embeds: [exampleEmbed] });
        }
    } catch (error) {
        console.error('Error in getInfo:', error.message);
        message.channel.send(`Couldn't find additional info :(`)
    }
}

module.exports = {
    name: 'info',
    description: '!info [anime_name] Returns additional anime information.',
    async execute(message, args, searchAnime) {

        const animeName = searchAnime;

        try {
            const animeID = await getAnimeIDFromString(message, animeName);
            getInfo(message, animeID);
        } catch (error) {
            console.error('Error in info:', error.message);
            message.channel.send('An error occurred in getInfo: ' + error.message);
        }
    }
}