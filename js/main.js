document.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementById('header');
    const darkToggle = document.getElementById('dark-mode-toggle');
    const mobileBtn = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const backTop = document.getElementById('back-to-top');
    const progress = document.getElementById('scroll-progress');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    const typingEl = document.getElementById('typing-effect');
    document.getElementById('year').textContent = new Date().getFullYear();

    // Add the class when the page is loaded to animate the header
    window.onload = () => {
        header.classList.add('animate-in');
    };

    // Icons
    const sunIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>`;
    const moonIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`;

    // Theme
    const applyTheme = (isDark) => {
        if (isDark) { document.documentElement.classList.add('dark'); darkToggle.innerHTML = sunIcon; }
        else { document.documentElement.classList.remove('dark'); darkToggle.innerHTML = moonIcon; }
    };
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    let isDark = savedTheme ? savedTheme === 'dark' : prefersDark;
    applyTheme(isDark);
    darkToggle.addEventListener('click', () => {
        isDark = !isDark; localStorage.setItem('theme', isDark ? 'dark' : 'light'); applyTheme(isDark);
    });

    // Scroll effects (progress, back-to-top, header shrink)
    const onScroll = () => {
        const y = window.scrollY || document.documentElement.scrollTop;
        const max = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const ratio = max > 0 ? (y / max) : 0;
        progress.style.transform = `scaleX(${ratio})`;
        if (y > 12) { header.classList.add('py-3', 'shadow-md'); header.classList.remove('py-4'); }
        else { header.classList.remove('py-3', 'shadow-md'); header.classList.add('py-4'); }
        if (y > 300) { backTop.classList.remove('opacity-0', 'translate-y-5'); }
        else { backTop.classList.add('opacity-0', 'translate-y-5'); }
    };

    window.addEventListener('load', function () {
        const header = document.getElementById('header');
        header.classList.add('animate-in'); // Add the animation class after page load
    });
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Mobile menu (smooth open/close)
    mobileBtn.addEventListener('click', () => {
        const opened = mobileMenu.classList.contains('!open');

        if (!opened) {
            // OPEN
            mobileMenu.classList.add('!open');
            mobileMenu.classList.remove('hidden', 'opacity-0', 'scale-y-95', 'pointer-events-none');
            mobileMenu.classList.add('opacity-100', 'scale-y-100');
            const target = mobileMenu.scrollHeight;
            mobileMenu.style.maxHeight = target + 'px';
            mobileBtn.setAttribute('aria-expanded', 'true');
        } else {
            // CLOSE
            // set current height so transition starts from here
            mobileMenu.style.maxHeight = mobileMenu.scrollHeight + 'px';

            // next frame set to 0 for animation
            requestAnimationFrame(() => {
                mobileMenu.style.maxHeight = '0px';
                mobileMenu.classList.add('opacity-0', 'scale-y-95');
                mobileMenu.classList.remove('opacity-100', 'scale-y-100');
            });

            const done = (e) => {
                if (e.propertyName === 'max-height') {
                    mobileMenu.classList.remove('!open');
                    mobileMenu.classList.add('pointer-events-none');
                    mobileMenu.removeEventListener('transitionend', done);
                }
            };
            mobileMenu.addEventListener('transitionend', done);
            mobileBtn.setAttribute('aria-expanded', 'false');
        }
    });


    mobileMenu.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
            // trigger close if open
            if (mobileMenu.classList.contains('!open')) {
                mobileBtn.click();
            }
        });
    });



    // Smooth nav + close mobile on click
    // Smooth nav + close mobile on click (no hidden toggle)
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });

                // If the mobile menu is open, close it using the same animation logic
                if (mobileMenu.classList.contains('!open')) {
                    mobileBtn.click();
                }
            }
        });
    });

    // Section reveal
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('is-visible'); });
    }, { threshold: 0.12 });
    sections.forEach(s => observer.observe(s));

    // Active link highlight
    const activeObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                document.querySelectorAll('.nav-link.active').forEach(a => a.classList.remove('active', 'text-sky-600'));
                const el = document.querySelector(`.nav-link[href="#${id}"]`);
                if (el) el.classList.add('active', 'text-sky-600');
            }
        });
    }, { rootMargin: '-45% 0px -55% 0px' });
    document.querySelectorAll('section[id]').forEach(sec => activeObs.observe(sec)
    );

    // Set the coordinates for the map view
    const mapCoords = [23.875782, 90.323880];
    const map = L.map('map').setView(mapCoords, 15);

    // --- 1. MODERN MAP THEME ---
    const lightThemeUrl = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
    const darkThemeUrl = 'https://{s}.basemaps.cartocdn.com/rastertiles/dark_matter/{z}/{x}/{y}{r}.png';
    const cartoAttribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

    const isDarkMode = document.documentElement.classList.contains('dark');
    const tileUrl = isDarkMode ? darkThemeUrl : lightThemeUrl;

    L.tileLayer(tileUrl, { attribution: cartoAttribution }).addTo(map);

    // --- 2. CUSTOM MARKER ---
    const customMarkerIcon = L.divIcon({
        className: 'custom-map-marker',
        iconSize: [20, 20]
    });

    const marker = L.marker(mapCoords, { icon: customMarkerIcon }).addTo(map)
        .bindPopup('Daffodil International University (Permanent Campus)');

    // --- 3. PIN CENTERING FIX ---
    marker.on('popupopen', () => {
        setTimeout(() => {
            map.panTo(mapCoords);
        }, 100);
    });

    marker.openPopup();

    // --- 4. RECENTER BUTTON ---
    // 1. Define the custom control
    L.Control.Recenter = L.Control.extend({
        onAdd: function (map) {
            const button = L.DomUtil.create('div', 'leaflet-recenter-button');
            button.title = 'Recenter Map';
            button.innerHTML = '<svg viewBox="0 0 24 24"><path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/></svg>';

            L.DomEvent.on(button, 'click', function (e) {
                L.DomEvent.stop(e);
                map.setView(mapCoords, 15);
            });

            return button;
        },
    });

    // 2. Add an instance of the new control to the map
    new L.Control.Recenter({ position: 'topleft' }).addTo(map);



    // Back to top
    document.getElementById('back-to-top').addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    // Typing effect
    const typingSequence = ['An AI/ML Researcher', 'A Full-Stack Developer', 'A Federated Learning Engineer', 'A Deep Learning Enthusiast', 'A Published Author', 'A UI/UX Designer', 'A Problem Solver'];
    let sIdx = 0, cIdx = 0, del = false;
    const type = () => {
        const str = typingSequence[sIdx];
        typingEl.textContent = del ? str.slice(0, cIdx--) : str.slice(0, ++cIdx);
        if (!del && cIdx === str.length) { del = true; setTimeout(type, 1200); }
        else if (del && cIdx < 0) { del = false; sIdx = (sIdx + 1) % typingSequence.length; setTimeout(type, 300); }
        else { setTimeout(type, del ? 45 : 85); }
    };
    type();
});

