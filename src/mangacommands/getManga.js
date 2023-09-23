// getManga.js

//IMPORTS
const { EmbedBuilder } = require('discord.js');

//IMPORT GETID 
const { getMangaIDFromString } = require('../utils/getMangaIDFromString');

//LYTRO FOOTER ICON, MAX VALUE LENGTH FOR EMBEDS
const { jikanClient, MANGA_MODE, THUMBNAIL, ICON_URL, MAX_VALUE_LENGTH } = require('../../config')

//ERROR MESSAGES
const { SYNOPSIS_NOT_FOUND, URL_NOT_FOUND, AUTHOR_NOT_FOUND, VOLUMES_NOT_FOUND, GENRES_NOT_FOUND, RATINGS_NOT_FOUND } = require('../../config')

/**
 * Checks if value passed is null. If null, instead returns error Message 
 * as to display 'Value not found.' instead of null in message response. 
 * 
 * @param {*} value is the Jikan get value. 
 * @param {*} errMessage is the message if value is null.  
 * @returns either value or error Message depending on if value is null. 
 */
function nullCheck(value, errMessage) {
    return (value !== null) ? value : errMessage;
}

function createEmbed(TITLE, URL, THUMBNAIL, AUTHOR, SYNOPSIS, SYNOPSIS2, VOLUMES, GENRES, RATINGS, image) {
    console.log("TITLE:", TITLE);
    console.log("URL:", URL);
    console.log("SYNOPSIS:", SYNOPSIS);
    console.log("SYNOPSIS2:", SYNOPSIS2);
    console.log("VOLUMES:", VOLUMES);
    console.log("GENRES:", GENRES);
    console.log("RATINGS:", RATINGS);
    const createdEmbed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle(`${TITLE}`)
        .setURL(`${URL}`)
        .setAuthor({ name: `Currently Searching ${MANGA_MODE}: ${TITLE}`, iconURL: ICON_URL })
        .setThumbnail(THUMBNAIL)
        .addFields(
            { name: 'Author: \n\u200b', value: `**${AUTHOR}** \n\u200b` },
            { name: 'Synopsis: \n\u200b', value: `${SYNOPSIS}` },
            { name: '\n', value: `${SYNOPSIS2}\n\u200b` },
            { name: 'Volumes:', value: `${VOLUMES}`, inline: true },
            { name: 'Genres:', value: `${GENRES}`, inline: true },
            { name: 'Ratings:', value: `${RATINGS}`, inline: true }
        )
        .setImage(`${image}`)
        .setTimestamp()
        .setFooter({ text: 'Information from Lytro', iconURL: ICON_URL });

    return createdEmbed;
}

/**
 * Gets manga Information from the mangaID passed. 
 * 
 * @param {*} message is the discord message. 
 * @param {*} mangaID is the mangaID passed. 
 */
async function getMangaInfo(message, mangaID) {
    try {

        //GETS manga INFORMATION
        const manga = await jikanClient.manga.get(mangaID);
        const stats = await jikanClient.manga.getStatistics(mangaID);
        const genres = nullCheck(manga.genres.map(genre => genre.name).join(', '), GENRES_NOT_FOUND);

        //INITIALIZES SPLIT FOR SYNOPSIS THAT ARE OVER 1020 CHARACTERS 
        let synopsis = '';
        let synopsis2 = '\n';

        //SPLITS SYNOPSIS IF TOO LONG INTO 2-3 PARAGRAPHS. 
        if (manga.synopsis !== null) {
            if (manga.synopsis.length > MAX_VALUE_LENGTH) {
                const midPoint = manga.synopsis.lastIndexOf('.', MAX_VALUE_LENGTH);
                if (midPoint !== -1) {
                    const synopsisFirstPart = manga.synopsis.substring(0, midPoint + 1);
                    const synopsisSecondPart = manga.synopsis.substring(midPoint + 1);
                    synopsis = synopsisFirstPart;
                    synopsis2 = synopsisSecondPart;
                }

                if (synopsis2 === undefined) {
                    synopsis2 = '\n';
                }
            }
            //else, simply assign synopsis to the manga synopsis. 
            else {
                synopsis = manga.synopsis;
            }
        }

        else {
            synopsis = SYNOPSIS_NOT_FOUND;
        }

        //RATINGS AS AN AVERAGED SCORE STRING 
        let ratings = '';
        let totalScore = 0;
        let totalVotes = 0;

        if (stats.scores !== null) {
            for (const obj of stats.scores) {
                totalScore += obj.score * obj.votes;
                totalVotes += obj.votes;
            }

            const averageScore = totalScore / totalVotes;

            ratings = `Average score based off ${totalVotes.toLocaleString()} votes: ${averageScore.toFixed(2) + ' / 10'}`;
        }

        else {
            ratings = RATINGS_NOT_FOUND;
        }


        //SYNOPSIS, URL, EPISODES, GENRES, RATINGS
        const SYNOPSIS = synopsis;
        const SYNOPSIS2 = synopsis2;
        const AUTHOR = (manga.authors[0].name !== null) ? manga.authors[0].name : AUTHOR_NOT_FOUND;
        const URL = (manga.url !== null) ? manga.url : URL_NOT_FOUND;
        const VOLUMES = (manga.volumes !== null) ? manga.volumes : VOLUMES_NOT_FOUND;
        const GENRES = genres;
        const RATINGS = ratings;

        const embedMessage = createEmbed(
            manga.title.default,
            URL,
            THUMBNAIL,
            AUTHOR,
            SYNOPSIS,
            SYNOPSIS2,
            VOLUMES,
            GENRES,
            RATINGS,
            manga.image.webp.default
        )

        message.channel.send({ embeds: [embedMessage] });

    } catch (error) {
        console.error('Error:', error.message);
    }
}

module.exports = {
    name: 'm',
    description: '!m [manga_name] Returns manga information.',
    async execute(message, args, searchName) {
        const passedMangaName = searchName

        try {
            const mangaID = await getMangaIDFromString(message, passedMangaName);
            getMangaInfo(message, mangaID);
        } catch (error) {
            console.error('Error:', error.message);
            message.channel.send('An error occurred: ' + error.message);
        }
    }
}
