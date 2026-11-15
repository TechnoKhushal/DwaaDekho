import { createClient } from 'redis';

let redisClient: any;

// Create Redis client
export const createRedis = () => {
  if (!redisClient) {
    redisClient = createClient({
      // Redis URL from environment
      url: process.env.REDIS_URL || 'redis://localhost:6379',
    });

    redisClient.connect().catch(console.error);
  }

  return redisClient;
};

// Redis rate limiter store export
export const getRedisStore = () => {
  const RedisStore = require('rate-limit-redis').RedisStore;
  return new RedisStore({
    client: createRedis(),
    prefix: 'dwaadekho:rl:',
  });
};

// Health check
export async function redisHealth(): Promise<boolean> {
  try {
    const client = createRedis();
    await client.ping();
    return true;
  } catch {
    return false;
  }
}

export default createRedis;