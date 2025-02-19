const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_0c300591b67af459accbbd35de3eab9dea8e45b6590a73760ee1b95a28d57e62';
import { createPremium } from '../../auth/premium.js';
import { sendEvent } from '../../events/event_core.js';
import stripe from './stripe_premade.js';

const setupWebhookStripe = (app, express) => {
    app.post('/webhook/stripe/', express.raw({ type: "application/json" }), async (req, res) => {
        // console.log(req.query, req.body, req.params, req.headers);
        const sig = req.headers["stripe-signature"];
        if (!sig) {
            res.status(200).send('IGNORED');
            return;
        }
        console.log("SIG", sig);

        const reqBody = JSON.parse(req.body.toString());
        if (reqBody.type !== 'checkout.session.completed') {
            res.status(200).send('IGNORED');
            return;
        }

        let event;
        try {
            event = stripe.webhooks.constructEvent(req.body, sig, STRIPE_WEBHOOK_SECRET);
        } catch (err) {
            console.error("Webhook signature verification failed.", err.message);
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }

        console.log(event);
        const { payment_status, metadata } = event.data.object;
        console.log("METADATA", metadata, event.type);
        if (payment_status === 'paid') {
            const { userId } = metadata;
            console.log("NEW PREMIUM " + userId);
            await createPremium(userId);
            sendEvent(userId, 'NEW_PREMIUM');
        }

        res.status(200).send('Received');
    });
}

export default setupWebhookStripe;