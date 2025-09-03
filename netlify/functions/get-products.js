const fetch = require('node-fetch');

exports.handler = async (event) => {
    // WICHTIG: Passe diese Variablen an dein GitHub-Repo an
    const REPO_OWNER = 'jakobneukirchner';
    const REPO_NAME = 'shop';
    const FILE_PATH = 'data/products.json'; // Passe den Pfad zu deiner JSON-Datei an

    // Dieser Token wird über Netlify-Umgebungsvariablen bereitgestellt
    const GITHUB_PAT = process.env.GITHUB_PAT;

    if (!GITHUB_PAT) {
        return {
            statusCode: 500,
            body: 'GITHUB_PAT environment variable not set.',
        };
    }

    try {
        const response = await fetch(
            `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`,
            {
                headers: {
                    'Authorization': `token ${GITHUB_PAT}`,
                    'Accept': 'application/vnd.github.v3.raw',
                },
            }
        );

        if (!response.ok) {
            console.error('GitHub API-Fehler:', response.status, response.statusText);
            return {
                statusCode: response.status,
                body: JSON.stringify({ error: 'Failed to fetch file from GitHub.' }),
            };
        }

        const data = await response.json();

        return {
            statusCode: 200,
            body: JSON.stringify(data),
        };
    } catch (error) {
        console.error('Fehler beim Abrufen der Produktdaten:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};
