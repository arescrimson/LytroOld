/**
 * @file getCharacter.js
 * @description Retrieve character info from an anime.
 * @license MIT
 * @author Ares
 */

//IMPORTS

const { EmbedBuilder } = require('discord.js')

const { getID } = require('../utils/getIDUtil')

const {
    DISCORD_CLIENT,
    JIKAN_CLIENT,
    THUMBNAIL,
    ICON_URL,
    ANIME_MODE,
    DESCRIPTION_NOT_FOUND,
    MAX_VALUE_LENGTH,
    VA_NOT_FOUND,
    ROLE_NOT_FOUND,
    BUTTON_ROW
} = require('../../config')


const { getCharacterUtil } = require('../utils/findCharacterUtil')

/**
 * Gets first name from either a single first name, or a lastname, firstname format. 
 * Ex. !chr gon hunter x hunter would return gon, even though the api lists it as Freecss, Gon. 
 * 
 * @param {Message} message is the discord message. 
 * @param {string} characterName is the character Name. 
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

/**
 * Creates an embedded message for displaying information about an anime character.
 *
 * @param {string} NAME - The name of the character.
 * @param {string} URL - The URL associated with the character.
 * @param {string} TITLE - The title of the anime the character is from.
 * @param {string} THUMBNAIL - The URL of the character's thumbnail image.
 * @param {string} ROLE - The role or position of the character.
 * @param {string} VOICEACTOR - The Japanese voice actor for the character.
 * @param {string} IMAGE - The URL of the character's image.
 * @returns {EmbedBuilder} - An EmbedBuilder object for the character information.
 */
function createCharacterEmbed(NAME, URL, TITLE, THUMBNAIL, ROLE, DESCRIPTION, VOICEACTOR, IMAGE) {
    return new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle(`${NAME}`)
        .setURL(`${URL}`)
        .setAuthor({ name: `Currently Searching ${ANIME_MODE} : ${TITLE}`, iconURL: ICON_URL })
        .setThumbnail(THUMBNAIL)
        .addFields(
            { name: 'Role:', value: `${ROLE}` },
            { name: 'Description:', value: `${DESCRIPTION}` },
            { name: 'Japanese Voice Actor:', value: `${VOICEACTOR}`, inline: true },
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
 * Gets Anime Characters from the animeID passed. 
 * 
 * @param {Message} message is the discord message. 
 * @param {number} animeID is the animeID passed. 
 * @param {string} characterName is the lowercased character Name being searched. 
 */

async function getAnimeCharacters(message, animeID, characterName) {

    try {

        const anime = await JIKAN_CLIENT.anime.get(animeID);
        const ch = await JIKAN_CLIENT.anime.getCharacters(animeID);
        const animeName = anime.title.default;

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
            animeName,
            THUMBNAIL,
            characterArr[i]?.role ?? ROLE_NOT_FOUND,
            description,
            characterArr[i]?.voiceActors[0].person.name ?? VA_NOT_FOUND,
            characterArr[i].character.image.webp.default,
        );

        if (characterArr.length > 1) {
            embedMessage = await message.channel.send({ embeds: [characterEmbed], components: [BUTTON_ROW] });
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
                animeName,
                THUMBNAIL,
                characterArr[i]?.role ?? ROLE_NOT_FOUND,
                description,
                characterArr[i]?.voiceActors[0]?.person.name ?? VA_NOT_FOUND,
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
        message.channel.send('Error with finding anime character.')
        console.error('Error in getCharacter:', error.message);
    }
}

module.exports = {
    name: 'chr',
    description: '!chr [main, sup, character_name] in [anime_name].\n' +
        '(in [anime_name]) only needs to be used when searching for a new character that is not in the current directory you are searching in.\n\n' +
        'NOTE: MAY CONTAIN SPOILERS.',
    /**
     * Executes the `chr` command to retrieve character information. 
     *
     * @param {Message} message - The Discord message object representing the user's command.
     * @param {Array} args - An array of arguments passed with the command. 
     * @param {string} searchAnime - The anime name specified for the search.
     */
    async execute(message, args, animeName) {

        try {
            let characterName = args[0];

            if (!characterName) throw new Error('no character specified in !chr.')

            characterName = characterName.toLowerCase();
            //console.log('Character Name:' + characterName);

            const animeID = await getID(message, ANIME_MODE, animeName);
            getAnimeCharacters(message, animeID, characterName)
        } catch (error) {
            console.error('Error in !chr:', error.message);
            message.channel.send('An error occurred: please make sure you are specifying an anime character and/or anime.');
        }
    }
}