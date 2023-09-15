// getAnime.js

//IMPORTS

//STRING SIMILARITY LIBRARY 
const stringSimilarity = require('string-similarity');
//JIKAN API LIBRARY 
const Jikan = require('jikan4.js')
//JIKANJS WRAPPER LIBRARY
const client = new Jikan.Client();

/**
 * Gets Anime ID from String. Since Jikan can only access specific animes through an ID, 
 * this utilizes a string-similarity to parse the string results and gets the ID from the 
 * one that is the best result. However, this is still in testing, and is not entirely accurate, 
 * sometimes even returning wrong results for correct searches, i.e. demon slayer does not return 
 * demon slayer, you have to search kimetsu no yaiba etc . 
 * 
 * @param {*} message is the discord message.
 * @param {*} searchString is the searched anime name. 
 * @returns best result anime ID. 
 */
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

/**
 * Gets Anime Information from the animeID passed. 
 * 
 * @param {*} message is the discord message. 
 * @param {*} animeID is the animeID passed. 
 */
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
    name: 'info',
    description: 'Gets Anime Information.',
    async execute(message, args) {

        //Gets passed manga name. 
        const passedMangaName = args.join(' ');
        console.log(passedMangaName)

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
