import EfiPay from 'sdk-node-apis-efi'
import options from './credentials.js'

// 1.19% per pix (same as stripe)

let body = {
	calendario: {
		expiracao: 3600,
	},
	devedor: {
		nome: 'USER_ID',
		cpf: '06891530407',
	},
	valor: {
		original: '12.10',
	},
	chave: '72da8d9a-955a-4198-9e5a-86c89d0cd67b', // Informe sua chave Pix cadastrada na efipay.	
}
console.log(options);
console.log({options});
const efipay = new EfiPay(options)

// O método pixCreateImmediateCharge indica os campos que devem ser enviados e que serão retornados
// enable API pix, alterar cobranca (cob.write)
// efipay.pixCreateImmediateCharge({}, body)
// 	.then((resposta) => {
// 		console.log(resposta) // Aqui você tera acesso a resposta da API e os campos retornados de forma intuitiva
		
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
