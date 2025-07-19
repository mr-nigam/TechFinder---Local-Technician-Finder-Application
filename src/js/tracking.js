// Enhanced tracking page functionality with real-time ETA updates
import { TechFinderAPI } from './utils/api.js';
import { initializeData } from './utils/storage.js';

let currentBooking = null;
let trackingInterval = null;
let etaUpdateInterval = null;
let technicianLocation = { lat: 28.6139, lng: 77.2090 }; // Default Delhi location
let customerLocation = { lat: 28.6129, lng: 77.2295 }; // Customer location

document.addEventListener('DOMContentLoaded', function() {
    initializeData();
    loadBookingDetails();
    setupEventListeners();
    startTracking();
    startETAUpdates();
});

function setupEventListeners() {
    // Add any tracking-specific event listeners here
}

async function loadBookingDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const bookingId = urlParams.get('booking');

    if (!bookingId) {
        alert('No booking ID provided');
        window.location.href = 'services.html';
        return;
    }

    try {
        const bookings = await TechFinderAPI.getBookings();
        currentBooking = bookings.find(b => b.id === parseInt(bookingId));
        
        if (!currentBooking) {
            alert('Booking not found');
            window.location.href = 'services.html';
            return;
        }

        displayBookingDetails();
        displayTechnicianInfo();
        updateStatusTimeline();
        updateETA();
        initializeMap();
        
    } catch (error) {
        console.error('Error loading booking details:', error);
        alert('Error loading booking details');
    }
}

function displayBookingDetails() {
    const appointmentDetails = document.getElementById('appointmentDetails');
    if (!appointmentDetails || !currentBooking) return;

    const bookingDate = new Date(currentBooking.date).toLocaleDateString('en-IN');
    const bookingTime = currentBooking.time;

    appointmentDetails.innerHTML = `
        <div class="detail-item">
            <i class="fas fa-calendar-alt"></i>
            <span>${bookingDate}, ${bookingTime}</span>
        </div>
        <div class="detail-item">
            <i class="fas fa-wrench"></i>
            <span>${currentBooking.service || currentBooking.specificService}</span>
        </div>
        <div class="detail-item">
            <i class="fas fa-map-marker-alt"></i>
            <span>${currentBooking.address || currentBooking.serviceAddress}</span>
        </div>
        <div class="detail-item">
            <i class="fas fa-user"></i>
            <span>${currentBooking.customerName}</span>
        </div>
        <div class="detail-item">
            <i class="fas fa-rupee-sign"></i>
            <span>₹${currentBooking.price}</span>
        </div>
    `;
}

async function displayTechnicianInfo() {
    const technicianInfo = document.getElementById('technicianInfo');
    if (!technicianInfo || !currentBooking) return;

    try {
        const technician = await TechFinderAPI.getTechnicianById(currentBooking.technicianId);
        
        if (!technician) {
            technicianInfo.innerHTML = '<p>Technician information not available</p>';
            return;
        }

        const stars = '★'.repeat(Math.floor(technician.rating));

        technicianInfo.innerHTML = `
            <div class="technician-avatar">
                <img src="${technician.avatar}" alt="${technician.name}" onerror="this.src='https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'">
            </div>
            <div class="technician-details">
                <h4>${technician.name}</h4>
                <p>${technician.specialties.join(', ')}</p>
                <div class="rating">
                    <span class="stars">${stars}</span>
                    <span class="rating-text">${technician.rating}</span>
                </div>
                <div class="technician-contact-info">
                    <p><i class="fas fa-phone"></i> ${technician.phone}</p>
                    <p><i class="fas fa-map-marker-alt"></i> ${technician.location}</p>
                </div>
            </div>
        `;
        
    } catch (error) {
        console.error('Error loading technician info:', error);
        technicianInfo.innerHTML = '<p>Error loading technician information</p>';
    }
}

