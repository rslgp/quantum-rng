import Router from "express";
import { checkout_session } from "./stripe/stripe_premade.js";

const paymentRouter = Router();

paymentRouter.get('/stripe/checkout', async (req, res) => {
    const userId = req.user.id;
    const sessionId = await checkout_session(userId);
    res.status(200).send({sessionId});
});

export default paymentRouter;