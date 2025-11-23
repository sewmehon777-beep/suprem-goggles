// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded - initializing scripts');
    
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    // Mobile menu toggle
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            // Toggle hamburger icon
            const icon = hamburger.querySelector('i');
            if (icon.classList.contains('fa-bars')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                // Reset hamburger icon
                const icon = hamburger.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    });

    // Active navigation link highlighting
    function updateActiveNav() {
        const currentPage = window.location.pathname.split('/').pop() || 'home.html';
        const navLinks = document.querySelectorAll('.nav-links a');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const linkPage = link.getAttribute('href');
            if (linkPage === currentPage || (currentPage === '' && linkPage === 'home.html')) {
                link.classList.add('active');
            }
        });
    }

    // Form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const name = this.querySelector('input[type="text"]').value;
            const email = this.querySelector('input[type="email"]').value;
            
            // Show success message
            const currentLang = localStorage.getItem('preferredLanguage') || 'en';
            const messages = {
                en: `Thank you ${name}! Your message has been sent successfully. I'll get back to you soon at ${email}.`,
                am: `አመሰግናለሁ ${name}! መልእክትዎ በተሳካ ሁኔታ ቀርቧል። በቅርብ ጊዜ በ${email} እገናኝዎታለሁ።`,
                om: `Galatoomaa ${name}! Ergaa keessan sirriitti ergameera. Fuula duraa email ${email} irratti siin deebi'na.`,
                ar: `شكراً ${name}! تم إرسال رسالتك بنجاح. سأعود إليك قريباً على ${email}.`,
                ti: `የቕንየለይ ${name}! መልእኽቲኻ ብኽብረት ተለኪጹ። ብቕልጡፍ ኣብ ${email} ክምለስካ እየ።`
            };
            
            alert(messages[currentLang] || messages.en);
            this.reset();
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Language Switching Functionality
    function initializeLanguageSelector() {
        console.log('Initializing language selector');
        
        const languageToggle = document.getElementById('languageToggle');
        const languageDropdown = document.getElementById('languageDropdown');
        const currentLang = document.getElementById('currentLang');
        const langOptions = document.querySelectorAll('.lang-option');

        // Set initial language
        let currentLanguage = localStorage.getItem('preferredLanguage') || 'en';
        console.log('Current language:', currentLanguage);
        updateLanguage(currentLanguage);

        // Toggle dropdown
        if (languageToggle && languageDropdown) {
            languageToggle.addEventListener('click', function(e) {
                e.stopPropagation();
                console.log('Language toggle clicked');
                languageDropdown.classList.toggle('show');
            });
        } else {
            console.error('Language toggle or dropdown not found');
        }

        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (languageDropdown && 
                !languageToggle.contains(e.target) && 
                !languageDropdown.contains(e.target)) {
                languageDropdown.classList.remove('show');
            }
        });

        // Language selection
        langOptions.forEach(option => {
            option.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                const selectedLang = this.getAttribute('data-lang');
                console.log('Language selected:', selectedLang);
                updateLanguage(selectedLang);
                if (languageDropdown) {
                    languageDropdown.classList.remove('show');
                }
                localStorage.setItem('preferredLanguage', selectedLang);
            });
        });

        function updateLanguage(lang) {
            console.log('Updating language to:', lang);
            
            // Update all translatable elements
            document.querySelectorAll('[data-en], [data-am], [data-om], [data-ar], [data-ti]').forEach(element => {
                const translation = element.getAttribute(`data-${lang}`);
                if (translation) {
                    if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                        element.placeholder = translation;
                    } else {
                        element.textContent = translation;
                    }
                }
            });

            // Update current language display
            if (currentLang) {
                currentLang.textContent = lang.toUpperCase();
            }

            // Update HTML attributes
            document.documentElement.lang = lang;
            if (lang === 'ar') {
                document.documentElement.dir = 'rtl';
            } else {
                document.documentElement.dir = 'ltr';
            }
        }
    }

    // Welcome Popup Logic
    function initializeWelcomePopup() {
        console.log('Initializing welcome popup');
        
        const welcomePopup = document.getElementById('welcomePopup');
        const closePopup = document.querySelector('.close-popup');
        const welcomeBadge = document.querySelector('.welcome-badge');
        const exploreBtn = document.getElementById('exploreBtn');
        const learnMoreBtn = document.getElementById('learnMoreBtn');

        if (!welcomePopup) {
            console.error('Welcome popup element not found');
            return;
        }

        // Check if user has seen the welcome message before
        const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');

        // Show welcome popup only if it's the first visit and on home page
        const isHomePage = window.location.pathname.endsWith('home.html') || 
                          window.location.pathname.endsWith('/') || 
                          window.location.pathname === '' ||
                          window.location.pathname.includes('home.html');

        if (!hasSeenWelcome && isHomePage) {
            console.log('Showing welcome popup - first visit');
            setTimeout(() => {
                welcomePopup.classList.add('active');
                document.body.style.overflow = 'hidden';
            }, 1000);
        }

        // Close popup function
        function closeWelcomePopup() {
            console.log('Closing welcome popup');
            welcomePopup.classList.remove('active');
            document.body.style.overflow = 'auto';
            localStorage.setItem('hasSeenWelcome', 'true');
        }

        // Close popup when X is clicked
        if (closePopup) {
            closePopup.addEventListener('click', function(e) {
                e.stopPropagation();
                closeWelcomePopup();
            });
        }

        // Explore button closes popup
        if (exploreBtn) {
            exploreBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                closeWelcomePopup();
            });
        }

        // Learn More button navigates to about page
        if (learnMoreBtn) {
            learnMoreBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                closeWelcomePopup();
                setTimeout(() => {
                    window.location.href = 'about.html';
                }, 300);
            });
        }

        // Close popup when clicking outside
        welcomePopup.addEventListener('click', (e) => {
            if (e.target === welcomePopup) {
                closeWelcomePopup();
            }
        });

        // Reopen popup when welcome badge is clicked
        if (welcomeBadge) {
            welcomeBadge.addEventListener('click', function(e) {
                e.stopPropagation();
                console.log('Welcome badge clicked');
                welcomePopup.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        }

        // Close popup with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && welcomePopup.classList.contains('active')) {
                closeWelcomePopup();
            }
        });
    }

    // Skill bar animation
    function animateSkillBars() {
        const skills = document.querySelectorAll('.skill-level');
        skills.forEach(skill => {
            const width = skill.style.width;
            skill.style.width = '0';
            setTimeout(() => {
                skill.style.width = width;
            }, 500);
        });
    }

    // Initialize all functionality
    initializeLanguageSelector();
    initializeWelcomePopup();
    updateActiveNav();

    // Animate skill bars when about page is loaded
    if (window.location.pathname.includes('about.html')) {
        setTimeout(animateSkillBars, 1000);
    }

    // Add click animations
    document.querySelectorAll('a, button').forEach(element => {
        element.addEventListener('click', function(e) {
            // Don't add ripple to links that navigate away
            if (this.tagName === 'A' && this.getAttribute('href') && 
                !this.getAttribute('href').startsWith('#')) {
                return;
            }
            
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('span');
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    console.log('All scripts initialized successfully');
});

// Global functions for testing
function resetWelcomeMessage() {
    localStorage.removeItem('hasSeenWelcome');
    alert('Welcome message has been reset. Refresh the page to see it again.');
    location.reload();
}

function showWelcomePopup() {
    const welcomePopup = document.getElementById('welcomePopup');
    if (welcomePopup) {
        welcomePopup.classList.add('active');
        document.body.style.overflow = 'hidden';
    } else {
        alert('Welcome popup element not found!');
    }
}

function testLanguage(lang) {
    const currentLang = document.getElementById('currentLang');
    if (currentLang) {
        currentLang.textContent = lang.toUpperCase();
    }
    alert(`Language test: ${lang}`);
}

// Export functions for global access
window.resetWelcomeMessage = resetWelcomeMessage;
window.showWelcomePopup = showWelcomePopup;
window.testLanguage = testLanguage;