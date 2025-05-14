document.addEventListener('DOMContentLoaded', () => {

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
    const eventDateEST      = new Date('May 17, 2025 12:30:00 EST');

    try {
        const optsDate = { year: 'numeric', month: 'long', day: 'numeric' };
        const optsTime = { hour: 'numeric', minute: 'numeric', timeZoneName: 'short' };

        const userLocalDate = eventDateEST.toLocaleDateString(undefined, optsDate);
        const userLocalTime = eventDateEST.toLocaleTimeString(undefined, optsTime);

        const fullUserDateTime = `${userLocalDate} @ ${userLocalTime}`;

        if (eventTimeSpan)       eventTimeSpan.textContent     = userLocalTime;
        if (nextEventDateSpan)   nextEventDateSpan.textContent = fullUserDateTime;

        // Also update the banner title
        const bannerGlowingText = document.querySelector('#home .banner h1 .glowing-text');
        if (bannerGlowingText) {
            bannerGlowingText.innerHTML = `🏆 RGC #8 – ${fullUserDateTime}`;
        }

    } catch (err) {
        console.error('Error formatting event date:', err);
        if (nextEventDateSpan) {
            nextEventDateSpan.textContent = 'May 17, 2025 @ 12:30 PM EST (Time-zone conversion error)';
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

    /* ─────────────────────────────────────
       (Optional) Mobile-menu toggle, page-load
       transitions, etc. retain commented-out
       placeholders from original script.
    ───────────────────────────────────── */

});
