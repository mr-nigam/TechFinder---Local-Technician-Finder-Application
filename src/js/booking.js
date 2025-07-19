// Booking page functionality
import { TechFinderAPI } from './utils/api.js';
import { initializeData } from './utils/storage.js';

let currentStep = 1;
let selectedTechnician = null;
let bookingData = {};

document.addEventListener('DOMContentLoaded', function() {
    initializeData();
    loadTechnicianInfo();
    setupFormEvents();
    updateProgress();
});

function setupFormEvents() {
    const form = document.getElementById('bookingForm');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }

    // Service category change
    const categorySelect = document.getElementById('serviceCategory');
    if (categorySelect) {
        categorySelect.addEventListener('change', updateSpecificServices);
    }

    // Date change
    const dateInput = document.getElementById('appointmentDate');
    if (dateInput) {
        dateInput.addEventListener('change', loadAvailableTimeSlots);
        // Set minimum date to today
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
    }

    // Priority change
    const prioritySelect = document.getElementById('priority');
    if (prioritySelect) {
        prioritySelect.addEventListener('change', updatePricing);
    }
}

async function loadTechnicianInfo() {
    const urlParams = new URLSearchParams(window.location.search);
    const technicianId = urlParams.get('technician');

    if (!technicianId) {
        window.location.href = 'services.html';
        return;
    }

    try {
        selectedTechnician = await TechFinderAPI.getTechnicianById(technicianId);
        
        if (!selectedTechnician) {
            alert('Technician not found');
            window.location.href = 'services.html';
            return;
        }

        displayTechnicianCard();
        updatePricing();

    } catch (error) {
        console.error('Error loading technician:', error);
        alert('Error loading technician information');
    }
}

function displayTechnicianCard() {
    const technicianCard = document.getElementById('technicianCard');
    if (!technicianCard || !selectedTechnician) return;

    const stars = '★'.repeat(Math.floor(selectedTechnician.rating)) + 
                 (selectedTechnician.rating % 1 !== 0 ? '☆' : '');

    technicianCard.innerHTML = `
        <div class="tech-info">
            <div class="tech-avatar">
                <img src="${selectedTechnician.avatar}" alt="${selectedTechnician.name}" onerror="this.src='https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'">
            </div>
            <div class="tech-details">
                <h4>${selectedTechnician.name}</h4>
                <p>${selectedTechnician.specialties.join(', ')}</p>
                <div class="tech-rating">
                    <span>${stars}</span>
                    <span>${selectedTechnician.rating} (${selectedTechnician.reviews})</span>
                </div>
            </div>
        </div>
        <div class="tech-contact">
            <p><i class="fas fa-phone"></i> ${selectedTechnician.phone}</p>
            <p><i class="fas fa-map-marker-alt"></i> ${selectedTechnician.location}</p>
        </div>
    `;
}

function updateSpecificServices() {
    const categorySelect = document.getElementById('serviceCategory');
    const specificSelect = document.getElementById('specificService');
    
    if (!categorySelect || !specificSelect) return;

    const category = categorySelect.value;
    const services = {
        'home': ['Plumbing', 'Electrical', 'HVAC', 'Appliance Repair', 'Carpentry', 'Painting'],
        'computer': ['Hardware Repair', 'Software Issues', 'Virus Removal', 'Data Recovery', 'Network Setup'],
        'vehicle': ['Engine Repair', 'Brake Service', 'Oil Change', 'Tire Service', 'Electrical', 'Bodywork']
    };

    specificSelect.innerHTML = '<option value="">Select Service</option>';
    
    if (category && services[category]) {
        services[category].forEach(service => {
            const option = document.createElement('option');
            option.value = service;
            option.textContent = service;
            specificSelect.appendChild(option);
        });
    }

    updatePricing();
}

async function loadAvailableTimeSlots() {
    const dateInput = document.getElementById('appointmentDate');
    const timeSlotsContainer = document.getElementById('timeSlots');
    
    if (!dateInput || !timeSlotsContainer || !selectedTechnician) return;

    const selectedDate = dateInput.value;
    if (!selectedDate) return;

    try {
        const availableSlots = await TechFinderAPI.getAvailableTimeSlots(selectedTechnician.id, selectedDate);
        
        timeSlotsContainer.innerHTML = '';
        
        availableSlots.forEach(slot => {
            const timeSlot = document.createElement('div');
            timeSlot.className = 'time-slot';
            timeSlot.textContent = slot;
            timeSlot.addEventListener('click', function() {
                // Remove previous selection
                document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
                // Add selection to clicked slot
                this.classList.add('selected');
                bookingData.appointmentTime = slot;
            });
            timeSlotsContainer.appendChild(timeSlot);
        });

    } catch (error) {
        console.error('Error loading time slots:', error);
        timeSlotsContainer.innerHTML = '<p>Error loading available time slots.</p>';
    }
}

