// Home page functionality
import { TechFinderAPI } from './utils/api.js';
import { initializeData } from './utils/storage.js';

// Initialize data on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeData();
    setupEventListeners();
    setupMobileMenu();
});

function setupEventListeners() {
    // Search functionality
    const searchBtn = document.querySelector('.search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', searchTechnicians);
    }

    // Enter key on search input
    const locationInput = document.getElementById('locationInput');
    if (locationInput) {
        locationInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchTechnicians();
            }
        });
    }

    // Service card clicks
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('click', function() {
            const category = this.getAttribute('onclick')?.match(/category=(\w+)/)?.[1];
            if (category) {
                window.location.href = `services.html?category=${category}`;
            }
        });
    });
}

function setupMobileMenu() {
    const hamburger = document.querySelector('.nav-hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
}

window.searchTechnicians = function() {
    const locationInput = document.getElementById('locationInput');
    const location = locationInput?.value.trim();
    
    if (location) {
        // Redirect to services page with location filter
        window.location.href = `services.html?location=${encodeURIComponent(location)}`;
    } else {
        // Show all services if no location specified
        window.location.href = 'services.html';
    }
};

// Add smooth scrolling for internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Add animation on scroll
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

function animateOnScroll() {
    const elements = document.querySelectorAll('.service-card, .feature-card');
    elements.forEach(element => {
        if (isElementInViewport(element)) {
            element.style.animationDelay = '0.1s';
            element.style.animationName = 'slideInUp';
        }
    });
}

window.addEventListener('scroll', animateOnScroll);