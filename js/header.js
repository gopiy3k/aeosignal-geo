// header.js - Clean, modular header handling for Aeosignal.Space

document.addEventListener('DOMContentLoaded', function () {
  const hamburgerMenu = document.getElementById('hamburgerMenu');
  const hamburgerClose = document.getElementById('hamburgerClose');
  const navLinks = document.getElementById('navLinks');
  const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
  const body = document.body;
  const toggleModeButtons = document.querySelectorAll('.toggle-mode-btn');

  // Hamburger Open
  hamburgerMenu.addEventListener('click', function () {
    navLinks.classList.add('open');
    hamburgerMenu.style.display = 'none';
    hamburgerClose.style.display = 'block';
    body.classList.add('no-scroll');
  });

  // Hamburger Close
  hamburgerClose.addEventListener('click', function () {
    navLinks.classList.remove('open');
    hamburgerMenu.style.display = 'block';
    hamburgerClose.style.display = 'none';
    body.classList.remove('no-scroll');
  });
// Dropdown toggle support for mobile
const dropdownToggles = document.querySelectorAll('.dropdown-toggle');

dropdownToggles.forEach(toggle => {
  toggle.addEventListener('click', function(e) {
    e.preventDefault(); // prevent link behavior
    const parentDropdown = this.parentElement;
    parentDropdown.classList.toggle('open');

    // Optional: close other dropdowns
    dropdownToggles.forEach(otherToggle => {
      if (otherToggle !== this) {
        otherToggle.parentElement.classList.remove('open');
      }
    });
  });
});
  // Dropdown toggles (mobile)
  dropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', function () {
      const dropdownContent = this.nextElementSibling;
      const isOpen = dropdownContent.classList.contains('open');
      document.querySelectorAll('.dropdown-content').forEach(dc => dc.classList.remove('open'));
      if (!isOpen) {
        dropdownContent.classList.add('open');
      }
    });
  });

  // Close nav on resize to desktop
  window.addEventListener('resize', function () {
    if (window.innerWidth >= 768) {
      navLinks.classList.remove('open');
      hamburgerMenu.style.display = 'none';
      hamburgerClose.style.display = 'none';
      body.classList.remove('no-scroll');
    } else {
      hamburgerMenu.style.display = 'block';
    }
  });

  // Dark mode toggle
  toggleModeButtons.forEach(btn => {
    btn.addEventListener('click', function () {
      const isDark = body.classList.toggle('dark');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      updateLogoForTheme(isDark);
    });
  });

  // Set theme on load from localStorage
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
});
