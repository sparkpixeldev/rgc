document.addEventListener('DOMContentLoaded', () => {

    // --- FAQ Accordion --- 
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const questionButton = item.querySelector('.faq-question');
        const answerDiv = item.querySelector('.faq-answer');

        questionButton.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all other items
            // faqItems.forEach(otherItem => {
            //     if (otherItem !== item) {
            //         otherItem.classList.remove('active');
            //         otherItem.querySelector('.faq-answer').style.maxHeight = null;
            //         otherItem.querySelector('.faq-answer').style.padding = '0 1.5rem';
            //     }
            // });

            // Toggle current item
            if (isActive) {
                item.classList.remove('active');
                answerDiv.style.maxHeight = null;
                answerDiv.style.padding = '0 1.5rem'; // Reset padding when closing
            } else {
                item.classList.add('active');
                // Set padding before calculating scrollHeight for smooth opening
                answerDiv.style.padding = '0 1.5rem 1rem 1.5rem'; 
                answerDiv.style.maxHeight = answerDiv.scrollHeight + "px";
            }
        });
    });

    // --- Dynamic Footer Year ---
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // --- Event Timezone Conversion (Placeholder) ---
    const eventTimeSpan = document.getElementById('event-time');
    const nextEventDateSpan = document.getElementById('next-event-date');
    const eventDateEST = new Date('May 17, 2025 12:30:00 EST'); // IMPORTANT: EST is tricky timezone, consider using a library like Moment Timezone or Luxon for robust handling

    if (eventTimeSpan && eventDateEST) {
        try {
            // Format the date and time according to the user's locale and timezone
            const optionsDate = { year: 'numeric', month: 'long', day: 'numeric' };
            const optionsTime = { hour: 'numeric', minute: 'numeric', timeZoneName: 'short' };
            
            const userLocalDate = eventDateEST.toLocaleDateString(undefined, optionsDate);
            const userLocalTime = eventDateEST.toLocaleTimeString(undefined, optionsTime);

            const fullUserDateTime = `${userLocalDate} @ ${userLocalTime}`;

            // Update the banner and events section
            eventTimeSpan.textContent = userLocalTime;
            if (nextEventDateSpan) {
                 nextEventDateSpan.textContent = fullUserDateTime;
            }
           
            // Initial update for the main banner title (more complex if needed)
            const bannerH1 = document.querySelector('#home .banner h1 .glowing-text');
            if(bannerH1) {
                 // Basic update, assumes specific structure
                 bannerH1.innerHTML = `🏆 RGC #8 – ${fullUserDateTime}`;
            }

        } catch (error) {
            console.error("Error formatting event date:", error);
            // Keep the default EST time if conversion fails
             if (nextEventDateSpan) {
                nextEventDateSpan.textContent = "May 17th, 2025 @ 12:300 PM EST (Timezone conversion error)";
             }
        }
    }

    // --- Countdown Timer (Placeholder) ---
    const countdownTimerDiv = document.getElementById('countdown-timer');
    const targetDate = eventDateEST.getTime();

    if (countdownTimerDiv && targetDate) {
        const interval = setInterval(() => {
            const now = new Date().getTime();
            const distance = targetDate - now;

            if (distance < 0) {
                clearInterval(interval);
                countdownTimerDiv.innerHTML = "EVENT IS LIVE OR HAS PASSED!";
                return;
            }

            // Time calculations for days, hours, minutes and seconds
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            // Display the result
            countdownTimerDiv.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;

        }, 1000);
    }

    // --- Optional: Smooth Page Load Transition ---
    // document.body.classList.add('loaded');

     // --- Optional: Mobile Menu Toggle (Basic Example) ---
    // const menuToggle = document.querySelector('.menu-toggle'); // Need to add this button to HTML
    // const navUl = document.querySelector('nav ul');
    // if (menuToggle && navUl) {
    //     menuToggle.addEventListener('click', () => {
    //         navUl.classList.toggle('active');
    //     });
    // }

}); 
