
import { MercadoPagoConfig, Preference } from 'mercadopago';

const client = new MercadoPagoConfig({ accessToken: 'TEST-114259758444895-021710-5c4f7dfa315699763de883b21e6e2f17-241379422' });

const preference = new Preference(client);

preference.create({
  body: {
    items: [
      {
        title: 'Mais Decisoes no app Arbitrio',
        quantity: 1,
        unit_price: 12.10
      }
    ],
  }
})
.then(console.log)
.catch(console.log);