// --- AOS-like animation only for the Education section ---
(function eduAOS() {
    const items = document.querySelectorAll('#education [data-aos]');
    if (!items.length) return;

    // Optional auto-stagger if you didn't set delays on every item
    items.forEach((el, idx) => {
        if (!el.hasAttribute('data-aos-delay')) {
            el.setAttribute('data-aos-delay', String(idx * 90)); // 0ms, 90ms, 180ms...
        }
    });

    // If IO not supported or reduced motion, reveal immediately
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!('IntersectionObserver' in window) || reduced) {
        items.forEach(el => el.classList.add('edu-animate'));
        return;
    }

    const io = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            const el = entry.target;
            const delay = parseInt(el.getAttribute('data-aos-delay') || '0', 10);
            const duration = parseInt(el.getAttribute('data-aos-duration') || '600', 10);

            // Allow per-item duration if you add data-aos-duration
            el.style.transitionDuration = duration + 'ms';

            // Trigger the animation after the declared delay
            setTimeout(() => el.classList.add('edu-animate'), delay);

            observer.unobserve(el); // run once per item
        });
    }, { threshold: 0.2, rootMargin: '0px 0px -10% 0px' });

    items.forEach(el => io.observe(el));
})();

// Select the form and the toast elements ==============================================================

// Contact form submit with Web3Forms Free Plan
const contactForm = document.getElementById('contact-form');
const successToast = document.getElementById('success-toast');
const closeToastBtn = document.getElementById('close-toast-btn');

function hideToast() {
    if (!successToast) return;

    successToast.classList.remove('opacity-100', 'translate-x-0');
    successToast.classList.add('opacity-0', 'translate-x-[-200%]');
    successToast.classList.add('pointer-events-none');
}

function showToast() {
    if (!successToast) {
        alert('Message sent successfully!');
        return;
    }

    successToast.classList.remove('opacity-0', 'translate-x-[-200%]');
    successToast.classList.add('opacity-100', 'translate-x-0');
    successToast.classList.remove('pointer-events-none');

    setTimeout(() => {
        hideToast();
    }, 4000);
}

if (contactForm) {
    contactForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn ? submitBtn.innerHTML : '';

        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Sending...';
            submitBtn.classList.add('opacity-70', 'cursor-not-allowed');
        }

        try {
            const json = JSON.stringify({
            access_key: "06d27366-bb20-42e7-a8b3-44f8a18cb1e2",
            subject: "New Portfolio Message from Rashedul Hasan Shohan Website",
            from_name: "Rashedul Hasan Shohan Portfolio",

            name: contactForm.querySelector('[name="name"]').value.trim(),
            email: contactForm.querySelector('[name="email"]').value.trim(),
            message: contactForm.querySelector('[name="message"]').value.trim()
        });

            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: json
            });

            const result = await response.json();

            if (result.success || response.status === 200) {
                contactForm.reset();
                showToast();
            } else {
                alert(result.message || 'Message could not be sent. Please try again.');
            }
        } catch (error) {
            alert('Something went wrong. Please check your internet connection and try again.');
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
                submitBtn.classList.remove('opacity-70', 'cursor-not-allowed');
            }
        }
    });
}

if (closeToastBtn) {
    closeToastBtn.addEventListener('click', function () {
        hideToast();
    });
}

//======================================================================================================


function openBioModal() {
    const modal = document.getElementById('bioModal');
    if (!modal) return;

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeBioModal() {
    const modal = document.getElementById('bioModal');
    if (!modal) return;

    modal.classList.remove('open');
    document.body.style.overflow = '';
}

function closeBioOnOutsideClick(event) {
    if (event.target && event.target.id === 'bioModal') {
        closeBioModal();
    }
}

document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        closeBioModal();
    }
});


document.addEventListener('DOMContentLoaded', function () {
    const expItems = document.querySelectorAll('#experience [data-aos]');

    if (!expItems.length) return;

    if (!('IntersectionObserver' in window)) {
        expItems.forEach(function (item) {
            item.classList.add('exp-animate');
        });
        return;
    }

    const expObserver = new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-aos-delay') || 0;
                entry.target.style.transitionDelay = delay + 'ms';
                entry.target.classList.add('exp-animate');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -60px 0px'
    });

    expItems.forEach(function (item) {
        expObserver.observe(item);
    });
});