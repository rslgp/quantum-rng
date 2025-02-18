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
}

export default setupWebhook;