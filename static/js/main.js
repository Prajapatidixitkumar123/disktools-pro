document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            const isHidden = mobileMenu.classList.contains('hidden');

            if (isHidden) {
                // Make it visible before starting the animation
                mobileMenu.classList.remove('hidden');
                // Use a timeout to allow the DOM to update before adding the active class
                setTimeout(() => {
                    mobileMenu.classList.add('active');
                }, 10);
            } else {
                // Start the closing animation
                mobileMenu.classList.remove('active');
                // Listen for the animation to end before hiding it
                mobileMenu.addEventListener('transitionend', () => {
                    mobileMenu.classList.add('hidden');
                }, { once: true });
            }
        });
    }

    // Optional: Close the menu when a link inside it is clicked
    const mobileMenuLinks = document.querySelectorAll('#mobileMenu a');
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
                mobileMenu.addEventListener('transitionend', () => {
                    mobileMenu.classList.add('hidden');
                }, { once: true });
            }
        });
    });
});

class DiskTools {
    constructor() {
        this.isLoading = false;
        this.currentTheme = localStorage.getItem('disktools-theme') || 'dark';
        this.notifications = [];
        this.searchIndex = [];
        this.init();
    }

    init() {
        console.log('🚀 DiskTools Pro initialized');
        this.setupEventListeners();
        this.setupTheme();
        this.setupSearch();
        this.setupToolCards();
        this.initScrollAnimations();
        this.initParticles();
        this.setupKeyboardShortcuts();
        this.initPerformanceOptimizations();
        this.setupProgressiveEnhancements();
    }

    setupEventListeners() {
        // Mobile menu toggle
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const mobileMenu = document.getElementById('mobileMenu');
        
        // Theme toggle functionality
        const themeToggle = document.getElementById('themeToggle');
        const themeToggleMobile = document.getElementById('themeToggleMobile');
        
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }
        
        if (themeToggleMobile) {
            themeToggleMobile.addEventListener('click', () => {
                this.toggleTheme();
            });
        }
        
        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
            
