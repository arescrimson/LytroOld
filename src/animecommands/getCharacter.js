/**
 * @file getCharacter.js
 * @description Retrieve character info from an anime.
 * @license MIT
 * @author Ares
 */

//IMPORTS

const { EmbedBuilder } = require('discord.js')

const { getAnimeID } = require('../utils/getAnimeID')

const { discordClient, jikanClient, rightArrow, leftArrow, THUMBNAIL, ICON_URL, ANIME_MODE } = require('../../config')

let embedMessage = null;
let characterArr = [];

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
 * @param {Message} message is the discord message. 
 * @param {number} animeID is the animeID passed. 
 * @param {string} characterName is the lowercased character Name being searched. 
 */
async function getAnimeCharacters(message, animeID, characterName) {

    try {

        const anime = await jikanClient.anime.get(animeID);
        const ch = await jikanClient.anime.getCharacters(animeID);

        const animeName = anime.title.default;

        let characterFound = false;
        characterArr = [];

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

        const characterEmbed = createCharacterEmbed(
            characterArr[i].character.name,
            characterArr[i].character.url,
            animeName,
            THUMBNAIL,
            characterArr[i].role,
            characterArr[i].voiceActors[0].person.name,
            characterArr[i].character.image.webp.default,
        );

        embedMessage = await message.channel.send({ embeds: [characterEmbed] });

        if (characterArr.length > 1) {
            embedMessage.react(leftArrow);
            embedMessage.react(rightArrow);
        }

        function handleReaction(reaction, user) {
            if (user.bot) return;
        
            if (reaction.emoji.name === leftArrow) {
                i = (i - 1 + characterArr.length) % characterArr.length; // Decrement and wrap around
            } else {
                i = (i + 1) % characterArr.length; // Increment and wrap around
            }
        
            const updatedEmbed = createCharacterEmbed(
                characterArr[i].character.name,
                characterArr[i].character.url,
                animeName,
                THUMBNAIL,
                characterArr[i].role,
                characterArr[i].voiceActors[0].person.name,
                characterArr[i].character.image.webp.default
            );
        
            embedMessage.edit({ embeds: [updatedEmbed] }).catch(console.error);
        };

        discordClient.removeAllListeners('messageReactionAdd');
        discordClient.on('messageReactionAdd', (reaction, user) => {
            handleReaction(reaction, user);
        });

    } catch (error) {
        message.channel.send('Error with finding anime character.')
        console.error('Error:', error.message);
    }
}

module.exports = {
    name: 'chr',
    description: '!chr [main, sup, character_name] [anime_name] Returns character information. Use main for main characters, sup for supporting characters, and specify name for a specific character.',
    /**
     * Executes the `img` command to retrieve character information. 
     *
     * @param {Message} message - The Discord message object representing the user's command.
     * @param {Array} args - An array of arguments passed with the command, typically containing the anime name.
     * @param {string} searchAnime - The anime name specified for the search.
     */
    async execute(message, args, searchName) {
        //takes character name from zero index. Needs reworking for 2 word character names. 
        const characterName = args[0].toLowerCase();
        //takes anime name from index one. Needs reworking for 2 word character names. 
        const animeName = searchName;

        try {
            const animeID = await getAnimeID(message, animeName);
            getAnimeCharacters(message, animeID, characterName)
        } catch (error) {
            console.error('Error:', error.message);
            message.channel.send('An error occurred: please make sure you are specfiying an anime character and/or anime.');
        }
    }
}
