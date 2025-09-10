const fetch = require('node-fetch');

// WICHTIG: Ersetze diese Platzhalter durch deine eigenen GitHub-Informationen
const REPO_OWNER = 'DEIN_GITHUB_BENUTZERNAME';
const REPO_NAME = 'DEIN_REPOSITORY_NAME';
const FILE_PATH = 'data/products.json';

exports.handler = async () => {
    try {
        const githubToken = process.env.GITHUB_PAT;
        const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`;

        const response = await fetch(url, {
            headers: {
                'Authorization': `token ${githubToken}`,
                'Accept': 'application/vnd.github.v3.raw'
            }
        });

        if (!response.ok) {
            throw new Error(`GitHub API returned status: ${response.status}`);
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
