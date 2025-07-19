// Support page functionality
import { initializeData } from './utils/storage.js';

let chatActive = false;
let chatMessages = [];

document.addEventListener('DOMContentLoaded', function() {
    initializeData();
    setupEventListeners();
    setupFAQ();
});

function setupEventListeners() {
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
}

function setupFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            toggleFAQ(this);
        });
    });
}

window.startLiveChat = function() {
    const chatContainer = document.getElementById('chatContainer');
    const chatMessages = document.getElementById('chatMessages');
    
    if (chatContainer) {
        chatContainer.style.display = 'block';
        chatContainer.scrollIntoView({ behavior: 'smooth' });
        chatActive = true;
        
        // Add welcome message if not already present
        if (chatMessages && chatMessages.children.length <= 1) {
            addBotMessage("Hi! I'm here to help you with TechFinder. What can I assist you with today?");
        }
    }
};

window.closeLiveChat = function() {
    const chatContainer = document.getElementById('chatContainer');
    if (chatContainer) {
        chatContainer.style.display = 'none';
        chatActive = false;
    }
};

window.sendMessage = function() {
    const chatInput = document.getElementById('chatInput');
    const message = chatInput?.value.trim();
    
    if (!message) return;
    
    addUserMessage(message);
    chatInput.value = '';
    
    // Simulate bot response
    setTimeout(() => {
        const response = generateBotResponse(message);
        addBotMessage(response);
    }, 1000);
};

function addUserMessage(message) {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;
    
    const messageElement = document.createElement('div');
    messageElement.className = 'message user-message';
    messageElement.innerHTML = `
        <div class="message-content">
            <p>${message}</p>
        </div>
        <div class="message-time">${new Date().toLocaleTimeString()}</div>
    `;
    
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addBotMessage(message) {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;
    
    const messageElement = document.createElement('div');
    messageElement.className = 'message support-message';
    messageElement.innerHTML = `
        <div class="message-content">
            <p>${message}</p>
        </div>
        <div class="message-time">${new Date().toLocaleTimeString()}</div>
    `;
    
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function generateBotResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    const responses = {
        'booking': "To make a booking, go to our Services page, select a technician, and click 'Book'. You can also call us at 1800-TECH-FIND for immediate assistance.",
        'cancel': "To cancel a booking, please call our support line at 1800-TECH-FIND at least 2 hours before your appointment. Cancellation fees may apply for last-minute cancellations.",
        'emergency': "For emergency services, use our Emergency page or call 1800-EMERGENCY. Our emergency technicians are available 24/7 with response times under 30 minutes.",
        'payment': "We accept all major credit cards, PayPal, Apple Pay, Google Pay, and cash. Payment is processed securely after service completion.",
        'technician': "All our technicians are background-checked, licensed, and insured. You can view their profiles, ratings, and reviews before booking.",
        'pricing': "Pricing varies by service type and technician. You'll see the full cost breakdown before confirming your booking. Most services range from ₹300-1500 per hour.",
        'track': "You can track your technician's location and ETA in real-time through our tracking page. You'll receive a link after booking confirmation."
    };
    
    for (const [keyword, response] of Object.entries(responses)) {
        if (message.includes(keyword)) {
            return response;
        }
    }
    
    return "I'd be happy to help you with that! For specific questions about bookings, payments, or technical issues, please call our support line at 1800-TECH-FIND or describe your issue in more detail.";
}

window.toggleFAQ = function(element) {
    const faqItem = element.parentElement;
    const answer = faqItem.querySelector('.faq-answer');
    const icon = element.querySelector('i');
    
    if (answer.style.display === 'block') {
        answer.style.display = 'none';
        icon.style.transform = 'rotate(0deg)';
        faqItem.classList.remove('active');
    } else {
        // Close all other FAQs
        document.querySelectorAll('.faq-answer').forEach(a => {
            a.style.display = 'none';
        });
        document.querySelectorAll('.faq-question i').forEach(i => {
            i.style.transform = 'rotate(0deg)';
        });
        document.querySelectorAll('.faq-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Open this FAQ
        answer.style.display = 'block';
        icon.style.transform = 'rotate(180deg)';
        faqItem.classList.add('active');
    }
};

window.openEmailForm = function() {
    const emailModal = document.createElement('div');
    emailModal.className = 'modal';
    emailModal.innerHTML = `
        <div class="modal-content">
            <span class="close" onclick="this.parentElement.parentElement.remove()">&times;</span>
            <h2>Contact Support</h2>
            <form id="emailForm">
                <div class="form-group">
                    <label for="supportName">Name</label>
                    <input type="text" id="supportName" required>
                </div>
                <div class="form-group">
                    <label for="supportEmail">Email</label>
                    <input type="email" id="supportEmail" required>
                </div>
                <div class="form-group">
                    <label for="supportSubject">Subject</label>
                    <select id="supportSubject" required>
                        <option value="">Select Subject</option>
                        <option value="booking">Booking Issue</option>
                        <option value="payment">Payment Problem</option>
                        <option value="technician">Technician Feedback</option>
                        <option value="technical">Technical Issue</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="supportMessage">Message</label>
                    <textarea id="supportMessage" rows="5" required></textarea>
                </div>
                <button type="submit" class="btn btn-primary">Send Email</button>
            </form>
        </div>
    `;
    
    document.body.appendChild(emailModal);
    emailModal.style.display = 'block';
    
    const form = emailModal.querySelector('#emailForm');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Thank you for your message! We will respond within 24 hours.');
        emailModal.remove();
    });
};

window.initiateCall = function(phoneNumber) {
    if (confirm(`Call TechFinder support at ${phoneNumber}?`)) {
        window.location.href = `tel:${phoneNumber}`;
    }
};