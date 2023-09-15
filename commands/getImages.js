// getImages.js

//IMPORTS

//IMPORT GETID 
const {getAnimeIDFromString} = require('../utils/getAnimeIDFromString')
//JIKAN API LIBRARY 
const Jikan = require('jikan4.js')
//JIKANJS WRAPPER LIBRARY
const client = new Jikan.Client();

/**
 * Gets Anime Images from the animeID passed, and sends a Random Image 
 * from the Anime Pictures Gallery. 
 * 
 * @param {*} message is the discord message. 
 * @param {*} animeID is the animeID passed. 
 */
async function getAnimeImages(message, animeID) {

    try {
        const ch = await client.anime.getPictures(animeID);

        const randomImageIndex = Math.floor(Math.random() * ch.length);

        const testlink = ch[randomImageIndex].jpg.default.href

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
    description: 'Gets Anime Images.',
    async execute(message, args) {

        //Gets passed manga name. 
        const passedMangaName = args.join(' ');

        try {
            //Gets anime ID from ID get function. 
            const animeID = await getAnimeIDFromString(message, passedMangaName);
            //Gets anime information Info get function. 
            getAnimeImages(message, animeID)
        } catch (error) {
            console.error('Error:', error.message);
            message.channel.send('An error occurred: ' + error.message);
        }
    }
}
