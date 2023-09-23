const { Client, IntentsBitField } = require('discord.js');

const Jikan = require('jikan4.js')
const ACCESS_TOKEN = process.env.ACCESS_TOKEN

const discordClient = new Client({
  intents: [
      IntentsBitField.Flags.Guilds,
      IntentsBitField.Flags.GuildMessages,
      IntentsBitField.Flags.GuildMembers,
      IntentsBitField.Flags.MessageContent,
      IntentsBitField.Flags.GuildMessageReactions,
  ],
});

module.exports = {
    discordClient,
    ACCESS_TOKEN, 
    THUMBNAIL: 'https://github.com/arescrimson/Lytro/blob/master/img/profile.jpg?raw=true',
    ICON_URL: 'https://github.com/arescrimson/Lytro/blob/master/img/icon.png?raw=true',
    QUOTE_URL: "https://waifu.it/api/quote",
    MAX_VALUE_LENGTH: 1020,

    //ID
    ANIME_MODE: 'Anime', 
    MANGA_MODE: 'Manga',
  
    // ERROR MESSAGES FOR GETANIME
    SYNOPSIS_NOT_FOUND: 'Synopsis not found.',
    URL_NOT_FOUND: 'URL not found.',
    EPISODES_NOT_FOUND: 'Episodes not found.',
    GENRES_NOT_FOUND: 'Genres not found.',
    RATINGS_NOT_FOUND: 'Ratings not found.',
  
    // ERROR MESSAGES FOR GETINFO
    BACKGROUND_NOT_FOUND: 'Background not found.',
    YEAR_NOT_FOUND: 'Year not found.',
    TRAILER_NOT_FOUND: 'Trailer not found.',
    STUDIO_NOT_FOUND: 'Studios not found.',
    RECOMMENDATIONS_NOT_FOUND: 'Recommendations not found.',

    // ERROR MESSAGES FOR GETMANGA 
    VOLUMES_NOT_FOUND: 'Volumes not found.',
    AUTHOR_NOT_FOUND: 'Author not found.',
    POPULARITY_NOT_FOUND: 'Popularity not found.',
    SERIAL_NOT_FOUND: 'Serialization not found.',
    //JIKANJS WRAPPER LIBRARY
    client: new Jikan.Client()
  };
  