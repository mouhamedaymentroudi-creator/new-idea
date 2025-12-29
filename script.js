// ========================================
// State Management
// ========================================
const state = {
    currentPage: 'login',
    userData: {
        firstName: '',
        lastName: '',
        gender: '',
        commitment: false
    }
};

// ========================================
// DOM Elements
// ========================================
const elements = {
    // Pages
    pageLogin: document.getElementById('page-login'),
    pageSelection: document.getElementById('page-selection'),
    pageCertificate: document.getElementById('page-certificate'),
    
    // Login Form
    loginForm: document.getElementById('login-form'),
    firstNameInput: document.getElementById('firstName'),
    lastNameInput: document.getElementById('lastName'),
    firstNameError: document.getElementById('firstName-error'),
    lastNameError: document.getElementById('lastName-error'),
    
    // Selection Page
    userName: document.getElementById('user-name'),
    genderMale: document.getElementById('gender-male'),
    genderFemale: document.getElementById('gender-female'),
    commitmentSection: document.getElementById('commitment-section'),
    btnYes: document.getElementById('btn-yes'),
    btnNo: document.getElementById('btn-no'),
    reconsiderMessage: document.getElementById('reconsider-message'),
    btnReconsider: document.getElementById('btn-reconsider'),
    
    // Certificate Page
    certificateName: document.getElementById('certificate-name'),
    certificateDate: document.getElementById('certificate-date'),
    certificate: document.getElementById('certificate'),
    btnDownload: document.getElementById('btn-download'),
    btnShare: document.getElementById('btn-share'),
    btnRestart: document.getElementById('btn-restart'),
    
    // Utilities
    toast: document.getElementById('toast'),
    loadingOverlay: document.getElementById('loading-overlay')
};

// ========================================
// Utility Functions
// ========================================

/**
 * Show a toast notification
 * @param {string} message - The message to display
 * @param {string} type - Type of toast: 'success', 'error', or 'info'
 */
function showToast(message, type = 'info') {
    elements.toast.textContent = message;
    elements.toast.className = `toast ${type}`;
    elements.toast.classList.add('show');
    
    setTimeout(() => {
        elements.toast.classList.remove('show');
    }, 3000);
}

/**
 * Show/hide loading overlay
 * @param {boolean} show - Whether to show or hide the overlay
 */
function toggleLoading(show) {
    if (show) {
        elements.loadingOverlay.classList.add('show');
    } else {
        elements.loadingOverlay.classList.remove('show');
    }
}

/**
 * Navigate to a specific page with smooth transitions
 * @param {string} pageName - Name of the page to navigate to
 */
function navigateToPage(pageName) {
    // Remove active class from all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Add active class to target page
    const targetPage = document.getElementById(`page-${pageName}`);
    if (targetPage) {
        setTimeout(() => {
            targetPage.classList.add('active');
        }, 100);
    }
    
    state.currentPage = pageName;
}

/**
 * Save user data to localStorage
 */
function saveToLocalStorage() {
    try {
        localStorage.setItem('aymen2026UserData', JSON.stringify(state.userData));
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
}

/**
 * Load user data from localStorage
 */
function loadFromLocalStorage() {
    try {
        const savedData = localStorage.getItem('aymen2026UserData');
        if (savedData) {
            state.userData = JSON.parse(savedData);
            return true;
        }
    } catch (error) {
        console.error('Error loading from localStorage:', error);
    }
    return false;
}

/**
 * Clear all user data
 */
function clearUserData() {
    state.userData = {
        firstName: '',
        lastName: '',
        gender: '',
        commitment: false
    };
    localStorage.removeItem('aymen2026UserData');
}

/**
 * Validate text input (name fields)
 * @param {string} value - The input value to validate
 * @returns {object} - Validation result with isValid and error message
 */
function validateName(value) {
    if (!value || value.trim() === '') {
        return { isValid: false, error: 'This field is required' };
    }
    
    if (value.trim().length < 2) {
        return { isValid: false, error: 'Must be at least 2 characters' };
    }
    
    if (!/^[a-zA-Z\s'-]+$/.test(value)) {
        return { isValid: false, error: 'Only letters, spaces, hyphens, and apostrophes allowed' };
    }
    
    return { isValid: true, error: '' };
}

/**
 * Format date for certificate
 * @returns {string} - Formatted date string
 */
function formatCertificateDate() {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString('en-US', options);
}

// ========================================
// Page 1: Login/Registration
// ========================================

/**
 * Handle login form submission
 */
elements.loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get input values
    const firstName = elements.firstNameInput.value.trim();
    const lastName = elements.lastNameInput.value.trim();
    
    // Validate inputs
    const firstNameValidation = validateName(firstName);
    const lastNameValidation = validateName(lastName);
    
    // Display errors or clear them
    if (!firstNameValidation.isValid) {
        elements.firstNameInput.classList.add('error');
        elements.firstNameError.textContent = firstNameValidation.error;
    } else {
        elements.firstNameInput.classList.remove('error');
        elements.firstNameError.textContent = '';
    }
    
    if (!lastNameValidation.isValid) {
        elements.lastNameInput.classList.add('error');
        elements.lastNameError.textContent = lastNameValidation.error;
    } else {
        elements.lastNameInput.classList.remove('error');
        elements.lastNameError.textContent = '';
    }
    
    // If validation passes, proceed
    if (firstNameValidation.isValid && lastNameValidation.isValid) {
        // Save user data
        state.userData.firstName = firstName;
        state.userData.lastName = lastName;
        saveToLocalStorage();
        
        // Update welcome message on next page
        elements.userName.textContent = `${firstName} ${lastName}`;
        
        // Show success toast
        showToast('Welcome! Let\'s get to know you better.', 'success');
        
        // Navigate to selection page
        setTimeout(() => {
            navigateToPage('selection');
        }, 500);
    }
});

