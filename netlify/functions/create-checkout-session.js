const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
    // Überprüfe, ob die Anfrage eine POST-Anfrage ist
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: 'Method Not Allowed',
        };
    }

    try {
        const { lineItems } = JSON.parse(event.body);

        // Erstelle die Checkout-Session mit den übergebenen Produktdaten
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${process.env.URL}/success`, // Passe dies an deine Erfolgsseite an
            cancel_url: `${process.env.URL}/`,        // Passe dies an deine Abbruchseite an
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ id: session.id }),
        };
    } catch (error) {
        console.error('Stripe-Fehler:', error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: { message: error.message } }),
        };
    }
};
