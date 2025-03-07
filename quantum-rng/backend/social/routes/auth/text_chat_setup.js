import { redisClient } from "../lib/persistence/redis/redis_core.js";
import { isAuthRoute } from "./auth_core.js";

const dep_injection_telegram = (router) => {
    router.get('/user/setup_chat', isAuthRoute, async (req, res) => {
        const { telegram } = req.query;
        if (telegram) {
            const key_telegram = `telegram:${telegram}`; // returns userid

            await redisClient.set(key_telegram, req.user.id);
        }

        //res.json(true);

        res.redirect(`/backend/dashboard`);
    });
}

export default dep_injection_telegram;