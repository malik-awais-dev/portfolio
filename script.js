// ============================================
// PORTFOLIO JAVASCRIPT
// ============================================

// ---- Smooth scroll for in-page anchors ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#top') return;
        e.preventDefault();
        const target = document.querySelector(href);
        if (!target) return;
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// ---- Active nav link based on scroll position ----
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

function updateActiveNavLink() {
    let current = '';
    const scrollY = window.pageYOffset;
    sections.forEach(section => {
        if (scrollY >= section.offsetTop - 200) {
            current = section.getAttribute('id');
        }
    });
    navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href').slice(1) === current);
    });
}
window.addEventListener('scroll', updateActiveNavLink, { passive: true });
updateActiveNavLink();

// ---- Counter animation for stats ----
function animateCounter(el) {
    const original = el.dataset.original || el.textContent.trim();
    const match = original.match(/^(\d+)(.*)$/);
    if (!match) {
        // Non-numeric (e.g. "Expert") — just keep original text
        el.textContent = original;
        return;
    }
    const target = parseInt(match[1], 10);
    const suffix = match[2];
    const duration = 1800;
    const startTime = performance.now();

    function tick(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        const current = Math.floor(eased * target);
        el.textContent = current + suffix;
        if (progress < 1) {
            requestAnimationFrame(tick);
        } else {
            el.textContent = target + suffix;
        }
    }
    requestAnimationFrame(tick);
}

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.4 });

document.querySelectorAll('.stat-value').forEach(el => {
    const original = el.textContent.trim();
    el.dataset.original = original;
    if (/^\d+/.test(original)) {
        el.textContent = '0' + original.replace(/^\d+/, '');
    }
    counterObserver.observe(el);
});

// ---- Animated progress bars ----
const progressBars = document.querySelectorAll('.progress-fill');
progressBars.forEach(bar => {
    bar.dataset.targetWidth = bar.style.width || '0%';
    bar.style.width = '0%';
});

const progressObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const bar = entry.target;
            // tiny delay so transition catches
            requestAnimationFrame(() => {
                bar.style.width = bar.dataset.targetWidth;
            });
            progressObserver.unobserve(bar);
        }
    });
}, { threshold: 0.3 });

progressBars.forEach(bar => progressObserver.observe(bar));

// ---- Reveal-on-scroll for wire boxes (stagger within each section) ----
document.querySelectorAll('.blueprint-section').forEach(section => {
    const boxes = section.querySelectorAll('.wire-box');
    boxes.forEach((box, i) => {
        box.style.setProperty('--reveal-delay', `${i * 90}ms`);
    });
});

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.wire-box').forEach(box => revealObserver.observe(box));

// ---- Section label reveal ----
const labelObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            labelObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });

document.querySelectorAll('.section-label').forEach(el => labelObserver.observe(el));

// ---- Manual scroll restoration ----
if ('scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'manual';
}
