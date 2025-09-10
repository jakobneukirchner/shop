const fetch = require('node-fetch');

// WICHTIG: Ersetze diese Platzhalter durch deine eigenen GitHub-Informationen
const REPO_OWNER = 'jakobneukirchner';
const REPO_NAME = 'shop';
const REPO_BRANCH = 'main'; // Oder 'master', je nachdem, wie dein Haupt-Branch heißt
const FILE_PATH = 'data/products.json';

exports.handler = async () => {
    try {
        // Direkte URL zu den Rohdaten verwenden, um API-Probleme zu umgehen
        const url = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/${REPO_BRANCH}/${FILE_PATH}`;

        const response = await fetch(url);

        if (!response.ok) {
            // Dies ist entscheidend für das Debugging.
            const errorText = await response.text();
            console.error(`Error fetching raw data: ${response.status}. Response: ${errorText}`);
            throw new Error(`Failed to fetch raw data from GitHub: ${response.status}`);
        }

        const products = await response.json();

        return {
            statusCode: 200,
            body: JSON.stringify(products),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        };
    } catch (error) {
        console.error('An error occurred in the Netlify function:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to fetch products' })
        };
    }
};
