// getImages.js

//IMPORTS

//IMPORT GETID 
const { getAnimeIDFromString } = require('../utils/getAnimeIDFromString')
//JIKAN API LIBRARY 
const Jikan = require('jikan4.js')
//JIKANJS WRAPPER LIBRARY
const client = new Jikan.Client();

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

        const pictures = await client.anime.getPictures(animeID);

        //randomly search index of picture gallery 
        do { 
            randomImageIndex = Math.floor(Math.random() * pictures.length);
        }
        //If set contains an index it's already searched, runs random search again. 
        while (searchedSet.has(randomImageIndex));

        //If searched images Set exceeds the length of picture gallery array, clear values from Set. 
        if ( searchedSet.size >= pictures.length) { 
            searchedSet.clear(); 
        } 
        //Else, add index to searched index Set. 
        else { 
            searchedSet.add(randomImageIndex);
        }

        const pictureLink = pictures[randomImageIndex].jpg.default.href;

        message.channel.send({
            files: [{
                attachment: pictureLink
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
