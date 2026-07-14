/* ===== LOADING SCREEN ===== */
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('loader').classList.add('hidden');
    }, 1800);
});

/* ===== SCROLL PROGRESS BAR ===== */
window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    document.getElementById('scroll-progress').style.width = progress + '%';
});

/* ===== MOUSE GLOW ===== */
const mouseGlow = document.getElementById('mouse-glow');
document.addEventListener('mousemove', (e) => {
    mouseGlow.style.left = e.clientX + 'px';
    mouseGlow.style.top = e.clientY + 'px';
});

/* ===== NAVBAR ===== */
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);

    // Back to top
    document.getElementById('back-to-top').classList.toggle('visible', window.scrollY > 500);

    // Active nav link
    const sections = document.querySelectorAll('section[id]');
    let current = '';
    sections.forEach(section => {
        const top = section.offsetTop - 120;
        if (window.scrollY >= top) current = section.getAttribute('id');
    });
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) link.classList.add('active');
    });
});

// Hamburger
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Back to top
document.getElementById('back-to-top').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ===== COUNTER ANIMATION ===== */
function animateCounters() {
    const counters = document.querySelectorAll('.counter-number');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const update = () => {
            current += step;
            if (current < target) {
                counter.textContent = Math.floor(current).toLocaleString();
                requestAnimationFrame(update);
            } else {
                counter.textContent = target.toLocaleString();
            }
        };
        update();
    });
}

/* ===== GALLERY FILTER ===== */
const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');

        galleryItems.forEach(item => {
            if (filter === 'all' || item.getAttribute('data-category') === filter) {
                item.classList.remove('hidden');
                item.style.display = '';
            } else {
                item.classList.add('hidden');
                setTimeout(() => { if (item.classList.contains('hidden')) item.style.display = 'none'; }, 400);
            }
        });
    });
});

/* ===== LIGHTBOX ===== */
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
let currentLightboxIndex = 0;
let visibleGalleryItems = [];

function updateVisibleItems() {
    visibleGalleryItems = Array.from(galleryItems).filter(item => !item.classList.contains('hidden'));
}

galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
        updateVisibleItems();
        currentLightboxIndex = visibleGalleryItems.indexOf(item);
        lightboxImg.src = item.querySelector('img').src;
        lightbox.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    });
});

document.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

document.querySelector('.lightbox-prev').addEventListener('click', () => {
    currentLightboxIndex = (currentLightboxIndex - 1 + visibleGalleryItems.length) % visibleGalleryItems.length;
    lightboxImg.src = visibleGalleryItems[currentLightboxIndex].querySelector('img').src;
});

document.querySelector('.lightbox-next').addEventListener('click', () => {
    currentLightboxIndex = (currentLightboxIndex + 1) % visibleGalleryItems.length;
    lightboxImg.src = visibleGalleryItems[currentLightboxIndex].querySelector('img').src;
});

function closeLightbox() {
    lightbox.classList.add('hidden');
    document.body.style.overflow = '';
}

document.addEventListener('keydown', (e) => {
    if (lightbox.classList.contains('hidden')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') document.querySelector('.lightbox-prev').click();
    if (e.key === 'ArrowRight') document.querySelector('.lightbox-next').click();
});

/* ===== FAQ ACCORDION ===== */
document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
        const item = btn.parentElement;
        const wasActive = item.classList.contains('active');
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
        if (!wasActive) item.classList.add('active');
    });
});

/* ===== REVIEWS SLIDER ===== */
const reviewsTrack = document.getElementById('reviews-track');
let reviewIndex = 0;

function getVisibleReviews() {
    const width = window.innerWidth;
    if (width <= 768) return 1;
    if (width <= 1024) return 2;
    return 4;
}

function updateSlider() {
    const visible = getVisibleReviews();
    const total = reviewsTrack.children.length;
    const maxIndex = Math.max(0, total - visible);
    reviewIndex = Math.min(reviewIndex, maxIndex);
    const cardWidth = reviewsTrack.children[0].offsetWidth + 25;
    reviewsTrack.style.transform = `translateX(-${reviewIndex * cardWidth}px)`;
}

document.getElementById('review-prev').addEventListener('click', () => {
    if (reviewIndex > 0) { reviewIndex--; updateSlider(); }
});

document.getElementById('review-next').addEventListener('click', () => {
    const visible = getVisibleReviews();
    const maxIndex = reviewsTrack.children.length - visible;
    if (reviewIndex < maxIndex) { reviewIndex++; updateSlider(); }
});

window.addEventListener('resize', updateSlider);

/* ===== BOOKING FORM ===== */
document.getElementById('booking-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const form = e.target;
    const success = document.getElementById('form-success');

    // Animasyonlu geçiş
    form.style.opacity = '0';
    form.style.transform = 'scale(0.95)';
    setTimeout(() => {
        form.querySelectorAll('.form-grid, .btn-full').forEach(el => el.style.display = 'none');
        success.classList.remove('hidden');
        form.style.opacity = '1';
        form.style.transform = 'scale(1)';
    }, 300);
});

// Min date ayarla
const dateInput = document.getElementById('date');
if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
}

/* ===== SCROLL REVEAL ===== */
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');

            // Counter animasyonu
            if (entry.target.closest('.counters')) {
                animateCounters();
            }

            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

/* ===== SMOOTH SCROLL ===== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

/* ===== KEYBOARD NAVIGATION ===== */
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});
