import { patchPremium } from "../auth/premium.js";
import { redisClient } from "../lib/persistence/redis/redis_core.js";

async function adaptChat(req, res, next) {
    // user receive a msg on telegram or whatsapp, with their code /user/setup_chat?telegram=chatid
    const { telegram } = req.query;
    if (telegram) {
        const key_telegram = `telegram:${telegram}`; // returns userid
        let userId = await redisClient.get(key_telegram);
        if (userId) { 
            req.user = {
                id: userId,
                name: `telegram_user_${telegram}`
            }
            req.user = await patchPremium(req.user);
            console.log("adaptChat", req.user);

        }else{
            // user dont config telegram, free usage
            console.log("ANOM TELEGRAM USER");
            req.headers['x-real-ip'] = telegram; // gambiarra (substituir ip do telegram pelo chat_id)
            //return res.status(400).json({message:"invalid telegram"}); // no telegram config;

        }
    }
    return next();
}

export default adaptChat;