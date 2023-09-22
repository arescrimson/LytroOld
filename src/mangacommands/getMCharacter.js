// getMCharacter.js

//IMPORTS

const { EmbedBuilder } = require('discord.js')

//IMPORT GETID 
const { getMangaIDFromString } = require('../utils/getMangaIDFromString')

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

function createCharacterEmbed(NAME, URL, TITLE, THUMBNAIL, ROLE, IMAGE) {
    return new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle(`${NAME}`)
        .setURL(`${URL}`)
        .setAuthor({ name: `Currently Searching: ${TITLE}`, iconURL: ICON_URL })
        .setThumbnail(THUMBNAIL)
        .addFields(
            { name: 'Role:', value: `${ROLE}` },
        )
        .setImage(`${IMAGE}`)
        .setTimestamp()
        .setFooter({ text: 'Information from Lytro', iconURL: ICON_URL });
}


/**
 * Gets manga Characters from the mangaID passed. 
 * 
 * @param {*} message is the discord message. 
 * @param {*} mangaID is the mangaID passed. 
 * @param {*} characterName is the lowercased character Name being searched. 
 */
async function getMangaCharacters(message, mangaID, characterName) {

    try {
        const manga = await client.manga.get(mangaID);
        const ch = await client.manga.getCharacters(mangaID);

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
                        manga.title.default,
                        THUMBNAIL,
                        ch[i].role, 
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
    name: 'mchr',
    description: '!mchr [main, sup, character_name] [manga_name] Returns character information. Use main for main characters, sup for supporting characters, and specify name for a specific character.',
    async execute(message, args, searchName) {
        //takes character name from zero index. Needs reworking for 2 word character names. 
        const characterName = args[0].toLowerCase();
        //takes manga name from index one. Needs reworking for 2 word character names. 
        const mangaName = searchName;

        try {
            const mangaID = await getMangaIDFromString(message, mangaName);
            getMangaCharacters(message, mangaID, characterName)
        } catch (error) {
            console.error('Error:', error.message);
            message.channel.send('An error occurred: ' + error.message);
        }
    }
}
