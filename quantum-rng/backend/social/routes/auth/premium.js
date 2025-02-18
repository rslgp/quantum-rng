import {redisClient, getMissingTime} from "../lib/persistence/redis/redis_core.js";
const patchPremium = async (user) => {
    const key_premium = `premium:${user.id}`;
    const premium_exp_date = await redisClient.get(key_premium);
    // user.customData = {
    //   isPremium: isPremium ? true : false,
    //   teste:`ola`,
    // }
    
    user.isPremium = premium_exp_date ? true : false;
    if(user.isPremium){
        user.premium = {
            resta: await getMissingTime(key_premium)
        }
    }
    return user;
}

const WINDOW_TIME = 30 * 24 * 3600;
const createPremium = async (userId) => {
    const key_premium = `premium:${userId}`;
    await redisClient.setex(key_premium, WINDOW_TIME, 1); // Set key with expiry
}
export {patchPremium, createPremium}