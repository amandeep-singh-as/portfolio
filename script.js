/**
 * Portfolio – Scroll reveal + smooth interactions
 */

(function () {
    'use strict';

    /* -----------------------------------------------
     * Scroll-triggered reveal (IntersectionObserver)
     * ----------------------------------------------- */
    const revealElements = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target); // animate once
                    }
                });
            },
            { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
        );

        revealElements.forEach((el) => observer.observe(el));
    } else {
        // Fallback: show everything immediately
        revealElements.forEach((el) => el.classList.add('visible'));
    }

    /* -----------------------------------------------
     * Smooth scroll for anchor links
     * ----------------------------------------------- */
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (e) => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    /* -----------------------------------------------
     * Header fade on scroll
     * ----------------------------------------------- */
    const header = document.querySelector('.site-header');
    let lastScrollY = 0;
    let ticking = false;

    function onScroll() {
        lastScrollY = window.scrollY;
        if (!ticking) {
            requestAnimationFrame(() => {
                if (lastScrollY > 100) {
                    header.style.opacity = '0.92';
                } else {
                    header.style.opacity = '1';
                }
                ticking = false;
            });
            ticking = true;
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    /* -----------------------------------------------
     * Typewriter animation
     * ----------------------------------------------- */
    const typewriterLines = document.querySelectorAll('.typewriter-line');
    const heroTagline = document.getElementById('hero-tagline');

    function typeLine(element, text, speed) {
        return new Promise((resolve) => {
            let i = 0;
            element.classList.add('typing', 'active');
            element.textContent = '';

            function typeChar() {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                    // Vary speed slightly for natural feel
                    const jitter = Math.random() * 40 - 20;
                    setTimeout(typeChar, speed + jitter);
                } else {
                    element.classList.remove('active');
                    element.classList.add('done');
                    resolve();
                }
            }

            typeChar();
        });
    }

    async function runTypewriter() {
        const baseSpeed = 65; // ms per character
        const pauseBetweenLines = 400; // ms

        for (const line of typewriterLines) {
            const text = line.getAttribute('data-text');
            if (text) {
                await typeLine(line, text, baseSpeed);
                await new Promise((r) => setTimeout(r, pauseBetweenLines));
            }
        }

        // Fade in the tagline after typing completes
        if (heroTagline) {
            setTimeout(() => {
                heroTagline.classList.add('visible');
            }, 300);
        }
    }

    // Start typing after a brief initial delay
    setTimeout(runTypewriter, 600);

    /* -----------------------------------------------
     * Project Detail Panel
     * ----------------------------------------------- */
    const detailPanel = document.getElementById('detailPanel');
    const panelOverlay = document.getElementById('panelOverlay');
    const panelClose = document.getElementById('panelClose');
    const projects = document.querySelectorAll('.project');

    // Panel content elements
    const panelTitle = document.getElementById('panelTitle');
    const panelRole = document.getElementById('panelRole');
    const panelDuration = document.getElementById('panelDuration');
    const panelLocation = document.getElementById('panelLocation');
    const panelDesc = document.getElementById('panelDesc');
    const panelHighlights = document.getElementById('panelHighlights');
    const panelTech = document.getElementById('panelTech');

    function openPanel(projectEl) {
        // Populate content from data attributes
        panelTitle.textContent = projectEl.dataset.detailTitle || '';
        panelTitle.href = projectEl.dataset.detailUrl || '#';
        panelRole.textContent = projectEl.dataset.detailRole || '';
        panelDuration.textContent = projectEl.dataset.detailDuration || '';
        panelLocation.textContent = projectEl.dataset.detailLocation || '';
        panelDesc.textContent = projectEl.dataset.detailDesc || '';

        // Highlights (pipe-separated)
        panelHighlights.innerHTML = '';
        const highlights = projectEl.dataset.detailHighlights || '';
        if (highlights) {
            highlights.split('|').forEach((item) => {
                const li = document.createElement('li');
                li.textContent = item.trim();
                panelHighlights.appendChild(li);
            });
        }

        // Tech tags (comma-separated)
        panelTech.innerHTML = '';
        const tech = projectEl.dataset.detailTech || '';
        if (tech) {
            tech.split(',').forEach((tag) => {
                const span = document.createElement('span');
                span.className = 'detail-panel__tag';
                span.textContent = tag.trim();
                panelTech.appendChild(span);
            });
        }

        // Open
        detailPanel.classList.add('open');
        panelOverlay.classList.add('active');
        document.body.classList.add('panel-open');
    }

    function closePanel() {
        detailPanel.classList.remove('open');
        panelOverlay.classList.remove('active');
        document.body.classList.remove('panel-open');
    }

    // Click handlers on projects
    projects.forEach((project) => {
        project.addEventListener('click', (e) => {
            e.preventDefault();
            openPanel(project);
        });
    });

    // Close handlers
    panelClose.addEventListener('click', closePanel);
    panelOverlay.addEventListener('click', closePanel);

    // Escape key closes panel
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && detailPanel.classList.contains('open')) {
            closePanel();
        }
    });
})();
