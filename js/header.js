// header.js - Clean, stable, modular header handling for Aeosignal.Space

document.addEventListener('DOMContentLoaded', function () {
  const hamburgerMenu = document.getElementById('hamburgerMenu');
  const hamburgerClose = document.getElementById('hamburgerClose');
  const navLinks = document.getElementById('navLinks');
  const body = document.body;
  const toggleModeButtons = document.querySelectorAll('.toggle-mode-btn');
  const dropdownToggles = document.querySelectorAll('.dropdown-toggle');

  // Hamburger Open
  hamburgerMenu.addEventListener('click', function () {
    navLinks.classList.add('open');
    hamburgerMenu.style.display = 'none';
    hamburgerClose.style.display = 'block';
    body.classList.add('no-scroll', 'menu-open');
  });

  // Hamburger Close
  hamburgerClose.addEventListener('click', function () {
    navLinks.classList.remove('open');
    hamburgerMenu.style.display = 'block';
    hamburgerClose.style.display = 'none';
    body.classList.remove('no-scroll', 'menu-open');
  });

  // Dropdown toggle for mobile
  dropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', function (e) {
      e.preventDefault();
      const parent = this.parentElement;
      const dropdownContent = this.nextElementSibling;

      const isOpen = parent.classList.contains('open');

      // Close all other dropdowns
      dropdownToggles.forEach(otherToggle => {
        otherToggle.parentElement.classList.remove('open');
        if (otherToggle.nextElementSibling) {
          otherToggle.nextElementSibling.classList.remove('open');
        }
      });

      if (!isOpen) {
        parent.classList.add('open');
        if (dropdownContent) dropdownContent.classList.add('open');
      }
    });
  });

  // Dark mode toggle
  toggleModeButtons.forEach(btn => {
    btn.addEventListener('click', function () {
      const isDark = body.classList.toggle('dark');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      updateLogoForTheme(isDark);
    });
  });

  // Load saved theme
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    body.classList.add('dark');
    updateLogoForTheme(true);
  } else {
    body.classList.remove('dark');
    updateLogoForTheme(false);
  }

  function updateLogoForTheme(isDark) {
    const logoImg = document.getElementById('logo-img');
    if (!logoImg) return;
    logoImg.src = isDark ? '/images/logo-dark.webp' : '/images/logo-light.webp';
    logoImg.alt = isDark ? 'Aeosignal.Space Logo - Dark' : 'Aeosignal.Space Logo - Light';
  }

  // Responsive hamburger visibility
  function handleResize() {
    if (window.innerWidth >= 768) {
      navLinks.classList.remove('open');
      hamburgerMenu.style.display = 'none';
      hamburgerClose.style.display = 'none';
      body.classList.remove('no-scroll', 'menu-open');
    } else {
      hamburgerMenu.style.display = 'block';
      hamburgerClose.style.display = 'none';
    }
  }

  window.addEventListener('resize', handleResize);
  handleResize(); // initial check
});
