import EfiPay from 'sdk-node-apis-efi'
import options from './credentials.js'
let params = {
	id: 0,
}

let body = {
	settings: {
		message: 'MSG ARBITRIO',
		expire_at: '2025-03-01',
		request_delivery_address: false,
		payment_method: 'all',
	},
	items: [
		{
			name: 'Mais Decisoes',
			value: 1210,
			amount: 1,
		},
	],
}

const efipay = new EfiPay(options)
// https://github.com/efipay/sdk-node-apis-efi/blob/master/examples/charges/payment-link/createOneStepLink.js#L28
// O método createOneStepLink indica os campos que devem ser enviados e que serão retornados
efipay.createOneStepLink(params, body)
	.then((resposta) => {
		console.log(resposta) // Aqui você tera acesso a resposta da API e os campos retornados de forma intuitiva
	})
	.catch((error) => {
		console.log(error)
	})