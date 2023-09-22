// getImages.js

//IMPORTS

const { EmbedBuilder } = require('discord.js')

//IMPORT GETID 
const { getAnimeIDFromString } = require('../utils/getAnimeIDFromString')

//IMPORT CLIENT
const { client , ICON_URL} = require('../../config')

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

        const anime = await client.anime.get(animeID);
        const pictures = await client.anime.getPictures(animeID);

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

        const pictureLink = pictures[randomImageIndex].webp.default;

        const embedMessage = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle(`${anime.title.default}`)
                .setURL(`${anime.url}`)
                .setAuthor({ name: `Currently Searching: ${anime.title.default}` })
                .setImage(`${pictureLink}`)
                .setTimestamp()
                .setFooter({ text: 'Information from Lytro', iconURL: ICON_URL});

        message.channel.send({ embeds: [embedMessage] });

    } catch (error) {
        console.error('Error:', error.message);
    }
}

module.exports = {
    name: 'img',
    description: '!img [anime_name] Returns a single image from anime gallery.',
    async execute(message, args, searchAnime) {

        const animeName = searchAnime;

        try {
            const animeID = await getAnimeIDFromString(message, animeName);
            getAnimeImages(message, animeID)
        } catch (error) {
            console.error('Error:', error.message);
            message.channel.send('An error occurred: ' + error.message);
        }
    }
}
