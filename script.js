document.addEventListener('DOMContentLoaded', () => {
    // Mark body as loaded for CSS entrance animations (ensure first paint occurs)
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
    document.body.classList.add('loaded');
            // Ensure hero elements animate on page load (excluding header)
            try {
                const prefersReduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                const canAnimate = typeof Element.prototype.animate === 'function';
                if (!prefersReduce && canAnimate) {
                    const easing = 'cubic-bezier(0.22, 1, 0.36, 1)';
                    const duration = 640;
                    const badge = document.querySelector('.season-badge');
                    const titleSpans = document.querySelectorAll('.hero-title span');
                    if (badge) {
                        badge.animate(
                            [
                                { opacity: 0, transform: 'translateY(12px) scale(0.985)' },
                                { opacity: 1, transform: 'none' }
                            ],
                            { duration, easing, delay: 240, fill: 'both' }
                        );
                    }
                    titleSpans.forEach((span, i) => {
                        span.animate(
                            [
                                { opacity: 0, transform: 'translateY(16px) scale(0.98)' },
                                { opacity: 1, transform: 'none' }
                            ],
                            { duration, easing, delay: 360 + i * 120, fill: 'both' }
                        );
                    });
                }
            } catch (e) { /* no-op */ }
        });
    });

    /* ─────────────────────────────────────
       FAQ Accordion
    ───────────────────────────────────── */
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const questionButton = item.querySelector('.faq-question');
        const answerDiv      = item.querySelector('.faq-answer');

        questionButton.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Toggle this item
            if (isActive) {
                item.classList.remove('active');
                answerDiv.style.maxHeight = null;
                answerDiv.style.padding   = '0 1.5rem';
            } else {
                item.classList.add('active');
                answerDiv.style.padding   = '0 1.5rem 1rem 1.5rem';
                answerDiv.style.maxHeight = `${answerDiv.scrollHeight}px`;
            }
        });
    });

    /* ─────────────────────────────────────
       Dynamic Footer Year
    ───────────────────────────────────── */
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    /* ─────────────────────────────────────
       Event Date → local timezone
    ───────────────────────────────────── */
    const eventTimeSpan     = document.getElementById('event-time');      // optional
    const nextEventDateSpan = document.getElementById('next-event-date'); // required
    const heroEventDate     = document.getElementById('hero-next-event-date');
    const heroEventTime     = document.getElementById('hero-next-event-time');
    const eventsSectionEl   = document.getElementById('events');
    const noEventMode       = eventsSectionEl && eventsSectionEl.getAttribute('data-no-event') === 'true';
    // Event time: Sunday, Oct 12, 2025 at 12:00 PM in New York (America/New_York)
    // We compute the equivalent UTC Date to ensure correct local conversion across DST/regions.
    const getZonedDate = (tz) => {
        try {
            // Format parts for the target zone, then construct a Date from those parts as if they are local.
            const fmt = new Intl.DateTimeFormat('en-US', {
                timeZone: tz,
                year: 'numeric', month: '2-digit', day: '2-digit',
                hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
            });
            // Target wall time in New York
            const target = new Date('2025-10-12T12:00:00'); // interpret later via parts
            const parts = fmt.formatToParts(target);
            const map = Object.fromEntries(parts.map(p => [p.type, p.value]));
            // Build an ISO-like string in the target zone's wall time, then treat as if it's local to get UTC epoch
            const isoLike = `${map.year}-${map.month}-${map.day}T${map.hour}:${map.minute}:${map.second}`;
            // Create a date as if user local, then adjust by the offset between user local and target zone at that wall time
            const localPretend = new Date(isoLike);
            // Get the actual offset for the target zone by comparing formatted time to UTC
            const utcFmt = new Intl.DateTimeFormat('en-US', {
                timeZone: 'UTC', year: 'numeric', month: '2-digit', day: '2-digit',
                hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
            });
            const utcParts = Object.fromEntries(utcFmt.formatToParts(localPretend).map(p => [p.type, p.value]));
            const utcIso = `${utcParts.year}-${utcParts.month}-${utcParts.day}T${utcParts.hour}:${utcParts.minute}:${utcParts.second}Z`;
            return new Date(utcIso);
        } catch (e) {
            // Fallback: attempt parsing with explicit time zone name (not widely supported in Date constructor)
            return new Date('2025-10-12T12:00:00-04:00'); // New York likely EDT on Oct 12, 2025
        }
    };

    if (noEventMode) {
        if (heroEventDate) heroEventDate.textContent = 'Not currently scheduled';
        if (heroEventTime) heroEventTime.textContent = '';
    } else {
    const eventDateEST = getZonedDate('America/New_York');

    try {
        const optsDate = { year: 'numeric', month: 'long', day: 'numeric' };
        const optsTime = { hour: 'numeric', minute: 'numeric', timeZoneName: 'short' };

        const userLocalDate = eventDateEST.toLocaleDateString(undefined, optsDate);
        const userLocalTime = eventDateEST.toLocaleTimeString(undefined, optsTime);

        const fullUserDateTime = `${userLocalDate} @ ${userLocalTime}`;

        if (eventTimeSpan)       eventTimeSpan.textContent     = userLocalTime;
        if (nextEventDateSpan)   nextEventDateSpan.textContent = fullUserDateTime;
        if (heroEventDate)       heroEventDate.textContent     = userLocalDate;
        if (heroEventTime)       heroEventTime.textContent     = userLocalTime;

        // Also update the banner title
        const bannerGlowingText = document.querySelector('#home .banner h1 .glowing-text');
        if (bannerGlowingText) {
            bannerGlowingText.innerHTML = `🏆 RGC - ${fullUserDateTime}`;
        }

    } catch (err) {
        console.error('Error formatting event date:', err);
        if (nextEventDateSpan) {
            nextEventDateSpan.textContent = 'July 29, 2025 @ 2:00 PM EST (Time-zone conversion error)';
        }
    }

    /* ─────────────────────────────────────
       Countdown Timer
    ───────────────────────────────────── */
    const countdownTimerDiv = document.getElementById('countdown-timer');
    const targetTimestamp   = eventDateEST.getTime();

    if (countdownTimerDiv && !Number.isNaN(targetTimestamp)) {
        const updateCountdown = () => {
            const now       = Date.now();
            const distance  = targetTimestamp - now;

            if (distance <= 0) {
                countdownTimerDiv.textContent = 'EVENT IS LIVE OR HAS PASSED!';
                clearInterval(intervalId);
                return;
            }

            const days    = Math.floor(distance / 86_400_000);      // 1000*60*60*24
            const hours   = Math.floor((distance % 86_400_000) / 3_600_000);
            const minutes = Math.floor((distance % 3_600_000) /   60_000);
            const seconds = Math.floor((distance %     60_000) /    1_000);

            countdownTimerDiv.textContent =
                `${days}d ${hours}h ${minutes}m ${seconds}s`;
        };

        updateCountdown();                    // run immediately
        const intervalId = setInterval(updateCountdown, 1000);
    }
    }

    /* ─────────────────────────────────────
       (Optional) Mobile-menu toggle, page-load
       transitions, etc. retain commented-out
       placeholders from original script.
    ───────────────────────────────────── */

    /* ─────────────────────────────────────
       Mobile Navigation Toggle
    ───────────────────────────────────── */
    const menuToggle = document.querySelector('.menu-toggle');
    const primaryNav = document.getElementById('primary-navigation');
    if (menuToggle && primaryNav) {
        const toggleMenu = () => {
            const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', String(!expanded));
            primaryNav.classList.toggle('active');
        };
        menuToggle.addEventListener('click', toggleMenu);
        // Close on nav link click (mobile)
        primaryNav.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => {
                if (window.matchMedia('(max-width: 768px)').matches) {
                    menuToggle.setAttribute('aria-expanded', 'false');
                    primaryNav.classList.remove('active');
                }
            });
        });
    }

    /* ─────────────────────────────────────
       Back to Top Button
    ───────────────────────────────────── */
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        const onScroll = () => {
            if (window.scrollY > 400) backToTopBtn.classList.add('show');
            else backToTopBtn.classList.remove('show');
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        onScroll();
    }

    /* ─────────────────────────────────────
       Active Nav Highlight on Scroll
    ───────────────────────────────────── */
    const sections = document.querySelectorAll('main section[id]');
    const navLinks = document.querySelectorAll('#primary-navigation a');
    if (sections.length && navLinks.length) {
        const sectionById = new Map(Array.from(sections).map(s => [s.id, s]));
        const linkById = new Map(Array.from(navLinks).map(l => [l.getAttribute('href').slice(1), l]));
        const clearActive = () => navLinks.forEach(l => l.classList.remove('active'));
        const setActive = (id) => {
            clearActive();
            const l = linkById.get(id);
            if (l) l.classList.add('active');
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) setActive(entry.target.id);
            });
        }, { rootMargin: '-40% 0px -55% 0px', threshold: 0.01 });

        sections.forEach(s => observer.observe(s));
    }

    /* ─────────────────────────────────────
       Reveal-on-Scroll + Page-load Stagger
    ───────────────────────────────────── */
    const revealEls = document.querySelectorAll('main section, .card, #faq .faq-item, #team .team-group, #events .event-countdown, #community .housing-info, #community .boost-perks');
    if (revealEls.length) {
        const isInViewport = (el) => {
            const rect = el.getBoundingClientRect();
            const vh = window.innerHeight || document.documentElement.clientHeight;
            const vw = window.innerWidth || document.documentElement.clientWidth;
            return rect.top < vh && rect.bottom > 0 && rect.left < vw && rect.right > 0;
        };

        // Mark initial state
        revealEls.forEach(el => el.classList.add('reveal'));

        // Observer for scroll-in reveals
        const revealObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal-in');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });
        revealEls.forEach(el => revealObserver.observe(el));

        // Page-load stagger for elements already in view (exclude header by selector)
        const baseDelay = 120; // start slightly after main fade begins
        const step = 70;       // ms between items
        const initialInView = Array.from(revealEls).filter(isInViewport);
        initialInView.forEach((el, i) => {
            el.style.setProperty('--delay', `${baseDelay + i * step}ms`);
        });
        // Trigger reveal-in after delay is set, then stop observing those
        requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            initialInView.forEach(el => {
                el.classList.add('reveal-in');
                revealObserver.unobserve(el);
                });
            });
        });
    }

    /* ─────────────────────────────────────
       Subtle hero parallax on scroll
    ───────────────────────────────────── */
    const hero = document.querySelector('.hero-banner');
    if (hero) {
        const onParallax = () => {
            const y = Math.min(window.scrollY, 600);
            hero.style.backgroundPosition = `center ${-y * 0.12}px`;
        };
        window.addEventListener('scroll', onParallax, { passive: true });
        onParallax();
    }

    /* ─────────────────────────────────────
       Role Definitions: no JS needed; native <details> handles toggle.
    ───────────────────────────────────── */
});
