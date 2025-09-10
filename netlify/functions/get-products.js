const fetch = require('node-fetch');

// WICHTIG: Ersetze diese Platzhalter durch deine eigenen GitHub-Informationen
const REPO_OWNER = 'jakobneukirchner';
const REPO_NAME = 'shop';
const FILE_PATH = 'data/products.json';

exports.handler = async () => {
    try {
        // Überprüfe hier, ob dein Branch-Name 'main' oder 'master' ist.
        // Wenn dein Standard-Branch 'master' ist, ändere 'main' in 'master'.
        const url = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/main/${FILE_PATH}`;

        const response = await fetch(url);

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`GitHub API returned status: ${response.status}. Response: ${errorText}`);
            throw new Error(`GitHub API returned an error: ${response.status}`);
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
        console.error('Error fetching products from GitHub:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to fetch products' })
        };
    }
};
