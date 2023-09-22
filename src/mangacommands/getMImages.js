// getMImages.js

//IMPORTS

const { EmbedBuilder } = require('discord.js')

//IMPORT GETID 
const { getMangaIDFromString } = require('../utils/getMangaIDFromString')

//IMPORT CLIENT
const { client, ICON_URL } = require('../../config')

//Set of searched Set indexes. 
const searchedSet = new Set();

/**
 * Gets manga images from the mangaID passed, and sends a random image 
 * from the manga picture gallery.  
 * 
 * @param {*} message is the discord message. 
 * @param {*} mangaID is the mangaID passed. 
 */
async function getmangaImages(message, mangaID) {

    try {

        let randomImageIndex;

        const manga = await client.manga.get(mangaID);
        const pictures = await client.manga.getPictures(mangaID);

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
            .setAuthor({ name: `Currently Searching: ${manga.title.default}` })
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
        console.error('Error:', error.message);
    }
}

module.exports = {
    name: 'mimg',
    description: '!mimg [manga_name] Returns a single image from manga gallery.',
    async execute(message, args, searchManga) {

        const mangaName = searchManga;

        try {
            const mangaID = await getMangaIDFromString(message, mangaName);
            getmangaImages(message, mangaID)
        } catch (error) {
            console.error('Error:', error.message);
            message.channel.send('An error occurred: ' + error.message);
        }
    }
}
