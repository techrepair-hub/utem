document.addEventListener('DOMContentLoaded', () => {
    
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
    // 2. Scroll Reveal Animation Logic
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

    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {

        if (form.id === 'admin-login-form') return;

        const nameInput = form.querySelector('[name="Customer_Name"], [name="Contact_Name"]');
        const phoneInput = form.querySelector('[name="Phone_Number"]');
        const emailInput = form.querySelector('[name="email"], [name="Contact_Email"]');

        if (nameInput && localStorage.getItem('techRepair_Name')) nameInput.value = localStorage.getItem('techRepair_Name');
        if (phoneInput && localStorage.getItem('techRepair_Phone')) phoneInput.value = localStorage.getItem('techRepair_Phone');
        if (emailInput && localStorage.getItem('techRepair_Email')) emailInput.value = localStorage.getItem('techRepair_Email');

        const nextInput = form.querySelector('input[name="_next"]');
        if (nextInput) {
            let currentUrl = window.location.href;
            let successUrl = currentUrl.substring(0, currentUrl.lastIndexOf('/')) + '/success.html';
            nextInput.value = successUrl;
        }

        form.addEventListener('submit', () => {
            if (nameInput) localStorage.setItem('techRepair_Name', nameInput.value);
            if (phoneInput) localStorage.setItem('techRepair_Phone', phoneInput.value);
            if (emailInput) localStorage.setItem('techRepair_Email', emailInput.value);

            let ticketDB = JSON.parse(localStorage.getItem('techRepair_TicketDB')) || [];
            const serviceSelectDB = document.getElementById('service-cat');
            const deviceModelDB = document.getElementById('device-model');
            
            const newTicket = {
                date: new Date().toLocaleString(),
                name: nameInput ? nameInput.value : 'Unknown',
                email: emailInput ? emailInput.value : 'Unknown',
                service: serviceSelectDB ? serviceSelectDB.options[serviceSelectDB.selectedIndex].text : 'General Inquiry / Contact',
                device: deviceModelDB ? deviceModelDB.value : 'N/A'
            };

            ticketDB.push(newTicket);
            localStorage.setItem('techRepair_TicketDB', JSON.stringify(ticketDB));

            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.textContent = "Transmitting to Lab...";
                submitBtn.style.opacity = "0.7";
                submitBtn.style.pointerEvents = "none";
            }
        });
    });

    // ----------------------------------------------------
    // 5. Administrator Login, Persistent Sessions & Live DB
    // ----------------------------------------------------
    
    // A. Make the "ADMIN" navigation button smart on EVERY page
    const adminNavBtns = document.querySelectorAll('.btn-admin');
    const loggedInAdmin = localStorage.getItem('techRepairAdmin'); // Using localStorage for permanent memory!
    
    if (loggedInAdmin) {
        // If they are already logged in, clicking "ADMIN" goes straight to the dashboard!
        adminNavBtns.forEach(btn => {
            btn.href = "admin.html";
        });
    }

    // B. Handle Login Attempt on login.html
    const loginForm = document.getElementById('admin-login-form');
    if (loginForm) {
        
        // If they accidentally end up on the login page while already logged in, bounce them to the dashboard!
        if (loggedInAdmin) {
            window.location.href = "admin.html";
        }

        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const user = document.getElementById('admin-user').value.toLowerCase(); 
            const pass = document.getElementById('admin-pass').value;
            const btn = loginForm.querySelector('button');

            const validUsers = [
                { username: 'admin', password: 'admin123' },
                { username: 'lecturer', password: 'berc2393' },
                { username: 'syamil', password: 'dev123' },
                { username: 'ashraf', password: 'dev123' },
                { username: 'aiman', password: 'dev123' },
                { username: 'amir', password: 'dev123' }
            ];

            const isAuthenticated = validUsers.some(account => 
                account.username === user && account.password === pass
            );

            if (isAuthenticated) {

                localStorage.setItem('techRepairAdmin', user); 
                btn.textContent = "Authenticating...";
                btn.style.background = "#10b981"; 
                btn.style.pointerEvents = "none";
                setTimeout(() => { window.location.href = "admin.html"; }, 1000);
            } else {
                alert('Access Denied: Invalid credentials. Please try again.');
                document.getElementById('admin-pass').value = ''; 
            }
        });
    }

    // C. Admin Dashboard Data Visualization & Security
    if (window.location.pathname.includes('admin.html')) {
        
        if (!loggedInAdmin) {
            window.location.href = "login.html";
        }

        const adminDisplay = document.getElementById('admin-user-display');
        if (adminDisplay) {
            adminDisplay.textContent = `[ADMIN MODE: ${loggedInAdmin.toUpperCase()}]`;
        }


        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                // Destroys the login memory when clicked!
                localStorage.removeItem('techRepairAdmin');
                window.location.href = "login.html";
            });
        }

        // Load the Live Database into the Table
        const dbBody = document.getElementById('admin-database-body');
        if (dbBody) {
            let ticketDB = JSON.parse(localStorage.getItem('techRepair_TicketDB')) || [];
            
            if (ticketDB.length === 0) {
                dbBody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:#9ca3af;">No tickets currently in the database. Go submit a booking!</td></tr>`;
            } else {
                for (let i = ticketDB.length - 1; i >= 0; i--) {
                    const ticket = ticketDB[i];
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td style="color:var(--accent-cyan); font-size: 0.85rem;">${ticket.date}</td>
                        <td style="font-weight:bold; color:var(--text-bright);">${ticket.name}</td>
                        <td>${ticket.email}</td>
                        <td>${ticket.service}</td>
                        <td style="color:#9ca3af;">${ticket.device}</td>
                    `;
                    dbBody.appendChild(row);
                }
            }
        }

        // Clear Database Button
        const clearBtn = document.getElementById('clear-db-btn');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                if (confirm('Are you sure you want to permanently delete all local ticket data?')) {
                    localStorage.removeItem('techRepair_TicketDB');
                    window.location.reload(); 
                }
            });
        }
    }
});
