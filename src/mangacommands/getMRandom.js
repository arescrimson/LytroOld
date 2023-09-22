// getRandom.js

//IMPORTS

//JIKAN API LIBRARY 
const Jikan = require('jikan4.js')
//JIKANJS WRAPPER LIBRARY
const client = new Jikan.Client();

/**
 * Gets Random manga. Returns information identical to getmanga. 
 * 
 * @param {*} message is the discord message. 
 */
async function getRandomManga(message) {

    try {
        const random = await client.manga.random(true);
        const mangaID = random.id;
        
        //GETS manga INFORMATION
        const manga = await client.manga.get(mangaID);
        const stats = await client.manga.getStatistics(mangaID);      

        //GENRES AS A STRING LIST WITH COMMAS 
        let genreText = "";

        for (let i = 0; i < manga.genres.length; i++) {
            genreText += manga.genres[i].name;

            if (i < manga.genres.length - 1) {
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

        //SYNOPSIS, URL, EPISODES, GENRES, RATINGS
        const SYNOPSIS = manga.synopsis; 
        const URL = manga.url;  
        const RANK = manga.rank;
        const CHAPTERS = manga.chapters;
        const GENRES = manga.genres.map(genre => genre.name).join(', ');
        const RATINGS = `Average score based off ${totalVotes.toLocaleString()} votes: ${averageScore.toFixed(2) + ' / 10'}`;

        //FORMATTED SENT MESSAGE 
        message.channel.send(`**Synopsis:**\n\n${SYNOPSIS}\n\n`+ 
                            `**Rank:** ${RANK}\n\n`+ 
                            `**Chapters:**\n\n${CHAPTERS}\n\n`+ 
                            `**Ratings**\n\n${RATINGS}\n\n`+ 
                            `**Genres:**\n\n${GENRES}\n\n`+
                            `**MyAnimeList URL:**\n\n ${URL}
                            `)     
    } catch (error) {
        message.channel.send('An error occurred: ' + error.message);
        console.error('Error:', error.message);
    }
}

module.exports = {
    name: 'mrand',
    description: '!mrand Returns Random Manga',
    async execute(message) {
        try {
            await getRandomManga(message)
        } catch (error) {
            console.error('Error:', error.message);
            message.channel.send('An error occurred: ' + error.message);
        }
    }
}