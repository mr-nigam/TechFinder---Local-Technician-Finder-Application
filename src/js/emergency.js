// Emergency services page functionality
import { TechFinderAPI } from './utils/api.js';
import { initializeData } from './utils/storage.js';

document.addEventListener('DOMContentLoaded', function() {
    initializeData();
    setupEventListeners();
    setupGeolocation();
});

function setupEventListeners() {
    const form = document.getElementById('emergencyForm');
    if (form) {
        form.addEventListener('submit', handleEmergencySubmit);
    }

    const locationBtn = document.querySelector('.location-btn');
    if (locationBtn) {
        locationBtn.addEventListener('click', getCurrentLocation);
    }
}

function setupGeolocation() {
    // Check if geolocation is available
    if (!navigator.geolocation) {
        const locationBtn = document.querySelector('.location-btn');
        if (locationBtn) {
            locationBtn.style.display = 'none';
        }
    }
}

window.getCurrentLocation = function() {
    const locationInput = document.getElementById('emergencyLocation');
    const locationBtn = document.querySelector('.location-btn');
    
    if (!navigator.geolocation) {
        alert('Geolocation is not supported by this browser.');
        return;
    }

    // Show loading state
    if (locationBtn) {
        locationBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Getting Location...';
        locationBtn.disabled = true;
    }

    navigator.geolocation.getCurrentPosition(
        function(position) {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            
            // In a real app, this would use a geocoding service
            // For demo purposes, we'll use a mock address
            const mockAddress = `${lat.toFixed(4)}, ${lon.toFixed(4)} (Current Location)`;
            
            if (locationInput) {
                locationInput.value = mockAddress;
            }
            
            // Reset button
            if (locationBtn) {
                locationBtn.innerHTML = '<i class="fas fa-location-arrow"></i> Use Current Location';
                locationBtn.disabled = false;
            }
        },
        function(error) {
            console.error('Geolocation error:', error);
            alert('Unable to retrieve your location. Please enter your address manually.');
            
            // Reset button
            if (locationBtn) {
                locationBtn.innerHTML = '<i class="fas fa-location-arrow"></i> Use Current Location';
                locationBtn.disabled = false;
            }
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000
        }
    );
};

async function handleEmergencySubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const priority = formData.get('priority');
    
    if (!priority) {
        alert('Please select a priority level');
        return;
    }

    const emergencyData = {
        type: formData.get('emergencyType'),
        description: formData.get('emergencyDescription'),
        location: formData.get('emergencyLocation'),
        contactName: formData.get('contactName'),
        contactPhone: formData.get('contactPhone'),
        accessInstructions: formData.get('accessInstructions'),
        priority: priority,
        timestamp: new Date().toISOString(),
        status: 'dispatching'
    };

    try {
        // Create emergency booking
        const emergencyBooking = await TechFinderAPI.createBooking({
            ...emergencyData,
            serviceCategory: 'emergency',
            specificService: emergencyData.type,
            appointmentDate: new Date().toISOString().split('T')[0],
            appointmentTime: new Date().toLocaleTimeString('en-US', { 
                hour12: false, 
                hour: '2-digit', 
                minute: '2-digit' 
            }),
            customerName: emergencyData.contactName,
            customerPhone: emergencyData.contactPhone,
            customerEmail: 'emergency@techfinder.com',
            serviceAddress: emergencyData.location,
            price: priority === 'critical' ? 150 : 100
        });

        // Show success message
        showEmergencyConfirmation(emergencyBooking);
        
        // In a real app, this would trigger immediate dispatch
        simulateEmergencyDispatch(emergencyBooking);
        
    } catch (error) {
        console.error('Error submitting emergency request:', error);
        alert('Error submitting emergency request. Please try calling our emergency hotline.');
    }
}

function showEmergencyConfirmation(booking) {
    const confirmation = document.createElement('div');
    confirmation.className = 'emergency-confirmation';
    confirmation.innerHTML = `
        <div class="confirmation-content">
            <div class="confirmation-header">
                <i class="fas fa-check-circle"></i>
                <h2>Emergency Request Submitted</h2>
            </div>
            <div class="confirmation-details">
                <p><strong>Request ID:</strong> EMG-${booking.id}</p>
                <p><strong>Priority:</strong> ${booking.priority.toUpperCase()}</p>
                <p><strong>Status:</strong> Dispatching technician</p>
                <p><strong>Estimated Response:</strong> 15-20 minutes</p>
            </div>
            <div class="confirmation-actions">
                <button onclick="window.location.href='tracking.html?booking=${booking.id}'" class="btn btn-primary">
                    <i class="fas fa-map-marker-alt"></i> Track Technician
                </button>
                <button onclick="this.parentElement.parentElement.parentElement.remove()" class="btn btn-secondary">
                    Close
                </button>
            </div>
        </div>
    `;

    // Add styles
    const styles = `
        .emergency-confirmation {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
        }
        .confirmation-content {
            background: white;
            padding: 30px;
            border-radius: 12px;
            max-width: 500px;
            width: 90%;
            text-align: center;
        }
        .confirmation-header i {
            font-size: 3rem;
            color: #16a34a;
            margin-bottom: 15px;
        }
        .confirmation-details {
            margin: 20px 0;
            text-align: left;
        }
        .confirmation-details p {
            margin: 10px 0;
            padding: 8px;
            background: #f8fafc;
            border-radius: 4px;
        }
        .confirmation-actions {
            display: flex;
            gap: 10px;
            justify-content: center;
            margin-top: 20px;
        }
    `;

    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    document.body.appendChild(confirmation);
}

function simulateEmergencyDispatch(booking) {
    // Simulate real-time updates
    setTimeout(() => {
        console.log('Emergency technician dispatched for booking:', booking.id);
        
        // In a real app, this would use WebSocket connections
        // or server-sent events for real-time updates
        
        // Store emergency status for tracking page
        const emergencyStatus = {
            id: booking.id,
            status: 'dispatched',
            technicianName: 'Rajesh Kumar (Emergency)',
            estimatedArrival: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
            lastUpdate: new Date().toISOString()
        };
        
        localStorage.setItem(`emergency_${booking.id}`, JSON.stringify(emergencyStatus));
        
    }, 2000);
}

// Initialize emergency contact info
document.addEventListener('DOMContentLoaded', function() {
    const emergencyContact = document.querySelector('.emergency-contact');
    if (emergencyContact) {
        emergencyContact.addEventListener('click', function() {
            const phoneNumber = '1800-EMERGENCY';
            if (confirm(`Call emergency hotline at ${phoneNumber}?`)) {
                window.location.href = `tel:${phoneNumber}`;
            }
        });
    }
});