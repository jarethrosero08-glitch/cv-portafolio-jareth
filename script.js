(function () {
  "use strict";

  // Mobile menu toggle
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");

  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const isOpen = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    links.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Contact form handling
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");

  if (form && status) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const message = form.message.value.trim();

      if (!name || !email || !message) {
        status.textContent = "Por favor, completa todos los campos.";
        status.style.color = "#ff6a3d";
        return;
      }

      // Validación sencilla de email
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        status.textContent = "El correo electrónico no es válido.";
        status.style.color = "#ff6a3d";
        return;
      }

      status.textContent =
        "¡Gracias, " + name + "! Tu mensaje ha sido enviado. Te responderé pronto.";
      status.style.color = "#7b61ff";
      form.reset();
      form.name.value = "Jareth Rosero";
      form.email.value = "jareth.rosero08@somo.eus";
    });
  }
})();
