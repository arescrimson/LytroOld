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
        const anime = await client.anime.get(animeID)
        const ch = await client.anime.getCharacters(animeID);
        let genreText = "";

        for (let i = 0; i < anime.genres.length; i++) {
            genreText += anime.genres[i].name;

            if (i < anime.genres.length - 1) {
                genreText += ", "; // Add a comma and space between genres (except for the last one)
            }
        }

        const genres = anime.genres.map(genre => genre.name).join(', ');

        message.channel.send(`Synopsis:\n\n ${anime.synopsis}\n\n Genres:\n\n ${genres}\n\n MyAnimeList URL: \n\n ${anime.url}`)

        console.log(ch[0].character.id)
        /*
        const attachment = anime.image.jpg.default.href;
        message.channel.send({
            files: [{
                attachment: attachment, 
            }],
          });
          */
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
            const animeID = await getAnimeIDFromString(message, passedMangaName);
            getAnimeInfo(message, animeID);
        } catch (error) {
            console.error('Error:', error.message);
            message.channel.send('An error occurred: ' + error.message);
        }
    }
}
