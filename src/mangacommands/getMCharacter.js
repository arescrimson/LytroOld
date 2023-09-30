/**
 * @file getMCharacter.js
 * @description Retrieves character information from a manga.
 * @license MIT
 * @author Ares
 */

//IMPORTS

const { EmbedBuilder, Message } = require('discord.js')

const { getMangaID } = require('../utils/getMangaID')

const { discordClient, jikanClient, rightArrow, leftArrow, MANGA_MODE, THUMBNAIL, ICON_URL } = require('../../config')

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
function createCharacterEmbed(NAME, URL, TITLE, THUMBNAIL, ROLE, IMAGE) {
    return new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle(`${NAME}`)
        .setURL(`${URL}`)
        .setAuthor({ name: `Currently Searching ${MANGA_MODE} : ${TITLE}`, iconURL: ICON_URL })
        .setThumbnail(THUMBNAIL)
        .addFields(
            { name: 'Role:', value: `${ROLE}` },
        )
        .setImage(`${IMAGE}`)
        .setTimestamp()
        .setFooter({ text: 'Information from Lytro', iconURL: ICON_URL });
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
        const manga = await jikanClient.manga.get(mangaID);
        const ch = await jikanClient.manga.getCharacters(mangaID);

        const mangaName = manga.title.default; 

        let characterArr = [];
        let characterFound = false;

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
        let embedMessage; 
        //This function passes all of the information from each character.
        const characterEmbed = createCharacterEmbed(
            characterArr[i].character.name,
            characterArr[i].character.url,
            mangaName,
            THUMBNAIL,
            characterArr[i].role,
            characterArr[i].character.image.webp.default,
        );
        //Sends message using the information from CharacterEmbed.
        embedMessage = await message.channel.send({ embeds: [characterEmbed] });

        if (characterArr.length > 1) {
            embedMessage.react(leftArrow);
            embedMessage.react(rightArrow);
        }
        //This function catches errors. Returns characters to nextline after max length of each setence is reached. 
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
                mangaName,
                THUMBNAIL,
                characterArr[i].role,
                characterArr[i].character.image.webp.default
            );
        
            embedMessage.edit({ embeds: [updatedEmbed] }).catch(console.error);
        };

        discordClient.removeAllListeners('messageReactionAdd');
        discordClient.on('messageReactionAdd', (reaction, user) => {
            handleReaction(reaction, user);
        });

    } catch (error) {
        console.error('Error in finding manga character.', error.message);
        message.channel.send('Error in finding manga character.');
    }
}

module.exports = {
    name: 'mchr',
    description: '!mchr [main, sup, character_name] [manga_name] Returns character information. Use main for main characters, sup for supporting characters, and specify name for a specific character.',
    /**
     * Execute the !mchr command.
     *
     * @param {Message} message - The Discord message object.
     * @param {Array<string>} args - Arguments provided with the command.
     * @param {string} searchName - The name of the manga being searched.
     */
    async execute(message, args, searchName) {

        try {
            //takes character name from zero index. Needs reworking for 2 word character names. 
            const characterName = args[0].toLowerCase();
            //takes manga name from index one. Needs reworking for 2 word character names. 
            const mangaName = searchName;

            const mangaID = await getMangaID(message, mangaName);
            getMangaCharacters(message, mangaID, characterName)
        } catch (error) {
            console.error(`Error: Couldn't find manga character.`);
            message.channel.send('error: manga character was not defined.');
        }
    }
}
