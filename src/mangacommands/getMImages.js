/**
 * @file getMImages.js
 * @description Retrieve images about a manga. 
 * @license MIT
 * @author Ares
 */

//IMPORTS

const { EmbedBuilder } = require('discord.js')

//IMPORT GETID 
const { getID } = require('../utils/getIDUtil')

//IMPORT CLIENT
const { jikanClient, ICON_URL, MANGA_MODE } = require('../../config')

//Set of searched Set indexes. 
const searchedSet = new Set();

/**
 * Gets manga images from the mangaID passed, and sends a random image 
 * from the manga picture gallery.  
 * 
 * @param {string} message is the discord message. 
 * @param {number} mangaID is the mangaID passed. 
 */
async function getMangaImages(message, mangaID) {

    try {

        let randomImageIndex;

        const manga = await jikanClient.manga.get(mangaID);
        const pictures = await jikanClient.manga.getPictures(mangaID);

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
            .setAuthor({ name: `Currently Searching ${MANGA_MODE} : ${manga.title.default}` })
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
        message.channel.send('Error in getting manga image.')
        console.error('Error:', error.message);
    }
}

module.exports = {
    name: 'mimg',
    description: '!mimg [manga_name] Returns a single image from manga gallery.',
    /**
     * Execute the !mimg command.
     *
     * @param {Message} message - The Discord message object.
     * @param {Array<string>} args - Arguments provided with the command.
     * @param {string} searchManga - The name of the manga being searched.
     */
    async execute(message, args, searchManga) {

        const mangaName = searchManga;

        try {
            const mangaID = await getID(message, MANGA_MODE, mangaName);
            getMangaImages(message, mangaID);
        } catch (error) {
            console.error('Error:', error.message);
            message.channel.send('An error occurred: ' + error.message);
        }
    }
}
