// getInfo.js

//IMPORTS

const { EmbedBuilder } = require('discord.js');
//IMPORT GETID 
const { getAnimeIDFromString } = require('../utils/getAnimeIDFromString')
//JIKAN API LIBRARY 
const Jikan = require('jikan4.js')
//JIKANJS WRAPPER LIBRARY
const client = new Jikan.Client();

const maxLength = 1020

// Default ERROR MESSAGES
const BACKGROUND_NOT_FOUND = 'Background not found.';
const YEAR_NOT_FOUND = 'Year not found.';
const TRAILER_NOT_FOUND = 'Trailer not found.';
const STUDIO_NOT_FOUND = 'Studios not found.';
const RECOMMENDATIONS_NOT_FOUND = 'Recommendations not found.';

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

        //INITIALIZES SPLIT FOR background THAT ARE OVER 1020 CHARACTERS 
        let split = false;
        let background = '';
        let background2 = '';

        //SPLITS background IF TOO LONG INTO 2-3 PARAGRAPHS. 
        if (anime.background !== null) {
            if (anime.background.length > maxLength) {
                console.log('yes');
                const midPoint = anime.background.length / 2;
                const backgroundFirstPart = anime.background.substring(0, midPoint);
                const backgroundSecondPart = anime.background.substring(midPoint);
                background = backgroundFirstPart;
                background2 = backgroundSecondPart;
                console.log(background.length);
                console.log(background2.length);
                split = true;
            }
            //else, simply assign background to the anime background. 
            else {
                background = anime.background;
            }
        } else {
            background = BACKGROUND_NOT_FOUND;
        }

        //TEMPORARY WAY OF DISPLAYING RECOMMENDATION TITLES

        let recList = [];
        let recListString = '';

        if (rec.length > 2) {
            recList.push(rec[0].entry.title);
            recList.push(rec[1].entry.title);

            recListString = recList.map(item => item).join(', ');
        } else {
            recList = RECOMMENDATIONS_NOT_FOUND;
            recListString = RECOMMENDATIONS_NOT_FOUND;
        }

        //BACKGROUND, YEAR, TRAILER, STUDIO, RECOMMENDATIONS
        const BACKGROUND = background
        const YEAR = (anime.year !== null) ? anime.year : YEAR_NOT_FOUND;
        const TRAILER = (anime.trailer?.embedUrl.href !== null) ? anime.trailer.embedUrl.href : TRAILER_NOT_FOUND;
        const STUDIO = (anime.studios[0].name !== null) ? anime.studios[0].name : STUDIO_NOT_FOUND;
        const RECOMMENDATIONS = recListString

        //if background has been split, use the split background' as embed does not support more than 1024 characters per value. 
        if (split) {
            const exampleEmbed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle(`${anime.title.default}`)
                .setURL(`${anime.url}`)
                .setAuthor({ name: `Currently Searching: ${anime.title.default}` })
                .setThumbnail('https://github.com/arescrimson/Lytro/blob/master/img/profile.jpg?raw=true')
                .addFields(
                    { name: '\n\u200b', value: '\n\u200b' },
                    { name: 'Background: \n\u200b', value: `${BACKGROUND}` },
                    { name: '\n', value: `${background2}` },
                    { name: 'Year:', value: `${YEAR}`, inline: true },
                    { name: 'Studio:', value: `${STUDIO}`, inline: true },
                )
                .addFields({ name: 'Recommendations:', value: `${RECOMMENDATIONS}`, inline: true })
                .setImage(`${anime.image.webp.default}`)
                .setTimestamp()
                .setFooter({ text: 'Information from Lytro' });

            message.channel.send({ embeds: [exampleEmbed] });
        }
        // if not split, simply just use the regular background that was assigned to the anime background. 
        else {
            const exampleEmbed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle(`${anime.title.default}`)
                .setURL(`${anime.url}`)
                .setAuthor({ name: `Currently Searching: ${anime.title.default}` })
                .setThumbnail('https://github.com/arescrimson/Lytro/blob/master/img/profile.jpg?raw=true')
                .addFields(
                    { name: '\n\u200b', value: '\n\u200b' },
                    { name: 'Background: \n\u200b', value: `${BACKGROUND}` },
                    { name: 'Year:', value: `${YEAR}`, inline: true },
                    { name: 'Studio:', value: `${STUDIO}`, inline: true },
                )
                .addFields({ name: 'Recommendations:', value: `${RECOMMENDATIONS}`, inline: true })
                .setImage(`${anime.image.webp.default}`)
                .setTimestamp()
                .setFooter({ text: 'Information from Lytro' });

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
    async execute(message, args, currentSearchName) {

        const passedAnimeName = currentSearchName;

        try {
            const animeID = await getAnimeIDFromString(message, passedAnimeName);
            getInfo(message, animeID);
        } catch (error) {
            console.error('Error in info:', error.message);
            message.channel.send('An error occurred in getInfo: ' + error.message);
        }
    }
}