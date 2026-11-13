// CursorSwarm page-building cursors — MIT · github.com/ZhengLinLei/cursor-swarm.js
// Loaded by script.js after the base site JS runs. If this file or the
// library fails to load, the site keeps working normally without it.

// Wire boxes & labels: reveal immediately. CursorSwarm owns the scroll
// build/unbuild choreography, so nothing may stay hidden waiting for
// the old reveal observers' viewport trigger.
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
        root: 'main',           // animate content modules, not the sticky nav
        cursors: 3,
        palette: 'blueprint',
        names: ['LAYOUT', 'EDITOR', 'SCAN'],
        deconstruct: true,      // un-build sections on scroll-up
        exitAfterBuild: 'home',
        copyPaste: 0.5,         // repeated cards get copy-pasted in
        typeDuration: 1.2,
        speed: 1.15,
        respectReducedMotion: true
    }).init();
}

(function () {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/gh/ZhengLinLei/cursor-swarm.js@54cc2c2/cursor-swarm.min.js';
    s.onload = initSwarm;
    document.head.appendChild(s);
})();