            // Close mobile menu when clicking on menu links
            mobileMenu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    this.toggleMobileMenu();
                    this.closeMobileMenu();
                });
            });
        }
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            const mobileMenu = document.getElementById('mobileMenu');
            const mobileMenuBtn = document.getElementById('mobileMenuBtn');
            
            if (mobileMenu && !mobileMenu.classList.contains('hidden') && 
                !mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                this.closeMobileMenu();
            }
        });

    }

    toggleMobileMenu() {
        const mobileMenu = document.getElementById('mobileMenu');
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const icon = mobileMenuBtn.querySelector('i');

        mobileMenu.classList.toggle('hidden');
        mobileMenuBtn.classList.toggle('active');

        if (mobileMenu.classList.contains('hidden')) {
            icon.className = 'fas fa-bars text-xl';
        } else {
            icon.className = 'fas fa-times text-xl';
        }
    }

    closeMobileMenu() {
        const mobileMenu = document.getElementById('mobileMenu');
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const icon = mobileMenuBtn.querySelector('i');

        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
            mobileMenuBtn.classList.remove('active');
            icon.className = 'fas fa-bars text-xl';
        }
    }

    setupTheme() {
        document.addEventListener('click', (e) => {
            const toolCard = e.target.closest('.tool-card');
            if (toolCard) {
                this.handleToolCardClick(toolCard);
            }
        });

        // Search functionality
        const searchInput = document.querySelector('#toolSearch');
        if (searchInput) {
            searchInput.addEventListener('input', this.handleSearch.bind(this));
        }

        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', this.handleSmoothScroll);
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', this.handleKeyboardShortcuts.bind(this));
    }

    setupTheme() {
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        this.applyTheme(this.currentTheme);
        
        // Initialize theme toggle icons
        const themeToggle = document.getElementById('themeToggle');
        const themeToggleMobile = document.getElementById('themeToggleMobile');
        
        const updateIcon = (button) => {
            if (button) {
                const icon = button.querySelector('i');
                if (this.currentTheme === 'dark') {
                    icon.classList.remove('fa-sun');
                    icon.classList.add('fa-moon');
                } else {
                    icon.classList.remove('fa-moon');
                    icon.classList.add('fa-sun');
                }
            }
        };
        
        updateIcon(themeToggle);
        updateIcon(themeToggleMobile);
    }

    createThemeToggle() {
        const themeToggle = document.createElement('button');
        themeToggle.id = 'themeToggle';
        themeToggle.className = 'theme-toggle-btn';
        themeToggle.setAttribute('aria-label', 'Toggle theme');
        themeToggle.setAttribute('data-tooltip', 'Toggle Dark/Light Mode');
        
        const icon = document.createElement('i');
        icon.className = this.currentTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
        
        themeToggle.appendChild(icon);
        
        themeToggle.addEventListener('click', () => this.toggleTheme());
        
        return themeToggle;
    }

    setupSearch() {
        const toolCards = document.querySelectorAll('.tool-card');
        this.searchIndex = Array.from(toolCards).map(card => ({
            title: card.querySelector('.tool-title').textContent.toLowerCase(),
            description: card.querySelector('.tool-description').textContent.toLowerCase(),
            element: card
        }));
    }

    setupToolCards() {
        const toolCards = document.querySelectorAll('.tool-card');
        toolCards.forEach(card => {
            card.addEventListener('mousemove', (e) => this.handleCard3DEffect(e, card));
            card.addEventListener('mouseleave', () => this.resetCard3DEffect(card));
        });
    }

    handleToolCardClick(card) {
        if (card.classList.contains('coming-soon')) {
            this.showNotification('This tool is coming soon!', 'info');
            return;
        }
        const link = card.dataset.link;
        if (link) window.location.href = link;
    }

    handleSearch(e) {
        const query = e.target.value.toLowerCase();
        this.searchIndex.forEach(item => {
            const isVisible = item.title.includes(query) || item.description.includes(query);
            item.element.style.display = isVisible ? 'block' : 'none';
            if (isVisible) {
                item.element.classList.add('scroll-reveal', 'revealed');
            } else {
                item.element.classList.remove('revealed');
            }
        });
    }

    handleSmoothScroll(e) {
        e.preventDefault();
        const href = e.currentTarget.getAttribute('href');
        const targetElement = document.querySelector(href);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
    }

    handleKeyboardShortcuts(e) {
        if (e.key === 't' && e.ctrlKey) {
            e.preventDefault();
            this.toggleTheme();
        }
    }

    toggleMobileMenu() {
        const mobileMenu = document.getElementById('mobileMenu');
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');

        if (mobileMenu && mobileMenuBtn) {
            const isActive = mobileMenuBtn.classList.contains('active');
            mobileMenu.classList.toggle('hidden', isActive);
            mobileMenuBtn.classList.toggle('active', !isActive);
            document.body.classList.toggle('body-no-scroll', !isActive);
        }
    }

    closeMobileMenu() {
        const mobileMenu = document.getElementById('mobileMenu');
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');

        if (mobileMenu && mobileMenuBtn) {
            mobileMenu.classList.add('hidden');
            mobileMenuBtn.classList.remove('active');
            document.body.classList.remove('body-no-scroll');
        }
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('disktools-theme', newTheme);
        this.currentTheme = newTheme;
        
        // Update theme toggle icons
        const themeToggle = document.getElementById('themeToggle');
        const themeToggleMobile = document.getElementById('themeToggleMobile');
        
        const updateIcon = (button) => {
            if (button) {
                const icon = button.querySelector('i');
                if (newTheme === 'dark') {
                    icon.classList.remove('fa-sun');
                    icon.classList.add('fa-moon');
                } else {
                    icon.classList.remove('fa-moon');
                    icon.classList.add('fa-sun');
                }
            }
        };
        
        updateIcon(themeToggle);
        updateIcon(themeToggleMobile);
        
        // Apply theme styles
        this.applyTheme(newTheme);
    }

    applyTheme(theme) {
        // This could be expanded to dynamically load theme-specific stylesheets
        console.log(`Theme changed to ${theme}`);
    }

    initScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.scroll-reveal').forEach(el => {
            observer.observe(el);
        });
    }

    initParticles() {
        const container = document.querySelector('.particles-container');
        if (!container) return;
        for (let i = 0; i < 50; i++) {
            const particle = this.createParticle();
            container.appendChild(particle);
        }
    }

    createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        const size = Math.random() * 3 + 1;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.animationDuration = `${Math.random() * 10 + 10}s`;
        particle.style.animationDelay = `${Math.random() * 5}s`;
        
        const colors = ['#667eea', '#764ba2', '#f093fb', '#ffffff'];
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];

        // Randomize horizontal movement
        particle.animate([
            { transform: `translateX(0px)` },
            { transform: `translateX(${Math.random() * 100 - 50}px)` },
            { transform: `translateX(0px)` }
        ], {
            duration: Math.random() * 10000 + 5000,
            iterations: Infinity,
            direction: 'alternate',
            easing: 'ease-in-out'
        });

        return particle;
    }

    createRippleEffect(e) {
        const target = e.currentTarget;
        const circle = document.createElement('span');
        const diameter = Math.max(target.clientWidth, target.clientHeight);
        const radius = diameter / 2;

        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${e.clientX - target.offsetLeft - radius}px`;
        circle.style.top = `${e.clientY - target.offsetTop - radius}px`;
        circle.classList.add('ripple');

        const ripple = target.getElementsByClassName('ripple')[0];
        if (ripple) {
            ripple.remove();
        }

        target.appendChild(circle);
    }

    // Professional Enhancement Methods
    initPerformanceOptimizations() {
        // Passive event listeners for scrolling
        document.addEventListener('wheel', () => {}, { passive: true });
        document.addEventListener('touchmove', () => {}, { passive: true });

        // Debounce resize events
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => console.log('Resized'), 250);
        });
    }

    setupLazyLoading() {
        const lazyImages = document.querySelectorAll('img[data-src]');
        const lazyObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => lazyObserver.observe(img));
    }

    preloadCriticalResources() {
        // Preload critical CSS/JS files or fonts
        const criticalFont = document.createElement('link');
        criticalFont.rel = 'preload';
        criticalFont.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&family=JetBrains+Mono&display=swap';
        criticalFont.as = 'style';
        document.head.appendChild(criticalFont);

        // Preconnect to important origins
        const googleFonts1 = document.createElement('link');
        googleFonts1.rel = 'preconnect';
        googleFonts1.href = 'https://fonts.googleapis.com';
        document.head.appendChild(googleFonts1);
    }

    setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/service-worker.js')
                    .then(registration => console.log('ServiceWorker registration successful'))
                    .catch(err => console.log('ServiceWorker registration failed: ', err));
            });
        } else {
            console.log('Service Worker not supported');
        }
    }

    setupProgressiveEnhancements() {
        document.body.classList.add('js-enabled');

        // Example: Convert static cards to interactive ones
        const cards = document.querySelectorAll('.tool-card');
        cards.forEach(card => {
            // Add hover effects or other JS-dependent features
            card.style.setProperty('--glow-color', '#667eea');
        });
    }

    setupLoadingStates() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link && link.href && link.target !== '_blank') {
                // Check if it's not a smooth scroll link
                if (!link.getAttribute('href').startsWith('#')) {
                    document.body.classList.add('is-loading');
                    // Show a global spinner
                    const spinner = document.createElement('div');
                    spinner.className = 'spinner';
                    document.body.appendChild(spinner);
                }
            }
        });
    }

    setupKeyboardNavigation() {
        const focusableElements = 'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])';
        const toolCards = Array.from(document.querySelectorAll('.tool-card'));

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                // Basic focus trapping can be added here for modals
            }

            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                const activeElement = document.activeElement;
                if (toolCards.includes(activeElement)) {
                    e.preventDefault();
                    const currentIndex = toolCards.indexOf(activeElement);
                    let nextIndex = -1;

                    if (e.key === 'ArrowRight') nextIndex = (currentIndex + 1) % toolCards.length;
                    if (e.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + toolCards.length) % toolCards.length;
                    // Add up/down logic based on grid layout if needed

                    if (nextIndex !== -1) this.focusToolCard(toolCards[nextIndex]);
                }
            }
        });
    }

    focusToolCard(card) {
        if (card) {
            card.focus();
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    setupTouchGestures() {
        let touchStartX = 0;
        let touchEndX = 0;

        document.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        document.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        }, { passive: true });

        function handleSwipe() {
            if (touchEndX < touchStartX - 50) {
                // Swiped left
                console.log('Swiped Left');
                // Example: this.navigateSection('next');
            }

            if (touchEndX > touchStartX + 50) {
                // Swiped right
                console.log('Swiped Right');
                // Example: this.navigateSection('prev');
            }
        }
    }

    navigateSection(direction) {
        const sections = Array.from(document.querySelectorAll('section'));
        const currentSectionIndex = sections.findIndex(sec => sec.getBoundingClientRect().top > -window.innerHeight / 2);
        
        let nextSectionIndex;
        if (direction === 'next') {
            nextSectionIndex = Math.min(currentSectionIndex + 1, sections.length - 1);
        } else {
            nextSectionIndex = Math.max(currentSectionIndex - 1, 0);
        }

        if (sections[nextSectionIndex]) {
            sections[nextSectionIndex].scrollIntoView({ behavior: 'smooth' });
        }
    }

    setupAnalytics() {
        // Basic analytics consent check
        const consent = localStorage.getItem('disktools-analytics-consent');
        if (consent !== 'granted') {
            // Show a consent banner or modal
            console.log('Analytics consent not granted.');
            return;
        }
        this.trackEvent('page_view', { path: window.location.pathname });

        // Track outbound links
        document.addEventListener('click', e => {
            const link = e.target.closest('a');
            if (link && new URL(link.href).hostname !== window.location.hostname) {
                this.trackEvent('outbound_link_click', { url: link.href });
            }
        });

        // Track search usage
        const searchInput = document.querySelector('#toolSearch');
        if (searchInput) {
            let searchTimeout;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    if (e.target.value.length > 2) {
                        this.trackEvent('search', { query: e.target.value });
                    }
                }, 1000);
            });
        }
    }

    trackEvent(eventName, data) {
        const analytics = JSON.parse(localStorage.getItem('disktools-analytics') || '[]');
        analytics.push({
            event: eventName,
            data: data,
            timestamp: new Date().toISOString()
        });

        // Keep only last 100 events
        if (analytics.length > 100) {
            analytics.splice(0, analytics.length - 100);
        }

        localStorage.setItem('disktools-analytics', JSON.stringify(analytics));
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${this.getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        `;

        document.body.appendChild(notification);

        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);

        // Auto hide after 4 seconds
        const hideTimeout = setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 4000);

        // Manual close
        notification.querySelector('.notification-close').addEventListener('click', () => {
            clearTimeout(hideTimeout);
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        });
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }
}

