import {redisClient, getMissingTime} from "../lib/persistence/redis/redis_core.js";

const RATE_LIMIT_GLOBAL = 5; // Max requests allowed
const RATE_LIMIT_USER = RATE_LIMIT_GLOBAL + 3; // Max requests allowed
const RATE_LIMIT_PREMIUM = RATE_LIMIT_GLOBAL + 10; // Max requests allowed

const KEY_RATE_LIMIT = `rate-limit:`;


const WINDOW_TIME_GLOBAL = 8 * 3600; // Time window in seconds (1 hour)

async function rateLimiter(req, res, next) {
    let userId = req.headers['x-real-ip'] || req.ip || 'anom'; //default use ip, config express to use req.ip (app.set('trust proxy', true);), other options req.headers['x-forwarded-for']?.join(',')[0]
    console.log(userId);
    let RATE_LIMIT = RATE_LIMIT_GLOBAL;
    let WINDOW_TIME = WINDOW_TIME_GLOBAL;

    if (req.user) {
        if(req.user.id==='118176977539918205863') next(); //me rafaelleao user
        RATE_LIMIT = RATE_LIMIT_USER;
        // check if premium on redis
        userId = req.user.id; // Get unique user ID from Passport
        console.log("user",userId);

        if(req.user.isPremium){
            RATE_LIMIT = RATE_LIMIT_PREMIUM;
            WINDOW_TIME = req.user.premium.exp;
        }
    }

    const key = `${KEY_RATE_LIMIT}${userId}`;

    let requestCount = await redisClient.get(key);

    if (!requestCount) {
        await redisClient.setex(key, WINDOW_TIME, 1); // Set key with expiry
        return next();
    }

    requestCount = parseInt(requestCount);
    
    if (requestCount >= RATE_LIMIT) {
        
        return res.status(429).json({ error: "Too many requests. Try again later.", missingTime: await getMissingTime(key) });
    }

    const usage = await redisClient.incr(key); // Increment the request count
    
    if(req.user) req.user.usage = usage;
    req.usage = usage;
    next();
}

const paySomeLimit = async (userId, limit_amount) => {
    const key = `${KEY_RATE_LIMIT}${userId}`;
    await redisClient.decrby(key, limit_amount); // Decrement by N in one command

    let requestCount = await redisClient.get(key);
    return requestCount;
}

export default rateLimiter;
export {rateLimiter, paySomeLimit}