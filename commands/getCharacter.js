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

async function getAnimeCharacters(message, animeID, role) {

    try {
        const ch = await client.anime.getCharacters(animeID);

        let maxIndex = 0;

        for (let i = 0; i < ch.length; i++) {

            if (role === 'main') {
                if (ch[i].role === 'Main') {
                    message.channel.send(`Main Characters: ${ch[i].character.url}`)
                }
            } else if (role === 'sup') {
                if (ch[i].role === 'Supporting' && maxIndex < 5) {
                    message.channel.send(`Supporting Characters: ${ch[i].character.url}`)
                    maxIndex++;
                }
            } else {
                message.channel.send('Please specify main or supporting character D:');
                break;
            }
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

module.exports = {
    name: 'chr',
    description: 'Gets Character Information.',
    async execute(message, args) {
        const role = args[0].toLowerCase();
        const passedMangaName = args.slice(1).join(' ');

        try {
            const animeID = await getAnimeIDFromString(message, passedMangaName);
            getAnimeCharacters(message, animeID, role)
        } catch (error) {
            console.error('Error:', error.message);
            message.channel.send('An error occurred: ' + error.message);
        }
    }
}
