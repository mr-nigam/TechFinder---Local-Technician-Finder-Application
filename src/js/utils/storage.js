// Local storage utilities
export class StorageManager {
    static setItem(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    }

    static getItem(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return null;
        }
    }

    static removeItem(key) {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error('Error removing from localStorage:', error);
        }
    }

    static clear() {
        try {
            localStorage.clear();
        } catch (error) {
            console.error('Error clearing localStorage:', error);
        }
    }
}

// Initialize data if not present
export function initializeData() {
    import('../data/mockData.js').then(({ technicians, reviews, bookings }) => {
        // Force refresh data with Indian context
        StorageManager.setItem('technicians', technicians);
        StorageManager.setItem('reviews', reviews);
        StorageManager.setItem('bookings', bookings);
    });
}