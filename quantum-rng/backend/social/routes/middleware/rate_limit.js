import {redisClient, getMissingTime} from "../lib/persistence/redis/redis_core.js";
import {getUserId} from "../lib/userId/userId_util.js";

const RATE_LIMIT_GLOBAL = 5; // Max requests allowed
const RATE_LIMIT_USER = RATE_LIMIT_GLOBAL + 3; // Max requests allowed
const RATE_LIMIT_PREMIUM = RATE_LIMIT_GLOBAL + 10; // Max requests allowed

const KEY_RATE_LIMIT = `rate-limit:`;


const WINDOW_TIME_GLOBAL = 2 * 3600; // Time window to reset limit in seconds (1 hour)

async function rateLimiter(req, res, next) {
    let userId = getUserId(req); //default use ip, config express to use req.ip (app.set('trust proxy', true);), other options req.headers['x-forwarded-for']?.join(',')[0]
    
    console.log(userId);
    let RATE_LIMIT = RATE_LIMIT_GLOBAL;
    let WINDOW_TIME = WINDOW_TIME_GLOBAL;

    if (req.user) {
        // if(req.user.id==='118176977539918205863') return next(); //me rafaelleao user;
        RATE_LIMIT = RATE_LIMIT_USER;
        // check if premium on redis
        userId = req.user.id; // Get unique user ID from Passport
        console.log("user",userId);

        if(req.user.isPremium){
            RATE_LIMIT = RATE_LIMIT_PREMIUM;
            WINDOW_TIME = WINDOW_TIME * .5; // half time to reset
        }
    }

    const key = `${KEY_RATE_LIMIT}${userId}`;

    let requestCount = await redisClient.get(key);

    if (!requestCount) {
        await redisClient.setex(key, WINDOW_TIME, 1); // Set key with expiry
        return next();
    }

    requestCount = parseInt(requestCount);
    console.log(key,requestCount,RATE_LIMIT);
    
    if (requestCount >= RATE_LIMIT) {
        return res.status(429).json({ error: "Too many requests. Try again later.", missingTime: await getMissingTime(key) });
    }

    const usage = await redisClient.incr(key); // Increment the request count
    
    if(req.user) req.user.usage = usage;
    req.usage = usage;
    return next();
}

const paySomeLimit = async (userId, limit_amount) => {
    const key = `${KEY_RATE_LIMIT}${userId}`;
    await redisClient.decrby(key, limit_amount); // Decrement by N in one command

    let requestCount = await redisClient.get(key);
    console.log(key,requestCount);
    return requestCount;
}

export default rateLimiter;
export {rateLimiter, paySomeLimit}