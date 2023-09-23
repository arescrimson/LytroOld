// getCharacter.js

//IMPORTS

const { EmbedBuilder } = require('discord.js')

//IMPORT GETID 
const { getAnimeIDFromString } = require('../utils/getAnimeIDFromString')

//LYTRO FOOTER ICON
const { discordClient, client, rightArrow, leftArrow, THUMBNAIL, ICON_URL, ANIME_MODE } = require('../../config')


/**
 * Gets first name from either a single first name, or a lastname, firstname format. 
 * Ex. !chr gon hunter x hunter would return gon, even though the api lists it as Freecss, Gon. 
 * 
 * @param {*} message is the discord message. 
 * @param {*} characterName is the character Name. 
 * @returns the first name. 
 */
function getFirstName(message, characterName, databaseNames) {
    let res = false; 
    //splits by nameParts, i.e Monkey D., Luffy, and sets to lowercase for comparison purposes. 
    const nameParts = databaseNames.split(',').map(part => part.trim().toLowerCase());
    //returns true if characterName matches either first or last name. 
    if (nameParts.includes(characterName.toLowerCase())) {
        res = true; 
    }

    return res; 
}

function createCharacterEmbed(NAME, URL, TITLE, THUMBNAIL, ROLE, VOICEACTOR, IMAGE) {
    return new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle(`${NAME}`)
        .setURL(`${URL}`)
        .setAuthor({ name: `Currently Searching ${ANIME_MODE} : ${TITLE}`, iconURL: ICON_URL })
        .setThumbnail(THUMBNAIL)
        .addFields(
            { name: 'Role:', value: `${ROLE}` },
            { name: 'Japanese Voice Actor:', value: `${VOICEACTOR}`, inline: true },
        )
        .setImage(`${IMAGE}`)
        .setTimestamp()
        .setFooter({ text: 'Information from Lytro', iconURL: ICON_URL });
}

/**
 * Gets Anime Characters from the animeID passed. 
 * 
 * @param {*} message is the discord message. 
 * @param {*} animeID is the animeID passed. 
 * @param {*} characterName is the lowercased character Name being searched. 
 */
async function getAnimeCharacters(message, animeID, characterName) {

    try {
        const anime = await client.anime.get(animeID);
        const ch = await client.anime.getCharacters(animeID);

        let characterFound = false;
        let characterArr = [];

        for (let i = 0; i < ch.length; i++) {

            //if character name is main, indexes and returns ALL MAIN CHARACTERS.
            if (characterName === 'main') {
                if (ch[i].role === 'Main') {
                    characterArr.push(ch[i]);
                    characterFound = true;
                }
            }
            //if character name is sup, indexes ALL SUPPORTING CHARACTERS. Temporary limit of 5 indexes until 
            //functionality to advance indexes is added.  
            else if (characterName === 'sup') {
                if (ch[i].role === 'Supporting') {
                    characterArr.push(ch[i]);
                    characterFound = true;
                }
            }
            //if character name is specified as a name, extracts first name and compares it to 
            //passed characterName .toLowerCase() because of case sensitivity in equality. 
            else {
                if (getFirstName(message, characterName, (ch[i].character.name).toLowerCase())) { 
                    characterArr.push(ch[i]);
                    characterFound = true;
                }
            }
        }

        let embedMessage;
        let i = 0;

        const exampleEmbed = createCharacterEmbed(
            characterArr[i].character.name,
            characterArr[i].character.url,
            anime.title.default,
            THUMBNAIL,
            characterArr[i].role,
            characterArr[i].voiceActors[0].person.name,
            characterArr[i].character.image.webp.default
        );

        embedMessage = await message.channel.send({ embeds: [exampleEmbed] });

        if (characterArr.length > 1) {
            embedMessage.react(leftArrow);
            embedMessage.react(rightArrow);
        }

        discordClient.on('messageReactionAdd', async (reaction, user) => {
            if (reaction.message.partial) await reaction.message.fetch();

            if (user.bot) return;

            if (reaction.emoji.name === leftArrow) {
                i = (i - 1 + characterArr.length) % characterArr.length; // Decrement and wrap around
            } else {
                i = (i + 1) % characterArr.length; // Increment and wrap around
            }

            reaction.message.reactions.removeAll().catch(console.error);

            const updatedEmbed = createCharacterEmbed(
                characterArr[i].character.name,
                characterArr[i].character.url,
                anime.title.default,
                THUMBNAIL,
                characterArr[i].role,
                characterArr[i].voiceActors[0].person.name,
                characterArr[i].character.image.webp.default
            );

            embedMessage.edit({ embeds: [updatedEmbed] }).catch(console.error);
        });

        if (!characterFound) {
            message.channel.send('Character not found :(');
            return;
        }

    } catch (error) {
        message.channel.send('Error with finding anime character.')
        console.error('Error:', error.message);
    }
}

module.exports = {
    name: 'chr',
    description: '!chr [main, sup, character_name] [anime_name] Returns character information. Use main for main characters, sup for supporting characters, and specify name for a specific character.',
    async execute(message, args, searchName) {
        //takes character name from zero index. Needs reworking for 2 word character names. 
        const characterName = args[0].toLowerCase();
        //takes anime name from index one. Needs reworking for 2 word character names. 
        const animeName = searchName;

        try {
            const animeID = await getAnimeIDFromString(message, animeName);
            getAnimeCharacters(message, animeID, characterName)
        } catch (error) {
            console.error('Error:', error.message);
            message.channel.send('An error occurred: ' + error.message);
        }
    }
}
