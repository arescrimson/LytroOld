// getRandom.js

//IMPORTS

//JIKAN API LIBRARY 
const Jikan = require('jikan4.js')
//JIKANJS WRAPPER LIBRARY
const client = new Jikan.Client();

/**
 * Gets Random Anime. Returns information identical to getAnime. 
 * 
 * @param {*} message is the discord message. 
 */
async function getRandomAnime(message) {

    try {
        //true parameter enables sfw check 
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

        //SYNOPSIS, URL, RANK, EPISODES, GENRES, RATINGS
        const SYNOPSIS = anime.synopsis; 
        const URL = anime.url; 
        const RANK = anime.rank;
        const EPISODES = anime.episodes;
        const GENRES = anime.genres.map(genre => genre.name).join(', ');
        const RATINGS = `Average score based off ${totalVotes.toLocaleString()} votes: ${averageScore.toFixed(2) + ' / 10'}`;

        //FORMATTED SENT MESSAGE 
        message.channel.send(`**Synopsis:**\n\n${SYNOPSIS}\n\n`+ 
                            `**Rank:** ${RANK}\n\n`+ 
                            `**Episodes:**\n\n${EPISODES}\n\n`+ 
                            `**Ratings**\n\n${RATINGS}\n\n `+ 
                            `**Genres:**\n\n${GENRES}\n\n `+
                            `**MyAnimeList URL:**\n\n ${URL}
                            `)     
    } catch (error) {
        message.channel.send('An error occurred: ' + error.message);
        console.error('Error:', error.message);
    }
}

module.exports = {
    name: 'rand',
    description: '!rand Returns random anime',
    async execute(message) {
        try {
            await getRandomAnime(message)
        } catch (error) {
            console.error('Error:', error.message);
            message.channel.send('An error occurred: ' + error.message);
        }
    }
}