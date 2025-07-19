// Technician profile page functionality
import { TechFinderAPI } from './utils/api.js';
import { initializeData } from './utils/storage.js';

let currentTechnician = null;

document.addEventListener('DOMContentLoaded', function() {
    initializeData();
    loadTechnicianProfile();
    setupEventListeners();
});

function setupEventListeners() {
    // Modal events
    const modal = document.getElementById('bookingModal');
    if (modal) {
        window.onclick = function(event) {
            if (event.target === modal) {
                closeBookingModal();
            }
        };
    }

    // Form submission
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', handleBookingSubmit);
    }
}

async function loadTechnicianProfile() {
    const urlParams = new URLSearchParams(window.location.search);
    const technicianId = urlParams.get('id');

    if (!technicianId) {
        window.location.href = 'services.html';
        return;
    }

    try {
        currentTechnician = await TechFinderAPI.getTechnicianById(technicianId);
        
        if (!currentTechnician) {
            alert('Technician not found');
            window.location.href = 'services.html';
            return;
        }

        displayTechnicianInfo();
        loadTechnicianReviews();
        loadTechnicianServices();
        loadTechnicianPhotos();
        updateServiceArea();

    } catch (error) {
        console.error('Error loading technician profile:', error);
        alert('Error loading technician profile');
    }
}

function displayTechnicianInfo() {
    const profileInfo = document.getElementById('profileInfo');
    if (!profileInfo || !currentTechnician) return;

    const stars = '★'.repeat(Math.floor(currentTechnician.rating)) + 
                 (currentTechnician.rating % 1 !== 0 ? '☆' : '');

    const badges = [
        '<span class="badge verified">Verified</span>',
        currentTechnician.available ? '<span class="badge">Available</span>' : '<span class="badge busy">Busy</span>',
        '<span class="badge emergency">Emergency</span>'
    ].join('');

    profileInfo.innerHTML = `
        <div class="profile-avatar">
            <img src="${currentTechnician.avatar}" alt="${currentTechnician.name}" onerror="this.src='https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'">
        </div>
        <div class="profile-details">
            <h1>${currentTechnician.name}</h1>
            <p class="profile-subtitle">${currentTechnician.specialties.join(', ')}</p>
            <div class="profile-stats">
                <div class="stat-item">
                    <span class="stat-value">${currentTechnician.rating}</span>
                    <span class="stat-label">Rating</span>
                </div>
                <div class="stat-item">
                    <span class="stat-value">${currentTechnician.reviews}</span>
                    <span class="stat-label">Reviews</span>
                </div>
                <div class="stat-item">
                    <span class="stat-value">${currentTechnician.experience}</span>
                    <span class="stat-label">Years</span>
                </div>
            </div>
            <div class="profile-badges">
                ${badges}
            </div>
        </div>
    `;

    // Update about section
    const aboutSection = document.getElementById('technicianAbout');
    if (aboutSection) {
        aboutSection.innerHTML = `
            <div class="about-content">
                <p>${currentTechnician.description}</p>
                <div class="specialties">
                    ${currentTechnician.specialties.map(spec => `<span class="specialty-tag">${spec}</span>`).join('')}
                </div>
            </div>
        `;
    }

    // Update availability status
    const availabilityStatus = document.getElementById('availabilityStatus');
    if (availabilityStatus) {
        if (currentTechnician.availability.today) {
            availabilityStatus.textContent = 'Available Today';
            availabilityStatus.className = 'availability-info';
        } else if (currentTechnician.availability.tomorrow) {
            availabilityStatus.textContent = 'Available Tomorrow';
            availabilityStatus.className = 'availability-info';
        } else {
            availabilityStatus.textContent = 'Available This Week';
            availabilityStatus.className = 'availability-info';
        }
    }
}

function loadTechnicianServices() {
    const servicesSection = document.getElementById('technicianServices');
    if (!servicesSection || !currentTechnician) return;

    const servicesTable = `
        <table class="services-table">
            <thead>
                <tr>
                    <th>Service</th>
                    <th>Price</th>
                    <th>Duration</th>
                </tr>
            </thead>
            <tbody>
                ${currentTechnician.services.map(service => `
                    <tr>
                        <td>${service.name}</td>
                        <td class="service-price">₹${service.price}</td>
                        <td>1-2 hours</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;

    servicesSection.innerHTML = servicesTable;
}