function updateStatusTimeline() {
    const statusTimeline = document.getElementById('statusTimeline');
    if (!statusTimeline || !currentBooking) return;

    const now = new Date();
    const bookingTime = new Date(`${currentBooking.date}T${currentBooking.time}`);
    const currentTime = now.toLocaleTimeString('en-IN', { 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: true 
    });

    // Determine current status based on time and booking status
    let currentStatus = 'confirmed';
    if (currentBooking.status === 'confirmed') {
        const minutesUntilBooking = (bookingTime - now) / (1000 * 60);
        if (minutesUntilBooking < 30) {
            currentStatus = 'dispatched';
        }
        if (minutesUntilBooking < 15) {
            currentStatus = 'en-route';
        }
        if (minutesUntilBooking < 5) {
            currentStatus = 'nearby';
        }
        if (minutesUntilBooking < 0) {
            currentStatus = 'arrived';
        }
    }

    const timelineSteps = [
        { 
            id: 'confirmed', 
            title: 'Appointment Confirmed', 
            description: 'Your appointment has been confirmed',
            time: '30 min ago'
        },
        { 
            id: 'dispatched', 
            title: 'Technician Dispatched', 
            description: 'Our technician is preparing to leave',
            time: '15 min ago'
        },
        { 
            id: 'en-route', 
            title: 'En Route', 
            description: 'Our technician is traveling to your location',
            time: '10 min ago'
        },
        { 
            id: 'nearby', 
            title: 'Nearby', 
            description: 'Our technician is very close to your location',
            time: '2 min ago'
        },
        { 
            id: 'arrived', 
            title: 'Arrived', 
            description: 'Our technician has arrived at your location',
            time: 'Now'
        }
    ];

    const timelineHTML = timelineSteps.map(step => {
        let className = 'timeline-item';
        const stepIndex = timelineSteps.findIndex(s => s.id === step.id);
        const currentIndex = timelineSteps.findIndex(s => s.id === currentStatus);
        
        if (step.id === currentStatus) {
            className += ' active';
        } else if (stepIndex < currentIndex) {
            className += ' completed';
        }

        return `
            <div class="${className}">
                <div class="timeline-marker"></div>
                <div class="timeline-content">
                    <h4>${step.title}</h4>
                    <p>${step.description}</p>
                    <span class="time">${step.time}</span>
                </div>
            </div>
        `;
    }).join('');

    statusTimeline.innerHTML = timelineHTML;
}

function updateETA() {
    const etaTime = document.getElementById('etaTime');
    const etaCountdown = document.getElementById('etaCountdown');
    
    if (!currentBooking) return;

    const bookingTime = new Date(`${currentBooking.date}T${currentBooking.time}`);
    const now = new Date();
    const minutesUntilBooking = Math.max(0, Math.ceil((bookingTime - now) / (1000 * 60)));

    // Calculate distance-based ETA
    const distance = calculateDistance(technicianLocation, customerLocation);
    const estimatedTravelTime = Math.ceil(distance * 2); // Assuming 2 minutes per km in traffic

    if (etaTime) {
        const etaTimeElement = etaTime.querySelector('.time');
        if (etaTimeElement) {
            if (minutesUntilBooking <= 0) {
                etaTimeElement.textContent = 'Arrived';
            } else {
                const etaDate = new Date(now.getTime() + estimatedTravelTime * 60000);
                etaTimeElement.textContent = etaDate.toLocaleTimeString('en-IN', { 
                    hour: '2-digit', 
                    minute: '2-digit', 
                    hour12: true 
                });
            }
        }
    }

    if (etaCountdown) {
        const countdownElement = etaCountdown.querySelector('.countdown');
        const labelElement = etaCountdown.querySelector('.label');
        
        if (countdownElement && labelElement) {
            if (minutesUntilBooking === 0) {
                countdownElement.textContent = 'Arriving now';
                labelElement.textContent = '';
            } else if (estimatedTravelTime < 60) {
                countdownElement.textContent = `${estimatedTravelTime} minutes`;
                labelElement.textContent = 'away';
            } else {
                const hours = Math.floor(estimatedTravelTime / 60);
                const minutes = estimatedTravelTime % 60;
                countdownElement.textContent = `${hours}h ${minutes}m`;
                labelElement.textContent = 'away';
            }
        }
    }

    // Update distance and speed info
    updateETADetails(distance, estimatedTravelTime);
}

function updateETADetails(distance, travelTime) {
    const etaDetails = document.querySelector('.eta-details');
    if (etaDetails) {
        etaDetails.innerHTML = `
            <div class="detail">
                <i class="fas fa-route"></i>
                <span>${distance.toFixed(1)} km away</span>
            </div>
            <div class="detail">
                <i class="fas fa-clock"></i>
                <span>${travelTime < 5 ? 'Arriving soon' : 'On schedule'}</span>
            </div>
            <div class="detail">
                <i class="fas fa-tachometer-alt"></i>
                <span>${Math.round(30 + Math.random() * 20)} km/h</span>
            </div>
        `;
    }
}

