// getCharacter.js
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

            return result.animeID;
        } else {
            message.channel.send('No match found.');
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

async function getAnimeImages(message, animeID) {

    try {
        const ch = await client.anime.getPictures(animeID);
        let maxIndex = 0;

        const testlink = ch[0].jpg.default.href

        message.channel.send({
            files: [{ 
                attachment: testlink
            }]
        })
    } catch (error) {
        console.error('Error:', error.message);
    }
}

module.exports = {
    name: 'img',
    description: 'Gets Anime Images.',
    async execute(message, args) {
        const passedMangaName = args.join(' ');

        try {
            const animeID = await getAnimeIDFromString(message, passedMangaName);
            getAnimeImages(message, animeID)
        } catch (error) {
            console.error('Error:', error.message);
            message.channel.send('An error occurred: ' + error.message);
        }
    }
}
