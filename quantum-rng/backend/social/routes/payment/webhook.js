import setupWebhookEfiPix from "./efi/webhook_efi.js";
// import setupWebhookMercadopago from "./mercadopago/webhook_mercadopago";
import setupWebhookStripe from "./stripe/webhook_stripe.js";

const setupWebhook = (app) => {
    app.post('/webhook', (req, res) => {
        console.log('Received Webhook:', req.body);

        if (req.body.type === 'payment') {
            // Process the payment notification
            console.log(`Payment ID: ${req.body.data.id}`);
        }

        res.status(200).send('Received');
    });

    app.get('/webhook/stripe/callback_success', (req, res) => {
        // console.log(req.query, req.body, req.params, req.headers);

        res.status(200).send('Received');
    });

    // setupWebhookStripe(app); // need to use raw req.body before express.json()
    setupWebhookEfiPix(app);
    

    //setupWebhookMercadopago(app);
}

export default setupWebhook;