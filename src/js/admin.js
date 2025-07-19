// Admin panel functionality
import { TechFinderAPI } from './utils/api.js';
import { initializeData } from './utils/storage.js';

let currentSection = 'dashboard';

document.addEventListener('DOMContentLoaded', function() {
    initializeData();
    setupEventListeners();
    loadDashboard();
});

function setupEventListeners() {
    // Add technician form
    const addTechnicianForm = document.getElementById('addTechnicianForm');
    if (addTechnicianForm) {
        addTechnicianForm.addEventListener('submit', handleAddTechnician);
    }

    // Booking filter
    const bookingFilter = document.getElementById('bookingStatusFilter');
    if (bookingFilter) {
        bookingFilter.addEventListener('change', loadBookings);
    }

    // Review filter
    const reviewFilter = document.getElementById('reviewRatingFilter');
    if (reviewFilter) {
        reviewFilter.addEventListener('change', loadReviews);
    }
}

window.showSection = function(sectionName) {
    // Hide all sections
    document.querySelectorAll('.admin-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    const section = document.getElementById(sectionName);
    if (section) {
        section.classList.add('active');
    }
    
    // Update menu
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
    });
    
    const menuItem = document.querySelector(`[onclick="showSection('${sectionName}')"]`);
    if (menuItem) {
        menuItem.classList.add('active');
    }
    
    currentSection = sectionName;
    
    // Load section-specific data
    switch (sectionName) {
        case 'dashboard':
            loadDashboard();
            break;
        case 'technicians':
            loadTechnicians();
            break;
        case 'bookings':
            loadBookings();
            break;
        case 'reviews':
            loadReviews();
            break;
    }
};

