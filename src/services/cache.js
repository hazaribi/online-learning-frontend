// Simple cache service to prevent duplicate API calls
class CacheService {
  constructor() {
    this.cache = new Map();
    this.pendingRequests = new Map();
  }

  // Get cached data or make request
  async get(key, requestFn, ttl = 30000) {
    // Check cache first
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < ttl) {
      return cached.data;
    }

    // Check if request is already pending
    if (this.pendingRequests.has(key)) {
      return this.pendingRequests.get(key);
    }

    // Make new request
    const promise = requestFn().then(data => {
      this.cache.set(key, { data, timestamp: Date.now() });
      this.pendingRequests.delete(key);
      return data;
    }).catch(error => {
      this.pendingRequests.delete(key);
      throw error;
    });

    this.pendingRequests.set(key, promise);
    return promise;
  }

  // Clear cache for specific key
  clear(key) {
    this.cache.delete(key);
    this.pendingRequests.delete(key);
  }

  // Clear all cache
  clearAll() {
    this.cache.clear();
    this.pendingRequests.clear();
  }
}

export const cacheService = new CacheService();