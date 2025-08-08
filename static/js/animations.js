// DiskTools Advanced Animations

class AnimationEngine {
    constructor() {
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.setupHoverEffects();
        this.setupClickAnimations();
        this.initTypewriterEffect();
        this.initFloatingElements();
    }

    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                }
            });
        }, observerOptions);

        // Observe elements with animation classes
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            observer.observe(el);
        });
    }

    animateElement(element) {
        const animationType = element.dataset.animation || 'fadeInUp';
        element.classList.add('animate-' + animationType);
    }

    setupHoverEffects() {
        // Enhanced tool card hover effects
        document.querySelectorAll('.tool-card').forEach(card => {
            card.addEventListener('mouseenter', (e) => {
                this.createHoverGlow(e.target);
                this.animateIcon(e.target.querySelector('.tool-icon'));
            });

            card.addEventListener('mouseleave', (e) => {
                this.removeHoverGlow(e.target);
            });
        });

        // Button hover effects
        document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => {
            btn.addEventListener('mouseenter', (e) => {
                this.createButtonMorph(e.target);
            });
        });
    }

    createHoverGlow(element) {
        const glow = document.createElement('div');
        glow.className = 'hover-glow-effect';
        glow.style.cssText = `
            position: absolute;
            inset: -2px;
            background: linear-gradient(45deg, #667eea, #764ba2, #f093fb);
            border-radius: 22px;
            z-index: -1;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        element.style.position = 'relative';
        element.appendChild(glow);
        
        setTimeout(() => {
            glow.style.opacity = '0.3';
        }, 50);
    }

    removeHoverGlow(element) {
        const glow = element.querySelector('.hover-glow-effect');
        if (glow) {
            glow.style.opacity = '0';
            setTimeout(() => glow.remove(), 300);
        }
    }

    animateIcon(icon) {
        if (icon) {
            icon.style.transform = 'scale(1.1) rotateY(180deg)';
            setTimeout(() => {
                icon.style.transform = '';
            }, 300);
        }
    }

    createButtonMorph(button) {
        button.style.animation = 'morphButton 0.3s ease';
        setTimeout(() => {
            button.style.animation = '';
        }, 300);
    }

    setupClickAnimations() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('.tool-card')) {
                this.createSuccessAnimation(e.target.closest('.tool-card'));
            }
        });
    }

    createSuccessAnimation(element) {
        const success = document.createElement('div');
        success.className = 'success-indicator';
        success.innerHTML = '<i class="fas fa-check"></i>';
        success.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0);
            background: #4ade80;
            color: white;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            animation: successPop 0.6s ease-out;
        `;
        
        element.style.position = 'relative';
        element.appendChild(success);
        
        setTimeout(() => success.remove(), 600);
    }

    initTypewriterEffect() {
        const typewriterElements = document.querySelectorAll('.typewriter');
        typewriterElements.forEach(element => {
            this.typeWriter(element);
        });
    }

    typeWriter(element) {
        const text = element.textContent;
        element.textContent = '';
        element.style.borderRight = '2px solid #667eea';
        
        let i = 0;
        const timer = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(timer);
                // Blinking cursor effect
                setInterval(() => {
                    element.style.borderRight = element.style.borderRight === 'none' 
                        ? '2px solid #667eea' 
                        : 'none';
                }, 500);
            }
        }, 100);
    }

    initFloatingElements() {
        const floatingElements = document.querySelectorAll('.floating');
        floatingElements.forEach((element, index) => {
            element.style.animationDelay = `${index * 0.5}s`;
            element.style.animation = 'float 6s ease-in-out infinite';
        });
    }

    // Particle burst effect
    createParticleBurst(x, y, color = '#667eea') {
        const particleCount = 12;
        const particles = [];
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: fixed;
                left: ${x}px;
                top: ${y}px;
                width: 4px;
                height: 4px;
                background: ${color};
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
            `;
            
            document.body.appendChild(particle);
            particles.push(particle);
            
            const angle = (i / particleCount) * Math.PI * 2;
            const velocity = 100 + Math.random() * 50;
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity;
            
            let posX = x;
            let posY = y;
            let opacity = 1;
            
            const animate = () => {
                posX += vx * 0.02;
                posY += vy * 0.02;
                opacity -= 0.02;
                
                particle.style.left = posX + 'px';
                particle.style.top = posY + 'px';
                particle.style.opacity = opacity;
                
                if (opacity > 0) {
                    requestAnimationFrame(animate);
                } else {
                    particle.remove();
                }
            };
            
            requestAnimationFrame(animate);
        }
    }

    // Loading animation for tools
    showToolLoading(toolElement) {
        const loader = document.createElement('div');
        loader.className = 'tool-loader';
        loader.innerHTML = `
            <div class="loading-spinner"></div>
            <p>Loading tool...</p>
        `;
        loader.style.cssText = `
            position: absolute;
            inset: 0;
            background: rgba(15, 15, 35, 0.9);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            border-radius: 20px;
            z-index: 100;
        `;
        
        toolElement.style.position = 'relative';
        toolElement.appendChild(loader);
        
        return loader;
    }

    hideToolLoading(loader) {
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => loader.remove(), 300);
        }
    }

    // Stagger animation for tool grids
    staggerToolCards() {
        const toolCards = document.querySelectorAll('.tool-card');
        toolCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.6s ease-out';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    // Confetti effect for achievements
    createConfetti() {
        const colors = ['#667eea', '#764ba2', '#f093fb', '#4ade80', '#fbbf24'];
        const confettiCount = 50;
        
        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                left: ${Math.random() * 100}vw;
                top: -10px;
                width: ${Math.random() * 10 + 5}px;
                height: ${Math.random() * 10 + 5}px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                z-index: 1000;
                pointer-events: none;
                animation: confetti ${Math.random() * 3 + 2}s linear forwards;
            `;
            
            document.body.appendChild(confetti);
            
            setTimeout(() => confetti.remove(), 5000);
        }
    }

    // Smooth page transitions
    initPageTransitions() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="/"]');
            if (link && !link.target) {
                e.preventDefault();
                this.transitionToPage(link.href);
            }
        });
    }

    transitionToPage(url) {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            inset: 0;
            background: linear-gradient(45deg, #667eea, #764ba2);
            z-index: 10000;
            transform: translateX(-100%);
            transition: transform 0.5s ease-in-out;
        `;
        
        document.body.appendChild(overlay);
        
        setTimeout(() => {
            overlay.style.transform = 'translateX(0)';
        }, 50);
        
        setTimeout(() => {
            window.location.href = url;
        }, 500);
    }
}

// CSS Keyframes for JavaScript animations
const animationStyles = `
    @keyframes successPop {
        0% { transform: translate(-50%, -50%) scale(0); }
        50% { transform: translate(-50%, -50%) scale(1.2); }
        100% { transform: translate(-50%, -50%) scale(1); }
    }
    
    @keyframes confetti {
        0% { transform: translateY(-10px) rotate(0deg); opacity: 1; }
        100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
    }
    
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    }
    
    .notification.success {
        background: linear-gradient(45deg, #4ade80, #22c55e);
    }
    
    .notification.error {
        background: linear-gradient(45deg, #ef4444, #dc2626);
    }
    
    .notification.show {
        transform: translateX(0);
    }
`;

// Inject animation styles
const styleSheet = document.createElement('style');
styleSheet.textContent = animationStyles;
document.head.appendChild(styleSheet);

// Initialize animation engine
document.addEventListener('DOMContentLoaded', () => {
    new AnimationEngine();
});

// Export for use in other scripts
window.AnimationEngine = AnimationEngine;
