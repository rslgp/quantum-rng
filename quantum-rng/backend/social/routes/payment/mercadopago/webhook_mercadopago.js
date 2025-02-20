import { payments } from "./mercadopago_pix";

const setupWebhookMercadopago = (app) => {
    app.post('/webhook/mercadopago', async (req, res) => {
        console.log("oi");
        const { topic, id } = req.query;
        // id is paymentId

        if (topic === 'payment') {
            try {

                const paymentData = await payments.get({ id });

                if (paymentData.status === 'approved') {
                    console.log('✅ Payment Approved:', paymentData);
                    // Handle order fulfillment here
                } else {
                    console.log('⚠️ Payment Status:', paymentData.status);
                }

                res.sendStatus(200);
            } catch (error) {
                console.error('❌ Webhook Error:', error);
                res.status(500).json({ error: error.message });
            }
        }
    });
}

export default setupWebhookMercadopago;