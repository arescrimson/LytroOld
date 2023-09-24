/**
 * @file config.js
 * @description Configuration file for My Discord Bot.
 * 
 * @license MIT
 * 
 * @author Ares
 */


const { Client, IntentsBitField } = require('discord.js');
const Jikan = require('jikan4.js');
const jikanClient = new Jikan.Client();

// Discord Bot Token for authentication
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;

// Access Token for the Quote API
const QUOTE_TOKEN = process.env.ACCESS_TOKEN;

// Discord Client Manager
const discordClient = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.GuildMessageReactions,
  ],
});

// Unicode emojis for reactions
const rightArrow = '▶️';
const leftArrow = '◀️';

module.exports = {
  // Access Token for the Quote API
  QUOTE_TOKEN,

  // Login Token for Discord Bot
  DISCORD_TOKEN,

  // Jikan Client Manager
  jikanClient,

  // Discord Client Manager
  discordClient,

  // Unicode emojis for embed reactions
  rightArrow,
  leftArrow,

  // Links to embed images
  THUMBNAIL: 'https://github.com/arescrimson/Lytro/blob/master/img/profile.jpg?raw=true',
  ICON_URL: 'https://github.com/arescrimson/Lytro/blob/master/img/icon.png?raw=true',
  QUOTE_URL: "https://waifu.it/api/quote",

  // Maximum length of embed values
  MAX_VALUE_LENGTH: 1020,

  // Currently searching mode
  ANIME_MODE: 'Anime',
  MANGA_MODE: 'Manga',

  // Error messages for Anime
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

  // Error messages for Manga
  VOLUMES_NOT_FOUND: 'Volumes not found.',
  AUTHOR_NOT_FOUND: 'Author not found.',
  POPULARITY_NOT_FOUND: 'Popularity not found.',
  SERIAL_NOT_FOUND: 'Serialization not found.',
};
