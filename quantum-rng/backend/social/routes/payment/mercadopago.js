import { MercadoPagoConfig, Payment } from 'mercadopago';
import { v4 as uuidv4 } from 'uuid';

// charge 0.99% per pix

const client = new MercadoPagoConfig({ accessToken: 'TEST-114259758444895-021710-5c4f7dfa315699763de883b21e6e2f17-241379422' });
const payments = new Payment(client);
const PRECO = 12.10;

// https://www.mercadopago.com.br/developers/pt/reference/payments/_payments/post
payments.create({
    body: {
        installments: 1,
        payment_method_id: 'pix',
        transaction_amount: PRECO,
        payer: {
            email: 'dev.rafaelleao+arbitriopayments@gmail.com',
            entity_type: 'individual',
            type: 'customer',
            first_name: 'USER_ID'
        },
        // token: 'CARD_TOKEN', // so para cartao
        // additional_info: {
        //     items: [
        //         {
        //             id: 'arbitrio_more_decision',
        //             title: 'Mais Decisoes no app Arbitrio',
        //             category_id: 'electronics',
        //             quantity: 1,
        //             unit_price: PRECO,
        //         }
        //     ]
        // },
        description: 'Mais Decisoes no app Arbitrio',
        external_reference: 'ARBITRIO_PAYMENTS',
        metadata: null,
    },
    requestOptions: { idempotencyKey: uuidv4() }
})
    .then((result) => console.log(result))
    .catch((error) => console.log(error));


// LIST PAYMENTS
// payments.search({ options: {
// 	    external_reference: 'ARBITRIO_PAYMENTS',
// 	    sort: 'date_created',
// 	    criteria: 'desc',
// 	    range: 'date_created',
// 	    begin_date: 'NOW-30DAYS',
// 	     end_date: 'NOW',
// } })
// 	.then(console.log).catch(console.log);