function updatePricing() {
    const prioritySelect = document.getElementById('priority');
    const serviceFee = document.getElementById('serviceFee');
    const priorityFee = document.getElementById('priorityFee');
    const travelFee = document.getElementById('travelFee');
    const totalFee = document.getElementById('totalFee');

    if (!selectedTechnician) return;

    let basePrice = selectedTechnician.price;
    let priorityPrice = 0;
    let travel = 15; // Fixed travel fee

    if (prioritySelect) {
        const priority = prioritySelect.value;
        if (priority === 'urgent') priorityPrice = 25;
        else if (priority === 'emergency') priorityPrice = 50;
    }

    const total = basePrice + priorityPrice + travel;

    if (serviceFee) serviceFee.textContent = `$${basePrice}`;
    if (priorityFee) priorityFee.textContent = `₹${priorityPrice}`;
    if (travelFee) travelFee.textContent = `₹${travel}`;
    if (totalFee) totalFee.textContent = `₹${total}`;
}

window.nextStep = function(step) {
    if (validateCurrentStep()) {
        currentStep = step;
        showStep(step);
        updateProgress();
    }
};

window.prevStep = function(step) {
    currentStep = step;
    showStep(step);
    updateProgress();
};

function validateCurrentStep() {
    const currentStepElement = document.getElementById(`step${currentStep}`);
    if (!currentStepElement) return false;

    const requiredFields = currentStepElement.querySelectorAll('[required]');
    let valid = true;

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.style.borderColor = '#dc2626';
            valid = false;
        } else {
            field.style.borderColor = '#e5e7eb';
        }
    });

    // Special validation for step 2 (time slot selection)
    if (currentStep === 2) {
        const selectedTimeSlot = document.querySelector('.time-slot.selected');
        if (!selectedTimeSlot) {
            alert('Please select a time slot');
            valid = false;
        }
    }

    return valid;
}

function showStep(step) {
    // Hide all steps
    document.querySelectorAll('.form-step').forEach(s => s.classList.remove('active'));
    
    // Show current step
    const stepElement = document.getElementById(`step${step}`);
    if (stepElement) {
        stepElement.classList.add('active');
    }

    // Update summary if on step 4
    if (step === 4) {
        updateBookingSummary();
    }
}

function updateProgress() {
    document.querySelectorAll('.progress-step').forEach((step, index) => {
        step.classList.remove('active', 'completed');
        if (index + 1 === currentStep) {
            step.classList.add('active');
        } else if (index + 1 < currentStep) {
            step.classList.add('completed');
        }
    });
}

function updateBookingSummary() {
    const summaryContainer = document.getElementById('bookingSummary');
    if (!summaryContainer) return;

    const formData = new FormData(document.getElementById('bookingForm'));
    const selectedTimeSlot = document.querySelector('.time-slot.selected');
    
    const summary = {
        'Service Category': formData.get('serviceCategory'),
        'Specific Service': formData.get('specificService'),
        'Priority': formData.get('priority'),
        'Date': formData.get('appointmentDate'),
        'Time': selectedTimeSlot ? selectedTimeSlot.textContent : 'Not selected',
        'Duration': formData.get('duration') + ' minutes',
        'Customer Name': formData.get('customerName'),
        'Phone': formData.get('customerPhone'),
        'Email': formData.get('customerEmail'),
        'Address': formData.get('serviceAddress'),
        'Description': formData.get('description'),
        'Special Instructions': formData.get('specialInstructions') || 'None'
    };

    const summaryHTML = Object.entries(summary).map(([key, value]) => `
        <div class="summary-item">
            <span class="summary-label">${key}:</span>
            <span class="summary-value">${value}</span>
        </div>
    `).join('');

    summaryContainer.innerHTML = summaryHTML;
}

async function handleFormSubmit(event) {
    event.preventDefault();

    if (!validateCurrentStep()) {
        return;
    }

    const formData = new FormData(event.target);
    const selectedTimeSlot = document.querySelector('.time-slot.selected');

    const booking = {
        technicianId: selectedTechnician.id,
        serviceCategory: formData.get('serviceCategory'),
        specificService: formData.get('specificService'),
        priority: formData.get('priority'),
        description: formData.get('description'),
        appointmentDate: formData.get('appointmentDate'),
        appointmentTime: selectedTimeSlot ? selectedTimeSlot.textContent : '',
        duration: formData.get('duration'),
        customerName: formData.get('customerName'),
        customerPhone: formData.get('customerPhone'),
        customerEmail: formData.get('customerEmail'),
        serviceAddress: formData.get('serviceAddress'),
        specialInstructions: formData.get('specialInstructions'),
        price: calculateTotalPrice()
    };

    try {
        const createdBooking = await TechFinderAPI.createBooking(booking);
        
        alert('Booking confirmed! You will receive a confirmation email shortly.');
        
        // Redirect to tracking page
        window.location.href = `tracking.html?booking=${createdBooking.id}`;
        
    } catch (error) {
        console.error('Error creating booking:', error);
        alert('Error creating booking. Please try again.');
    }
}

function calculateTotalPrice() {
    const prioritySelect = document.getElementById('priority');
    let basePrice = selectedTechnician ? selectedTechnician.price : 0;
    let priorityPrice = 0;
    let travel = 15;

    if (prioritySelect) {
        const priority = prioritySelect.value;
        if (priority === 'urgent') priorityPrice = 25;
        else if (priority === 'emergency') priorityPrice = 50;
    }

    return basePrice + priorityPrice + travel;
}