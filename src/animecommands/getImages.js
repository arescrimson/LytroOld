/**
 * @file getImages.js
 * @description Retrieve images from an anime. 
 * @license MIT
 * @author Ares
 */

//IMPORTS

const { EmbedBuilder } = require('discord.js')

const { getAnimeID } = require('../utils/getAnimeID')

const { jikanClient , ICON_URL, ANIME_MODE} = require('../../config')

const searchedSet = new Set();

/**
 * Gets anime images from the animeID passed, and sends a random image 
 * from the anime picture gallery.  
 * 
 * @param {Message} message is the discord message. 
 * @param {number} animeID is the animeID passed. 
 */
async function getAnimeImages(message, animeID) {

    try {

        let randomImageIndex;     

        const anime = await jikanClient.anime.get(animeID);
        const pictures = await jikanClient.anime.getPictures(animeID);

        //randomly search index of picture gallery 
        do {
            randomImageIndex = Math.floor(Math.random() * pictures.length);
        }
        //If set contains an index it's already searched, runs random search again. 
        while (searchedSet.has(randomImageIndex));

        //If searched images Set exceeds the length of picture gallery array, clear values from Set. 
        if (searchedSet.size >= pictures.length) {
            searchedSet.clear();
        }
        //Else, add index to searched index Set. 
        else {
            searchedSet.add(randomImageIndex);
        }

        const pictureLink = pictures[randomImageIndex].webp.default.href;

        const embedMessage = new EmbedBuilder()
            .setColor(0x0099FF)
            .setAuthor({ name: `Currently Searching ${ANIME_MODE} : ${anime.title.default}` })
            .setTimestamp()
            .setFooter({ text: 'Information from Lytro', iconURL: ICON_URL });

        message.channel.send({
            embeds: [embedMessage]
        })

        message.channel.send({
            files: [{
                attachment: pictureLink
            }],
        });

    } catch (error) {
        message.channel.send('Error in searching image.')
        console.error('Error:', error.message);
    }
}

module.exports = {
    name: 'img',
    description: '!img [anime_name] Returns a single image from anime gallery.',
    /**
     * Executes the `img` command to retrieve and display a random image from an anime's picture gallery.
     *
     * @param {Message} message - The Discord message object representing the user's command.
     * @param {Array} args - An array of arguments passed with the command, typically containing the anime name.
     * @param {string} searchAnime - The anime name specified for the search.
     */
    async execute(message, args, searchAnime) {

        const animeName = searchAnime;

        try {
            const animeID = await getAnimeID(message, animeName);
            getAnimeImages(message, animeID)
        } catch (error) {
            console.error('Error:', error.message);
            message.channel.send('Error: please make sure you have specified an anime.');
        }
    }
}
