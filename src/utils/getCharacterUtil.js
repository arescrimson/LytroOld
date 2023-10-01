import('node-fetch');

// Define your GraphQL query for character search
const characterQuery = `
  query ($search: String, $page: Int, $perPage: Int) {
    Page (page: $page, perPage: $perPage) {
      characters (search: $search) {
        id
        name {
          full
        }
        description
        image {
          large
        }
      }
    }
  }
`;

// Define the API endpoint
const apiUrl = 'https://graphql.anilist.co';

// Define the request options function
function requestOptions(characterName) {
    const variables = {
        search: characterName,
        page: 1,
        perPage: 1,
    };

    return {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            query: characterQuery,
            variables: variables,
        }),
    };
}

function handleData(data) { 
    return data.data.Page.characters[0];
}

// Make the GraphQL API request and return a Promise
async function fetchCharacterInfo(characterName) {
    return fetch(apiUrl, requestOptions(characterName))
        .then(response => response.json())
        .then(data => {
            return handleData(data)
        });
}

module.exports = {
    async getCharacterUtil(characterName) {
        try {
            const characterInfo = await fetchCharacterInfo(characterName);

            if (characterInfo) {
                return characterInfo;
            } 
        } catch (error) {
            console.error('Error in getCharacterUtil', error.message);
        }
    }
};

