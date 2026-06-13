document.addEventListener('DOMContentLoaded', () => {
    
   // ----------------------------------------------------
    // 1. Sliding Portfolio Carousel & Before/After Toggle
    // ----------------------------------------------------
    
    // A. The Sliding Carousel Logic
    const track = document.getElementById('carousel-track');
    const prevBtn = document.getElementById('prev-slide-btn');
    const nextBtn = document.getElementById('next-slide-btn');
    
    if (track && prevBtn && nextBtn) {
        const slides = document.querySelectorAll('.carousel-slide');
        let currentIndex = 0;

        const updateSlidePosition = () => {
            // Moves the track horizontally by exactly 100% per slide
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
        };

        nextBtn.addEventListener('click', () => {
            if (currentIndex < slides.length - 1) {
                currentIndex++;
            } else {
                currentIndex = 0; // Loop back to the first slide
            }
            updateSlidePosition();
        });

        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
            } else {
                currentIndex = slides.length - 1; // Loop back to the last slide
            }
            updateSlidePosition();
        });
    }

    // B. The Before/After Toggle Logic for Multiple Slides
    const toggleBtns = document.querySelectorAll('.toggle-gallery-btn');
    
    toggleBtns.forEach(btn => {
        // Each button keeps track of its own state
        let showingBefore = true; 
        
        btn.addEventListener('click', (e) => {
            // Find the specific image that belongs to THIS button
            const slide = e.target.closest('.carousel-slide');
            const img = slide.querySelector('.gallery-img');
            
            // Read the file names assigned in the HTML data attributes
            const beforeImageSrc = btn.getAttribute('data-before');
            const afterImageSrc = btn.getAttribute('data-after');

            if (showingBefore) {
                img.src = afterImageSrc;
                btn.textContent = "Show Before";
                btn.classList.remove('btn-secondary');
                btn.classList.add('btn-primary');
                showingBefore = false;
            } else {
                img.src = beforeImageSrc;
                btn.textContent = "Show After (Completed Battery Replacement)";
                btn.classList.remove('btn-primary');
                btn.classList.add('btn-secondary');
                showingBefore = true;
            }
        });
    });

    // ----------------------------------------------------
    // 2. Scroll Reveal Animation Logic
    // ----------------------------------------------------
    const reveals = document.querySelectorAll('.reveal');
    const revealOptions = {
        threshold: 0.15, 
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); 
            }
        });
    }, revealOptions);

    reveals.forEach(reveal => {
        revealOnScroll.observe(reveal);
    });

    // ----------------------------------------------------
    // 3. Booking Form Logic (Dynamic Fields & Auto-Select)
    // ----------------------------------------------------
    const serviceSelect = document.getElementById('service-cat');
    const customServiceGroup = document.getElementById('custom-service-group');
    const customServiceInput = document.getElementById('custom-service-details');

    if (serviceSelect) {
        // A. Auto-Select from URL parameter (If coming from Service Cards)
        const urlParams = new URLSearchParams(window.location.search);
        const serviceParam = urlParams.get('service');
        if (serviceParam) {
            serviceSelect.value = serviceParam;
        }

        // B. Hide/Show "Custom Request" box dynamically
        const checkCustomField = () => {
            if (serviceSelect.value === 'other-custom') {
                if (customServiceGroup) customServiceGroup.classList.add('show');
                if (customServiceInput) customServiceInput.setAttribute('required', 'true');
            } else {
                if (customServiceGroup) customServiceGroup.classList.remove('show');
                if (customServiceInput) customServiceInput.removeAttribute('required');
            }
        };
        
        // Listen for changes and run once on load
        serviceSelect.addEventListener('change', checkCustomField);
        checkCustomField(); 
    }

    // ----------------------------------------------------
    // 4. Formspree Submission & LocalStorage Memory
    // ----------------------------------------------------
    const bookingForm = document.getElementById('booking-request-form');
    
    if (bookingForm) {
        // Load details if they exist in memory (Impressive UX feature!)
        const savedName = localStorage.getItem('techRepair_Name');
        const savedPhone = localStorage.getItem('techRepair_Phone');
        const savedEmail = localStorage.getItem('techRepair_Email');

        if (savedName) document.getElementById('client-name').value = savedName;
        if (savedPhone) document.getElementById('client-phone').value = savedPhone;
        if (savedEmail) document.getElementById('client-email').value = savedEmail;

        // Handle pressing Submit
        bookingForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Stop standard redirect so we stay on the page
            
            const submitBtn = document.getElementById('submit-btn');
            
            // Change button to show loading state
            if(submitBtn) {
                submitBtn.textContent = "Sending Request..."; 
                submitBtn.style.opacity = "0.7";
            }

            // Save customer details to memory for next time
            localStorage.setItem('techRepair_Name', document.getElementById('client-name').value);
            localStorage.setItem('techRepair_Phone', document.getElementById('client-phone').value);
            localStorage.setItem('techRepair_Email', document.getElementById('client-email').value);

            // Send the data to Formspree silently in the background
            const formData = new FormData(bookingForm);
            
            try {
                const response = await fetch(bookingForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    alert("Success! Your service ticket has been securely logged into our laboratory queue.");
                    
                    // Clear only the problem details, keep the name/email filled!
                    document.getElementById('device-model').value = "";
                    document.getElementById('problem-desc').value = "";
                    if (customServiceInput) customServiceInput.value = "";
                    
                    // Hide custom field if it was open
                    if (customServiceGroup) customServiceGroup.classList.remove('show');
                    
                    // Reset Button
                    if(submitBtn) {
                        submitBtn.textContent = "Submit Booking Request";
                        submitBtn.style.opacity = "1";
                    }
                } else {
                    alert("Oops! There was a problem sending your form. Please try again.");
                    if(submitBtn) {
                        submitBtn.textContent = "Submit Booking Request";
                        submitBtn.style.opacity = "1";
                    }
                }
            }
        });
    }
});