// Clear error on input
elements.firstNameInput.addEventListener('input', () => {
    elements.firstNameInput.classList.remove('error');
    elements.firstNameError.textContent = '';
});

elements.lastNameInput.addEventListener('input', () => {
    elements.lastNameInput.classList.remove('error');
    elements.lastNameError.textContent = '';
});

// ========================================
// Page 2: Gender Selection & Commitment
// ========================================

/**
 * Handle gender selection
 */
function handleGenderSelection() {
    const selectedGender = document.querySelector('input[name="gender"]:checked');
    
    if (selectedGender) {
        state.userData.gender = selectedGender.value;
        saveToLocalStorage();
        
        // Update body theme
        document.body.classList.remove('male-theme', 'female-theme');
        document.body.classList.add(`${selectedGender.value}-theme`);
        
        // Show commitment section with animation
        elements.commitmentSection.style.display = 'block';
        setTimeout(() => {
            elements.commitmentSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
    }
}

// Add event listeners to gender radio buttons
elements.genderMale.addEventListener('change', handleGenderSelection);
elements.genderFemale.addEventListener('change', handleGenderSelection);

/**
 * Handle "Yes" button click
 */
elements.btnYes.addEventListener('click', () => {
    state.userData.commitment = true;
    saveToLocalStorage();
    
    // Show loading overlay
    toggleLoading(true);
    
    // Generate certificate after delay
    setTimeout(() => {
        generateCertificate();
        toggleLoading(false);
        
        // Trigger confetti celebration
        celebrateWithConfetti();
        
        // Navigate to certificate page
        navigateToPage('certificate');
        
        showToast('Congratulations! Your certificate is ready!', 'success');
    }, 1500);
});

/**
 * Handle "No" button click
 */
elements.btnNo.addEventListener('click', () => {
    // Show reconsider message
    elements.reconsiderMessage.style.display = 'block';
    elements.reconsiderMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Hide commitment buttons temporarily
    elements.btnYes.style.opacity = '0.5';
    elements.btnNo.style.opacity = '0.5';
    elements.btnYes.disabled = true;
    elements.btnNo.disabled = true;
});

/**
 * Handle "Reconsider" button click
 */
elements.btnReconsider.addEventListener('click', () => {
    // Hide reconsider message
    elements.reconsiderMessage.style.display = 'none';
    
    // Re-enable commitment buttons
    elements.btnYes.style.opacity = '1';
    elements.btnNo.style.opacity = '1';
    elements.btnYes.disabled = false;
    elements.btnNo.disabled = false;
    
    showToast('Great decision! We knew you\'d come around! 🎉', 'success');
});

// ========================================
// Page 3: Certificate Generation
// ========================================

/**
 * Generate certificate content
 */
function generateCertificate() {
    // Set certificate name
    elements.certificateName.textContent = `${state.userData.firstName} ${state.userData.lastName}`;
    
    // Set certificate date
    elements.certificateDate.textContent = formatCertificateDate();
}

/**
 * Celebration confetti animation
 */
function celebrateWithConfetti() {
    // Check if confetti is available
    if (typeof confetti === 'function') {
        // Multiple bursts for dramatic effect
        const duration = 3000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 10000 };
        
        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }
        
        const interval = setInterval(() => {
            const timeLeft = animationEnd - Date.now();
            
            if (timeLeft <= 0) {
                return clearInterval(interval);
            }
            
            const particleCount = 50 * (timeLeft / duration);
            
            // Left side burst
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
            });
            
            // Right side burst
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
            });
        }, 250);
    }
}

/**
 * Download certificate as PNG
 */
