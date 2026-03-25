// ========================================
// FORM.JS - Contact Form Validation & Submission
// ========================================

/**
 * Contact Form Handler
 */
class ContactForm {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.api = window.api;
        this.isSubmitting = false;
        
        if (this.form) {
            this.init();
        }
    }

    init() {
        this.setupValidation();
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Real-time validation
        this.form.querySelectorAll('input, textarea').forEach(field => {
            field.addEventListener('blur', () => this.validateField(field));
            field.addEventListener('change', () => this.clearFieldError(field));
        });
    }

    /**
     * Setup Validation Rules
     */
    setupValidation() {
        this.validationRules = {
            name: {
                required: true,
                minLength: 2,
                maxLength: 100,
                pattern: /^[a-zA-Z\s]*$/,
                message: 'Name must be 2-100 characters and contain only letters'
            },
            email: {
                required: true,
                type: 'email',
                message: 'Please enter a valid email address'
            },
            phone: {
                required: false,
                pattern: /^[\d\s\-\+\(\)]{0,20}$/,
                message: 'Please enter a valid phone number'
            },
            subject: {
                required: true,
                minLength: 5,
                maxLength: 200,
                message: 'Subject must be 5-200 characters'
            },
            message: {
                required: true,
                minLength: 10,
                maxLength: 2000,
                message: 'Message must be 10-2000 characters'
            }
        };
    }

    /**
     * Validate Single Field
     */
    validateField(field) {
        const { name, value } = field;
        const rules = this.validationRules[name];
        
        if (!rules) return true;

        // Check required
        if (rules.required && !value.trim()) {
            this.showFieldError(field, 'This field is required');
            return false;
        }

        // Check minLength
        if (rules.minLength && value.length < rules.minLength) {
            this.showFieldError(field, `Minimum ${rules.minLength} characters required`);
            return false;
        }

        // Check maxLength
        if (rules.maxLength && value.length > rules.maxLength) {
            this.showFieldError(field, `Maximum ${rules.maxLength} characters allowed`);
            return false;
        }

        // Check email type
        if (rules.type === 'email' && value) {
            if (!this.isValidEmail(value)) {
                this.showFieldError(field, rules.message);
                return false;
            }
        }

        // Check pattern
        if (rules.pattern && value && !rules.pattern.test(value)) {
            this.showFieldError(field, rules.message);
            return false;
        }

        this.clearFieldError(field);
        return true;
    }

    /**
     * Validate All Fields
     */
    validateForm() {
        let isValid = true;
        
        this.form.querySelectorAll('input[required], textarea[required]').forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        // Also validate optional fields if they have value
        this.form.querySelectorAll('input[type="tel"], input[type="text"]').forEach(field => {
            if (field.value && !this.validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    /**
     * Email Validation Helper
     */
    isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    /**
     * Show Field Error
     */
    showFieldError(field, message) {
        field.classList.add('error');
        const errorElement = field.parentElement.querySelector('.error-message');
        if (errorElement) {
            errorElement.textContent = message;
        }
    }

    /**
     * Clear Field Error
     */
    clearFieldError(field) {
        field.classList.remove('error');
        const errorElement = field.parentElement.querySelector('.error-message');
        if (errorElement) {
            errorElement.textContent = '';
        }
    }

    /**
     * Show Form Status
     */
    showFormStatus(message, type = 'success') {
        const statusElement = document.getElementById('form-status');
        if (statusElement) {
            statusElement.className = `form-status ${type}`;
            statusElement.textContent = message;
            statusElement.style.display = 'flex';
        }
    }

    /**
     * Clear Form Status
     */
    clearFormStatus() {
        const statusElement = document.getElementById('form-status');
        if (statusElement) {
            statusElement.className = 'form-status';
            statusElement.textContent = '';
            statusElement.style.display = 'none';
        }
    }

    /**
     * Set Button State
     */
    setButtonState(loading = false) {
        const button = this.form.querySelector('.btn-submit');
        const btnText = button.querySelector('.btn-text');
        const btnLoader = button.querySelector('.btn-loader');

        if (loading) {
            button.disabled = true;
            btnText.style.display = 'none';
            btnLoader.classList.remove('hidden');
        } else {
            button.disabled = false;
            btnText.style.display = 'inline';
            btnLoader.classList.add('hidden');
        }
    }

    /**
     * Get Form Data
     */
    getFormData() {
        const formData = new FormData(this.form);
        const data = {};
        
        for (let [key, value] of formData) {
            data[key] = value.trim();
        }
        
        return data;
    }

    /**
     * Handle Form Submission
     */
    async handleSubmit(e) {
        e.preventDefault();

        // Prevent double submission
        if (this.isSubmitting) return;

        // Clear previous status
        this.clearFormStatus();

        // Validate form
        if (!this.validateForm()) {
            this.showFormStatus('Please fix the errors above', 'error');
            return;
        }

        this.isSubmitting = true;
        this.setButtonState(true);

        try {
            const data = this.getFormData();

            // Send to API
            const response = await this.api.post('/contacts', data);

            // Success
            this.showFormStatus(
                'Thank you! Your message has been sent. I\'ll get back to you soon.',
                'success'
            );

            // Reset form
            this.form.reset();
            
            // Scroll to status message
            document.getElementById('form-status').scrollIntoView({ behavior: 'smooth', block: 'nearest' });

            // Clear success message after 5 seconds
            setTimeout(() => this.clearFormStatus(), 5000);

        } catch (error) {
            console.error('Form submission error:', error);
            
            let errorMessage = 'Failed to send message. Please try again later.';
            
            if (error.message) {
                errorMessage = error.message;
            }

            this.showFormStatus(errorMessage, 'error');

        } finally {
            this.isSubmitting = false;
            this.setButtonState(false);
        }
    }
}

/**
 * Advanced Validation Features
 */
class AdvancedValidation {
    /**
     * Check for spam patterns
     */
    static isSpam(text) {
        const spamPatterns = [
            /viagra|cialis|casino|lottery/gi,
            /(https?:\/\/[^\s]+){3,}/gi, // Multiple URLs
            /(.)\1{5,}/g // Repeated characters
        ];

        return spamPatterns.some(pattern => pattern.test(text));
    }

    /**
     * Sanitize input
     */
    static sanitizeInput(input) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        
        return input.replace(/[&<>"']/g, m => map[m]);
    }

    /**
     * Validate honeypot field (if used)
     */
    static validateHoneypot(honeypotValue) {
        return !honeypotValue || honeypotValue.trim() === '';
    }

    /**
     * Rate limiting (client-side)
     */
    static canSubmit() {
        const lastSubmitTime = sessionStorage.getItem('lastFormSubmit');
        const now = Date.now();

        if (lastSubmitTime && now - parseInt(lastSubmitTime) < 3000) {
            return false;
        }

        sessionStorage.setItem('lastFormSubmit', now.toString());
        return true;
    }
}

/**
 * Form Analytics
 */
class FormAnalytics {
    static trackFormStart() {
        console.log('User started filling form');
        // Send to analytics
    }

    static trackFormSubmit() {
        console.log('Form submitted');
        // Send to analytics
    }

    static trackFormError(field) {
        console.log(`Error on field: ${field}`);
        // Send to analytics
    }
}

/**
 * Initialize Contact Form
 */
document.addEventListener('DOMContentLoaded', () => {
    const form = new ContactForm();
    window.contactForm = form;
});

// Log form script loaded
console.log('✓ Form.js loaded');
