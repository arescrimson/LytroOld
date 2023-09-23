// getMCharacter.js

//IMPORTS

const { EmbedBuilder } = require('discord.js')

//IMPORT GETID 
const { getMangaIDFromString } = require('../utils/getMangaIDFromString')

//LYTRO FOOTER ICON
const { discordClient, client, rightArrow, leftArrow, MANGA_MODE, THUMBNAIL, ICON_URL } = require('../../config')

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

        const characterEmbed = createCharacterEmbed(
            characterArr[i].character.name,
            characterArr[i].character.url,
            mangaName,
            THUMBNAIL,
            characterArr[i].role,
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
    async execute(message, args, searchName) {

        try {
            //takes character name from zero index. Needs reworking for 2 word character names. 
            const characterName = args[0].toLowerCase();
            //takes manga name from index one. Needs reworking for 2 word character names. 
            const mangaName = searchName;


            const mangaID = await getMangaIDFromString(message, mangaName);
            getMangaCharacters(message, mangaID, characterName)
        } catch (error) {
            console.error(`Error: Couldn't find manga character.`);
            message.channel.send('error: manga character was not defined.');
        }
    }
}
