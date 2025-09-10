const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Sichere Produktdaten direkt in der Funktion, um Dateizugriffsfehler zu vermeiden
const availableProducts = [
  {
    "id": "prod_Pz6eP9xQ0yH1r2g",
    "name": "Minimalistischer Schreibtischstuhl",
    "price": 24999,
  },
  {
    "id": "prod_Pz6eP9xQ0yH1r2h",
    "name": "Zeitloser Holztisch",
    "price": 49999,
  },
  {
    "id": "prod_Pz6eP9xQ0yH1r2i",
    "name": "Elegante Stehlampe",
    "price": 12999,
  },
  {
    "id": "prod_Pz6eP9xQ0yH1r2j",
    "name": "Kunstvolles Wandbild",
    "price": 8999,
  },
  {
    "id": "prod_Pz6eP9xQ0yH1r2k",
    "name": "Gemütliches Kissen-Set",
    "price": 3499,
  }
];

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: 'Method Not Allowed',
        };
    }

    try {
        const { items } = JSON.parse(event.body);

        const line_items = items.map(item => {
            const productInfo = availableProducts.find(p => p.id === item.id);
            if (!productInfo) {
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
