const fs = require('fs');
const path = require('path');

exports.handler = async () => {
    try {
        const filePath = path.join(__dirname, '../../data/products.json');
        const productsData = fs.readFileSync(filePath, 'utf-8');
        const products = JSON.parse(productsData);

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
