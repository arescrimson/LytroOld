// getRandom.js

//IMPORTS

//JIKAN API LIBRARY 
const Jikan = require('jikan4.js')
//JIKANJS WRAPPER LIBRARY
const client = new Jikan.Client();

async function getRandomAnime(message) {

    try {
        const random = await client.anime.random(true);
        const animeID = random.id;
        
        //GETS ANIME INFORMATION
        const anime = await client.anime.get(animeID);
        const stats = await client.anime.getStatistics(animeID);      

        //GENRES AS A STRING LIST WITH COMMAS 
        let genreText = "";

        for (let i = 0; i < anime.genres.length; i++) {
            genreText += anime.genres[i].name;

            if (i < anime.genres.length - 1) {
                genreText += ", "; // Adds a comma and space between genres
            }
        }

        //RATINGS AS AN AVERAGED SCORE STRING 
        let totalScore = 0; 
        let totalVotes = 0; 

        for (const obj of stats.scores) {
            totalScore += obj.score * obj.votes;
            totalVotes += obj.votes;
        }

        const averageScore = totalScore / totalVotes; 

        //SYNOPSIS, URL, EPISODES, RATINGS
        const SYNOPSIS = anime.synopsis; 
        const URL = anime.url; 
        const EPISODES = anime.episodes;
        const GENRES = anime.genres.map(genre => genre.name).join(', ');
        const RATINGS = `Average score based off ${totalVotes.toLocaleString()} votes: ${averageScore.toFixed(2) + ' / 10'}`;

        //FORMATTED SENT MESSAGE 
        message.channel.send(`**Synopsis:**\n\n ${SYNOPSIS}\n\n **Episodes:**\n\n ${EPISODES}\n\n **Ratings**\n\n ${RATINGS}\n\n **Genres:**
        \n${GENRES}\n\n **MyAnimeList URL:** \n\n ${URL}`)       
    } catch (error) {
        console.error('Error:', error.message);
    }
}

module.exports = {
    name: 'rand',
    description: 'Gets Random Anime info.',
    async execute(message, args) {

        try {
            //Gets anime information Info get function. 
            await getRandomAnime(message)
        } catch (error) {
            console.error('Error:', error.message);
            message.channel.send('An error occurred: ' + error.message);
        }
    }
}