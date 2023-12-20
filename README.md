# Lytro
<div style="text-align:center">
<img src="https://github.com/arescrimson/Lytro/blob/master/media/newbanner.jpg" alt="" width="1500" height="200">
</div>

<p align="center"> Discord.js based discord bot for anime/manga information.</p>

<!-- PROJECT ABOUT !-->
## About

**IMPORTANT** AS OF 12/19/2023, THIS BOT HAS NOW BEEN COMPLETELY REWRITTEN INTO A NEWER VERSION, WHICH CAN BE LOCATED HERE. 

Anime Discord Bot for quick information on anime/manga, characters, and more. 

Now supports title caching; any command with an **[name]** identifier will stay within the searched title directory. Commands pertaining to that directory can be entered without the **[name]**.

**Data Source:** This bot uses the [MyAnimeList (MAL) API](https://myanimelist.net/apiconfig/references/api/v2) and [AniList API](https://anilist.gitbook.io/anilist-apiv2-docs/) to fetch anime and manga information. You can visit [MyAnimeList](https://myanimelist.net/) or [AniList](https://anilist.co/) for more details.

## Anime Commands

**!a [name]:** returns information like synopsis, rating based off total votes, genre, and url. Scroll to return addition information like background, studio, related animes and release year. 

**!chr [prefix] in [name]:** depending on prefix, returns either 'main' main characters, 'sup' supporting characters, or a specified character name. If searching for a character in a new anime/manga directory, specify the in, ex. !chr luffy in one piece. Provides information like character role, description, and voice actor. 

**!img [name]:** returns a random image in the picture gallery of the specific anime. 

**!rand:** returns information identical to !info with a random anime(sfw).

## Manga Commands

**!m [name]:** returns information like synopsis, rating based off total votes, genre, and url. 

**!minfo [name]** returns additional information like manga rank, serialization, and publish date. 

**!mchr [prefix] [name]:** depending on prefix, returns either 'main' main characters, 'sup' supporting characters, or a specified character name. If searching for a character in a new anime/manga directory, specify the in, ex. !mchr luffy in one piece. Provides information like character role and description.

**!mimg [name]:** returns a random image in the picture gallery of the specific manga. 

**!mrand:** returns information identical to !info with a random manga(sfw).

## Misc Commands

**!help** returns a list of possible commands with their descriptions. 

**!quote:** returns a random quote, the character, and the anime/manga it came from. 

## Built With 

[![Discord.js](https://img.shields.io/badge/Discord.js-v15.0.0-blue.svg)](https://discord.js.org/) [![Jikan API](https://img.shields.io/badge/Jikan%20API-Latest-green.svg)](https://docs.api.jikan.moe/) [![AniList API V2](https://img.shields.io/badge/AniList%20API%20V2-v2.8.0-green.svg)](https://docs.api.jikan.moe/) [![JikanJS](https://img.shields.io/badge/JikanJS-v4.0.0-blue.svg)](https://github.com/rizzzigit/jikan4.js) [![Axios](https://img.shields.io/badge/Axios-v1.5.0-blue)](https://github.com/axios/axios)

## Anime Demo 

https://github.com/arescrimson/Lytro/assets/66581240/1eda06f3-1193-4f69-a5eb-e2e803ceb63d

<p align="center"> Featuring !a, !info, !img, !chr, and !quote.</p>

## Manga Demo

https://github.com/arescrimson/Lytro/assets/66581240/365eaafa-e7d2-4858-95eb-46f34781ee5e

<p align="center"> Featuring !m, !minfo, !mimg, and !mchr.</p>

<!-- LICENSE -->
## License

Distributed under the MIT License. If you do find this useful, please let me know! :D 

<p align="right">(<a href="#readme-top">back to top</a>)</p>
