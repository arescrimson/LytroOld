const { Client, IntentsBitField } = require('discord.js');

const Jikan = require('jikan4.js')
const jikanClient = new Jikan.Client();

const DISCORD_TOKEN = process.env.TOKEN;
const QUOTE_TOKEN = process.env.ACCESS_TOKEN;

const discordClient = new Client({
  intents: [
      IntentsBitField.Flags.Guilds,
      IntentsBitField.Flags.GuildMessages,
      IntentsBitField.Flags.GuildMembers,
      IntentsBitField.Flags.MessageContent,
      IntentsBitField.Flags.GuildMessageReactions,
  ],
});

const rightArrow = '▶️';
const leftArrow = '◀️';

module.exports = {

    //ACCESS TOKEN FOR QUOTE API 
    QUOTE_TOKEN,
    
    //LOGIN TOKEN FOR DISCORD BOT 
    DISCORD_TOKEN,

    //JIKAN CLIENT MANAGER 
    jikanClient,

    //DISCORD CLIENT MANAGER 
    discordClient,

    //LEFT AND RIGHT ARROW EMOJIS FOR EMBED REACTIONS
    rightArrow, 
    leftArrow,

    //LINKS TO EMBED IMAGES 
    THUMBNAIL: 'https://github.com/arescrimson/Lytro/blob/master/img/profile.jpg?raw=true',
    ICON_URL: 'https://github.com/arescrimson/Lytro/blob/master/img/icon.png?raw=true',
    QUOTE_URL: "https://waifu.it/api/quote",

    //MAX VALUE OF EMBED
    MAX_VALUE_LENGTH: 1020,

    //CURRENTLY SEARCHING MODE
    ANIME_MODE: 'Anime', 
    MANGA_MODE: 'Manga',
  
    // ERROR MESSAGES FOR ANIME
    SYNOPSIS_NOT_FOUND: 'Synopsis not found.',
    URL_NOT_FOUND: 'URL not found.',
    EPISODES_NOT_FOUND: 'Episodes not found.',
    GENRES_NOT_FOUND: 'Genres not found.',
    RATINGS_NOT_FOUND: 'Ratings not found.',
    BACKGROUND_NOT_FOUND: 'Background not found.',
    YEAR_NOT_FOUND: 'Year not found.',
    TRAILER_NOT_FOUND: 'Trailer not found.',
    STUDIO_NOT_FOUND: 'Studios not found.',
    RECOMMENDATIONS_NOT_FOUND: 'Recommendations not found.',

    // ERROR MESSAGES FOR MANGA
    VOLUMES_NOT_FOUND: 'Volumes not found.',
    AUTHOR_NOT_FOUND: 'Author not found.',
    POPULARITY_NOT_FOUND: 'Popularity not found.',
    SERIAL_NOT_FOUND: 'Serialization not found.',
  };
  