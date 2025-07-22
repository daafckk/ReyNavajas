document.addEventListener('DOMContentLoaded', function() {
    const splashScreen = document.getElementById('splash-screen');
    const mainContent = document.querySelector('.content');
    const typingTextElement = document.getElementById('typing-text');
    const progressBar = document.querySelector('.progress');
    const percentageText = document.querySelector('.loading-percentage');

    const typingMessage = "REY NAVAJAS";
    let typeIndex = 0;
    let typeIntervalId;

    function typeWriterEffect() {
        if (typeIndex < typingMessage.length) {
            typingTextElement.textContent += typingMessage.charAt(typeIndex);
            typeIndex++;
            typeIntervalId = setTimeout(typeWriterEffect, 100);
        } else {
            // After typing, start blinking cursor for a moment
            typingTextElement.style.borderRight = '3px solid transparent'; // Hide for blink animation
            setTimeout(() => {
                typingTextElement.style.borderRight = 'none'; // Permanently hide after blink
            }, 1500); // Blink for 1.5 seconds
        }
    }

    function simulateLoadingProgress() {
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 10 + 5; // Faster, more varied progress
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                // Ensure progress bar is full before hiding splash
                progressBar.style.width = '100%';
                percentageText.textContent = '100%';
                hideSplashScreen();
            }
            progressBar.style.width = `${progress}%`;
            percentageText.textContent = `${Math.floor(progress)}%`;
        }, 150); // Faster update
    }

    function hideSplashScreen() {
        clearTimeout(typeIntervalId); // Stop typing effect immediately
        splashScreen.classList.add('hidden');
        setTimeout(() => {
            mainContent.classList.add('visible');
            initApp();
        }, 800); // Allow fade-out transition to complete
    }

    function createParticles() {
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'particles';
        splashScreen.appendChild(particlesContainer);

        const particleCount = 40; // Fewer, more prominent particles
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';

            const size = Math.random() * 4 + 2; // Size between 2px and 6px
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;

            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;

            const duration = Math.random() * 12 + 8; // Duration between 8s and 20s
            particle.style.animationDuration = `${duration}s`;

            const delay = Math.random() * 6; // Delay up to 6s
            particle.style.animationDelay = `${delay}s`;

            // Random direction for horizontal movement
            const direction = Math.random() > 0.5 ? 1 : -1;
            particle.style.setProperty('--random-x', `${Math.random() * 100 * direction}vw`);

            particlesContainer.appendChild(particle);
        }
    }

    // Initialize splash screen effects
    typeWriterEffect();
    simulateLoadingProgress();
    createParticles();


    // Main App Initialization
    function initApp() {
        setupNavigation();
        animateOnScroll();
        setupEventListeners();
        setupCarousel();
        preloadImages();
    }

    // --- Navigation ---
    function setupNavigation() {
        const menuToggle = document.querySelector('.menu-toggle');
        const navLinks = document.querySelector('.nav-links');
        const header = document.querySelector('header');
        const navItems = document.querySelectorAll('.nav-links a');

        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');
            document.body.classList.toggle('no-scroll'); // Add/remove class to body
        });

        navItems.forEach(link => {
            link.addEventListener('click', function(e) {
                // Check if it's a valid hash link and not just '#'
                if (this.hash && this.hash !== '#') {
                    e.preventDefault();
                    const targetId = this.hash;
                    const targetElement = document.querySelector(targetId);

                    if (targetElement) {
                        const headerOffset = header.offsetHeight;
                        const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                        const offsetPosition = elementPosition - headerOffset - 20; // Add some extra padding

                        window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                        });
                    }
                }

                // Close mobile menu after clicking a link
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    menuToggle.classList.remove('active');
                    document.body.classList.remove('no-scroll');
                }

                // Update active link styling
                navItems.forEach(item => item.classList.remove('active'));
                this.classList.add('active');
            });
        });

        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            // Highlight active link based on scroll position
            let currentActive = '';
            document.querySelectorAll('section').forEach(section => {
                const sectionTop = section.offsetTop - header.offsetHeight - 50; // Adjust for header height and padding
                const sectionHeight = section.clientHeight;
                if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
                    currentActive = section.getAttribute('id');
                }
            });

            navItems.forEach(item => {
                item.classList.remove('active');
                if (item.getAttribute('href').includes(currentActive)) {
                    item.classList.add('active');
                }
            });

            // Special handling for the 'Inicio' link
            if (window.scrollY < document.getElementById('services').offsetTop - header.offsetHeight - 50) {
                 document.querySelector('.nav-links a[href="#hero"]').classList.add('active');
            }
        });
    }

    // --- Animations on Scroll ---
    function animateOnScroll() {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1 // Trigger when 10% of the element is visible
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    // Stop observing elements that should only animate once
                    if (entry.target.dataset.animateOnce === 'true' ||
                        entry.target.classList.contains('section-header') ||
                        entry.target.classList.contains('service-card') ||
                        entry.target.classList.contains('barber-card') ||
                        entry.target.classList.contains('gallery-item') ||
                        entry.target.classList.contains('testimonial-card') ||
                        entry.target.classList.contains('about-image') ||
                        entry.target.classList.contains('about-text') ||
                        entry.target.classList.contains('contact-info') ||
                        entry.target.classList.contains('contact-form-container')) {
                        observer.unobserve(entry.target);
                    }
                }
            });
        }, observerOptions);

        // Observe all elements that have an animation class
        document.querySelectorAll(
            '.animate-fade-in, .animate-fade-up, .animate-slide-up, .animate-slide-left, .animate-slide-right, .animate-zoom-in'
        ).forEach(el => {
            observer.observe(el);
        });
    }

    // --- Event Listeners ---
    function setupEventListeners() {
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const formMessage = document.getElementById('formMessage');
                const submitButton = this.querySelector('.form-submit-btn');
                const originalText = submitButton.textContent;

                submitButton.disabled = true;
                submitButton.textContent = 'Enviando...';
                formMessage.style.display = 'none';

                // Simulate form submission
                setTimeout(() => {
                    const success = Math.random() > 0.3; // Simulate 70% success rate
                    if (success) {
                        formMessage.classList.remove('error');
                        formMessage.classList.add('success');
                        formMessage.textContent = '¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.';
                        this.reset();
                    } else {
                        formMessage.classList.remove('success');
                        formMessage.classList.add('error');
                        formMessage.textContent = 'Error al enviar el mensaje. Por favor, inténtalo de nuevo más tarde.';
                    }
                    formMessage.style.display = 'block';

                    setTimeout(() => {
                        submitButton.textContent = originalText;
                        submitButton.disabled = false;
                        formMessage.style.display = 'none'; // Hide message after a few seconds
                    }, 3000);
                }, 1500);
            });
        }
    }

    // --- Testimonial Carousel ---
    function setupCarousel() {
        const carousel = document.querySelector('.testimonial-carousel');
        const prevBtn = document.querySelector('.carousel-prev');
        const nextBtn = document.querySelector('.carousel-next');

        if (!carousel || !prevBtn || !nextBtn) return;

        let currentIndex = 0;
        const cards = document.querySelectorAll('.testimonial-card');
        const cardWidth = cards[0].offsetWidth + 30; // Card width + gap

        function updateCarousel() {
            carousel.scrollTo({
                left: currentIndex * cardWidth,
                behavior: 'smooth'
            });
        }

        prevBtn.addEventListener('click', () => {
            currentIndex = Math.max(0, currentIndex - 1);
            updateCarousel();
        });

        nextBtn.addEventListener('click', () => {
            currentIndex = Math.min(cards.length - 1, currentIndex + 1);
            updateCarousel();
        });

        // Optional: Auto-slide
        // setInterval(() => {
        //     currentIndex = (currentIndex + 1) % cards.length;
        //     updateCarousel();
        // }, 5000); // Change slide every 5 seconds
    }


    // --- Preload Images ---
    function preloadImages() {
        const images = [
            'img/barber1.jpg', 'img/barber2.jpg', 'img/barber3.jpg',
            'img/gallery1.jpg', 'img/gallery2.jpg', 'img/gallery3.jpg',
            'img/gallery4.jpg', 'img/gallery5.jpg', 'img/gallery6.jpg',
            'img/client1.jpg', 'img/client2.jpg', 'img/client3.jpg',
            'img/barber-tools.jpg', 'img/logo-icon.png'
        ];
        images.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }

    // Helper for adding/removing no-scroll class
    // This is added to body to prevent scrolling when mobile menu is open
    document.body.classList.add('no-scroll-initial');
    window.addEventListener('load', () => {
        document.body.classList.remove('no-scroll-initial');
    });

});