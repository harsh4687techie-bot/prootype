import { redisClient } from '../app.js';

export default function cache(ttlSeconds) {
  return async (req, res, next) => {
    const key = `cache:${req.originalUrl}`;
    try {
      if (redisClient.isOpen) {
        const cached = await redisClient.get(key);
        if (cached) {
          return res.status(200).json(JSON.parse(cached));
        }
      }
    } catch (err) {
      console.warn('Redis cache miss error', err);
    }

    const originalSend = res.json.bind(res);
    res.json = (body) => {
      if (res.statusCode === 200 && redisClient.isOpen) {
        redisClient.setEx(key, ttlSeconds, JSON.stringify(body)).catch(() => {});
      }
      return originalSend(body);
    };
    next();
  };
}
