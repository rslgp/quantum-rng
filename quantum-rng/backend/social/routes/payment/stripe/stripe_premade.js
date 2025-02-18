import Stripe from 'stripe';
const stripe = Stripe('sk_test_51QsvxJK56JTr9UcatV3AvyAhh9RMSafjHDhAuNqn39czUPcRstNCeAsG8F7VieZPkI8N65kI5vnioSSYH24XtBY400ghAfO3uI');

/*
curl https://api.stripe.com/v1/payment_methods \
  -u sk_test_51QsvxJK56JTr9UcatV3AvyAhh9RMSafjHDhAuNqn39czUPcRstNCeAsG8F7VieZPkI8N65kI5vnioSSYH24XtBY400ghAfO3uI: \
  -d type=all
*/
const checkout_session = async (userId, args = {}) => {
    const { success_callback_url, product, amount } = args;
    const session = await stripe.checkout.sessions.create({
        // payment_method_types: ['paypal','samsung_pay','boleto', 'link', 'pix', 'customer_balance', 'card'],
        line_items: [
            {
                price_data: {
                    currency: 'brl',
                    product_data: {
                        name: 'Mais Decisoes',
                    },
                    unit_amount: 1210, // $12.10
                },
                quantity: 1,
            },
        ],
        "metadata": { // work for specific event checkout.session.completed
            userId,
            product

        },
        mode: 'payment',
        // success_url,
        success_url: `https://arbitrio.mapafome.com.br/webhook/stripe/callback_success?session_id={CHECKOUT_SESSION_ID}&userId=${userId}&product=${product}`,

    });

    console.log(session.id);
    return session.id;

}

export default stripe;
export { checkout_session }