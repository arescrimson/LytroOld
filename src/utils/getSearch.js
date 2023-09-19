/**
 * Parses discord command message to cache searched anime name for convenience. 
 * i.e. !a one piece will set the user's currently searched anime to one piece, and 
 * they will only need to do !img or !chr name to search within their searched show. 
 * Of course, this also allows for users to change shows with any command, such as 
 * !chr gon hunter x hunter will switch the searched name to hunter x hunter. 
 * 
 * @param {string} args is the array of strings of individual words from the discord command. 
 * @param {string} command is the actual command, i.e. 'a' or 'chr'.
 * @param {string} currentSearchName is the currently cached searched name. 
 * @returns currentSearchName after it has been correctly assigned depending on context. 
 */

async function getSearch(args, command, currentSearchName) { 
    //records animeName for commands with no specified command name, so use cached animeName. 
    let animeName = ''

        //if no length, i.e. !a or !img, cache the animeName using the previously searched name. 
        if (!args.length) {
            animeName = currentSearchName;
        } 
        //else if args has length, currentSearchName is assigned to other identifiers in the discord command. 
        else {
            //since !chr command requires a character name/prefix, takes the anime identifier after the name if one is provided.
            if ((command === 'chr' || command === 'mchr') && args.length > 1) {
                currentSearchName = args.slice(1).join(' ')
            } 
            //if !chr is provided with only a character identifier, uses currentSearchName as the anime name. 
            else if (command === 'chr' || command === 'mchr')  {
                animeName = currentSearchName;
                currentSearchName = animeName;
            } 
            //if not !chr, will be a command like !a anime name, so return anime name as the current search name. 
            else {
                animeName = args.join(' ');
                currentSearchName = animeName;
            }
        } 
        
    return currentSearchName
}

module.exports = {getSearch}; 