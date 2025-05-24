// Main application script for n8n automation service webpage
document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize the application
    initializeWebsite();
    
    function initializeWebsite() {
        setupSmoothScrolling();
        setupCallToActionButtons();
        setupAnimationOnScroll();
        setupInteractiveElements();
        logPageVisit();
    }

    // Smooth scrolling for better UX
    function setupSmoothScrolling() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // Setup call to action button functionality
    function setupCallToActionButtons() {
        const bookCallBtn = document.getElementById('bookCallBtn');
        
        if (bookCallBtn) {
            bookCallBtn.addEventListener('click', function() {
                handleBookingClick();
            });
        }

        // Add click handlers for package selection feedback
        const packageCards = document.querySelectorAll('.rounded-2xl.shadow-lg');
        packageCards.forEach((card, index) => {
            card.addEventListener('click', function() {
                handlePackageSelection(index);
            });
        });
    }

    // Handle booking button click
    function handleBookingClick() {
        // In a real implementation, this would redirect to Calendly
        console.log('Booking call button clicked');
        
        // Show user feedback
        showNotification('Redirecting to booking calendar...', 'info');
        
        // Simulate booking action (replace with actual Calendly link)
        setTimeout(() => {
            // window.location.href = 'https://calendly.com/your-booking-link';
            showNotification('Booking calendar would open here. Contact us for the actual booking link.', 'success');
        }, 1000);
        
        // Track the conversion event
        trackEvent('booking_attempt', {
            source: 'cta_button',
            timestamp: new Date().toISOString()
        });
    }

    // Handle package selection
    function handlePackageSelection(packageIndex) {
        const packages = ['Essential Threads', 'Growth Stitch', 'Full Wardrobe'];
        const selectedPackage = packages[packageIndex] || 'Unknown';
        
        console.log(`Package selected: ${selectedPackage}`);
        
        // Visual feedback
        const card = event.currentTarget;
        card.classList.add('ring-2', 'ring-indigo-500');
        
        setTimeout(() => {
            card.classList.remove('ring-2', 'ring-indigo-500');
        }, 2000);
        
        showNotification(`${selectedPackage} package selected. Book a call to get started!`, 'success');
        
        // Track package interest
        trackEvent('package_interest', {
            package: selectedPackage,
            index: packageIndex,
            timestamp: new Date().toISOString()
        });
    }

    // Setup animations on scroll
    function setupAnimationOnScroll() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in');
                    
                    // Special animations for specific elements
                    if (entry.target.classList.contains('grid')) {
                        animateGridChildren(entry.target);
                    }
                }
            });
        }, observerOptions);

        // Observe sections for scroll animations
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            observer.observe(section);
        });
    }

    // Animate grid children with stagger effect
    function animateGridChildren(gridElement) {
        const children = gridElement.children;
        
        Array.from(children).forEach((child, index) => {
            setTimeout(() => {
                child.style.opacity = '0';
                child.style.transform = 'translateY(20px)';
                child.style.transition = 'all 0.6s ease';
                
                requestAnimationFrame(() => {
                    child.style.opacity = '1';
                    child.style.transform = 'translateY(0)';
                });
            }, index * 100);
        });
    }

    // Setup interactive elements
    function setupInteractiveElements() {
        // Add hover effects to cards
        const cards = document.querySelectorAll('.bg-white.rounded-xl, .bg-white.rounded-2xl');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-2px)';
                this.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.1)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = '';
            });
        });

        // Add ripple effect to buttons
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            button.addEventListener('click', createRippleEffect);
        });
    }

    // Create ripple effect on button click
    function createRippleEffect(event) {
        const button = event.currentTarget;
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');

        button.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    // Show notification to user
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm ${getNotificationClasses(type)}`;
        notification.innerHTML = `
            <div class="flex items-center">
                <div class="flex-shrink-0">
                    ${getNotificationIcon(type)}
                </div>
                <div class="ml-3">
                    <p class="text-sm font-medium">${message}</p>
                </div>
                <button class="ml-auto flex-shrink-0" onclick="this.parentElement.parentElement.remove()">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                    </svg>
                </button>
            </div>
        `;

        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);

        // Slide in animation
        notification.style.transform = 'translateX(100%)';
        notification.style.transition = 'transform 0.3s ease';
        
        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(0)';
        });
    }

    // Get notification styling classes
    function getNotificationClasses(type) {
        const classes = {
            'success': 'bg-green-50 text-green-800 border border-green-200',
            'error': 'bg-red-50 text-red-800 border border-red-200',
            'warning': 'bg-yellow-50 text-yellow-800 border border-yellow-200',
            'info': 'bg-blue-50 text-blue-800 border border-blue-200'
        };
        return classes[type] || classes.info;
    }

    // Get notification icon
    function getNotificationIcon(type) {
        const icons = {
            'success': '<svg class="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>',
            'error': '<svg class="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path></svg>',
            'warning': '<svg class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>',
            'info': '<svg class="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>'
        };
        return icons[type] || icons.info;
    }

    // Track events for analytics
    function trackEvent(eventName, data) {
        console.log(`Event: ${eventName}`, data);
        
        // In a real implementation, this would send data to analytics service
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, data);
        }
        
        // Store in localStorage for basic tracking
        const events = JSON.parse(localStorage.getItem('site_events') || '[]');
        events.push({
            event: eventName,
            data: data,
            timestamp: new Date().toISOString()
        });
        
        // Keep only last 100 events
        if (events.length > 100) {
            events.splice(0, events.length - 100);
        }
        
        localStorage.setItem('site_events', JSON.stringify(events));
    }

    // Log page visit
    function logPageVisit() {
        const visitData = {
            page: window.location.pathname,
            referrer: document.referrer,
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString(),
            screenSize: `${screen.width}x${screen.height}`,
            viewportSize: `${window.innerWidth}x${window.innerHeight}`
        };
        
        trackEvent('page_visit', visitData);
    }

    // Add CSS classes for animations
    const style = document.createElement('style');
    style.textContent = `
        .animate-fade-in {
            animation: fadeIn 0.8s ease-in-out;
        }
        
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .ripple {
            position: absolute;
            border-radius: 50%;
            background-color: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
            pointer-events: none;
        }
        
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // Expose some functions globally for debugging
    window.siteTracking = {
        trackEvent,
        getEvents: () => JSON.parse(localStorage.getItem('site_events') || '[]'),
        clearEvents: () => localStorage.removeItem('site_events')
    };
});