async function loadTechnicianReviews() {
    const reviewsSection = document.getElementById('technicianReviews');
    if (!reviewsSection || !currentTechnician) return;

    try {
        const reviews = await TechFinderAPI.getReviewsByTechnicianId(currentTechnician.id);
        
        if (reviews.length === 0) {
            reviewsSection.innerHTML = '<p>No reviews yet.</p>';
            return;
        }

        const reviewsHTML = reviews.map(review => `
            <div class="review-item">
                <div class="review-header">
                    <span class="review-author">${review.customerName}</span>
                    <span class="review-date">${new Date(review.date).toLocaleDateString()}</span>
                </div>
                <div class="review-rating">
                    ${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}
                </div>
                <div class="review-content">${review.comment}</div>
            </div>
        `).join('');

        reviewsSection.innerHTML = reviewsHTML;

    } catch (error) {
        console.error('Error loading reviews:', error);
        reviewsSection.innerHTML = '<p>Error loading reviews.</p>';
    }
}

function loadTechnicianPhotos() {
    const photosSection = document.getElementById('technicianPhotos');
    if (!photosSection || !currentTechnician) return;

    if (currentTechnician.photos.length === 0) {
        photosSection.innerHTML = '<p>No photos available.</p>';
        return;
    }

    const photosHTML = currentTechnician.photos.map(photo => `
        <div class="photo-item">
            <img src="${photo}" alt="Work sample" onclick="openPhotoModal('${photo}')">
        </div>
    `).join('');

    photosSection.innerHTML = `<div class="photo-gallery">${photosHTML}</div>`;
}

function updateServiceArea() {
    const serviceArea = document.getElementById('serviceArea');
    if (serviceArea && currentTechnician) {
        serviceArea.innerHTML = `
            <p><i class="fas fa-map-marker-alt"></i> ${currentTechnician.location}</p>
            <p><i class="fas fa-route"></i> ${currentTechnician.distance} miles from you</p>
        `;
    }
}

window.openBookingModal = function() {
    const modal = document.getElementById('bookingModal');
    if (modal) {
        modal.style.display = 'block';
        populateBookingForm();
    }
};

window.closeBookingModal = function() {
    const modal = document.getElementById('bookingModal');
    if (modal) {
        modal.style.display = 'none';
    }
};

function populateBookingForm() {
    const serviceSelect = document.getElementById('serviceType');
    if (serviceSelect && currentTechnician) {
        serviceSelect.innerHTML = '<option value="">Select Service</option>' +
            currentTechnician.services.map(service => 
                `<option value="${service.name}">${service.name} - $${service.price}</option>`
            ).join('');
    }

    // Set minimum date to today
    const dateInput = document.getElementById('appointmentDate');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
    }
}

async function handleBookingSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const bookingData = {
        technicianId: currentTechnician.id,
        serviceType: formData.get('serviceType'),
        appointmentDate: formData.get('appointmentDate'),
        appointmentTime: formData.get('appointmentTime'),
        description: formData.get('description'),
        address: formData.get('address'),
        customerName: 'Current User', // This would come from authentication
        customerPhone: '(555) 000-0000',
        customerEmail: 'user@example.com'
    };

    try {
        const booking = await TechFinderAPI.createBooking(bookingData);
        alert('Booking submitted successfully! You will receive a confirmation shortly.');
        closeBookingModal();
        
        // Redirect to tracking page
        window.location.href = `tracking.html?booking=${booking.id}`;
        
    } catch (error) {
        console.error('Error creating booking:', error);
        alert('Error creating booking. Please try again.');
    }
}

window.initiateChat = function() {
    alert('Chat feature would be integrated with a messaging service.');
};

window.initiateCall = function() {
    if (currentTechnician) {
        alert(`Calling ${currentTechnician.name} at ${currentTechnician.phone}`);
    }
};

window.bookEmergency = function() {
    window.location.href = `emergency.html?technician=${currentTechnician.id}`;
};

window.openPhotoModal = function(photoUrl) {
    // Create and show photo modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 800px;">
            <span class="close" onclick="this.parentElement.parentElement.remove()">&times;</span>
            <img src="${photoUrl}" alt="Work sample" style="width: 100%; height: auto;">
        </div>
    `;
    document.body.appendChild(modal);
    modal.style.display = 'block';
};