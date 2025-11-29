const Redis = require('ioredis');
const { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } = process.env;

const redis = new Redis({
  host: REDIS_HOST || '127.0.0.1',
  port: REDIS_PORT ? parseInt(REDIS_PORT, 10) : 6379,
  password: REDIS_PASSWORD || undefined,
  lazyConnect: false
});

redis.on('error', (err) => {
  console.error('Redis error', err);
});

module.exports = redis;
