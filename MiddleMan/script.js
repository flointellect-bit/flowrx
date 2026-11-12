document.addEventListener('DOMContentLoaded', () => {

    /* --- MOBILE NAVBAR TOGGLE --- */
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.querySelector('.nav-links');
    if(hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.innerHTML = navLinks.classList.contains('active') ? '&#10005;' : '&#9776;';
        });
    }

    /* --- SMOOTH SCROLL (Additional Polyfill Fallback Concept) --- */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if(target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
                // Close menu if open
                if (navLinks && navLinks.classList.contains('active')){
                    navLinks.classList.remove('active');
                    hamburger.innerHTML = '&#9776;';
                }
            }
        });
    });

    /* --- COUNTER ANIMATION USING INTERSECTION OBSERVER --- */
    const counters = document.querySelectorAll('.counter');
    const speed = 200; // Denominator speed modifier
    const options = { threshold: 0.5 };

    const runCounters = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const updateCount = () => {
                    const target = +counter.getAttribute('data-target');
                    const count = +counter.innerText;
                    
                    const inc = target / speed;

                    if (count < target) {
                        counter.innerText = Math.ceil(count + inc);
                        setTimeout(updateCount, 15);
                    } else {
                        counter.innerText = target;
                    }
                };
                updateCount();
                observer.unobserve(counter);
            }
        });
    };

    if(counters.length > 0) {
        const counterObserver = new IntersectionObserver(runCounters, options);
        counters.forEach(counter => counterObserver.observe(counter));
    }


    /* --- STAR RATING LOGIC --- */
    const stars = document.querySelectorAll('#star-rating span');
    let ratingValue = 0; // Local state holding rated value

    if(stars) {
        stars.forEach(star => {
            star.addEventListener('click', (e) => {
                ratingValue = e.target.getAttribute('data-value');
                highlightStars(ratingValue);
            });

            // Interactive hover effect overriding pure CSS where necessary visually
            star.addEventListener('mouseover', (e) => {
                const hoverValue = e.target.getAttribute('data-value');
                highlightStars(hoverValue);
            });
            star.addEventListener('mouseleave', () => {
                highlightStars(ratingValue); // Restore back to original click status
            });
        });
    }

    function highlightStars(val) {
        stars.forEach(s => {
            s.classList.remove('active');
            s.style.color = '#ccc';
        });
        for (let i = 0; i < val; i++) {
            if(stars[i]) {
                stars[i].classList.add('active');
                stars[i].style.color = '#5A3E2B'; // The required strong brown rating accent
            }
        }
    }


    /* --- FORM VALIDATION & MOCK SUBMISSION NO-BACKEND --- */
    const feedbackForm = document.getElementById('feedback-form');
    const successMsg = document.getElementById('form-success');

    if (feedbackForm) {
        feedbackForm.addEventListener('submit', function (e) {
            e.preventDefault(); // crucial prevent default
            
            const name = document.getElementById('fname').value;
            const email = document.getElementById('femail').value;
            const msg = document.getElementById('fmessage').value;

            // basic validation redundancy
            if(name.trim() === '' || email.trim() === '' || msg.trim() === '') {
                return false; 
            }

            // Animate and trigger Mock submit output
            successMsg.classList.remove('hidden');
            successMsg.classList.add('show');

            // Optionally: Disable the button visually right away
            const submitBtn = feedbackForm.querySelector('button[type="submit"]');
            submitBtn.textContent = 'Submitted ✓';
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.7';

            // Clear inputs after 1s for seamless transition perception
            setTimeout(() => {
                feedbackForm.reset();
                highlightStars(0);
                ratingValue = 0;
            }, 1000);

            // Rehide response logic after reasonable UX time limits
            setTimeout(() => {
                successMsg.classList.add('hidden');
                successMsg.classList.remove('show');
                submitBtn.textContent = 'Send Inquiry';
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
            }, 6000);
        });
    }
});