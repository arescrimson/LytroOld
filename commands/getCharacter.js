// getCharacter.js
const axios = require('axios');
const JIKAN_API_BASE_URL = 'https://api.jikan.moe/v4';

async function getCharacter(passedMangaName) {

    const mangaName = passedMangaName

    try {
        //Gets raw manga data from JIKAN API using passed manga name. 
        const mangaData = await axios.get(`${JIKAN_API_BASE_URL}/manga?q=${mangaName}`)
        //JSON stringifies the raw manga data. 
        const jsonData = JSON.stringify(mangaData.data);
        //parses the JSON. 
        const parsedData = JSON.parse(jsonData);
        //dataURL returns FIRST INDEX OBJECT of parsed JSON. 
        const parsedDataID = parsedData.data[0].mal_id; 

        console.log(parsedDataID);

        //return characterURL;
    } catch (error) {
        console.error('Error fetching character data:', error);
        message.channel.send('An error occurred while fetching character data.');
    }
}


module.exports = {
    name: 'character',
    description: 'Get Character',
    async execute(message, args) {
        const passedMangaName = args.join(' ');

        try {
            const url = await getCharacter(passedMangaName);
            message.channel.send(`Manga URL: ${url}`);
        } catch (error) {
            console.error('Error:', error.message);
            message.channel.send('An error occurred: ' + error.message);
        }
    }
}
