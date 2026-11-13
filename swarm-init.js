// CursorSwarm page-building cursors — MIT · github.com/ZhengLinLei/cursor-swarm.js
// Loaded by script.js after the base site JS runs. If this file or the
// library fails to load, the site keeps working normally without it.

// Wire boxes & labels: reveal immediately.
document.querySelectorAll('.wire-box, .section-label').forEach(el => el.classList.add('is-revealed'));

function initSwarm() {
    if (!window.CursorSwarm) return;
    CursorSwarm.palettes.blueprint = {
        colors: ['#2a2a2a', '#d95d39', '#2a6bf2'],
        hud: {
            background: 'rgba(24, 24, 24, 0.78)',
            color: '#f7f5ee',
            mute: '#b5b0a1',
            border: 'rgba(255, 255, 255, 0.14)'
        }
    };
    window.cursorSwarm = new CursorSwarm({
        root: 'main',
        cursors: 3,
        palette: 'blueprint',
        names: ['LAYOUT', 'EDITOR', 'SCAN'],
        deconstruct: true,
        exitAfterBuild: 'home',
        copyPaste: 0.5,
        trigger: 0.95,   // start building earlier so users outrun it less
        typeDuration: 1.0,
        speed: 1.25,
        maxSpeed: 4,
        respectReducedMotion: true
    }).init();

    // ---- Fast-scroll watchdog -------------------------------------------
    // Fast scrolling can interrupt a section mid-build and leave elements
    // cloaked with the swarm waiting on them. Two self-heals:
    //   1. Jump detection — a very fast scroll (1.5+ viewport heights in
    //      under 250ms) force-completes all pending builds via buildAll().
    //   2. Stall detection — if progress hasn't moved for 3s while the
    //      page is idle (no scroll), force-complete so nothing stays
    //      invisible. Each heal fires at most once per scroll burst.
    const swarm = window.cursorSwarm;
    let lastY = window.scrollY, lastT = performance.now();
    let lastProgress = null, progressT = performance.now();
    let healed = false;

    function heal(reason) {
        if (healed || !swarm || swarm.state !== 'running') return;
        healed = true;
        swarm.buildAll();
        setTimeout(() => { healed = false; }, 1500);
    }

    window.addEventListener('scroll', () => {
        const now = performance.now();
        const dy = Math.abs(window.scrollY - lastY);
        const dt = now - lastT;
        if (dt > 0 && dy / dt > window.innerHeight * 1.5 / 250) heal('jump');
        lastY = window.scrollY; lastT = now;
        progressT = now;
    }, { passive: true });

    setInterval(() => {
        if (!swarm || swarm.state !== 'running') return;
        const p = swarm.progress;
        if (p !== lastProgress) { lastProgress = p; progressT = performance.now(); return; }
        if (performance.now() - progressT > 3000) { lastProgress = p; heal('stall'); }
    }, 1000);
}

(function () {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/gh/ZhengLinLei/cursor-swarm.js@54cc2c2/cursor-swarm.min.js';
    s.onload = initSwarm;
    document.head.appendChild(s);
})();
