
// MOBILE NAVIGATION
const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".main-nav");

if (menuButton && nav) {
  menuButton.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
    });
  });
}

// CURRENT YEAR
const yearElement = document.getElementById("year");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

// COUNT-UP ANIMATION
const counters = document.querySelectorAll("[data-count]");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const el = entry.target;
      const target = Number(el.dataset.count);

      if (!Number.isFinite(target)) return;

      let current = 0;
      const step = Math.max(1, Math.ceil(target / 35));

      const timer = setInterval(() => {
        current = Math.min(target, current + step);
        el.textContent = current;

        if (current >= target) {
          clearInterval(timer);
        }
      }, 35);

      observer.unobserve(el);
    });
  }, { threshold: 0.4 });

  counters.forEach(counter => observer.observe(counter));
}

// WHATSAPP ENQUIRY FORM
const enquiryForm = document.getElementById("enquiry-form");

if (enquiryForm) {
  enquiryForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const form = new FormData(this);

    const message = [
      "Hello JJ Travels, I would like to enquire about a trip.",
      "",
      `Name: ${form.get("name") || ""}`,
      `Mobile: ${form.get("phone") || ""}`,
      `Passengers: ${form.get("passengers") || ""}`,
      `Vehicle: ${form.get("vehicle") || ""}`,
      `Destination: ${form.get("destination") || "Not specified"}`
    ].join("\n");

    const url = `https://wa.me/917824996878?text=${encodeURIComponent(message)}`;

    window.open(url, "_blank", "noopener,noreferrer");

    const note = document.getElementById("form-note");

    if (note) {
      note.textContent = "Your enquiry is ready to send in WhatsApp.";
    }
  });
}

// CONTACT FORM - WHATSAPP ENQUIRY
const contactForm = document.getElementById("contact-form");

if (contactForm) {
  contactForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const form = new FormData(this);

    const name = form.get("name") || "";
    const email = form.get("email") || "";
    const phone = form.get("phone") || "";
    const message = form.get("message") || "";

    const whatsappMessage = [
      "Hello JJ Travels!",
      "",
      `Name: ${name}`,
      `Email: ${email}`,
      `Phone: ${phone}`,
      "",
      "Message:",
      message
    ].join("\n");

    const whatsappURL =
      `https://wa.me/917824996878?text=${encodeURIComponent(whatsappMessage)}`;

    window.open(whatsappURL, "_blank", "noopener,noreferrer");

    const note = document.getElementById("contact-note");

    if (note) {
      note.textContent = "Your enquiry is ready to send through WhatsApp.";
    }
  });
}
