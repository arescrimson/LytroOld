// getCharacter.js

//IMPORTS

const { EmbedBuilder } = require('discord.js')

//IMPORT GETID 
const { getAnimeIDFromString } = require('../utils/getAnimeIDFromString')

//LYTRO FOOTER ICON
const { client, THUMBNAIL, ICON_URL } = require('../../config')

/**
 * Gets first name from either a single first name, or a lastname, firstname format. 
 * Ex. !chr gon hunter x hunter would return gon, even though the api lists it as Freecss, Gon. 
 * 
 * @param {*} message is the discord message. 
 * @param {*} characterName is the character Name. 
 * @returns the first name. 
 */
function getFirstName(message, characterName, databaseNames) {
    //splits by nameParts, i.e Monkey D., Luffy, and sets to lowercase for comparison purposes. 
    const nameParts = databaseNames.split(',').map(part => part.trim().toLowerCase());

    //returns true if characterName matches either first or last name. 
    if (nameParts.includes(characterName.toLowerCase())) {
        return true;
    }
}

function createCharacterEmbed(NAME, URL, TITLE, THUMBNAIL, ROLE, VOICEACTOR, IMAGE) {
    return new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle(`${NAME}`)
        .setURL(`${URL}`)
        .setAuthor({ name: `Currently Searching: ${TITLE}`, iconURL: ICON_URL })
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

        let maxIndex = 0;
        let characterFound = false;

        for (let i = 0; i < ch.length; i++) {

            //if character name is main, indexes and returns ALL MAIN CHARACTERS.
            if (characterName === 'main') {
                if (ch[i].role === 'Main') {
                    message.channel.send(`Main Characters: ${ch[i].character.url}`);
                    characterFound = true;
                }
            }
            //if character name is sup, indexes ALL SUPPORTING CHARACTERS. Temporary limit of 5 indexes until 
            //functionality to advance indexes is added.  
            else if (characterName === 'sup') {
                if (ch[i].role === 'Supporting' && maxIndex < 5) {
                    message.channel.send(`Supporting Characters: ${ch[i].character.url}`);
                    maxIndex++;
                    characterFound = true;
                }
            }
            //if character name is specified as a name, extracts first name and compares it to 
            //passed characterName .toLowerCase() because of case sensitivity in equality. 
            else {
                if (getFirstName(message, characterName, (ch[i].character.name).toLowerCase())) {
                    const characterName = ch[i].character;

                    const exampleEmbed = createCharacterEmbed(
                        characterName.name,
                        characterName.url,
                        anime.title.default,
                        THUMBNAIL,
                        ch[i].role, 
                        ch[i].voiceActors[0].person.name, 
                        characterName.image.webp.default
                    );

                    message.channel.send({ embeds: [exampleEmbed] });
                    characterFound = true;
                    break;
                }
            }
        }

        if (!characterFound) {
            message.channel.send('Character not found :(');
        }
    } catch (error) {
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