async function loadDashboard() {
    try {
        const technicians = await TechFinderAPI.getTechnicians();
        const bookings = await TechFinderAPI.getBookings();
        
        const stats = {
            activeTechnicians: technicians.filter(t => t.available).length,
            completedBookings: bookings.filter(b => b.status === 'completed').length,
            pendingApprovals: bookings.filter(b => b.status === 'pending').length,
            averageRating: technicians.reduce((sum, t) => sum + t.rating, 0) / technicians.length || 0
        };
        
        updateDashboardStats(stats);
        
    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

function updateDashboardStats(stats) {
    const statCards = document.querySelectorAll('.stat-card');
    const values = [
        stats.activeTechnicians,
        stats.completedBookings,
        stats.pendingApprovals,
        stats.averageRating.toFixed(1)
    ];
    
    statCards.forEach((card, index) => {
        const valueElement = card.querySelector('h3');
        if (valueElement) {
            valueElement.textContent = values[index];
        }
    });
}

async function loadTechnicians() {
    const tableBody = document.getElementById('techniciansTableBody');
    if (!tableBody) return;

    try {
        const technicians = await TechFinderAPI.getTechnicians();
        
        const tableHTML = technicians.map(technician => `
            <tr>
                <td>
                    <div class="tech-name">
                        <img src="${technician.avatar}" alt="${technician.name}" width="40" height="40" style="border-radius: 50%; margin-right: 10px;">
                        ${technician.name}
                    </div>
                </td>
                <td>${getCategoryName(technician.category)}</td>
                <td>
                    <div class="rating">
                        ${'★'.repeat(Math.floor(technician.rating))}
                        <span>${technician.rating}</span>
                    </div>
                </td>
                <td>
                    <span class="status ${technician.available ? 'active' : 'inactive'}">
                        ${technician.available ? 'Active' : 'Inactive'}
                    </span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button onclick="editTechnician(${technician.id})" class="btn-sm btn-primary">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="deleteTechnician(${technician.id})" class="btn-sm btn-danger">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
        
        tableBody.innerHTML = tableHTML;
        
    } catch (error) {
        console.error('Error loading technicians:', error);
        tableBody.innerHTML = '<tr><td colspan="5">Error loading technicians</td></tr>';
    }
}

async function loadBookings() {
    const tableBody = document.getElementById('bookingsTableBody');
    if (!tableBody) return;

    try {
        const bookings = await TechFinderAPI.getBookings();
        const filter = document.getElementById('bookingStatusFilter')?.value;
        
        const filteredBookings = filter ? 
            bookings.filter(b => b.status === filter) : 
            bookings;
        
        const tableHTML = filteredBookings.map(booking => `
            <tr>
                <td>#${booking.id}</td>
                <td>${booking.customerName}</td>
                <td>
                    <div class="technician-name">
                        Technician #${booking.technicianId}
                    </div>
                </td>
                <td>${booking.service || booking.specificService}</td>
                <td>${booking.date} ${booking.time}</td>
                <td>
                    <span class="status ${booking.status}">
                        ${booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button onclick="updateBookingStatus(${booking.id}, 'confirmed')" class="btn-sm btn-success">
                            <i class="fas fa-check"></i>
                        </button>
                        <button onclick="updateBookingStatus(${booking.id}, 'cancelled')" class="btn-sm btn-danger">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
        
        tableBody.innerHTML = tableHTML;
        
    } catch (error) {
        console.error('Error loading bookings:', error);
        tableBody.innerHTML = '<tr><td colspan="7">Error loading bookings</td></tr>';
    }
}

async function loadReviews() {
    const reviewsList = document.getElementById('reviewsList');
    if (!reviewsList) return;

    try {
        const reviews = await TechFinderAPI.getReviews();
        const filter = document.getElementById('reviewRatingFilter')?.value;
        
        const filteredReviews = filter ? 
            reviews.filter(r => r.rating === parseInt(filter)) : 
            reviews;
        
        const reviewsHTML = filteredReviews.map(review => `
            <div class="review-card">
                <div class="review-header">
                    <div class="review-info">
                        <h4>${review.customerName}</h4>
                        <div class="rating">
                            ${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}
                        </div>
                    </div>
                    <div class="review-meta">
                        <span class="date">${new Date(review.date).toLocaleDateString()}</span>
                        <span class="service">${review.service}</span>
                    </div>
                </div>
                <div class="review-content">
                    <p>${review.comment}</p>
                </div>
                <div class="review-actions">
                    <button onclick="approveReview(${review.id})" class="btn-sm btn-success">
                        <i class="fas fa-check"></i> Approve
                    </button>
                    <button onclick="rejectReview(${review.id})" class="btn-sm btn-danger">
                        <i class="fas fa-times"></i> Reject
                    </button>
                </div>
            </div>
        `).join('');
        
        reviewsList.innerHTML = reviewsHTML;
        
    } catch (error) {
        console.error('Error loading reviews:', error);
        reviewsList.innerHTML = '<div class="error">Error loading reviews</div>';
    }
}

window.showAddTechnicianForm = function() {
    const modal = document.getElementById('addTechnicianModal');
    if (modal) {
        modal.style.display = 'block';
    }
};

window.closeAddTechnicianForm = function() {
    const modal = document.getElementById('addTechnicianModal');
    if (modal) {
        modal.style.display = 'none';
    }
};

async function handleAddTechnician(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const technicianData = {
        name: formData.get('techName'),
        email: formData.get('techEmail'),
        phone: formData.get('techPhone'),
        category: formData.get('techCategory'),
        experience: parseInt(formData.get('techExperience')),
        specialties: formData.get('techCertifications').split(',').map(s => s.trim()),
        description: `Experienced ${formData.get('techCategory')} technician with ${formData.get('techExperience')} years of experience.`,
        location: 'Local Area',
        distance: Math.floor(Math.random() * 10) + 1,
        price: Math.floor(Math.random() * 50) + 75,
        avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    };
    
    try {
        await TechFinderAPI.createTechnician(technicianData);
        alert('Technician added successfully!');
        closeAddTechnicianForm();
        loadTechnicians();
        event.target.reset();
        
    } catch (error) {
        console.error('Error adding technician:', error);
        alert('Error adding technician. Please try again.');
    }
}

window.editTechnician = function(id) {
    // This would open an edit form
    alert(`Edit technician functionality would be implemented here for ID: ${id}`);
};

window.deleteTechnician = async function(id) {
    if (confirm('Are you sure you want to delete this technician?')) {
        try {
            await TechFinderAPI.deleteTechnician(id);
            alert('Technician deleted successfully!');
            loadTechnicians();
        } catch (error) {
            console.error('Error deleting technician:', error);
            alert('Error deleting technician. Please try again.');
        }
    }
};

window.updateBookingStatus = async function(bookingId, status) {
    try {
        await TechFinderAPI.updateBookingStatus(bookingId, status);
        alert(`Booking ${status} successfully!`);
        loadBookings();
    } catch (error) {
        console.error('Error updating booking status:', error);
        alert('Error updating booking status. Please try again.');
    }
};

window.approveReview = function(reviewId) {
    alert(`Review ${reviewId} approved successfully!`);
    loadReviews();
};

window.rejectReview = function(reviewId) {
    alert(`Review ${reviewId} rejected successfully!`);
    loadReviews();
};

function getCategoryName(category) {
    const categories = {
        'home': 'Home Repairs',
        'computer': 'Computer Repairs',
        'vehicle': 'Vehicle Repairs'
    };
    return categories[category] || category;
}

// Add CSS for admin-specific styling
const adminStyles = `
    .tech-name {
        display: flex;
        align-items: center;
    }
    .status.active {
        color: #16a34a;
        font-weight: 600;
    }
    .status.inactive {
        color: #dc2626;
        font-weight: 600;
    }
    .action-buttons {
        display: flex;
        gap: 5px;
    }
    .btn-sm {
        padding: 5px 10px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.8rem;
    }
    .btn-primary {
        background: #2563eb;
        color: white;
    }
    .btn-success {
        background: #16a34a;
        color: white;
    }
    .btn-danger {
        background: #dc2626;
        color: white;
    }
    .review-card {
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        padding: 15px;
        margin-bottom: 15px;
    }
    .review-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
    }
    .review-actions {
        display: flex;
        gap: 10px;
        margin-top: 10px;
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = adminStyles;
document.head.appendChild(styleSheet);