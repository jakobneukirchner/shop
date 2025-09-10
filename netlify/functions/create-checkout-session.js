const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const fetch = require('node-fetch'); // Stelle sicher, dass node-fetch in deiner package.json enthalten ist

exports.handler = async (event) => {
    // Überprüft, ob die Anfrage eine POST-Anfrage ist.
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: 'Method Not Allowed',
        };
    }

    try {
        const { items } = JSON.parse(event.body);

        // Hole die Produktdaten vom öffentlichen URL deines Shops.
        // Dies ist die zuverlässigste Methode in der Netlify-Umgebung.
        const productsUrl = `${process.env.URL}/data/products.json`;
        const productsResponse = await fetch(productsUrl);

        if (!productsResponse.ok) {
            throw new Error(`Failed to fetch products from ${productsUrl}`);
        }
        
        const availableProducts = await productsResponse.json();

        const line_items = items.map(item => {
            const productInfo = availableProducts.find(p => p.id === item.id);
            if (!productInfo) {
                // Gibt eine detaillierte Fehlermeldung aus, wenn ein Produkt nicht gefunden wird.
                throw new Error(`Produkt mit der ID ${item.id} wurde nicht gefunden.`);
            }
            return {
                price_data: {
                    currency: 'eur',
                    product_data: {
                        name: productInfo.name,
                    },
                    unit_amount: productInfo.price,
                },
                quantity: item.quantity,
            };
        });

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items,
            mode: 'payment',
            success_url: `${process.env.URL}/success.html`,
            cancel_url: `${process.env.URL}/`,
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ sessionId: session.id }),
        };
    } catch (error) {
        console.error('Stripe-Fehler:', error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: { message: error.message } }),
        };
    }
};
