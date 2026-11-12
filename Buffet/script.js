document.addEventListener('DOMContentLoaded', () => {

    /* ---- MOBILE MENU TOGGLE LOGIC ---- */
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    const links = document.querySelectorAll('.nav-links li a');

    // Opens the menu and turns the burger into an X
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Auto-closes the mobile menu after clicking any navigational link inside
    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });

    /* ---- SCROLL EFFECTS FOR NAVBAR GLASSMORPHISM ---- */
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        // If scroll hits slightly below the absolute top, beef up the navbar visibility
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(5, 5, 5, 0.9)';
            navbar.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.6)';
        } else {
            // Restore transparency rules attached to .navbar initially
            navbar.style.background = 'rgba(5, 5, 5, 0.75)';
            navbar.style.boxShadow = 'none';
        }
    });
});