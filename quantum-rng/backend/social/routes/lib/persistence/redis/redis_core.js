import Redis from 'ioredis';
import { RedisStore } from 'connect-redis';
import moment from 'moment';
import 'moment/locale/pt-br.js'; // Importa o idioma PT-BR

moment.locale('pt-br'); // Define o idioma

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

const getMissingTime = async(key) => {
  // Get the remaining TTL in seconds
  const ttlSeconds = await redisClient.ttl(key);

  if (ttlSeconds === -2) {
      console.log(`Key ${key} does not exist`);
      return null;
  } else if (ttlSeconds === -1) {
      console.log(`Key ${key} does not have an expiration time`);
      return null;
  } else {
      // Use moment to format the missing time
      const missingTime = moment.duration(ttlSeconds, 'seconds').humanize();
      return missingTime;
  }
}


export {redisClient, redisStore, getMissingTime};