// getURL.js
const axios = require('axios');
const stringSimilarity = require('string-similarity');
const Jikan = require('jikan4.js')
const client = new Jikan.Client();
const JIKAN_API_BASE_URL = 'https://api.jikan.moe/v4';

async function getAnime(message, searchString) {
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
                //id: bestMatch.anime.id,
                url: bestMatch.anime.url
            };

            message.channel.send((result.url).toString())
        } else {
            message.channel.send('No match found.');
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

module.exports = {
    name: 'url',
    description: 'Get URL',
    async execute(message, args) {
        const passedMangaName = args.join(' ');

        try {
            const test = await getAnime(message, passedMangaName);
        } catch (error) {
            console.error('Error:', error.message);
            message.channel.send('An error occurred: ' + error.message);
        }
    }
}
