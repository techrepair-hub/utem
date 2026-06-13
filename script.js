document.addEventListener('DOMContentLoaded', () => {
    
    // ----------------------------------------------------
    // 1. Sliding Portfolio Carousel & Before/After Toggle
    // ----------------------------------------------------
    const track = document.getElementById('carousel-track');
    const prevBtn = document.getElementById('prev-slide-btn');
    const nextBtn = document.getElementById('next-slide-btn');
    
    if (track && prevBtn && nextBtn) {
        const slides = document.querySelectorAll('.carousel-slide');
        let currentIndex = 0;

        const updateSlidePosition = () => {
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
        };

        nextBtn.addEventListener('click', () => {
            if (currentIndex < slides.length - 1) currentIndex++;
            else currentIndex = 0;
            updateSlidePosition();
        });

        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) currentIndex--;
            else currentIndex = slides.length - 1;
            updateSlidePosition();
        });
    }

    const toggleBtns = document.querySelectorAll('.toggle-gallery-btn');
    toggleBtns.forEach(btn => {
        let showingBefore = true; 
        btn.addEventListener('click', (e) => {
            const slide = e.target.closest('.carousel-slide');
            const img = slide.querySelector('.gallery-img');
            const beforeImageSrc = btn.getAttribute('data-before');
            const afterImageSrc = btn.getAttribute('data-after');

            if (showingBefore) {
                img.src = afterImageSrc;
                btn.textContent = "Show Before Repair";
                btn.classList.remove('btn-secondary');
                btn.classList.add('btn-primary');
                showingBefore = false;
            } else {
                img.src = beforeImageSrc;
                btn.textContent = "Show After Repair";
                btn.classList.remove('btn-primary');
                btn.classList.add('btn-secondary');
                showingBefore = true;
            }
        });
    });

    // ----------------------------------------------------
    // 2. Scroll Reveal Animation Logic (Fixes the invisible blank pages!)
    // ----------------------------------------------------
    const reveals = document.querySelectorAll('.reveal');
    const revealOptions = {
        threshold: 0.1, 
        rootMargin: "0px 0px -20px 0px"
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
    const deviceSelect = document.getElementById('device-type');
    const customServiceGroup = document.getElementById('custom-service-group');
    const customServiceInput = document.getElementById('custom-service-details');

    if (serviceSelect) {
        // Auto-Select from URL parameter
        const urlParams = new URLSearchParams(window.location.search);
        const serviceParam = urlParams.get('service');
        
        const serviceMap = {
            'pc-format': 'Laptop/PC Formatting',
            'pc-upgrade': 'SSD & RAM Upgrades',
            'pc-virus': 'Virus & Malware Purging',
            'pc-hardware': 'Component Replacements',
            'mobile-screen': 'Screen Replacement',
            'mobile-battery': 'Battery Replacement',
            'mobile-port': 'Charging Port Solutions',
            'mobile-audio': 'Audio Array Refitting',
            'pkg-a': 'Package A: Basic Check-up',
            'pkg-b': 'Package B: Formatting Suite',
            'pkg-c': 'Package C: SSD/RAM Upgrade',
            'pkg-d': 'Package D: Screen Repair',
            'pkg-e': 'Package E: Battery Resuscitation',
            'pkg-f': 'Package F: Water Damage'
        };

        if (serviceParam && serviceMap[serviceParam]) {
            serviceSelect.value = serviceMap[serviceParam];
            if (deviceSelect) {
                if (serviceParam.startsWith('pc-') || serviceParam === 'pkg-b' || serviceParam === 'pkg-c') {
                    deviceSelect.value = 'Personal Computer / Laptop';
                } else if (serviceParam.startsWith('mobile-') || serviceParam === 'pkg-d' || serviceParam === 'pkg-e') {
                    deviceSelect.value = 'Smartphone Operating System';
                }
            }
        }

        // Hide/Show "Custom Request" box
        const checkCustomField = () => {
            if (serviceSelect.value === 'other-custom') {
                if (customServiceGroup) customServiceGroup.classList.add('show');
                if (customServiceInput) customServiceInput.setAttribute('required', 'true');
            } else {
                if (customServiceGroup) customServiceGroup.classList.remove('show');
                if (customServiceInput) customServiceInput.removeAttribute('required');
            }
        };
        
        serviceSelect.addEventListener('change', checkCustomField);
        checkCustomField(); 
    }

    // ----------------------------------------------------
    // 4. Formspree UI Update & LocalStorage Memory
    // ----------------------------------------------------
    // This finds ANY form on the page (booking or contact)
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        // Load Memory (if inputs exist on the page)
        const nameInput = form.querySelector('[name="Customer_Name"], [name="Contact_Name"]');
        const phoneInput = form.querySelector('[name="Phone_Number"]');
        const emailInput = form.querySelector('[name="email"], [name="Contact_Email"]');

        if (nameInput && localStorage.getItem('techRepair_Name')) nameInput.value = localStorage.getItem('techRepair_Name');
        if (phoneInput && localStorage.getItem('techRepair_Phone')) phoneInput.value = localStorage.getItem('techRepair_Phone');
        if (emailInput && localStorage.getItem('techRepair_Email')) emailInput.value = localStorage.getItem('techRepair_Email');

        // Save memory and update button when clicked
        form.addEventListener('submit', () => {
            if (nameInput) localStorage.setItem('techRepair_Name', nameInput.value);
            if (phoneInput) localStorage.setItem('techRepair_Phone', phoneInput.value);
            if (emailInput) localStorage.setItem('techRepair_Email', emailInput.value);

            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.textContent = "Transmitting to Lab...";
                submitBtn.style.opacity = "0.7";
                submitBtn.style.pointerEvents = "none";
            }
        });
    });
});
