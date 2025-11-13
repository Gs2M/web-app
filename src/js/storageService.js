// storageService.js
const StorageService = {
  // Save a value
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },

  // Get a value
  get(key) {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  },

  // Remove a value
  remove(key) {
    localStorage.removeItem(key);
  },

  // Clear all storage
  clear() {
    localStorage.clear();
  }
};

export default StorageService;
