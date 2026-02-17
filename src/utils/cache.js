import redis from 'redis';

class CacheService {
  constructor() {
    this.client = null;
    this.isConnected = false;
  }

  async connect() {
    this.client = redis.createClient({
      socket: {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379
      }
    });

    this.client.on('connect', () => {
      console.log('✅ Redis connected');
      this.isConnected = true;
    });

    this.client.on('error', (err) => {
      console.error('❌ Redis error:', err);
      this.isConnected = false;
    });

    await this.client.connect();
    return this;
  }

  async get(key) {
    try {
      const data = await this.client.get(key);
      return data ? JSON.parse(data) : null;
    } catch (err) {
      console.error('Cache GET error:', err);
      return null;
    }
  }

  async set(key, value, ttlSeconds = 3600) {
    try {
      await this.client.setEx(key, ttlSeconds, JSON.stringify(value));
      return true;
    } catch (err) {
      console.error('Cache SET error:', err);
      return false;
    }
  }

  async delete(key) {
    try {
      await this.client.del(key);
      return true;
    } catch (err) {
      console.error('Cache DELETE error:', err);
      return false;
    }
  }

  // Get remaining TTL for a key (in seconds)
  async getTTL(key) {
    try {
      return await this.client.ttl(key);
    } catch (err) {
      console.error('Cache TTL error:', err);
      return -1;
    }
  }

  // Check if key exists
  async exists(key) {
    try {
      const result = await this.client.exists(key);
      return result === 1;
    } catch (err) {
      console.error('Cache EXISTS error:', err);
      return false;
    }
  }

  // Flush ALL cache (careful in production!)
  async flush() {
    try {
      await this.client.flushAll();
      return true;
    } catch (err) {
      console.error('Cache FLUSH error:', err);
      return false;
    }
  }

  async disconnect() {
    await this.client.quit();
  }
}

export default new CacheService();