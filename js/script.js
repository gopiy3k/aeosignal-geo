document.addEventListener('DOMContentLoaded', function() {
    // Element References
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const hamburgerClose = document.getElementById('hamburgerClose');
    const navLinks = document.getElementById('navLinks');
    const toggleBtnHeader = document.getElementById('toggleModeBtnHeader'); // Button in header-right-controls
    const toggleBtnNav = document.getElementById('toggleModeBtnNav');     // Button inside nav-links

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

    // Also call on window resize (e.g., orientation change)
    // This is already handled by your existing resize listener for menu cleanups
    // window.addEventListener('resize', setFullWidthForBodyAndHtml); // No need to add a duplicate listener

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
        if (hamburgerClose) hamburgerClose.style.display = 'none';
        document.documentElement.style.overflow = ''; // Allow scrolling on the root
        document.querySelectorAll('.dropdown.open').forEach(d => {
            d.classList.remove('open');
            const dropdownToggle = d.querySelector('.dropdown-toggle');
            if (dropdownToggle) dropdownToggle.setAttribute('aria-expanded', 'false');
        });
        if (hamburgerMenu) hamburgerMenu.setAttribute('aria-expanded', 'false');
        if (hamburgerClose) hamburgerClose.setAttribute('aria-expanded', 'false');
    }

    // Toggle Dark Mode
    function toggleMode() {
        document.body.classList.toggle('dark');
        const isDark = document.body.classList.contains('dark');

        const btnText = isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode';

        // Update both toggle buttons' text and aria-label
        if (toggleBtnHeader) {
            toggleBtnHeader.textContent = btnText;
            toggleBtnHeader.setAttribute('aria-label', btnText);
        }
        if (toggleBtnNav) {
            toggleBtnNav.textContent = btnText;
            toggleBtnNav.setAttribute('aria-label', btnText);
        }

        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        updateImages(); // Ensure all images are swapped
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

        // Update regular section images (KEEP THIS BLOCK as it handles other images)
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

        // --- NEW/UPDATED LOGIC FOR BACKGROUND IMAGES ---

        // Handle all elements with data-light-bg/data-dark-bg attributes
        document.querySelectorAll('[data-light-bg][data-dark-bg]').forEach(element => {
            const lightBg = element.getAttribute('data-light-bg');
            const darkBg = element.getAttribute('data-dark-bg');
            if (lightBg && darkBg) {
                element.style.backgroundImage = `url('${isDark ? darkBg : lightBg}')`;
            }
        });
        //

        // Update background image for the 'geo-section-visual' div
        const geoSectionVisual = document.getElementById('geo-section-visual');
        if (geoSectionVisual) {
            geoSectionVisual.style.backgroundImage = `url('${isDark ? '/images/what-is-geo-dark.webp' : '/images/what-is-geo-light.webp'}')`;
        }

        // Also ensure the generic hero background updates if it uses a dynamic image
        // This targets any .hero that is NOT the audit page hero or the geo page hero.
        const genericHero = document.querySelector('.hero:not(#audit):not(#geo-hero-section)');
        if (genericHero) {
            genericHero.style.backgroundImage = `url('${isDark ? '/images/hero-dark.webp' : '/images/hero-light.webp'}')`;
        }

        // Audit page hero background (if applicable)
        const auditHero = document.getElementById('audit');
        if (auditHero) {
            auditHero.style.backgroundImage = `url('${isDark ? '/images/hero-audit-dark.webp' : '/images/hero-audit-light.webp'}')`;
        }
        // --- END NEW/UPDATED LOGIC ---
    }

    // Initialize Dark Mode Preference on Page Load
    function initializeMode() {
        if (localStorage.getItem('theme') === 'dark') {
            document.body.classList.add('dark');
            const btnHeader = document.getElementById('toggleModeBtnHeader');
            const btnNav = document.getElementById('toggleModeBtnNav');
            if (btnHeader) {
                btnHeader.textContent = 'Switch to Light Mode';
                btnHeader.setAttribute('aria-label', 'Switch to Light Mode');
            }
            if (btnNav) {
                btnNav.textContent = 'Switch to Light Mode';
                btnNav.setAttribute('aria-label', 'Switch to Light Mode');
            }
        }
        updateImages(); // Call updateImages on initial load to set correct images
    }

    // Event Listeners
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
});

// This is a separate DOMContentLoaded block for theme-aware images.
// It's fine to keep it separate as it's self-contained and not directly impacting main layout.
document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const themeAwareImages = document.querySelectorAll('.theme-aware-image');

    // Function to update image sources based on current theme
    function updateThemeImages() {
        const isDarkMode = body.classList.contains('dark');
        themeAwareImages.forEach(img => {
            if (isDarkMode) {
                img.src = img.dataset.srcDark;
            } else {
                img.src = img.dataset.srcLight;
            }
        });
    }

    // Initial update when the page loads
    updateThemeImages();

    // Observe changes to the body's class list
    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                updateThemeImages();
            }
        }
    });

    // Start observing the body for attribute changes
    observer.observe(body, { attributes: true });
});