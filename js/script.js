const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".main-nav");

menuButton?.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

document.querySelectorAll('.main-nav a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
  });
});

document.getElementById("year").textContent = new Date().getFullYear();

// Small count-up animation for the achievement figures.
const counters = document.querySelectorAll("[data-count]");
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = Number(el.dataset.count);
    let current = 0;
    const step = Math.max(1, Math.ceil(target / 35));
    const timer = setInterval(() => {
      current = Math.min(target, current + step);
      el.textContent = current;
      if (current >= target) clearInterval(timer);
    }, 35);
    observer.unobserve(el);
  });
}, { threshold: 0.4 });
counters.forEach(counter => observer.observe(counter));

// This demo opens WhatsApp with the enquiry details.
// Replace the number below if the business enquiry number changes.
document.getElementById("enquiry-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const form = new FormData(this);

  const message = [
    "Hello JJ Travels, I would like to enquire about a trip.",
    "",
    `Name: ${form.get("name")}`,
    `Mobile: ${form.get("phone")}`,
    `Passengers: ${form.get("passengers")}`,
    `Vehicle: ${form.get("vehicle")}`,
    `Destination: ${form.get("destination") || "Not specified"}`
  ].join("\n");

  const url = `https://wa.me/917824996878?text=${encodeURIComponent(message)}`;

  window.open(url, "_blank");

  document.getElementById("form-note").textContent =
    "Your enquiry is ready to send in WhatsApp.";
});

// CONTACT FORM - WHATSAPP ENQUIRY

document.getElementById("contact-form")?.addEventListener("submit", function(event) {

    event.preventDefault();

    const form = new FormData(this);

    const name = form.get("name");
    const email = form.get("email");
    const phone = form.get("phone");
    const message = form.get("message");

    const whatsappMessage =
        `Hello JJ Travels!

Name: ${name}
Email: ${email}
Phone: ${phone}

Message:
${message}`;

    const whatsappURL =
        `https://wa.me/917824996878?text=${encodeURIComponent(whatsappMessage)}`;

    window.open(whatsappURL, "_blank", "noopener");

    document.getElementById("contact-note").textContent =
        "Your enquiry is ready to send through WhatsApp.";

});
