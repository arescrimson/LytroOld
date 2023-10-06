/**
 * @file getMCharacter.js
 * @description Retrieves character information from a manga.
 * @license MIT
 * @author Ares
 */

const { EmbedBuilder, Message } = require('discord.js')

const { getID } = require('../utils/getIDUtil')

const {
    DISCORD_CLIENT,
    JIKAN_CLIENT,
    MANGA_MODE,
    THUMBNAIL,
    ICON_URL,
    ROLE_NOT_FOUND,
    MAX_VALUE_LENGTH,
    DESCRIPTION_NOT_FOUND,
    BUTTON_ROW
} = require('../../config')

const { getCharacterUtil } = require('../utils/findCharacterUtil')

/**
 * Retrieves the first name from either a single first name or a last name, first name format.
 * Example: !chr gon hunter x hunter would return "gon," even though the API lists it as "Freecss, Gon."
 *
 * @param {Message} message - The Discord message object.
 * @param {string} characterName - The character name to extract the first name from.
 * @param {string} databaseNames - The database character names for comparison.
 * @returns {boolean} true if the characterName matches either the first or last name, false otherwise.
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

/**
 * Creates an embed message with character information.
 *
 * @param {string} NAME - The character's name.
 * @param {string} URL - The URL of the character's page.
 * @param {string} TITLE - The title of the manga.
 * @param {string} THUMBNAIL - The thumbnail image URL.
 * @param {string} ROLE - The character's role in the manga.
 * @param {string} IMAGE - The character's image URL.
 * @returns {MessageEmbed} The created embed message.
 */
function createCharacterEmbed(NAME, URL, TITLE, THUMBNAIL, ROLE, DESCRIPTION, IMAGE) {
    return new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle(`${NAME}`)
        .setURL(`${URL}`)
        .setAuthor({ name: `Currently Searching ${MANGA_MODE} : ${TITLE}`, iconURL: ICON_URL })
        .setThumbnail(THUMBNAIL)
        .addFields(
            { name: 'Role:', value: `${ROLE}` },
            { name: 'Description', value: `${DESCRIPTION}` },
        )
        .setImage(`${IMAGE}`)
        .setTimestamp()
        .setFooter({ text: 'Information from Lytro', iconURL: ICON_URL });
}

function getDescription(characterDescription) {
    let description;

    if (!characterDescription) {
        return description = DESCRIPTION_NOT_FOUND;
    } 
    
    else {
        if (characterDescription.length > MAX_VALUE_LENGTH) {
            const midPoint = characterDescription.lastIndexOf('.', MAX_VALUE_LENGTH);

            if (midPoint !== -1) {
                const descriptionFirstPart = characterDescription.substring(0, midPoint + 1);
                description = descriptionFirstPart;
            }
        }
        else {
            description = characterDescription
        }
    }

    return description;
}

/**
 * Retrieves character information from a manga based on the character's role or name and sends it as an embed message.
 *
 * @param {string} message - The Discord message object.
 * @param {number} mangaID - The ID of the manga to retrieve character information from.
 * @param {string} characterName - The character's name or role to search for.
 */
async function getMangaCharacters(message, mangaID, characterName) {

    try {
        const manga = await JIKAN_CLIENT.manga.get(mangaID);
        const ch = await JIKAN_CLIENT.manga.getCharacters(mangaID);

        const mangaName = manga.title.default;

        let description = '';
        let characterObj;
        let characterFound = false;
        let embedMessage = null;
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

        if (!characterFound) {
            message.channel.send('Character not found :(');
            return;
        }

        let i = 0;

        //characterObj = await getCharacterUtil(characterArr[i].character.name);
        characterObj = await JIKAN_CLIENT.characters.getFull(characterArr[i].character.id); 

        if (characterObj) {
            description = getDescription(characterObj.about);
        } else {
            description = DESCRIPTION_NOT_FOUND;
        }

        const characterEmbed = createCharacterEmbed(
            characterArr[i].character.name,
            characterArr[i].character.url,
            mangaName,
            THUMBNAIL,
            characterArr[i]?.role ?? ROLE_NOT_FOUND,
            description,
            characterArr[i].character.image.webp.default,
        );

        if (characterArr.length > 1) {
            embedMessage = await message.channel.send({ embeds: [characterEmbed] , components: [BUTTON_ROW]});
        } else { 
            embedMessage = await message.channel.send({ embeds: [characterEmbed] });
        }

        async function handleButton(interaction) {
            if (interaction.user.bot) return;

            if (interaction.customId === 'left') {
                i = (i - 1 + characterArr.length) % characterArr.length; 
            } else {
                i = (i + 1) % characterArr.length;
            }
            
            characterObj = await JIKAN_CLIENT.characters.getFull(characterArr[i].character.id); 

            if (characterObj) {
                description = getDescription(characterObj.about);
            } else {
                description = DESCRIPTION_NOT_FOUND;
            }

            const updatedEmbed = createCharacterEmbed(
                characterArr[i].character.name,
                characterArr[i].character.url,
                mangaName,
                THUMBNAIL,
                characterArr[i]?.role ?? ROLE_NOT_FOUND,
                description,
                characterArr[i].character.image.webp.default
            );

            embedMessage.edit({ embeds: [updatedEmbed] }).catch(console.error);

            interaction.deferUpdate();
        };

        DISCORD_CLIENT.removeAllListeners('interactionCreate');

        DISCORD_CLIENT.on('interactionCreate', async (interaction) => {
            if (!interaction.isButton()) return;
            await handleButton(interaction);
        });
    } catch (error) {
        console.error('Error in finding manga character.', error.message);
        message.channel.send('Error in finding manga character.');
    }
}

module.exports = {
    name: 'mchr',
    description: '!mchr [main, sup, character_name] [manga_name] Returns character information. Use main for main characters, sup for supporting characters, and specify name for a specific character. NOTE: MAY CONTAIN SPOILERS.',
    /**
     * Execute the !mchr command.
     *
     * @param {Message} message - The Discord message object.
     * @param {Array<string>} args - Arguments provided with the command.
     * @param {string} searchName - The name of the manga being searched.
     */
    async execute(message, args, searchName) {
        try {

            let characterName = args[0];
            
            if (!characterName) throw new Error('no character specified in !mchr.')

            characterName = characterName.toLowerCase();
       
            const mangaName = searchName;

            const mangaID = await getID(message, MANGA_MODE, mangaName);
            getMangaCharacters(message, mangaID, characterName)
        } catch (error) {
            console.error(`Error: Couldn't find manga character.`);
            message.channel.send('error: manga character was not defined.');
        }
    }
}
