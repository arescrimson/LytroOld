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

async function getAnimeCharacters(message, animeID, name) {

    try {
        const ch = await client.anime.getCharacters(animeID);

        let maxIndex = 0;

        for (let i = 0; i < ch.length; i++) {

            if (name === 'main') {
                if (ch[i].role === 'Main') {
                    message.channel.send(`Main Characters: ${ch[i].character.url}`)
                }
            } else if (name === 'sup') {
                if (ch[i].role === 'Supporting' && maxIndex < 5) {
                    message.channel.send(`Supporting Characters: ${ch[i].character.url}`)
                    maxIndex++;
                }
            }

            if (name === ch[i].character.name) {
                console.log(name)
                console.log(ch[i].character.name)
                message.channel.send(`Character: ${ch[i].character.url}`)
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
        const characterName = args[0].toLowerCase();
        const passedMangaName = args.slice(1).join(' ');

        try {
            const animeID = await getAnimeIDFromString(message, passedMangaName);
            getAnimeCharacters(message, animeID, characterName)
        } catch (error) {
            console.error('Error:', error.message);
            message.channel.send('An error occurred: ' + error.message);
        }
    }
}
