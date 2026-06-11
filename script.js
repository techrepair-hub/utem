document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Before-After Hardware Image Switcher 
    const toggleBtn = document.getElementById('toggle-gallery-btn');
    const galleryImg = document.getElementById('gallery-view-img');
    
    if (toggleBtn && galleryImg) {
        let showingBefore = true;
        toggleBtn.addEventListener('click', () => {
            if (showingBefore) {
                galleryImg.src = "after.jpeg";
                galleryImg.alt = "Clean Finished Internal Hardware Mainboard Calibration Layout";
                toggleBtn.textContent = "Show Before (Opened Hardware Inspection)";
                toggleBtn.classList.remove('btn-secondary');
                toggleBtn.classList.add('btn-primary');
                showingBefore = false;
            } else {
                galleryImg.src = "before.jpeg";
                galleryImg.alt = "Swollen Laptop Lithium-Polymer Battery Inspection Field";
                toggleBtn.textContent = "Show After (Completed Hardware Repair)";
                toggleBtn.classList.remove('btn-primary');
                toggleBtn.classList.add('btn-secondary');
                showingBefore = true;
            }
        });
    }

    // 2. Booking Intake Form Interceptor
    const bookingForm = document.getElementById('booking-request-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert("Success! Your device service request has been logged into our laboratory queue.");
            bookingForm.reset();
            // Hide the custom field again after submitting
            if (customServiceGroup) {
                customServiceGroup.classList.remove('show');
            }
        });
    }

    // 3. Scroll Reveal Animation Logic
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

    // 4 & 5. Booking Form Dropdown Auto-Select & Dynamic "Custom" Field Logic
    const serviceSelect = document.getElementById('service-cat');
    const customServiceGroup = document.getElementById('custom-service-group');
    const customServiceInput = document.getElementById('custom-service-details');

    if (serviceSelect) {
        // Read the "?service=..." from the URL
        const urlParams = new URLSearchParams(window.location.search);
        const serviceParam = urlParams.get('service');

        // Function to check if we should show the "Specify Your Request" box
        const checkCustomField = () => {
            // ONLY show if the value is exactly 'other-custom'
            if (serviceSelect.value === 'other-custom') {
                if (customServiceGroup) customServiceGroup.classList.add('show');
                if (customServiceInput) customServiceInput.setAttribute('required', 'true');
            } else {
                if (customServiceGroup) customServiceGroup.classList.remove('show');
                if (customServiceInput) customServiceInput.removeAttribute('required');
            }
        };

        // Listen for when the user manually changes the dropdown
        serviceSelect.addEventListener('change', checkCustomField);

        // If a service parameter exists in URL, auto-select it!
        if (serviceParam) {
            serviceSelect.value = serviceParam;
            
            // Brief visual glow to show it was auto-selected
            serviceSelect.style.borderColor = "var(--accent-cyan)";
            serviceSelect.style.boxShadow = "0 0 15px rgba(0, 210, 255, 0.5)";
            setTimeout(() => {
                serviceSelect.style.boxShadow = "none";
                serviceSelect.style.borderColor = "var(--border-color)";
            }, 1500);
        }

        // Run the custom field check immediately on page load
        checkCustomField();
    }
});