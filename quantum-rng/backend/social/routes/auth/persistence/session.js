
import session from 'express-session';
import Redis from 'ioredis';
import { RedisStore } from 'connect-redis';

// Create a Redis client using ioredis
const redisClient = new Redis({
  host: process.env.REDIS_HOST || 'localhost', // Redis server host
  port: process.env.REDIS_PORT || 6379,        // Redis server port
  password: process.env.REDIS_PASSWORD || null,
});
redisClient.on("error", (err) => console.error("Redis Error:", err));

// Configure Redis store
const redisStore = new RedisStore({
  client: redisClient,
  prefix: process.env.REDIT_PREFIX || 'arbitrio:', // Optional: Add a prefix to all keys in Redis
});

const persist_session = session({
  store: redisStore,
  secret: process.env.SESSION_SECRET, // Replace with a strong secret key
  resave: false, // Don't save session if unmodified
  saveUninitialized: false, // Don't create session until something is stored
  cookie: {
    secure: false, // Set to true if using HTTPS
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24, // Session expiration time (e.g., 1 day)
  },
});

// session({ // no persistence
//   secret: process.env.SESSION_SECRET,
//   resave: false,
//   saveUninitialized: true,
// });

const RATE_LIMIT = 3; // Max requests allowed
const WINDOW_TIME = 3600; // Time window in seconds (1 hour)

async function rateLimiter(req, res, next) {
    if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const userId = req.user.id; // Get unique user ID from Passport
    const key = `rate-limit:${userId}`;

    let requestCount = await redisClient.get(key);

    if (!requestCount) {
        await redisClient.setex(key, WINDOW_TIME, 1); // Set key with expiry
        return next();
    }

    requestCount = parseInt(requestCount);

    if (requestCount >= RATE_LIMIT) {
        return res.status(429).json({ error: "Too many requests. Try again later." });
    }

    await redisClient.incr(key); // Increment the request count
    next();
}


export {persist_session, rateLimiter};
