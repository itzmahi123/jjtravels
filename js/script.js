
// JJ Travels site interactions — safe to load on every page.
(() => {
  'use strict';

  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');

  if (menuButton && nav) {
    const closeMenu = () => {
      nav.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Open navigation');
    };

    menuButton.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      menuButton.setAttribute('aria-expanded', String(open));
      menuButton.setAttribute(
        'aria-label',
        open ? 'Close navigation' : 'Open navigation'
      );
    });

    nav.querySelectorAll('a').forEach(link =>
      link.addEventListener('click', closeMenu)
    );

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') closeMenu();
    });
  }

  // Automatically update the copyright year.
  const year = document.getElementById('year');
  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  // Animated number counters.
  if ('IntersectionObserver' in window) {
    const counters = document.querySelectorAll('[data-count]');

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const el = entry.target;
        const target = Number(el.dataset.count);

        if (!Number.isFinite(target) || target < 0) {
          observer.unobserve(el);
          return;
        }

        const duration = 900;
        const start = performance.now();

        const tick = now => {
          const progress = Math.min((now - start) / duration, 1);
          el.textContent = String(Math.round(target * progress));

          if (progress < 1) {
            requestAnimationFrame(tick);
          }
        };

        requestAnimationFrame(tick);
        observer.unobserve(el);
      });
    }, { threshold: 0.35 });

    counters.forEach(counter => observer.observe(counter));
  }

  // Open WhatsApp with the enquiry details.
  function openWhatsApp(message, note) {
    const url = `https://wa.me/917824996878?text=${encodeURIComponent(message)}`;

    if (note) {
      note.textContent =
        'Opening WhatsApp with your enquiry. Please review and press Send there.';
    }

    window.location.assign(url);
  }

  // Main enquiry form.
  const enquiry = document.getElementById('enquiry-form');

  if (enquiry) {
    enquiry.addEventListener('submit', event => {
      event.preventDefault();

      if (!enquiry.reportValidity()) return;

      const data = new FormData(enquiry);
      const phone = String(data.get('phone') || '').trim();

      if (!/^[+\d][\d\s()-]{7,18}$/.test(phone)) {
        const note = document.getElementById('form-note');
        if (note) {
          note.textContent = 'Please enter a valid contact number.';
        }
        return;
      }

      const message = [
        'Hello JJ Travels, I would like to enquire about a trip.',
        '',
        `Name: ${data.get('name') || ''}`,
        `Mobile: ${phone}`,
        `Passengers: ${data.get('passengers') || ''}`,
        `Vehicle: ${data.get('vehicle') || ''}`,
        `Destination: ${data.get('destination') || 'Not specified'}`
      ].join('\n');

      openWhatsApp(message, document.getElementById('form-note'));
    });
  }

  // Contact form.
  const contact = document.getElementById('contact-form');

  if (contact) {
    contact.addEventListener('submit', event => {
      event.preventDefault();

      if (!contact.reportValidity()) return;

      const data = new FormData(contact);
      const phone = String(data.get('phone') || '').trim();

      if (!/^[+\d][\d\s()-]{7,18}$/.test(phone)) {
        const note = document.getElementById('contact-note');
        if (note) {
          note.textContent = 'Please enter a valid contact number.';
        }
        return;
      }

      const message = [
        'Hello JJ Travels!',
        '',
        `Name: ${data.get('name') || ''}`,
        `Email: ${data.get('email') || ''}`,
        `Phone: ${phone}`,
        '',
        'Message:',
        String(data.get('message') || '')
      ].join('\n');

      openWhatsApp(message, document.getElementById('contact-note'));
    });
  }

  // Register the service worker on supported connections.
  if (
    'serviceWorker' in navigator &&
    (
      location.protocol === 'https:' ||
      location.hostname === 'localhost' ||
      location.hostname === '127.0.0.1'
    )
  ) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').catch(error => {
        console.error('Service worker registration failed:', error);
      });
    });
  }
})();
const reviewSlider = document.querySelector('.testimonial-loop');
const reviewTrack = document.querySelector('.testimonial-track');

if (reviewSlider && reviewTrack) {
  reviewSlider.addEventListener('pointerdown', () => {
    reviewTrack.style.animationPlayState = 'paused';
  });

  ['pointerup', 'pointercancel', 'pointerleave'].forEach(event => {
    reviewSlider.addEventListener(event, () => {
      reviewTrack.style.animationPlayState = '';
    });
  });
}


/* JJ TRAVELS TESTIMONIAL SLIDER */

document.querySelectorAll('.testimonial-loop').forEach(slider => {
  const track = slider.querySelector('.testimonial-track');
  const firstGroup = slider.querySelector('.testimonial-group');

  if (!track || !firstGroup) return;

  let position = 0;
  let lastTime = 0;
  let paused = false;
  let dragging = false;
  let startX = 0;
  let startScroll = 0;

  const speed = 15; // Pixels per second

  function loopWidth() {
    return firstGroup.getBoundingClientRect().width +
      parseFloat(getComputedStyle(track).gap || 0);
  }

  function animate(time) {
    if (!lastTime) lastTime = time;

    const delta = Math.min((time - lastTime) / 1000, 0.05);
    lastTime = time;

    if (!paused && !dragging) {
      position += speed * delta;

      const width = loopWidth();

      if (width > 0 && position >= width) {
        position -= width;
      }

      slider.scrollLeft = position;
    }

    requestAnimationFrame(animate);
  }

  slider.addEventListener('pointerdown', event => {
    dragging = true;
    paused = true;
    startX = event.clientX;
    startScroll = slider.scrollLeft;
  });
  
  window.addEventListener('pointermove', event => {
    if (!dragging) return;

    const distance = event.clientX - startX;
    slider.scrollLeft = startScroll - distance;
    position = slider.scrollLeft;
  });

  window.addEventListener('pointerup', () => {
    dragging = false;
    position = slider.scrollLeft;
  });

  slider.addEventListener('mouseenter', () => {
    paused = true;
  });

  slider.addEventListener('mouseleave', () => {
    if (!dragging) {
      position = slider.scrollLeft;
      paused = false;
    }
  });

  slider.addEventListener('touchstart', () => {
    paused = true;
  }, { passive: true });

  slider.addEventListener('touchend', () => {
    position = slider.scrollLeft;
    paused = false;
  }, { passive: true });
    // Open the review link when clicking a card
  slider.querySelectorAll('.testimonial').forEach(card => {
    card.addEventListener('click', event => {
      // Ignore clicks after dragging
      if (dragging) return;

      const link = card.dataset.link;

      if (link) {
        window.open(link, '_blank', 'noopener,noreferrer');
      }
    });
  });

  requestAnimationFrame(animate);
});



