// Authentication functionality
import { StorageManager } from './utils/storage.js';

let isLoginPage = true;

document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    checkAuthStatus();
});

function setupEventListeners() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
        isLoginPage = true;
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
        isLoginPage = false;
    }
}

function checkAuthStatus() {
    const user = StorageManager.getItem('currentUser');
    if (user) {
        // User is already logged in, redirect to appropriate page
        if (window.location.pathname.includes('login.html') || 
            window.location.pathname.includes('register.html')) {
            window.location.href = 'index.html';
        }
    }
}

async function handleLogin(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const email = formData.get('email');
    const password = formData.get('password');
    const rememberMe = formData.get('rememberMe');
    
    if (!email || !password) {
        alert('Please fill in all required fields');
        return;
    }
    
    try {
        // Simulate API call
        const users = StorageManager.getItem('users') || [];
        const user = users.find(u => u.email === email);
        
        if (!user) {
            alert('User not found. Please register first.');
            return;
        }
        
        // In a real app, password would be hashed and verified
        if (user.password !== password) {
            alert('Invalid password');
            return;
        }
        
        // Store user session
        const sessionData = {
            id: user.id,
            name: user.name,
            email: user.email,
            loginTime: new Date().toISOString(),
            rememberMe: rememberMe
        };
        
        StorageManager.setItem('currentUser', sessionData);
        
        // Redirect based on user type
        if (user.type === 'admin') {
            window.location.href = 'admin.html';
        } else {
            window.location.href = 'index.html';
        }
        
    } catch (error) {
        console.error('Login error:', error);
        alert('Login failed. Please try again.');
    }
}

async function handleRegister(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const fullName = formData.get('fullName');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');
    const agreeTerms = formData.get('agreeTerms');
    
    if (!fullName || !email || !phone || !password || !confirmPassword) {
        alert('Please fill in all required fields');
        return;
    }
    
    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }
    
    if (!agreeTerms) {
        alert('Please agree to the Terms of Service and Privacy Policy');
        return;
    }
    
    if (password.length < 6) {
        alert('Password must be at least 6 characters long');
        return;
    }
    
    try {
        // Check if user already exists
        const users = StorageManager.getItem('users') || [];
        const existingUser = users.find(u => u.email === email);
        
        if (existingUser) {
            alert('User with this email already exists');
            return;
        }
        
        // Create new user
        const newUser = {
            id: Date.now(),
            name: fullName,
            email: email,
            phone: phone,
            password: password, // In a real app, this would be hashed
            type: 'customer',
            createdAt: new Date().toISOString()
        };
        
        users.push(newUser);
        StorageManager.setItem('users', users);
        
        // Auto-login after registration
        const sessionData = {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            loginTime: new Date().toISOString(),
            rememberMe: false
        };
        
        StorageManager.setItem('currentUser', sessionData);
        
        alert('Registration successful! Welcome to TechFinder.');
        window.location.href = 'index.html';
        
    } catch (error) {
        console.error('Registration error:', error);
        alert('Registration failed. Please try again.');
    }
}

window.signInWithGoogle = function() {
    alert('Google Sign-In would be integrated with Google OAuth API');
};

window.signInWithFacebook = function() {
    alert('Facebook Sign-In would be integrated with Facebook Login API');
};

window.signUpWithGoogle = function() {
    alert('Google Sign-Up would be integrated with Google OAuth API');
};

window.signUpWithFacebook = function() {
    alert('Facebook Sign-Up would be integrated with Facebook Login API');
};

// Initialize with demo admin user
function initializeDemoUsers() {
    const users = StorageManager.getItem('users');
    if (!users || users.length === 0) {
        const demoUsers = [
            {
                id: 1,
                name: 'Suresh Kumar',
                email: 'admin@techfinder.in',
                phone: '+91 99999 00000',
                password: 'admin123',
                type: 'admin',
                createdAt: new Date().toISOString()
            },
            {
                id: 2,
                name: 'Rahul Kumar',
                email: 'rahul.kumar@example.com',
                phone: '+91 98765 11111',
                password: 'customer123',
                type: 'customer',
                createdAt: new Date().toISOString()
            }
        ];
        
        StorageManager.setItem('users', demoUsers);
    }
}

// Initialize demo users on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeDemoUsers();
});

// Logout functionality
window.logout = function() {
    StorageManager.removeItem('currentUser');
    window.location.href = 'login.html';
};