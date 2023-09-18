// getImages.js

//IMPORTS

//IMPORT GETID 
const {getAnimeIDFromString} = require('../utils/getAnimeIDFromString')
//JIKAN API LIBRARY 
const Jikan = require('jikan4.js')
//JIKANJS WRAPPER LIBRARY
const client = new Jikan.Client();

/**
 * Gets anime images from the animeID passed, and sends a random image 
 * from the anime picture gallery.  
 * 
 * @param {*} message is the discord message. 
 * @param {*} animeID is the animeID passed. 
 */
async function getAnimeImages(message, animeID) {

    try {
        const pictures = await client.anime.getPictures(animeID);

        const randomImageIndex = Math.floor(Math.random() * pictures.length);

        const testlink = pictures[randomImageIndex].jpg.default.href

        message.channel.send({
            files: [{ 
                attachment: testlink
            }]
        })
    } catch (error) {
        console.error('Error:', error.message);
    }
}

module.exports = {
    name: 'img',
    description: '!img [anime_name] Returns a single image from anime gallery.',
    async execute(message, args, currentSearchName) {

        const passedAnimeName = currentSearchName;

        try {
            const animeID = await getAnimeIDFromString(message, passedAnimeName);
            getAnimeImages(message, animeID)
        } catch (error) {
            console.error('Error:', error.message);
            message.channel.send('An error occurred: ' + error.message);
        }
    }
}
