import { MAP_txid_userid } from './efi_pix.js';
import { createPremium } from '../../auth/premium.js';
import { sendEvent } from '../../events/event_core.js';

const setupWebhookEfiPix = (app) => {
    app.post('/webhook/efi/', async (req, res) => { // used on config
        console.log(req.body);
        res.sendStatus(200);
    });
    app.post('/webhook/efi/pix', async (req, res) => {
        const ip = req.headers['x-real-ip'] || req.ip;
        if (ip !== '34.193.116.226') {
            res.sendStatus(401);
        }
        const { pix } = req.body;
        // pix payment
        console.log(pix);
        for (const pix_info of pix) {
            const { userId, product } = MAP_txid_userid.get(pix_info.txid);

            console.log("NEW PREMIUM PIX " + userId);
            await createPremium(userId);
            // TODO on front sendEvent(userId, 'NEW_PREMIUM');
        }
    });
}
export default setupWebhookEfiPix;