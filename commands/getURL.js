// getURL.js
const axios = require('axios');
const JIKAN_API_BASE_URL = 'https://api.jikan.moe/v4';

async function getURL(passedMangaName) {

    const mangaName = passedMangaName

    try {
        //Gets raw manga data from JIKAN API using passed manga name. 
        const mangaData = await axios.get(`${JIKAN_API_BASE_URL}/manga?q=${mangaName}`)
        //JSON stringifies the raw manga data. 
        const jsonData = JSON.stringify(mangaData.data);
        //parses the JSON. 
        const parsedData = JSON.parse(jsonData);
        //dataURL returns FIRST INDEX OBJECT of parsed JSON. 
        const dataURL = parsedData.data[0].url; 

        return dataURL;
    } catch (error) {
        console.error('Error fetching manga data:', error);
        message.channel.send('An error occurred while fetching manga data.');
    }
}


module.exports = {
    name: 'url',
    description: 'Get URL',
    async execute(message, args) {
        const passedMangaName = args.join(' ');

        try {
            const url = await getURL(passedMangaName);
            message.channel.send(`Manga URL: ${url}`);
        } catch (error) {
            console.error('Error:', error.message);
            message.channel.send('An error occurred: ' + error.message);
        }
    }
}
