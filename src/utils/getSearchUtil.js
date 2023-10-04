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

        if ((command === 'chr' || command === 'mchr')){
            if (args.slice(1).includes('in')) { 

                // parses searchname by slicing from the last index of in, and taking any words after. 
                currentSearchName = args.slice(args.lastIndexOf('in') + 1).join(' '); 

                //if someone does the command without specifying an anime name. 
                if (!currentSearchName) throw Error('No identifier name specified.');
            } else { 
                
            }
        }
        //if not !chr, will be a command like !a anime name, so return anime name as the current search name. 
        else {
            animeName = args.join(' ');
            currentSearchName = animeName;
        }
    }

    //console.log('AnimeName: ' + animeName); 
    //console.log('CurrentSearchName: ' + currentSearchName);
    return currentSearchName;
}

module.exports = { getSearch };