function calculateDistance(pos1, pos2) {
    // Simple distance calculation (Haversine formula simplified)
    const R = 6371; // Earth's radius in km
    const dLat = (pos2.lat - pos1.lat) * Math.PI / 180;
    const dLng = (pos2.lng - pos1.lng) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(pos1.lat * Math.PI / 180) * Math.cos(pos2.lat * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

function initializeMap() {
    const mapContainer = document.getElementById('mapContainer');
    if (!mapContainer) return;

    // Create a more realistic map simulation
    mapContainer.innerHTML = `
        <div class="map-simulation">
            <div class="map-header">
                <h4>Live Tracking</h4>
                <span class="live-indicator">● LIVE</span>
            </div>
            <div class="map-content">
                <div class="route-info">
                    <div class="location-marker technician-marker">
                        <i class="fas fa-user-cog"></i>
                        <span>Technician</span>
                    </div>
                    <div class="route-line"></div>
                    <div class="location-marker customer-marker">
                        <i class="fas fa-home"></i>
                        <span>Your Location</span>
                    </div>
                </div>
                <div class="map-stats">
                    <div class="stat">
                        <span class="stat-label">Distance</span>
                        <span class="stat-value" id="liveDistance">2.3 km</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">ETA</span>
                        <span class="stat-value" id="liveETA">8 min</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function startTracking() {
    // Update tracking info every 30 seconds
    trackingInterval = setInterval(() => {
        updateStatusTimeline();
        updateMap();
        simulateTechnicianMovement();
    }, 30000);
}

function startETAUpdates() {
    // Update ETA every 10 seconds for more real-time feel
    etaUpdateInterval = setInterval(() => {
        updateETA();
        updateLiveMapStats();
    }, 10000);
}

function simulateTechnicianMovement() {
    // Simulate technician moving closer to customer
    const distance = calculateDistance(technicianLocation, customerLocation);
    if (distance > 0.1) { // If more than 100m away
        const moveStep = 0.001; // Small movement step
        technicianLocation.lat += (customerLocation.lat - technicianLocation.lat) * moveStep;
        technicianLocation.lng += (customerLocation.lng - technicianLocation.lng) * moveStep;
    }
}

function updateLiveMapStats() {
    const distance = calculateDistance(technicianLocation, customerLocation);
    const eta = Math.ceil(distance * 2); // 2 minutes per km
    
    const liveDistance = document.getElementById('liveDistance');
    const liveETA = document.getElementById('liveETA');
    
    if (liveDistance) {
        liveDistance.textContent = `${distance.toFixed(1)} km`;
    }
    
    if (liveETA) {
        if (eta < 1) {
            liveETA.textContent = 'Arriving';
        } else {
            liveETA.textContent = `${eta} min`;
        }
    }
}

function updateMap() {
    // Update map with current technician position
    const routeLine = document.querySelector('.route-line');
    if (routeLine) {
        const distance = calculateDistance(technicianLocation, customerLocation);
        const progress = Math.max(0, Math.min(100, (5 - distance) / 5 * 100));
        routeLine.style.background = `linear-gradient(to right, #16a34a ${progress}%, #e5e7eb ${progress}%)`;
    }
}

window.callTechnician = function() {
    if (currentBooking) {
        // This would integrate with the technician's phone number
        alert('Calling technician...');
    }
};

window.messageTechnician = function() {
    if (currentBooking) {
        // This would open a messaging interface
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close" onclick="this.parentElement.parentElement.remove()">&times;</span>
                <h3>Message Technician</h3>
                <div class="chat-messages" style="height: 200px; overflow-y: auto; border: 1px solid #e5e7eb; padding: 10px; margin: 15px 0;">
                    <div class="message">
                        <strong>Technician:</strong> I'm on my way to your location. Will be there in 8 minutes.
                    </div>
                </div>
                <div style="display: flex; gap: 10px;">
                    <input type="text" placeholder="Type your message..." style="flex: 1; padding: 10px; border: 1px solid #e5e7eb; border-radius: 4px;">
                    <button style="padding: 10px 20px; background: #2563eb; color: white; border: none; border-radius: 4px;">Send</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        modal.style.display = 'block';
    }
};

// Cleanup on page unload
window.addEventListener('beforeunload', function() {
    if (trackingInterval) {
        clearInterval(trackingInterval);
    }
    if (etaUpdateInterval) {
        clearInterval(etaUpdateInterval);
    }
});