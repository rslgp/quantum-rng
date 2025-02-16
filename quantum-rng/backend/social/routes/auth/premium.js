import {redisClient} from "../lib/persistence/redis/redis_core.js";
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
            exp: premium_exp_date
        }
    }
    return user;
  }
export {patchPremium}