import EfiPay from 'sdk-node-apis-efi'
import options from './credentials.js'

let params = {
	txid: '7c02e39985294838a604bce4dd2730a9',
}

const efipay = new EfiPay(options)

// configuracoes > api pix > consultar cobrancas
// O método pixDetailCharge indica os campos que devem ser enviados e que serão retornados
efipay.pixDetailCharge(params)
	.then((resposta) => {
		console.log(resposta) // Aqui você tera acesso a resposta da API e os campos retornados de forma intuitiva
	})
	.catch((error) => {
		console.log(error)
	})