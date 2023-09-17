// getImages.js

//IMPORTS

//IMPORT GETID 
const {getMangaIDFromString} = require('../utils/getMangaIDFromString')
//JIKAN API LIBRARY 
const Jikan = require('jikan4.js')
//JIKANJS WRAPPER LIBRARY
const client = new Jikan.Client();

/**
 * Gets manga Images from the mangaID passed, and sends a Random Image 
 * from the manga Pictures Gallery. 
 * 
 * @param {*} message is the discord message. 
 * @param {*} mangaID is the mangaID passed. 
 */
async function getMangaImages(message, mangaID) {

    try {
        const ch = await client.manga.getPictures(mangaID);

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
    name: 'mimg',
    description: '!img [manga_name] Returns a single image from manga gallery.',
    async execute(message, args) {

        //Gets passed manga name. 
        const passedMangaName = args.join(' ');

        try {
            //Gets manga ID from ID get function. 
            const mangaID = await getMangaIDFromString(message, passedMangaName);
            //Gets manga information Info get function. 
            getMangaImages(message, mangaID)
        } catch (error) {
            console.error('Error:', error.message);
            message.channel.send('An error occurred: ' + error.message);
        }
    }
}
