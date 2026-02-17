document.addEventListener('DOMContentLoaded', () => {
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            document.body.classList.add('loaded');
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
            } catch (e) {  }
        });
    });
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const questionButton = item.querySelector('.faq-question');
        const answerDiv = item.querySelector('.faq-answer');
        questionButton.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            if (isActive) {
                item.classList.remove('active');
                answerDiv.style.maxHeight = null;
                answerDiv.style.padding = '0 1.5rem';
            } else {
                item.classList.add('active');
                answerDiv.style.padding = '0 1.5rem 1rem 1.5rem';
                answerDiv.style.maxHeight = `${answerDiv.scrollHeight}px`;
            }
        });
    });
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }
    const HAS_EVENT = false; 
    const eventTimeSpan = document.getElementById('event-time');      
    const nextEventDateSpan = document.getElementById('next-event-date'); 
    const heroEventDate = document.getElementById('hero-next-event-date');
    const heroEventTime = document.getElementById('hero-next-event-time');
    let eventDateEST;
    if (!HAS_EVENT) {
        if (heroEventDate) heroEventDate.textContent = 'No event scheduled';
        if (heroEventTime) heroEventTime.textContent = 'Check Discord for updates';
        if (nextEventDateSpan) nextEventDateSpan.textContent = 'TBD';
        if (eventTimeSpan) eventTimeSpan.textContent = 'TBD';
        const bannerGlowingText = document.querySelector('#home .banner h1 .glowing-text');
        if (bannerGlowingText) {
            bannerGlowingText.innerHTML = `🏆 RGC - No Event Scheduled`;
        }
    } else {
        const getZonedDate = (tz) => {
            try {
                const fmt = new Intl.DateTimeFormat('en-US', {
                    timeZone: tz,
                    year: 'numeric', month: '2-digit', day: '2-digit',
                    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
                });
                const target = new Date('2026-02-15T12:00:00'); 
                const parts = fmt.formatToParts(target);
                const map = Object.fromEntries(parts.map(p => [p.type, p.value]));
                const isoLike = `${map.year}-${map.month}-${map.day}T${map.hour}:${map.minute}:${map.second}`;
                const localPretend = new Date(isoLike);
                const utcFmt = new Intl.DateTimeFormat('en-US', {
                    timeZone: 'UTC', year: 'numeric', month: '2-digit', day: '2-digit',
                    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
                });
                const utcParts = Object.fromEntries(utcFmt.formatToParts(localPretend).map(p => [p.type, p.value]));
                const utcIso = `${utcParts.year}-${utcParts.month}-${utcParts.day}T${utcParts.hour}:${utcParts.minute}:${utcParts.second}Z`;
                return new Date(utcIso);
            } catch (e) {
                return new Date('2026-02-15T12:00:00-05:00'); 
            }
        };
        eventDateEST = getZonedDate('America/New_York');
        try {
            const optsDate = { year: 'numeric', month: 'long', day: 'numeric' };
            const optsTime = { hour: 'numeric', minute: 'numeric', timeZoneName: 'short' };
            const userLocalDate = eventDateEST.toLocaleDateString(undefined, optsDate);
            const userLocalTime = eventDateEST.toLocaleTimeString(undefined, optsTime);
            const fullUserDateTime = `${userLocalDate} @ ${userLocalTime}`;
            if (eventTimeSpan) eventTimeSpan.textContent = userLocalTime;
            if (nextEventDateSpan) nextEventDateSpan.textContent = fullUserDateTime;
            if (heroEventDate) heroEventDate.textContent = userLocalDate;
            if (heroEventTime) heroEventTime.textContent = userLocalTime;
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
    }
    const countdownTimerDiv = document.getElementById('countdown-timer');
    if (HAS_EVENT && eventDateEST) {
        const targetTimestamp = eventDateEST.getTime();
        if (countdownTimerDiv && !Number.isNaN(targetTimestamp)) {
            const updateCountdown = () => {
                const now = Date.now();
                const distance = targetTimestamp - now;
                if (distance <= 0) {
                    countdownTimerDiv.textContent = 'EVENT IS LIVE OR HAS PASSED!';
                    clearInterval(intervalId);
                    return;
                }
                const days = Math.floor(distance / 86_400_000);      
                const hours = Math.floor((distance % 86_400_000) / 3_600_000);
                const minutes = Math.floor((distance % 3_600_000) / 60_000);
                const seconds = Math.floor((distance % 60_000) / 1_000);
                countdownTimerDiv.textContent =
                    `${days}d ${hours}h ${minutes}m ${seconds}s`;
            };
            updateCountdown();                    
            const intervalId = setInterval(updateCountdown, 1000);
        }
    } else {
        if (countdownTimerDiv) {
            countdownTimerDiv.textContent = 'No event currently scheduled. Check back soon!';
        }
    }
    const menuToggle = document.querySelector('.menu-toggle');
    const primaryNav = document.getElementById('primary-navigation');
    if (menuToggle && primaryNav) {
        const toggleMenu = () => {
            const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', String(!expanded));
            primaryNav.classList.toggle('active');
        };
        menuToggle.addEventListener('click', toggleMenu);
        primaryNav.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => {
                if (window.matchMedia('(max-width: 768px)').matches) {
                    menuToggle.setAttribute('aria-expanded', 'false');
                    primaryNav.classList.remove('active');
                }
            });
        });
    }
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
    const revealEls = document.querySelectorAll('main section, .card, #faq .faq-item, #team .team-group, #events .event-countdown, #community .housing-info, #community .boost-perks');
    if (revealEls.length) {
        const isInViewport = (el) => {
            const rect = el.getBoundingClientRect();
            const vh = window.innerHeight || document.documentElement.clientHeight;
            const vw = window.innerWidth || document.documentElement.clientWidth;
            return rect.top < vh && rect.bottom > 0 && rect.left < vw && rect.right > 0;
        };
        revealEls.forEach(el => el.classList.add('reveal'));
        const revealObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal-in');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });
        revealEls.forEach(el => revealObserver.observe(el));
        const baseDelay = 120; 
        const step = 70;       
        const initialInView = Array.from(revealEls).filter(isInViewport);
        initialInView.forEach((el, i) => {
            el.style.setProperty('--delay', `${baseDelay + i * step}ms`);
        });
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                initialInView.forEach(el => {
                    el.classList.add('reveal-in');
                    revealObserver.unobserve(el);
                });
            });
        });
    }
    const hero = document.querySelector('.hero-banner');
    if (hero) {
        const onParallax = () => {
            const y = Math.min(window.scrollY, 600);
            hero.style.backgroundPosition = `center ${-y * 0.12}px`;
        };
        window.addEventListener('scroll', onParallax, { passive: true });
        onParallax();
    }
    const rulebookPopup = document.getElementById('rulebook-popup');
    const rulebookToggle = document.getElementById('rulebook-toggle');
    const rulebookClose = rulebookPopup ? rulebookPopup.querySelector('.rulebook-close') : null;
    if (rulebookPopup && rulebookToggle) {
        rulebookToggle.addEventListener('click', () => {
            rulebookPopup.classList.add('open');
        });
        if (rulebookClose) {
            rulebookClose.addEventListener('click', () => {
                rulebookPopup.classList.remove('open');
            });
        }
        document.addEventListener('click', (e) => {
            if (rulebookPopup.classList.contains('open') &&
                !rulebookPopup.contains(e.target)) {
                rulebookPopup.classList.remove('open');
            }
        });
    }
    const heroEl = document.querySelector('.hero-banner');
    const prefersReduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (heroEl && !prefersReduceMotion) {
        const particleColors = ['#5cb85c', '#FFAA00', '#8b5cf6', '#6ee7b7', '#7dd87d', '#ffcc44'];
        const spawnParticle = () => {
            const p = document.createElement('div');
            p.className = 'mc-particle';
            const size = Math.floor(Math.random() * 4) + 3; 
            p.style.width = size + 'px';
            p.style.height = size + 'px';
            p.style.backgroundColor = particleColors[Math.floor(Math.random() * particleColors.length)];
            p.style.left = Math.random() * 100 + '%';
            p.style.bottom = Math.random() * 40 + '%';
            p.style.animationDuration = (3 + Math.random() * 3) + 's';
            heroEl.appendChild(p);
            p.addEventListener('animationend', () => p.remove());
        };
        setInterval(spawnParticle, 300);
    }
});
