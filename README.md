# Lytro
<div style="text-align:center">
<img src="https://github.com/arescrimson/Lytro/blob/master/media/newbanner.jpg" alt="" width="1500" height="200">
</div>

<p align="center"> Discord.js based discord bot for anime/manga information.</p>

<!-- PROJECT ABOUT !-->
## About

Currently features commands for anime and manga. Currently planning to expand to include more APIs, as well as embed and streaming information support. Permanent hosting support also on the way. 

Now supports title caching; any command with an **[anime name]** identifier will stay within the searched title directory. Commands pertaining to that directory can be entered without the **[anime name]**.

**Data Source:** This bot uses the [MyAnimeList (MAL) API](https://myanimelist.net/apiconfig/references/api/v2) to fetch anime and manga information. You can visit the [MyAnimeList website](https://myanimelist.net/) for more details.

## Anime Commands

**!a [anime name]:** returns information like synopsis, rating based off total votes, genre, and url. 

**!info [anime name]** returns additional information like background, studio, related animes and release year. 

**!chr [prefix] [anime name]:** depending on prefix, returns either 'main' main characters, 'sup' supporting characters, or a specified character name. Provides information like character role and voice actor. 

**!img [anime name]:** returns a random image pertaining to the picture gallery of the specific anime. 

## Manga Commands

**!m [manga name]:** returns information like synopsis, rating based off total votes, genre, and url. 

**!minfo [manga name]** returns additional information like manga rank, serialization, and publish date. 

**!mchr [prefix] [manga name]:** depending on prefix, returns either 'main' main characters, 'sup' supporting characters, or a specified character name. Provides information like character role.

**!mimg [manga name]:** returns a random image pertaining to the picture gallery of the specific manga. 

## Misc Commands

**!help** returns a list of possible commands with their descriptions. 

**!rand:** returns information identical to !info with a random anime.

**!mrand:** returns information identical to !info with a random manga.

**!quote:** returns a random quote, the character, and the anime/manga it came from. 

## Built With 

[![Discord.js](https://img.shields.io/badge/Discord.js-v15.0.0-blue.svg)](https://discord.js.org/) [![Jikan API](https://img.shields.io/badge/Jikan%20API-Latest-green.svg)](https://docs.api.jikan.moe/) [![JikanJS](https://img.shields.io/badge/JikanJS-v4.0.0-blue.svg)](https://github.com/rizzzigit/jikan4.js) [![Axios](https://img.shields.io/badge/Axios-v1.5.0-blue)](https://github.com/axios/axios)

## Demo 

https://github.com/arescrimson/Lytro/assets/66581240/fc257995-02b1-4446-b091-ef94954c33a1

<p align="center"> Current anime functionalities: featuring !a, !info, !img, !chr, and !quote.</p>

https://github.com/arescrimson/Lytro/assets/66581240/79d916cc-af9c-40c7-9be9-449e2433eb02

<p align="center"> Current manga functionalities: featuring !m, !minfo, !mimg, and !mchr.</p>

<!-- LICENSE -->
## License

Distributed under the MIT License. If you do find this useful, please let me know! :D 

<p align="right">(<a href="#readme-top">back to top</a>)</p>
