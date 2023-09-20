# Lytro
<div style="text-align:center">
<img src="https://as2.ftcdn.net/v2/jpg/02/43/06/71/1000_F_243067171_LP1nmo921ZIivxzxFUFqMD9ZaQXP67vI.jpg" alt="" width="1500" height="200">
</div>

<p align="center">Discord.js based discord bot for anime/manga information</p>

<!-- PROJECT ABOUT !-->
## About

Currently features commands for anime and manga. Currently planning to expand to include more API integration, as well as embed and streaming information support. Permanent hosting support also on the way. 

Now supports title caching; any command with an **[anime name]** identifier will stay within the searched title directory. Commands pertaining to that directory can be entered without the **[anime name]**.

**Data Source:** This bot uses the [MyAnimeList (MAL) API](https://myanimelist.net/apiconfig/references/api/v2) to fetch anime and manga information. You can visit the [MyAnimeList website](https://myanimelist.net/) for more details.

## Anime Commands

**!help** returns a list of possible commands with their descriptions. 

**!a [anime name]:** returns information like synopsis, rating based off total votes, genre, and url. 

**!info [anime name]** returns additional information. 

**!chr [prefix] [anime name]:** depending on prefix, returns either 'main' main characters, 'sup' supporting characters, or a specified character name. Provides information like character role and voice actor. 

**!img [anime name]:** returns a random image pertaining to the picture gallery of the specific anime. 

**!rand:** returns information identical to !info with a random anime.

**!quote:** returns a random quote, the character, and the anime/manga it came from. 

## Manga Commands

**!m [manga name]:** returns information like synopsis, rating based off total votes, genre, and url. 

**!mchr [prefix] [manga name]:** depending on prefix, returns either 'main' main characters, 'sup' supporting characters, or a specified character name. Provides information like character role and voice actor. 

**!mimg [manga name]:** returns a random image pertaining to the picture gallery of the specific manga. 

**!mrand:** returns information identical to !info with a random manga.

## Built With 

[![Discord.js](https://img.shields.io/badge/Discord.js-v15.0.0-blue.svg)](https://discord.js.org/) [![Jikan API](https://img.shields.io/badge/Jikan%20API-Latest-green.svg)](https://jikan.docs.apiary.io/) [![JikanJS](https://img.shields.io/badge/JikanJS-v4.0.0-blue.svg)](https://github.com/xy137/jikanjs) [![Axios](https://img.shields.io/badge/Axios-v1.5.0-blue)](https://github.com/axios/axios)


<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>
