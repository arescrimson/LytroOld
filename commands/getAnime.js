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

            getAnimeInfo(message, result.animeID);
        } else {
            message.channel.send('No match found.');
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

async function getAnimeInfo(message, animeID) {
    try { 
        const anime = await client.anime.get(animeID) 

        message.channel.send(`Synopsis:\n\n ${anime.synopsis}\n\nCheck it out here: \n\n ${anime.url}
        `)
    } catch (error) { 
        console.error('Error:', error.message);
    }
}

module.exports = {
    name: 'info',
    description: 'Gets Anime Information.',
    async execute(message, args) {
        const passedMangaName = args.join(' ');

        try {
            const info = await getAnimeIDFromString(message, passedMangaName);
        } catch (error) {
            console.error('Error:', error.message);
            message.channel.send('An error occurred: ' + error.message);
        }
    }
}
