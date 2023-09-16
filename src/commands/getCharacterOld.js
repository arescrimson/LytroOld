// getCharacterOld.js 

//GETS API DATA VIA RAW JSON INSTEAD OF WRAPPER 
//THIS IS NOT BEING USED. 

//IMPORTS 

//AXIOS HTTPS GET LIBRARY 
const axios = require('axios');

//JIKAN URL 
const JIKAN_API_BASE_URL = 'https://api.jikan.moe/v4';

async function getCharacter(mangaName, characterName) {

    const manga = mangaName;
    const ch = characterName;

    try {
        //Gets raw manga data from JIKAN API using passed manga name. 
        const mangaData = await axios.get(`${JIKAN_API_BASE_URL}/manga?q=${manga}`);
        //JSON stringifies the raw manga data. 
        const jsonData = JSON.stringify(mangaData.data);
        //parses the JSON. 
        const parsedData = JSON.parse(jsonData);
        //dataURL returns FIRST INDEX OBJECT of parsed JSON. 
        const parsedDataID = parsedData.data[0].mal_id; 

        //Does another search with the ID of the searched manga. 
        const characterData = await axios.get(`${JIKAN_API_BASE_URL}/manga/${parsedDataID}/characters`)
        //JSON stringifies the raw manga data. 
        const characterJSON = JSON.stringify(characterData.data);
        //parses the JSON. 
        const characterParsedData = JSON.parse(characterJSON);
        //finds character name comparing 
        const foundCharacter = characterParsedData.data.find((character) => character.name === ch);

        console.log(foundCharacter);
        
        //return character;
    } catch (error) {
        console.error('Error fetching character data:', error);
        message.channel.send('An error occurred while fetching character data.');
    }
}


module.exports = {
    name: 'ch',
    description: 'Get Character',
    async execute(message, args) {
        const characterName = args.pop();
        const mangaName = args.join(' ');

        try {
            const url = await getCharacter(mangaName, characterName);
            //message.channel.send(`Manga URL: ${url}`);
        } catch (error) {
            console.error('Error:', error.message);
            message.channel.send('An error occurred: ' + error.message);
        }
    }
}
