document.addEventListener('DOMContentLoaded', function() {
    // Element References
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const hamburgerClose = document.getElementById('hamburgerClose');
    const navLinks = document.getElementById('navLinks');
    const toggleBtnHeader = document.getElementById('toggleModeBtnHeader'); // Button in header-right-controls
    const toggleBtnNav = document.getElementById('toggleModeBtnNav');     // Button inside nav-links
    const backToTopButton = document.getElementById('backToTop');

    // Helper to check if it's a mobile view
    const isMobileView = () => window.innerWidth <= 768;

    // --- Workaround for Android/Redmi width issue (START) ---
    function setFullWidthForBodyAndHtml() {
        const viewportWidth = window.innerWidth;
        document.documentElement.style.width = `${viewportWidth}px`;
        document.body.style.width = `${viewportWidth}px`;
        // console.log(`Forced html/body width to: ${viewportWidth}px`); // Commented out for cleaner console
    }
    setFullWidthForBodyAndHtml();
    // --- Workaround for Android/Redmi width issue (END) ---

    // Open Menu
    function openMenu() {
        navLinks.classList.add('open');
        if (hamburgerMenu) hamburgerMenu.style.display = 'none';
        if (hamburgerClose) hamburgerClose.style.display = 'block';
        document.documentElement.style.overflow = 'hidden';
        if (hamburgerMenu) hamburgerMenu.setAttribute('aria-expanded', 'true');
        if (hamburgerClose) hamburgerClose.setAttribute('aria-expanded', 'true');

        // FIX: Hide the mobile dark mode toggle button when menu is open
        if (toggleBtnHeader && isMobileView()) { // Only hide on mobile view
            toggleBtnHeader.style.display = 'none';
        }
    }

    // Close Menu
    function closeMenu() {
        navLinks.classList.remove('open');
        if (hamburgerMenu) hamburgerMenu.style.display = 'block';
        if (hamburgerClose) hamburgerClose.style.display = 'none'; // Corrected: should hide hamburgerClose
        document.documentElement.style.overflow = '';
        document.querySelectorAll('.dropdown.open').forEach(d => {
            d.classList.remove('open');
            const dropdownToggle = d.querySelector('.dropdown-toggle');
            if (dropdownToggle) dropdownToggle.setAttribute('aria-expanded', 'false');
        });
        if (hamburgerMenu) hamburgerMenu.setAttribute('aria-expanded', 'false');
        if (hamburgerClose) hamburgerClose.setAttribute('aria-expanded', 'false'); // Corrected: should hide hamburgerClose

        // FIX: Show the mobile dark mode toggle button when menu is closed
        // Only show if it's mobile view and the menu is closed
        if (toggleBtnHeader && isMobileView()) {
             toggleBtnHeader.style.display = 'block';
        }
    }

    // Update Images (Logo and Section Images) Based on Mode
    function updateImages() {
        const isDark = document.body.classList.contains('dark');

        const logo = document.getElementById('logo-img');
        if (logo) {
            logo.src = isDark ? '/images/logo-dark.webp' : '/images/logo-light.webp';
            logo.alt = isDark ? 'Aeosignal.Space Logo Dark Mode' : 'Aeosignal.Space Logo Light Mode';
        }

        const sectionImages = [
            { id: 'why-geo-img', light: '/images/why-geo-light.webp', dark: '/images/why-geo-dark.webp', altLight: 'Illustration showing AI concepts for GEO (Light Mode)', altDark: 'Illustration showing AI concepts for GEO (Dark Mode)' },
            { id: 'what-img', light: '/images/what-we-do-light.webp', dark: '/images/what-we-do-dark.webp', altLight: 'Illustration of services offered for GEO (Light Mode)', altDark: 'Illustration of services offered for GEO (Dark Mode)' },
            { id: 'how-img', light: '/images/how-it-works-light.webp', dark: '/images/how-it-works-dark.webp', altLight: 'Illustration depicting how GEO process works (Light Mode)', altDark: 'Illustration depicting how GEO process works (Dark Mode)' },
            { id: 'why-img', light: '/images/why-aeosignal-light.webp', dark: '/images/why-aeosignal-dark.webp', altLight: 'Illustration of why choose Aeosignal for GEO (Light Mode)', altDark: 'Illustration of why choose Aeosignal for GEO (Dark Mode)' },
        ];

        sectionImages.forEach(imgData => {
            const el = document.getElementById(imgData.id);
            if (el) {
                el.src = isDark ? imgData.dark : imgData.light;
                el.alt = isDark ? imgData.altDark : imgData.altLight;
            }
        });

        document.querySelectorAll('[data-light-bg][data-dark-bg]').forEach(element => {
            const lightBg = element.getAttribute('data-light-bg');
            const darkBg = element.getAttribute('data-dark-bg');
            if (lightBg && darkBg) {
                element.style.backgroundImage = `url('${isDark ? darkBg : lightBg}')`;
            }
        });

        const themeAwareImages = document.querySelectorAll('.theme-aware-image');
        themeAwareImages.forEach(img => {
            if (isDark) {
                img.src = img.dataset.srcDark;
            } else {
                img.src = img.dataset.srcLight;
            }
        });
    }

    // Toggle Dark Mode
    function toggleMode() {
        document.body.classList.toggle('dark');
        const isDark = document.body.classList.contains('dark');

        const desktopBtnText = isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode';
        const mobileIconHtml = '<i class="fas fa-adjust"></i>';

        if (toggleBtnNav) {
            toggleBtnNav.textContent = desktopBtnText;
            toggleBtnNav.setAttribute('aria-label', desktopBtnText);
        }

        if (toggleBtnHeader) {
            toggleBtnHeader.innerHTML = mobileIconHtml;
            toggleBtnHeader.setAttribute('aria-label', desktopBtnText);
        }

        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        updateImages();
    }

    // Initialize Dark Mode Preference on Page Load
    function initializeMode() {
        const isDark = localStorage.getItem('theme') === 'dark';

        if (isDark) {
            document.body.classList.add('dark');
        }

        const btnHeader = document.getElementById('toggleModeBtnHeader');
        const btnNav = document.getElementById('toggleModeBtnNav');

        const desktopBtnInitialText = isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode';
        const mobileIconInitialHtml = '<i class="fas fa-adjust"></i>';

        if (btnHeader) {
            btnHeader.innerHTML = mobileIconInitialHtml;
            btnHeader.setAttribute('aria-label', desktopBtnInitialText);
        }
        if (btnNav) {
            btnNav.textContent = desktopBtnInitialText;
            btnNav.setAttribute('aria-label', desktopBtnInitialText);
        }

        updateImages();
    }

    // --- EVENT LISTENERS ---
    if (hamburgerMenu) hamburgerMenu.addEventListener('click', openMenu);
    if (hamburgerClose) hamburgerClose.addEventListener('click', closeMenu);

    if (toggleBtnHeader) toggleBtnHeader.addEventListener('click', toggleMode);
    if (toggleBtnNav) toggleBtnNav.addEventListener('click', toggleMode);

    document.addEventListener('click', function (event) {
        const isClickInsideNav = navLinks && navLinks.contains(event.target);
        const isClickOnHamburger = hamburgerMenu && hamburgerMenu.contains(event.target);
        const isClickOnClose = hamburgerClose && hamburgerClose.contains(event.target);
        const isClickOnToggleHeader = toggleBtnHeader && toggleBtnHeader.contains(event.target);
        const isClickOnToggleNav = toggleBtnNav && toggleBtnNav.contains(event.target);


        if (navLinks && navLinks.classList.contains('open') &&
            !isClickInsideNav && !isClickOnHamburger && !isClickOnClose &&
            !isClickOnToggleHeader && !isClickOnToggleNav
        ) {
            closeMenu();
        }
    });

    // Dropdown Toggle for Mobile (Click functionality)
    document.querySelectorAll('.dropdown-toggle').forEach(button => {
        button.addEventListener('click', function(event) {
            if (isMobileView() && navLinks.classList.contains('open')) {
                event.preventDefault();
                const parentDropdown = this.closest('.dropdown');
                const alreadyOpen = parentDropdown.classList.contains('open');

                document.querySelectorAll('.dropdown.open').forEach(d => {
                    if (d !== parentDropdown) {
                        d.classList.remove('open');
                        const dropdownToggle = d.querySelector('.dropdown-toggle');
                        if (dropdownToggle) dropdownToggle.setAttribute('aria-expanded', 'false');
                    }
                });

                if (!alreadyOpen) {
                    parentDropdown.classList.add('open');
                    this.setAttribute('aria-expanded', 'true');
                } else {
                    parentDropdown.classList.remove('open');
                    this.setAttribute('aria-expanded', 'false');
                }
            }
        });
    });

    // Close mobile menu when a navigation link is clicked (excluding dropdown parents)
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (!link.closest('.dropdown-content')) {
                if (isMobileView() && navLinks.classList.contains('open')) {
                    closeMenu();
                }
            }
        });
    });

    // Handle window resize cleanups (also implicitly handles the width workaround)
    window.addEventListener('resize', () => {
        if (!isMobileView()) {
            if (navLinks && navLinks.classList.contains('open')) {
                closeMenu();
            }
        }
        setFullWidthForBodyAndHtml();
    });

    initializeMode();

    // --- Intersection Observer for Fade-in/Fade-lift Effects ---
    const faders = document.querySelectorAll('.fade-in, .fade-lift, .feature-card, .trust-section, .highlight-banner');

    if ('IntersectionObserver' in window) {
        const appearOptions = {
            threshold: 0.1,
            rootMargin: "0px 0px -50px 0px"
        };

        const appearOnScroll = new IntersectionObserver(function(entries, observer) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, appearOptions);

        faders.forEach(fader => {
            appearOnScroll.observe(fader);
        });

        faders.forEach(fader => {
            const rect = fader.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom >= 0) {
                fader.classList.add('visible');
            }
        });

    } else {
        faders.forEach(fader => fader.classList.add('visible'));
    }

    // --- Accordion Toggle for glossary ---
    const accordionToggles = document.querySelectorAll('.accordion-toggle');

    accordionToggles.forEach(toggle => {
        toggle.addEventListener('click', function () {
            const content = this.nextElementSibling;
            const icon = this.querySelector('.toggle-icon');

            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);

            if (isExpanded) {
                content.hidden = true;
                if (icon) icon.classList.remove('rotate');
            } else {
                content.hidden = false;
                if (icon) icon.classList.add('rotate');
            }
        });
    });

    // --- Back to Top Button Logic ---
    if (backToTopButton) {
        const toggleBackToTopButton = () => {
            if (window.scrollY > 300) {
                backToTopButton.style.display = 'block';
              } else {
                backToTopButton.style.display = 'none';
              
            }
        };

        window.addEventListener('scroll', toggleBackToTopButton);
        backToTopButton.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        // Initial check
        toggleBackToTopButton();
    }
});