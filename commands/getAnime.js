// getAnime.js
const stringSimilarity = require('string-similarity');
const Jikan = require('jikan4.js')
const client = new Jikan.Client();

async function getAnimeIDFromString(message, searchString) {
    try {
        const searchResults = await client.anime.search(searchString)

        const bestMatch = searchResults.reduce((best, anime) => {
            const similarity = stringSimilarity.compareTwoStrings(searchString, anime.title.default);
            if (similarity > best.similarity) {
                return { similarity, anime };
            }
            return best;
        }, { similarity: 0, anime: null });

        if (bestMatch.anime) {
            const result = {
                animeID: bestMatch.anime.id,
                url: bestMatch.anime.url
            };

            return result.animeID
        } else {
            message.channel.send('No match found.');
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

async function getAnimeInfo(message, animeID) {
    try {

        //GETS ANIME INFORMATION
        const anime = await client.anime.get(animeID);
        const stats = await client.anime.getStatistics(animeID);      

        //GENRES AS A STRING LIST WITH COMMAS 
        let genreText = "";

        for (let i = 0; i < anime.genres.length; i++) {
            genreText += anime.genres[i].name;

            if (i < anime.genres.length - 1) {
                genreText += ", "; // Add a comma and space between genres (except for the last one)
            }
        }

        const GENRES = anime.genres.map(genre => genre.name).join(', ');

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
        const RATINGS = `Average Score Based off of ${totalVotes.toLocaleString()} votes: ${averageScore.toFixed(2) + ' / 10'}`;

        //FORMATTED SENT MESSAGE 
        message.channel.send(`**Synopsis:**\n\n ${SYNOPSIS}\n\n **Episodes:**\n\n ${EPISODES}\n\n **Ratings**\n\n ${RATINGS}\n\n **Genres:**
        \n${GENRES}\n\n **MyAnimeList URL:** \n\n ${URL}`)
    } catch (error) {
        console.error('Error:', error.message);
    }
}

module.exports = {
    name: 'info',
    description: 'Gets Anime Information.',
    async execute(message, args) {

        //Gets passed manga name. 
        const passedMangaName = args.join(' ');

        try {
            //Gets anime ID from ID get function. 
            const animeID = await getAnimeIDFromString(message, passedMangaName);
            //Gets anime information Info get function. 
            getAnimeInfo(message, animeID);
        } catch (error) {
            console.error('Error:', error.message);
            message.channel.send('An error occurred: ' + error.message);
        }
    }
}
