const fetch = require('node-fetch');

// WICHTIG: Ersetze diese Platzhalter durch deine eigenen GitHub-Informationen
const REPO_OWNER = 'jakobneukirchner';
const REPO_NAME = 'shop';
const FILE_PATH = 'data/products.json';

exports.handler = async () => {
    try {
        const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`;

        const response = await fetch(url, {
            headers: {
                'Accept': 'application/vnd.github.v3.raw'
            }
        });

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
