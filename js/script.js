document.addEventListener('DOMContentLoaded', function() {
    // Element References
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const hamburgerClose = document.getElementById('hamburgerClose');
    const navLinks = document.getElementById('navLinks');
    const toggleBtnHeader = document.getElementById('toggleModeBtnHeader'); // Button in header-right-controls
    const toggleBtnNav = document.getElementById('toggleModeBtnNav');     // Button inside nav-links
    const backToTopButton = document.getElementById('backToTop'); // <--- Moved here

    // Helper to check if it's a mobile view
    const isMobileView = () => window.innerWidth <= 768;

    // --- Workaround for Android/Redmi width issue (START) ---
    function setFullWidthForBodyAndHtml() {
        const viewportWidth = window.innerWidth;
        // Use document.documentElement for html and document.body for body
        document.documentElement.style.width = `${viewportWidth}px`;
        document.body.style.width = `${viewportWidth}px`;

        // Optional: Log to console for debugging on device
        console.log(`Forced html/body width to: ${viewportWidth}px`);
    }

    // Call on initial load
    setFullWidthForBodyAndHtml();
    // --- Workaround for Android/Redmi width issue (END) ---

    // Open Menu
    function openMenu() {
        navLinks.classList.add('open');
        if (hamburgerMenu) hamburgerMenu.style.display = 'none';
        if (hamburgerClose) hamburgerClose.style.display = 'block';
        document.documentElement.style.overflow = 'hidden'; // Prevents scrolling on the root
        if (hamburgerMenu) hamburgerMenu.setAttribute('aria-expanded', 'true');
        if (hamburgerClose) hamburgerClose.setAttribute('aria-expanded', 'true');
    }

    // Close Menu
    function closeMenu() {
        navLinks.classList.remove('open');
        if (hamburgerMenu) hamburgerMenu.style.display = 'block';
        if (hamburgerClose) hamburgerMenu.style.display = 'none';
        document.documentElement.style.overflow = ''; // Allow scrolling on the root
        document.querySelectorAll('.dropdown.open').forEach(d => {
            d.classList.remove('open');
            const dropdownToggle = d.querySelector('.dropdown-toggle');
            if (dropdownToggle) dropdownToggle.setAttribute('aria-expanded', 'false');
        });
        if (hamburgerMenu) hamburgerMenu.setAttribute('aria-expanded', 'false');
        if (hamburgerClose) hamburgerClose.setAttribute('aria-expanded', 'false');
    }

    // Update Images (Logo and Section Images) Based on Mode
    function updateImages() {
        const isDark = document.body.classList.contains('dark');

        // Update main logo
        const logo = document.getElementById('logo-img');
        if (logo) {
            logo.src = isDark ? '/images/logo-dark.webp' : '/images/logo-light.webp';
            logo.alt = isDark ? 'Aeosignal.Space Logo Dark Mode' : 'Aeosignal.Space Logo Light Mode';
        }

        // Update regular section images
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

        // Handle all elements with data-light-bg/data-dark-bg attributes
        document.querySelectorAll('[data-light-bg][data-dark-bg]').forEach(element => {
            const lightBg = element.getAttribute('data-light-bg');
            const darkBg = element.getAttribute('data-dark-bg');
            if (lightBg && darkBg) {
                element.style.backgroundImage = `url('${isDark ? darkBg : lightBg}')`;
            }
        });

        // Update theme-aware images (from the second DOMContentLoaded block)
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

        // Define content for the desktop (text) button
        const desktopBtnText = isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode';

        // Define content for the mobile (icon) button
        const mobileIconHtml = '<i class="fas fa-adjust"></i>'; // Your Font Awesome icon HTML

        // Update the desktop toggle button (toggleBtnNav)
        if (toggleBtnNav) {
            toggleBtnNav.textContent = desktopBtnText; // Keeps text for desktop button
            toggleBtnNav.setAttribute('aria-label', desktopBtnText);
        }

        // Update the mobile toggle button (toggleBtnHeader)
        if (toggleBtnHeader) {
            toggleBtnHeader.innerHTML = mobileIconHtml; // Uses innerHTML for the icon
            // Use a descriptive aria-label for accessibility, even with an icon
            toggleBtnHeader.setAttribute('aria-label', desktopBtnText);
        }

        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        updateImages(); // Call updateImages when theme changes
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
        const mobileIconInitialHtml = '<i class="fas fa-adjust"></i>'; // The icon

        if (btnHeader) {
            btnHeader.innerHTML = mobileIconInitialHtml; // Sets the icon for mobile button
            btnHeader.setAttribute('aria-label', desktopBtnInitialText);
        }
        if (btnNav) {
            btnNav.textContent = desktopBtnInitialText; // Sets the text for desktop button
            btnNav.setAttribute('aria-label', desktopBtnInitialText);
        }

        updateImages(); // Call updateImages on initial load to set correct images
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
            // Only activate JS dropdown toggle on mobile views
            // and if the nav menu is open (for mobile-specific dropdown behavior)
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
            if (!link.closest('.dropdown-content')) { // Ensure it's not a dropdown item
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
        // Ensure width is reapplied on resize/orientation change
        setFullWidthForBodyAndHtml();
    });

    // Run initialization
    initializeMode();


    // --- Intersection Observer for Fade-in/Fade-lift Effects (AEOSIGNAL.SPACE) ---
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

        // ✅ Fix for above-the-fold elements on load
        // This ensures elements already in view when the page loads are made visible
        faders.forEach(fader => {
            const rect = fader.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom >= 0) {
                fader.classList.add('visible');
            }
        });

    } else {
        // Fallback: Show all if IntersectionObserver is unsupported
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

    // --- Back to Top Button Logic (Rewritten) ---
    // backToTopButton is already defined at the top of the DOMContentLoaded scope

    if (backToTopButton) { // Ensure the button exists in the HTML
        // Function to handle scroll visibility
        const toggleBackToTopButton = () => {
            if (window.scrollY > 300) { // Button appears after scrolling 300px down
                backToTopButton.style.display = 'block'; // Make visible
                backToTopButton.style.opacity = '1'; // Ensure full opacity for transition
            } else {
                backToTopButton.style.display = 'none'; // Hide
                backToTopButton.style.opacity = '0'; // Ensure zero opacity for transition
            }
        };

        // Add event listener for scrolling
        window.addEventListener('scroll', toggleBackToTopButton);

        // Add event listener for clicking the button
        backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth' // Smooth scroll to the top
            });
        });

        // Initial check in case the page loads already scrolled down (e.g., from a deep link)
        toggleBackToTopButton();
    }
}); // <--- THIS IS THE CORRECT CLOSING FOR THE MAIN DOMContentLoaded LISTENER