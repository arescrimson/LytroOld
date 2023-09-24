// getImages.js

//IMPORTS

const { EmbedBuilder } = require('discord.js')

//IMPORT GETID 
const { getAnimeID } = require('../utils/getAnimeID')

//IMPORT CLIENT
const { jikanClient , ICON_URL, ANIME_MODE} = require('../../config')

//Set of searched Set indexes. 
const searchedSet = new Set();

/**
 * Gets anime images from the animeID passed, and sends a random image 
 * from the anime picture gallery.  
 * 
 * @param {*} message is the discord message. 
 * @param {*} animeID is the animeID passed. 
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