elements.btnDownload.addEventListener('click', async () => {
    try {
        toggleLoading(true);
        
        // Use html2canvas to capture certificate
        const canvas = await html2canvas(elements.certificate, {
            scale: 2, // Higher quality
            backgroundColor: '#ffffff',
            logging: false,
            width: elements.certificate.offsetWidth,
            height: elements.certificate.offsetHeight
        });
        
        // Convert to blob and download
        canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `AYMEN_2026_Certificate_${state.userData.firstName}_${state.userData.lastName}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            
            toggleLoading(false);
            showToast('Certificate downloaded successfully! 📥', 'success');
        });
    } catch (error) {
        console.error('Error downloading certificate:', error);
        toggleLoading(false);
        showToast('Error downloading certificate. Please try again.', 'error');
    }
});

/**
 * Share certificate (Web Share API)
 */
elements.btnShare.addEventListener('click', async () => {
    try {
        // Check if Web Share API is supported
        if (navigator.share) {
            await navigator.share({
                title: 'My 2026 Commitment with AYMEN',
                text: `I, ${state.userData.firstName} ${state.userData.lastName}, commit to starting 2026 with AYMEN!`,
                url: window.location.href
            });
            showToast('Thanks for sharing! 🎉', 'success');
        } else {
            // Fallback: Copy link to clipboard
            await navigator.clipboard.writeText(window.location.href);
            showToast('Link copied to clipboard! Share it with friends! 📋', 'success');
        }
    } catch (error) {
        // User cancelled or error occurred
        if (error.name !== 'AbortError') {
            console.error('Error sharing:', error);
            showToast('Unable to share at this time.', 'error');
        }
    }
});

/**
 * Restart the experience
 */
elements.btnRestart.addEventListener('click', () => {
    // Confirm restart
    const confirmed = confirm('Are you sure you want to start over? This will clear all your data.');
    
    if (confirmed) {
        // Clear all data
        clearUserData();
        
        // Reset body theme
        document.body.classList.remove('male-theme', 'female-theme');
        
        // Reset form
        elements.loginForm.reset();
        elements.firstNameInput.classList.remove('error');
        elements.lastNameInput.classList.remove('error');
        elements.firstNameError.textContent = '';
        elements.lastNameError.textContent = '';
        
        // Reset gender selection
        elements.genderMale.checked = false;
        elements.genderFemale.checked = false;
        elements.commitmentSection.style.display = 'none';
        elements.reconsiderMessage.style.display = 'none';
        
        // Navigate back to login page
        navigateToPage('login');
        
        showToast('Let\'s start fresh! 🔄', 'info');
    }
});

// ========================================
// Initialization
// ========================================

/**
 * Initialize the application
 */
function initApp() {
    // Check if user has previous data
    const hasData = loadFromLocalStorage();
    
    if (hasData && state.userData.firstName && state.userData.lastName) {
        // User has completed registration before
        // You could optionally navigate them to their last page
        // For now, we'll just keep them on the login page
        console.log('Welcome back:', state.userData.firstName);
    }
    
    // Ensure login page is visible on load
    navigateToPage('login');
    
    console.log('App initialized successfully');
}

// ========================================
// Keyboard Navigation & Accessibility
// ========================================

/**
 * Handle keyboard shortcuts
 */
document.addEventListener('keydown', (e) => {
    // ESC key - close reconsider message if open
    if (e.key === 'Escape' && elements.reconsiderMessage.style.display === 'block') {
        elements.reconsiderMessage.style.display = 'none';
        elements.btnYes.style.opacity = '1';
        elements.btnNo.style.opacity = '1';
        elements.btnYes.disabled = false;
        elements.btnNo.disabled = false;
    }
});

// ========================================
// Form Auto-save (Optional Enhancement)
// ========================================

/**
 * Auto-save form data as user types
 */
let autoSaveTimeout;

elements.firstNameInput.addEventListener('input', () => {
    clearTimeout(autoSaveTimeout);
    autoSaveTimeout = setTimeout(() => {
        if (elements.firstNameInput.value.trim()) {
            state.userData.firstName = elements.firstNameInput.value.trim();
            saveToLocalStorage();
        }
    }, 1000);
});

elements.lastNameInput.addEventListener('input', () => {
    clearTimeout(autoSaveTimeout);
    autoSaveTimeout = setTimeout(() => {
        if (elements.lastNameInput.value.trim()) {
            state.userData.lastName = elements.lastNameInput.value.trim();
            saveToLocalStorage();
        }
    }, 1000);
});

// ========================================
// Prevent Form Resubmission on Refresh
// ========================================
if (window.history.replaceState) {
    window.history.replaceState(null, null, window.location.href);
}

// ========================================
// Start Application
// ========================================
document.addEventListener('DOMContentLoaded', initApp);

// ========================================
// PWA Support (Optional Enhancement)
// ========================================

/**
 * Register service worker for PWA functionality
 */
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Service worker registration would go here
        // For now, we'll skip this as it requires additional setup
        console.log('PWA features available');
    });
}

// ========================================
// Analytics & Error Tracking (Placeholder)
// ========================================

/**
 * Log errors for debugging
 */
window.addEventListener('error', (e) => {
    console.error('Application error:', e.error);
    // In production, you would send this to an error tracking service
});

/**
 * Track user interactions (placeholder)
 */
function trackEvent(eventName, eventData) {
    console.log('Event tracked:', eventName, eventData);
    // In production, you would send this to an analytics service
}

// Track page views
function trackPageView(pageName) {
    trackEvent('page_view', { page: pageName });
}

// ========================================
// Export Functions for Testing (Optional)
// ========================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateName,
        formatCertificateDate,
        saveToLocalStorage,
        loadFromLocalStorage
    };
}