// API Helper Functions
class ToolAPI {
    async callTool(toolName, data) {
        try {
            const response = await fetch(`/tools/${toolName}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            return await response.json();
        } catch (error) {
            console.error(`Error calling ${toolName}:`, error);
            this.showError('An unexpected error occurred.');
        }
    }

    showLoading(element) {
        // Add loading indicator logic
    }

    hideLoading(element) {
        // Remove loading indicator logic
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showNotification(message, type) {
        // This is not ideal, but avoids circular dependencies or complex instance management
        const tempDiskTools = new DiskTools();
        tempDiskTools.showNotification(message, type);
    }
}

// Initialize DiskTools when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const diskToolsApp = new DiskTools();
    window.diskTools = diskToolsApp; // Make instance globally available if needed

    // Mobile optimizations
    function initMobileOptimizations() {
        const isMobile = window.innerWidth <= 768;

        if (isMobile) {
            console.log('Mobile device detected, applying optimizations');

            // Add mobile class to body
            document.body.classList.add('mobile-device');

            // Optimize touch scrolling
            document.body.style.webkitOverflowScrolling = 'touch';

            // Fix viewport height for mobile browsers
            const setVH = () => {
                let vh = window.innerHeight * 0.01;
                document.documentElement.style.setProperty('--vh', `${vh}px`);
            };
            setVH();
            window.addEventListener('resize', setVH);

            // Prevent double-tap zoom (but allow single taps)
            let lastTouchEnd = 0;
            document.addEventListener('touchend', (event) => {
                const now = (new Date()).getTime();
                if (now - lastTouchEnd <= 300) {
                    // Only prevent if not clicking on interactive elements
                    if (!event.target.closest('button, a, input, select, textarea')) {
                        event.preventDefault();
                    }
                }
                lastTouchEnd = now;
            }, false);
        }
    }

    // Initialize mobile optimizations
    initMobileOptimizations();

    // Back to top functionality
    const backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.style.opacity = '1';
            } else {
                backToTopBtn.style.opacity = '0.5';
            }
        });
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});

// Export for use in other scripts if needed
window.DiskTools = DiskTools;
window.ToolAPI = ToolAPI;
