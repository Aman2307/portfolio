document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const submitButton = document.getElementById('submit-button');
    const formMessages = document.getElementById('form-messages');
    
    // Form validation
    function validateField(field) {
        const value = field.value.trim();
        const fieldId = field.id;
        const errorElement = document.getElementById(`${fieldId}-error`);
        
        // Reset error state
        field.classList.remove('error', 'valid');
        if (errorElement) errorElement.style.display = 'none';
        
        // Check required fields
        if (field.required && !value) {
            showError(field, 'This field is required');
            return false;
        }
        
        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                showError(field, 'Please enter a valid email address');
                return false;
            }
        }
        
        // Length validation
        if (field.minLength && value.length < field.minLength) {
            showError(field, `Must be at least ${field.minLength} characters`);
            return false;
        }
        
        if (field.maxLength && value.length > field.maxLength) {
            const remaining = field.maxLength - value.length;
            showError(field, `Please reduce the length by ${-remaining} characters`);
            return false;
        }
        
        // If all validations pass
        field.classList.add('valid');
        return true;
    }
    
    function showError(field, message) {
        field.classList.add('error');
        const errorElement = document.getElementById(`${field.id}-error`);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }
    
    // Validate on blur
    const formInputs = contactForm.querySelectorAll('input, textarea');
    formInputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => {
            if (input.classList.contains('error') || input.classList.contains('valid')) {
                validateField(input);
            }
        });
    });
    
    // Handle form submission
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Validate all fields
        let isValid = true;
        formInputs.forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
        });
        
        if (!isValid) {
            showFormMessage('Please fill in all required fields correctly', 'error');
            return;
        }
        
        // Show loading state
        submitButton.disabled = true;
        submitButton.classList.add('sending');
        
        try {
            const formData = new FormData(contactForm);
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                showFormMessage('Message sent successfully! I\'ll get back to you soon.', 'success');
                contactForm.reset();
                formInputs.forEach(input => input.classList.remove('valid'));
            } else {
                const data = await response.json().catch(() => ({}));
                throw new Error(data.message || 'Form submission failed');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            showFormMessage('Sorry, something went wrong. Please try again later or contact me directly at naziraman772@gmail.com', 'error');
        } finally {
            submitButton.disabled = false;
            submitButton.classList.remove('sending');
        }
    });
    
    function showFormMessage(message, type) {
        formMessages.textContent = message;
        formMessages.className = 'form-message ' + type;
        formMessages.style.display = 'block';
        
        // Scroll to message
        formMessages.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Auto-hide message after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                formMessages.style.display = 'none';
            }, 5000);
        }
    }
});
