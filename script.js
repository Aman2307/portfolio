// Theme Toggle Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize mobile menu
    if (hamburger) {
        hamburger.addEventListener('click', toggleMenu);
    }
    const themeToggle = document.getElementById('themeToggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    let currentTheme = localStorage.getItem('theme');

    // Set initial theme
    function setTheme(theme) {
        if (theme === 'dark' || (!theme && prefersDarkScheme.matches)) {
            document.documentElement.setAttribute('data-theme', 'dark');
            if (themeToggle) themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            if (themeToggle) themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            localStorage.setItem('theme', 'light');
        }
        // Force a reflow to ensure the transition works
        document.body.offsetHeight;
        document.documentElement.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    }

    // Apply the saved theme, or the preferred color scheme
    setTheme(currentTheme);

    // Toggle theme on button click
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            setTheme(currentTheme === 'dark' ? 'light' : 'dark');
        });
    }

    // Listen for system theme changes
    prefersDarkScheme.addListener((e) => {
        if (!localStorage.getItem('theme')) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    });
});

// Mobile Navigation
let hamburger = document.querySelector('.hamburger');
let navLinks = document.querySelector('.nav-links');
let navLinksItems = document.querySelectorAll('.nav-links a');
let navOverlay = document.querySelector('.nav-overlay');

// Create overlay if it doesn't exist
if (!navOverlay) {
    navOverlay = document.createElement('div');
    navOverlay.className = 'nav-overlay';
    document.body.appendChild(navOverlay);
}

// Toggle mobile menu
function toggleMenu() {
    if (!hamburger || !navLinks) return;
    
    const isOpening = !hamburger.classList.contains('active');
    
    // Toggle active classes
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
    document.body.classList.toggle('menu-open', isOpening);
    
    // Toggle overlay
    if (isOpening) {
        if (!navOverlay) {
            navOverlay = document.createElement('div');
            navOverlay.className = 'nav-overlay';
            document.body.appendChild(navOverlay);
            navOverlay.addEventListener('click', toggleMenu);
        }
        navOverlay.style.display = 'block';
        setTimeout(() => navOverlay.classList.add('active'), 10);
    } else if (navOverlay) {
        navOverlay.classList.remove('active');
        setTimeout(() => {
            if (navOverlay && !navLinks.classList.contains('active')) {
                navOverlay.style.display = 'none';
            }
        }, 300);
    }
}

// Close mobile menu when clicking on a link
if (navLinksItems && navLinksItems.length > 0) {
    navLinksItems.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                toggleMenu();
            }
        });
    });
}

// Close menu when clicking on overlay
if (navOverlay) {
    navOverlay.addEventListener('click', toggleMenu);
}

// Close menu when clicking outside on mobile
if (window.innerWidth <= 768) {
    document.addEventListener('click', (e) => {
        if (navLinks && navLinks.classList.contains('active') &&
            !e.target.closest('.nav-links') && 
            !e.target.closest('.hamburger')) {
            toggleMenu();
        }
    });
}

// Close menu on window resize if it becomes desktop view
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        if (window.innerWidth > 768 && navLinks.classList.contains('active')) {
            toggleMenu();
        }
    }, 250);
});

// Navbar scroll behavior
let lastScrollTop = 0;
const navbar = document.querySelector('.navbar');
const navbarHeight = navbar.offsetHeight;
let ticking = false;

function handleScroll() {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    
    if (!ticking) {
        window.requestAnimationFrame(function() {
            // Add/remove scrolled class
            if (currentScroll > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            
            // Hide/show navbar based on scroll direction
            if (currentScroll > lastScrollTop && currentScroll > navbarHeight) {
                // Scrolling down
                navbar.classList.add('hidden');
            } else {
                // Scrolling up or at top
                navbar.classList.remove('hidden');
            }
            
            // Always show navbar when at the top of the page
            if (currentScroll === 0) {
                navbar.classList.remove('hidden');
            }
            
            ticking = false;
        });
        
        ticking = true;
    }
    
    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
    
    // Section animation based on scroll position
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const scrollPosition = window.scrollY + window.innerHeight;
        
        // If section is in viewport
        if (scrollPosition > sectionTop && window.scrollY < sectionTop + sectionHeight) {
            // Keep section width consistent
            section.style.width = '90%';
            section.style.margin = '0 auto';
            section.style.transition = 'opacity 0.3s ease-out';
            
            // Add fade-in effect for sections
            const sectionContent = section.querySelector('h2, h3, p, div');
            if (sectionContent && !section.classList.contains('animated')) {
                section.classList.add('animated');
                section.style.opacity = '0';
                section.style.animation = 'fadeInUp 0.8s ease-out forwards';
            }
        }
    });
    
    lastScrollTop = st <= 0 ? 0 : st;
}

// Add scroll event listener
window.addEventListener('scroll', handleScroll, { passive: true });

// Initial call to set initial states
handleScroll();

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        });
    }

    // Close mobile menu when clicking on a nav link
    const navItems = document.querySelectorAll('.nav-links a');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });

    // Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Back to Top Button
    const backToTopBtn = document.getElementById('backToTop');
    
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('active');
            } else {
                backToTopBtn.classList.remove('active');
            }
        });
        
        backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Set current year in footer
    const currentYear = new Date().getFullYear();
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = currentYear;
    }

    // Animate elements on scroll
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.animate-on-scroll');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 50) {
                element.classList.add('animate');
            }
        });
    };
    
    // Initial check for elements in viewport
    animateOnScroll();
    
    // Check for elements on scroll
    window.addEventListener('scroll', animateOnScroll);
    
    // Add animation classes to hero elements with delays
    const heroElements = document.querySelectorAll('.hero h1, .hero h2, .hero p, .cta-buttons');
    heroElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.animation = `fadeInUp 0.8s ease-out ${0.3 + index * 0.2}s forwards`;
    });

    // Contact Form Submission
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const formObject = {};
            formData.forEach((value, key) => {
                formObject[key] = value;
            });
            
            // Here you would typically send the form data to a server
            console.log('Form submitted:', formObject);
            
            // Show success message
            alert('Thank you for your message! I will get back to you soon.');
            this.reset();
        });
    }

    // Add hover effect to project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const img = this.querySelector('.project-image img');
            if (img) img.style.transform = 'scale(1.05)';
        });
        
        card.addEventListener('mouseleave', function() {
            const img = this.querySelector('.project-image img');
            if (img) img.style.transform = 'scale(1)';
        });
    });

    // Add loading animation
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
    });

    // Intersection Observer for scroll animations
    const animateOnScrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                animateOnScrollObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    // Observe all elements with animate-on-scroll class
    document.querySelectorAll('.animate-on-scroll').forEach(element => {
        animateOnScrollObserver.observe(element);
    });

    // Add active class to current section in navigation
    function highlightNavigation() {
        let scrollPosition = window.pageYOffset + 200;
        
        document.querySelectorAll('section').forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            const navLink = document.querySelector(`.nav-links a[href*="${sectionId}"]`);
            if (navLink) {
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    navLink.classList.add('active');
                } else {
                    navLink.classList.remove('active');
                }
            }
        });
    }
    
    window.addEventListener('scroll', highlightNavigation);
    highlightNavigation(); // Call once on page load
});

// Debounce function for scroll events
function debounce(func, wait = 20, immediate = true) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Add smooth scrolling for Safari
document.addEventListener('DOMContentLoaded', function() {
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    if (isSafari) {
        document.documentElement.style.scrollBehavior = 'smooth';
    }
});

// Initialize AOS (Animate On Scroll) if included
if (typeof AOS !== 'undefined') {
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false
    });
}
