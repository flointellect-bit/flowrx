 document.addEventListener('DOMContentLoaded', () => {
    // Compact touch navigation for tablet and phone layouts.
    const siteNav = document.querySelector('nav');
    const menuToggle = document.getElementById('menuToggle');
    const primaryNavigation = document.getElementById('primaryNavigation');
    const closeMenu = () => {
        if (!siteNav || !menuToggle) return;
        siteNav.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Open navigation menu');
    };
    if (siteNav && menuToggle && primaryNavigation) {
        menuToggle.addEventListener('click', () => {
            const isOpen = siteNav.classList.toggle('is-open');
            menuToggle.setAttribute('aria-expanded', String(isOpen));
            menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
        });
        primaryNavigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
        document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
        document.addEventListener('click', event => {
            if (!siteNav.contains(event.target)) closeMenu();
        });
    }
    
    // Initialize Icons
    lucide.createIcons();

    // Theme Toggle
    const themeToggleBtn = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    if(themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            if (currentTheme === 'light') {
                document.documentElement.removeAttribute('data-theme');
                themeIcon.setAttribute('data-lucide', 'sun');
            } else {
                document.documentElement.setAttribute('data-theme', 'light');
                themeIcon.setAttribute('data-lucide', 'moon');
            }
            lucide.createIcons();
        });
    }

    // Background Scroll Parallax Text
    const bgText = document.getElementById('bgText');
    window.addEventListener('scroll', () => {
        if(!bgText) return;
        const scrollY = window.scrollY;
        bgText.style.transform = `translate(-50%, ${scrollY * -0.25}px)`;
        const opacity = Math.max(0, 1 - (scrollY / 1200));
        bgText.style.filter = `blur(${4 + (scrollY * 0.01)}px)`;
        bgText.style.opacity = opacity;
    });

    // Reveal Animations on scroll
    const revealElements = document.querySelectorAll('.reveal');
    const revealOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    revealElements.forEach(el => revealOnScroll.observe(el));

    // ==========================================
    // SEAMLESS FORMSPREE SUBMISSION (NO REDIRECT PAGE)
    // ==========================================
    const form = document.getElementById("contactForm");
    const formStatus = document.getElementById("formStatus");
    const submitBtn = document.getElementById("submitBtn");

    if (form) {
        form.addEventListener("submit", async function(event) {
            // STOP form from actually loading the Formspree success webpage
            event.preventDefault(); 
            
            // Switch button text visually
            const originalBtnText = submitBtn.innerText;
            submitBtn.innerText = "Sending Request...";
            formStatus.style.display = "none";
            
            // Collect Form Information Data
            const data = new FormData(event.target);
            
            // Fetch/Send exactly how Formspree securely demands JSON AJAX data:
            fetch(event.target.action, {
                method: form.method,
                body: data,
                headers: { 'Accept': 'application/json' }
            }).then(response => {
                // Done loading
                submitBtn.innerText = originalBtnText;
                formStatus.style.display = "block";
                
                if (response.ok) {
                    // IF SUCESS
                    formStatus.innerHTML = "Request sent successfully! I'll be in touch soon.";
                    formStatus.style.color = "#27c93f"; // Soft success green
                    formStatus.style.background = "rgba(39, 201, 63, 0.08)"; // Soft success highlight background
                    form.reset(); // Beautifully reset and clean all input form blocks
                } else {
                    // IF SOME OTHER DATA/ENTRY ISSUE HAPPENED 
                    response.json().then(data => {
                        if (Object.hasOwn(data, 'errors')) {
                            formStatus.innerHTML = data["errors"].map(error => error["message"]).join(", ");
                        } else {
                            formStatus.innerHTML = "Oops! There was a problem submitting your form.";
                        }
                        formStatus.style.color = "var(--accent-red)";
                        formStatus.style.background = "rgba(140, 29, 29, 0.08)";
                    });
                }
            }).catch(error => {
                // IF NETWORK CRASHES ENTIRELY 
                submitBtn.innerText = originalBtnText;
                formStatus.style.display = "block";
                formStatus.innerHTML = "Oops! Check your internet and try again.";
                formStatus.style.color = "var(--accent-red)";
                formStatus.style.background = "rgba(140, 29, 29, 0.08)";
            });
        });
    }

});