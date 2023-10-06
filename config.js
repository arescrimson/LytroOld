/**
 * @file config.js
 * @description Configuration file for My Discord Bot.
 * @license MIT
 * @author Ares
 */

const { Client, IntentsBitField, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');
const Jikan = require('jikan4.js');
const JIKAN_CLIENT = new Jikan.Client();

// Discord Bot Token for authentication
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;

// Access Token for the Quote API
const QUOTE_TOKEN = process.env.ACCESS_TOKEN;

// Discord Client Manager
const DISCORD_CLIENT = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.GuildMessageReactions,
  ],
});

//right and left arrow buttons
const rightArrow = new ButtonBuilder()
  .setCustomId('right')
  .setLabel('-->')
  .setStyle(ButtonStyle.Success)

const leftArrow = new ButtonBuilder()
  .setCustomId('left')
  .setLabel('<--')
  .setStyle(ButtonStyle.Success)

const BUTTON_ROW = new ActionRowBuilder()
  .setComponents(leftArrow, rightArrow)

//Explicit genre check array 
const explicitList = process.env.BANNED_LIST;
const bannedList = explicitList.split(',')

module.exports = {
  // Access Token for the Quote API
  QUOTE_TOKEN,

  // Login Token for Discord Bot
  DISCORD_TOKEN,

  // Jikan Client Manager
  JIKAN_CLIENT,

  // Discord Client Manager
  DISCORD_CLIENT,

  // Scroll Button Row 
  BUTTON_ROW,

  // Links to embed images
  THUMBNAIL: 'https://github.com/arescrimson/Lytro/blob/master/media/profile.jpg?raw=true',
  ICON_URL: 'https://github.com/arescrimson/Lytro/blob/master/media/icon.png?raw=true',

  // Links to API endpoints
  QUOTE_URL: "https://waifu.it/api/quote",
  ANI_API: 'https://graphql.anilist.co',

  // Maximum length of embed values
  MAX_VALUE_LENGTH: 1020,

  // Currently searching mode
  ANIME_MODE: 'Anime',
  MANGA_MODE: 'Manga',

  //Character command string
  CHR_COMMAND: 'in',

  // Error messages for Anime
  SYNOPSIS_NOT_FOUND: 'Synopsis not listed.',
  URL_NOT_FOUND: 'URL not listed.',
  EPISODES_NOT_FOUND: 'Episodes not listed.',
  GENRES_NOT_FOUND: 'Genres not listed.',
  RATINGS_NOT_FOUND: 'Ratings not listed.',
  BACKGROUND_NOT_FOUND: 'Background not listed.',
  YEAR_NOT_FOUND: 'Year not listed.',
  TRAILER_NOT_FOUND: 'Trailer not listed.',
  STUDIO_NOT_FOUND: 'Studios not listed.',
  RECOMMENDATIONS_NOT_FOUND: 'Recommendations not listed.',
  DESCRIPTION_NOT_FOUND: 'Description not listed.',
  ROLE_NOT_FOUND: 'Role not listed.',
  VA_NOT_FOUND: 'Voice Actor not listed.',

  // Error messages for Manga
  VOLUMES_NOT_FOUND: 'Volumes not listed.',
  AUTHOR_NOT_FOUND: 'Author not listed.',
  POPULARITY_NOT_FOUND: 'Popularity not listed.',
  SERIAL_NOT_FOUND: 'Serialization not listed.',

  // Banned genres list for random search. 
  bannedList
};
