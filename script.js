// PORTFOLIO JS — smooth scroll, nav highlight, stat counters, progress bars.
// Scroll-drawing effect lives in swarm-init.js (loaded last).

// ---- Smooth scroll for in-page anchors ----
document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (href === '#top') return;
    const t = document.querySelector(href);
    if (!t) return;
    e.preventDefault();
    t.scrollIntoView({ behavior: 'smooth', block: 'start' });
}));

// ---- Active nav link based on scroll position ----
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');
function updateActiveNavLink() {
    let current = '';
    const y = window.pageYOffset;
    sections.forEach(s => { if (y >= s.offsetTop - 200) current = s.id; });
    navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href').slice(1) === current));
}
window.addEventListener('scroll', updateActiveNavLink, { passive: true });
updateActiveNavLink();

// ---- Counter animation for stats (ease-out cubic, 1.8s) ----
function animateCounter(el) {
    const original = el.dataset.original || el.textContent.trim();
    const match = original.match(/^(\d+)(.*)$/);
    if (!match) { el.textContent = original; return; }
    const target = parseInt(match[1], 10);
    const suffix = match[2];
    const t0 = performance.now();
    (function tick(now) {
        const p = Math.min((now - t0) / 1800, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.floor(eased * target) + suffix;
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = target + suffix;
    })(t0);
}
const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(en => {
        if (en.isIntersecting) { animateCounter(en.target); counterObserver.unobserve(en.target); }
    });
}, { threshold: 0.4 });
document.querySelectorAll('.stat-value').forEach(el => {
    const original = el.textContent.trim();
    el.dataset.original = original;
    if (/^\d+/.test(original)) el.textContent = '0' + original.replace(/^\d+/, '');
    counterObserver.observe(el);
});

// ---- Animated progress bars ----
const progressBars = document.querySelectorAll('.progress-fill');
progressBars.forEach(b => { b.dataset.targetWidth = b.style.width || '0%'; b.style.width = '0%'; });
const progressObserver = new IntersectionObserver(entries => {
    entries.forEach(en => {
        if (!en.isIntersecting) return;
        const b = en.target;
        requestAnimationFrame(() => { b.style.width = b.dataset.targetWidth; });
        progressObserver.unobserve(b);
    });
}, { threshold: 0.3 });
progressBars.forEach(b => progressObserver.observe(b));

// ---- Manual scroll restoration ----
if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';

// ---- Load the CursorSwarm effect (swarm-init.js) ----
(function () {
    const s = document.createElement('script');
    s.src = 'swarm-init.js';
    document.head.appendChild(s);
})();
