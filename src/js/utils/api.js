// Mock API functions
import { StorageManager } from './storage.js';

export class TechFinderAPI {
    static async getTechnicians(filters = {}) {
        const technicians = StorageManager.getItem('technicians') || [];
        let filtered = [...technicians];

        // Apply filters
        if (filters.category) {
            filtered = filtered.filter(tech => tech.category === filters.category);
        }
        if (filters.rating) {
            filtered = filtered.filter(tech => tech.rating >= parseFloat(filters.rating));
        }
        if (filters.availability) {
            filtered = filtered.filter(tech => {
                if (filters.availability === 'today') return tech.availability.today;
                if (filters.availability === 'tomorrow') return tech.availability.tomorrow;
                if (filters.availability === 'week') return tech.availability.week;
                return true;
            });
        }
        if (filters.location) {
            filtered = filtered.filter(tech => 
                tech.location.toLowerCase().includes(filters.location.toLowerCase())
            );
        }

        // Sort by distance by default
        filtered.sort((a, b) => a.distance - b.distance);

        return filtered;
    }

    static async getTechnicianById(id) {
        const technicians = StorageManager.getItem('technicians') || [];
        return technicians.find(tech => tech.id === parseInt(id));
    }

    static async getReviewsByTechnicianId(technicianId) {
        const reviews = StorageManager.getItem('reviews') || [];
        return reviews.filter(review => review.technicianId === parseInt(technicianId));
    }

    static async createBooking(bookingData) {
        const bookings = StorageManager.getItem('bookings') || [];
        const newBooking = {
            ...bookingData,
            id: Date.now(),
            status: 'pending',
            createdAt: new Date().toISOString()
        };
        bookings.push(newBooking);
        StorageManager.setItem('bookings', bookings);
        return newBooking;
    }

    static async getBookings() {
        return StorageManager.getItem('bookings') || [];
    }

    static async updateBookingStatus(bookingId, status) {
        const bookings = StorageManager.getItem('bookings') || [];
        const booking = bookings.find(b => b.id === bookingId);
        if (booking) {
            booking.status = status;
            StorageManager.setItem('bookings', bookings);
        }
        return booking;
    }

    static async addReview(reviewData) {
        const reviews = StorageManager.getItem('reviews') || [];
        const newReview = {
            ...reviewData,
            id: Date.now(),
            date: new Date().toISOString().split('T')[0]
        };
        reviews.push(newReview);
        StorageManager.setItem('reviews', reviews);
        return newReview;
    }

    static async createTechnician(technicianData) {
        const technicians = StorageManager.getItem('technicians') || [];
        const newTechnician = {
            ...technicianData,
            id: Date.now(),
            rating: 0,
            reviews: 0,
            available: true,
            photos: [],
            services: [],
            availability: {
                today: true,
                tomorrow: true,
                week: true
            }
        };
        technicians.push(newTechnician);
        StorageManager.setItem('technicians', technicians);
        return newTechnician;
    }

    static async updateTechnician(id, updates) {
        const technicians = StorageManager.getItem('technicians') || [];
        const technicianIndex = technicians.findIndex(tech => tech.id === parseInt(id));
        if (technicianIndex !== -1) {
            technicians[technicianIndex] = { ...technicians[technicianIndex], ...updates };
            StorageManager.setItem('technicians', technicians);
            return technicians[technicianIndex];
        }
        return null;
    }

    static async deleteTechnician(id) {
        const technicians = StorageManager.getItem('technicians') || [];
        const filtered = technicians.filter(tech => tech.id !== parseInt(id));
        StorageManager.setItem('technicians', filtered);
        return true;
    }

    static async getAvailableTimeSlots(technicianId, date) {
        // Mock available time slots
        const slots = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];
        const bookings = StorageManager.getItem('bookings') || [];
        const bookedSlots = bookings
            .filter(booking => booking.technicianId === parseInt(technicianId) && booking.date === date)
            .map(booking => booking.time);
        
        return slots.filter(slot => !bookedSlots.includes(slot));
    }
}