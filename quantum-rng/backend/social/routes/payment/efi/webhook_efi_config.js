import EfiPay from 'sdk-node-apis-efi'
import options from './credentials.js'

options['validateMtls'] = false

let body = {
	webhookUrl: 'https://pwim9iyoywpv.share.zrok.io/webhook/mercadopago',
}

let params = {
	chave: options.chave_pix,
}

const efipay = new EfiPay(options)
// webhook.write alterar webhook
efipay.pixConfigWebhook(params, body)
	.then((resposta) => {
		console.log(resposta)
	})
	.catch((error) => {
		console.log(error)
	})