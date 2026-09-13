const cache = new Map();
const DEFAULT_TTL = Number(process.env.CACHE_TTL) || 5 * 60 * 1000;

// ---------------------------------------// GET CACHE// ---------------------------------------
export const getCache = (key) => {
    const item =cache.get(key);
    if (!item) {
        return null;
    }
    // Cache expired
    if (Date.now() >item.expiresAt) {
        cache.delete(key);
        return null;
    }
    return item.value;
};


// ---------------------------------------// SET CACHE// ---------------------------------------
export const setCache = (key,value,ttl = DEFAULT_TTL) => {
    cache.set(
        key,
        {
            value,
            expiresAt:
                Date.now() + ttl
        }
    );
};


// ---------------------------------------// CLEAR CACHE// ---------------------------------------
export const clearCache = () => {
    cache.clear();

};