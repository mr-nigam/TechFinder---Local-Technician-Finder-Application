// Services page functionality
import { TechFinderAPI } from './utils/api.js';
import { initializeData } from './utils/storage.js';

let currentFilters = {};

document.addEventListener('DOMContentLoaded', function() {
    initializeData();
    setupEventListeners();
    loadTechnicians();
    parseUrlParams();
});

function setupEventListeners() {
    // Filter controls
    const categoryFilter = document.getElementById('categoryFilter');
    const ratingFilter = document.getElementById('ratingFilter');
    const availabilityFilter = document.getElementById('availabilityFilter');
    const locationFilter = document.getElementById('locationFilter');

    if (categoryFilter) categoryFilter.addEventListener('change', applyFilters);
    if (ratingFilter) ratingFilter.addEventListener('change', applyFilters);
    if (availabilityFilter) availabilityFilter.addEventListener('change', applyFilters);
    if (locationFilter) {
        locationFilter.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                applyLocationFilter();
            }
        });
    }
}

function parseUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    const location = urlParams.get('location');

    if (category) {
        const categoryFilter = document.getElementById('categoryFilter');
        if (categoryFilter) {
            categoryFilter.value = category;
            currentFilters.category = category;
        }
    }

    if (location) {
        const locationFilter = document.getElementById('locationFilter');
        if (locationFilter) {
            locationFilter.value = location;
            currentFilters.location = location;
        }
    }

    if (category || location) {
        loadTechnicians();
    }
}

window.applyFilters = function() {
    const categoryFilter = document.getElementById('categoryFilter');
    const ratingFilter = document.getElementById('ratingFilter');
    const availabilityFilter = document.getElementById('availabilityFilter');

    currentFilters = {
        category: categoryFilter?.value || '',
        rating: ratingFilter?.value || '',
        availability: availabilityFilter?.value || '',
        location: currentFilters.location || ''
    };

    loadTechnicians();
};

window.applyLocationFilter = function() {
    const locationFilter = document.getElementById('locationFilter');
    currentFilters.location = locationFilter?.value || '';
    loadTechnicians();
};

async function loadTechnicians() {
    const servicesGrid = document.getElementById('servicesGrid');
    const loadingSpinner = document.getElementById('loadingSpinner');

    if (loadingSpinner) loadingSpinner.style.display = 'block';
    if (servicesGrid) servicesGrid.innerHTML = '';

    try {
        const technicians = await TechFinderAPI.getTechnicians(currentFilters);
        
        if (loadingSpinner) loadingSpinner.style.display = 'none';

        if (technicians.length === 0) {
            showEmptyState();
            return;
        }

        technicians.forEach(technician => {
            const card = createTechnicianCard(technician);
            if (servicesGrid) servicesGrid.appendChild(card);
        });

    } catch (error) {
        console.error('Error loading technicians:', error);
        if (loadingSpinner) loadingSpinner.style.display = 'none';
        showErrorState();
    }
}

function createTechnicianCard(technician) {
    const card = document.createElement('div');
    card.className = 'service-card';
    card.onclick = () => window.location.href = `technician-profile.html?id=${technician.id}`;

    const availabilityBadge = technician.available ? 
        '<span class="service-badge available">Available</span>' : 
        '<span class="service-badge busy">Busy</span>';

    const stars = '★'.repeat(Math.floor(technician.rating)) + 
                 (technician.rating % 1 !== 0 ? '☆' : '');

    card.innerHTML = `
        <div class="service-header">
            ${availabilityBadge}
            <div class="technician-info">
                <div class="technician-avatar">
                    <img src="${technician.avatar}" alt="${technician.name}" onerror="this.src='https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'">
                </div>
                <div class="technician-details">
                    <h3>${technician.name}</h3>
                    <p>${technician.specialties.join(', ')}</p>
                    <div class="service-rating">
                        <span class="stars">${stars}</span>
                        <span class="rating-text">${technician.rating} (${technician.reviews} reviews)</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="service-body">
            <div class="service-category">${getCategoryName(technician.category)}</div>
            <div class="service-description">${technician.description}</div>
            <div class="service-features">
                ${technician.specialties.map(spec => `<span class="feature-tag">${spec}</span>`).join('')}
            </div>
            <div class="service-location">
                <i class="fas fa-map-marker-alt"></i>
                <span>${technician.location}</span>
                <span class="distance">${technician.distance} miles away</span>
            </div>
        </div>
        <div class="service-footer">
            <div class="service-price">
                ₹${technician.price}<span class="price-label">/hour</span>
            </div>
            <div class="service-actions">
                <button class="service-btn primary" onclick="event.stopPropagation(); window.location.href='booking.html?technician=${technician.id}'">
                    <i class="fas fa-calendar-plus"></i> Book
                </button>
                <button class="service-btn secondary" onclick="event.stopPropagation(); contactTechnician(${technician.id})">
                    <i class="fas fa-phone"></i> Call
                </button>
            </div>
        </div>
    `;

    return card;
}

function getCategoryName(category) {
    const categories = {
        'home': 'Home Repairs',
        'computer': 'Computer Repairs',
        'vehicle': 'Vehicle Repairs'
    };
    return categories[category] || category;
}

function showEmptyState() {
    const servicesGrid = document.getElementById('servicesGrid');
    if (servicesGrid) {
        servicesGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-search"></i>
                <h3>No technicians found</h3>
                <p>Try adjusting your search filters or location to find available technicians.</p>
            </div>
        `;
    }
}

function showErrorState() {
    const servicesGrid = document.getElementById('servicesGrid');
    if (servicesGrid) {
        servicesGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Error loading technicians</h3>
                <p>Please try again later or contact support if the problem persists.</p>
            </div>
        `;
    }
}

window.contactTechnician = function(technicianId) {
    // This would typically integrate with a calling service
    alert('Calling feature would be integrated with a telephony service.');
};