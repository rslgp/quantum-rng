import Router from "express";
import { checkout_session } from "./stripe/stripe_premade.js";
import checkout_pix from "./efi/efi_pix.js";

const paymentRouter = Router();

paymentRouter.get('/stripe/checkout', async (req, res) => {
    const userId = req.user.id;
    const sessionId = await checkout_session(userId, req.query);
    res.status(200).send({sessionId});
});

paymentRouter.get('/efi/checkout', async (req, res) => {
    const userId = req.user.id;
    const pix_data = await checkout_pix(userId, req.query);
    res.status(200).send({pix_data});
});

export default paymentRouter;