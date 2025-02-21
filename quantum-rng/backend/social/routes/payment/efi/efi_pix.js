import QRCode from 'qrcode';
import EfiPay from 'sdk-node-apis-efi'
import options from './credentials.js'
import product_list from '../products.js';

const MAP_txid_userid = new Map();
// 1.19% per pix (same as stripe) (asaas eh para valores altos R$ 2.00 por transacao)

let body = {
	calendario: {
		expiracao: 3600,
	},
	valor: {
		original: '0.01', // 0.01 a 10.00 testa/simula sozinho pagamento com sucesso 
	},
	chave: options.chave_pix, // Informe sua chave Pix cadastrada na efipay.	
}
// console.log(options);
// console.log({ options });
const efipay = new EfiPay(options)

// O método pixCreateImmediateCharge indica os campos que devem ser enviados e que serão retornados
// enable API pix, alterar cobranca (cob.write)
// efipay.pixCreateImmediateCharge({}, body)
// 	.then((resposta) => {
// 		console.log(resposta) // Aqui você tera acesso a resposta da API e os campos retornados de forma intuitiva
// 		// eh gerado um txid (o webhook recebe essa info), que eu preciso associar com userId internamente
// 		// loc.id eh usado para gerar o QRCode img
// 		const { txid, loc, pixCopiaECola } = resposta;
// 		console.log(txid, loc.id, pixCopiaECola);
// 	})
// 	.catch((error) => {
// 		console.log(error)
// 	})

// Consultar Payloads (payloadlocation.read)
// efipay.pixGenerateQRCode({id:1})
// 		.then((resposta) => {
// 			console.log(resposta) // Aqui você tera acesso a resposta da API e os campos retornados de forma intuitiva
// 		})
// 		.catch((error) => {
// 			console.log(error)
// 		})	

// import QRCode from 'qrcode';

// const pixString = "00020101021226850014BR.GOV.BCB.PIX2563qrcodespix-h.sejaefi.com.br/v2/d9888f626cbc4927a0072b4c731fa5925204000053039865802BR5905EFISA6008SAOPAULO62070503***63045F32";

// // Generate QR code and display in console
// QRCode.toString(pixString, { type: 'terminal' }, (err, url) => {
//     if (err) console.error(err);
//     console.log(url);
// });

// // Generate QR code as an image
// QRCode.toFile('pix_qrcode.png', pixString, (err) => {
//     if (err) throw err;
//     console.log('QR Code saved as pix_qrcode.png');
// });


const checkout_pix = async (userId, args = {}) => {
	const { product='mais_decisoes', amount=1 } = args;
	const preco = ((product_list[product].price * amount) / 100).toFixed(2).toString();
	
	let body = {
		calendario: {
			expiracao: 3600,
		},
		valor: {
			original: preco, // '0.01' a 10.00 testa/simula sozinho pagamento com sucesso 
		},
		chave: options.chave_pix, // Informe sua chave Pix cadastrada na efipay.	
	}
	const pix_info = await efipay.pixCreateImmediateCharge({},body);
	const { txid, pixCopiaECola } = pix_info;
	// associate txid com userId
	MAP_txid_userid.set(txid,{userId,product});
	// deal security flaw no header secret for webhook
	// create uma env secretWebhookEfiPix
	const qrCodeBase64 = await QRCode.toDataURL(pixCopiaECola);

	// const pix_img = await efipay.pixGenerateQRCode({id:loc.id});
	const response = {
		qrCodeBase64, //: pix_img.imagemQrcode,
		txid,
		pixCopiaECola,
		// qrCodeLink: pix_img.linkVisualizacao // shows my address
	}
	return response;
}

export default checkout_pix;
export {MAP_txid_userid};
// console.log(await checkout_pix('USER_ID'));