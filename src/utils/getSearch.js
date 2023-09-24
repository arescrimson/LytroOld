/**
 * @file getSearch.js
 * @description getSearch function for parsing commands. 
 * @license MIT
 * @author Ares
 */

/**
 * Parses a Discord command message to cache a searched anime name for convenience.
 *
 * This function is designed to work with commands like !a and !chr to set and update
 * the currently searched anime name. Users can change the searched anime with any command
 * that requires an anime name, such as !img or !chr.
 *
 * @param {string[]} args - An array of strings containing individual words from the Discord command.
 * @param {string} command - The actual command, e.g., 'a' or 'chr'.
 * @param {string} currentSearchName - The currently cached searched anime name.
 * @returns {Promise<string>} The updated currentSearchName after it has been correctly assigned based on context.
 */
function getSearch(args, command, currentSearchName) {
    let animeName = '';

    // If no arguments provided, use the previously cached animeName.
    if (!args.length) {
        animeName = currentSearchName;
    } 
    //since !chr command requires a character name/prefix, takes the anime identifier after the name if one is provided.
    else {

        // Handle different commands and arguments.
        if ((command === 'chr' || command === 'mchr') && args.length > 1) {
            currentSearchName = args.slice(1).join(' ');
        } 

        //if !chr is provided with only a character identifier, uses currentSearchName as the anime name. 
        else if (command === 'chr' || command === 'mchr') {
            animeName = currentSearchName;
            currentSearchName = animeName;
        } 
        
        //if not !chr, will be a command like !a anime name, so return anime name as the current search name. 
        else {
            animeName = args.join(' ');
            currentSearchName = animeName;
        }
    }

    return currentSearchName;
}

module.exports = { getSearch };
