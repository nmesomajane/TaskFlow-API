import cacheService from '../utils/cache.js';

const cacheMiddleware = (duration = 3600) => {
  return async (req, res, next) => {

    if (req.method !== 'GET') {
      return next();
    }

    const key = `api:${req.originalUrl}`;

    try {

      const cachedResponse = await cacheService.get(key);

      if (cachedResponse) {
        console.log('Serving from cache');
        return res.json(cachedResponse);
      }

      // store original json
      const originalJson = res.json.bind(res);

      res.json = (body) => {

        cacheService
          .set(key, body, duration)
          .catch(err => console.error(err));

        return originalJson(body);
      };

      next();

    } catch (err) {

      console.error(err);
      next();

    }

  };
};

export default cacheMiddleware;
