import Stripe from 'stripe';
import product_list from '../products';
const stripe = Stripe('sk_test_51QsvxJK56JTr9UcatV3AvyAhh9RMSafjHDhAuNqn39czUPcRstNCeAsG8F7VieZPkI8N65kI5vnioSSYH24XtBY400ghAfO3uI');

/*
curl https://api.stripe.com/v1/payment_methods \
  -u sk_test_51QsvxJK56JTr9UcatV3AvyAhh9RMSafjHDhAuNqn39czUPcRstNCeAsG8F7VieZPkI8N65kI5vnioSSYH24XtBY400ghAfO3uI: \
  -d type=all
*/
// const product_list = {
//     mais_decisoes: {
//         name: 'Mais Decisoes pack x3',
//         price: 350
//     },
//     premium: {
//         name: 'Premium',
//         price: 1800
//     }
// }


const session_payload = (userId, product='mais_decisoes', amount=1) => {
    return {
        // payment_method_types: ['paypal','samsung_pay','boleto', 'link', 'pix', 'customer_balance', 'card'],
        line_items: [
            {
                price_data: {
                    currency: 'brl',
                    product_data: {
                        name: product_list[product].name,
                    },
                    unit_amount: product_list[product].price, // $12.10
                },
                quantity: amount,
            },
        ],
        "metadata": { // work for specific event checkout.session.completed
            userId,
            product,
            amount,

        },
        mode: 'payment',
        // success_url,
        success_url: `https://arbitrio.mapafome.com.br/webhook/stripe/callback_success?session_id={CHECKOUT_SESSION_ID}&userId=${userId}&product=${product}`,

    }
};

const checkout_session = async (userId, args = {}) => {
    const { product, amount } = args;

    const session = await stripe.checkout.sessions.create(
        session_payload(userId,product,amount)
    );

    console.log(session.id);
    return session.id;

}

export default stripe;
export { checkout_session }