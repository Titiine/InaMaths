/* ================= AbiAuto : logique du site ================= */
(function () {
  "use strict";

  const grid = document.getElementById("carGrid");
  const resultCount = document.getElementById("resultCount");
  const noResult = document.getElementById("noResult");

  const euro = (n) => n.toLocaleString("fr-FR") + " €";
  const km = (n) => n.toLocaleString("fr-FR") + " km";

  /* --- Vignette véhicule ---
     Si la voiture a des photos (car.photos = ["url1", "url2", ...]), on affiche
     la première photo. Sinon, on retombe sur une illustration SVG (hors-ligne). */
  function carThumb(car) {
    if (Array.isArray(car.photos) && car.photos.length) {
      return `<img class="car-thumb" src="${car.photos[0]}" alt="${car.marque} ${car.modele}" loading="lazy" />`;
    }
    return `
      <svg class="car-thumb" viewBox="0 0 400 240" role="img" aria-label="${car.marque} ${car.modele}">
        <defs>
          <linearGradient id="g${car.id}" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="${car.couleur}"/>
            <stop offset="100%" stop-color="#111827"/>
          </linearGradient>
        </defs>
        <rect width="400" height="240" fill="url(#g${car.id})"/>
        <g fill="rgba(255,255,255,.92)" transform="translate(60,120)">
          <path d="M20 40 L45 12 Q52 4 64 4 L180 4 Q192 4 200 14 L228 40 L268 48 Q280 50 280 62 L280 78 Q280 86 272 86 L248 86 A22 22 0 0 0 204 86 L96 86 A22 22 0 0 0 52 86 L24 86 Q12 86 12 74 L12 54 Q12 44 20 40 Z"/>
          <circle cx="74" cy="90" r="15" fill="#1f2937"/>
          <circle cx="226" cy="90" r="15" fill="#1f2937"/>
        </g>
        <text x="20" y="34" fill="rgba(255,255,255,.85)" font-family="system-ui" font-size="18" font-weight="700">${car.marque}</text>
      </svg>`;
  }

  /* --- Galerie photos pour la fiche (modale) --- */
  function carGallery(car) {
    if (!(Array.isArray(car.photos) && car.photos.length)) {
      return `<div class="modal-media">${carThumb(car)}</div>`;
    }
    const main = `<img id="galleryMain" class="gallery-main" src="${car.photos[0]}" alt="${car.marque} ${car.modele}" />`;
    const thumbs = car.photos.length > 1
      ? `<div class="gallery-thumbs">${car.photos.map((src, i) =>
          `<img src="${src}" alt="Photo ${i + 1}" class="${i === 0 ? "active" : ""}" data-gallery="${src}" />`).join("")}</div>`
      : "";
    return `<div class="modal-media gallery">${main}${thumbs}</div>`;
  }

  function badge(txt) { return `<span class="tag">${txt}</span>`; }

  function carCard(car) {
    return `
      <article class="car-card ${car.vendu ? "is-sold" : ""}" data-id="${car.id}">
        <div class="car-media">${carThumb(car)}
          <span class="car-price">${euro(car.prix)}</span>
          ${car.vendu
            ? '<span class="car-sold">Vendu</span>'
            : (car.annonce ? `<span class="car-lbc">Sur ${car.site}</span>` : "")}
        </div>
        <div class="car-body">
          <h3>${car.marque} ${car.modele}</h3>
          <p class="car-sub">${car.annee} • ${km(car.km)}</p>
          <div class="car-tags">${badge(car.carburant)}${badge(car.boite)}${car.puissance ? badge(car.puissance) : ""}</div>
          <button class="btn btn-outline btn-block" data-detail="${car.id}">Voir la fiche</button>
        </div>
      </article>`;
  }

  function render(list) {
    grid.innerHTML = list.map(carCard).join("");
    noResult.hidden = list.length !== 0;
    resultCount.textContent =
      list.length === 0
        ? "Aucun résultat"
        : `${list.length} véhicule${list.length > 1 ? "s" : ""} disponible${list.length > 1 ? "s" : ""}`;
  }

  /* --- Fiche véhicule (modale) --- */
  const modal = document.getElementById("carModal");
  const modalContent = document.getElementById("modalContent");

  function openModal(car) {
    const annonceBtn = car.annonce && !car.vendu
      ? `<a href="${car.annonce}" class="btn btn-lbc btn-block" target="_blank" rel="noopener">Voir l'annonce sur ${car.site} ↗</a>`
      : "";
    const cta = car.vendu
      ? `<p class="sold-note">Ce véhicule a été vendu. Appelez-moi, je peux vous trouver le même ! 📞</p>
         <a href="tel:+33601106358" class="btn btn-primary btn-block">Me contacter</a>`
      : `<a href="#rdv" class="btn btn-primary btn-block" data-close>Réserver un essai sur route</a>${annonceBtn}`;
    modalContent.innerHTML = `
      ${carGallery(car)}
      <div class="modal-info">
        <h2>${car.marque} ${car.modele} ${car.vendu ? '<span class="tag tag-sold">Vendu</span>' : ""}</h2>
        <p class="modal-price">${euro(car.prix)}</p>
        <p class="modal-desc">${car.desc}</p>
        <dl class="specs">
          <div><dt>Année</dt><dd>${car.annee}</dd></div>
          <div><dt>Kilométrage certifié</dt><dd>${km(car.km)}</dd></div>
          <div><dt>Carburant</dt><dd>${car.carburant}</dd></div>
          <div><dt>Boîte</dt><dd>${car.boite}</dd></div>
          ${car.puissance ? `<div><dt>Puissance</dt><dd>${car.puissance}</dd></div>` : ""}
          <div><dt>Places</dt><dd>${car.places}</dd></div>
        </dl>
        ${cta}
      </div>`;
    modal.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = "";
  }

  /* --- Événements --- */
  grid.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-detail]");
    if (!btn) return;
    const car = CARS.find((c) => c.id === Number(btn.dataset.detail));
    if (car) openModal(car);
  });

  modal.addEventListener("click", (e) => {
    const thumb = e.target.closest("[data-gallery]");
    if (thumb) {
      const main = document.getElementById("galleryMain");
      if (main) main.src = thumb.dataset.gallery;
      modal.querySelectorAll(".gallery-thumbs img").forEach((t) => t.classList.remove("active"));
      thumb.classList.add("active");
      return;
    }
    if (e.target.hasAttribute("data-close") || e.target.classList.contains("modal-backdrop")) {
      closeModal();
    }
  });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });

  /* --- Menu mobile --- */
  const navToggle = document.getElementById("navToggle");
  const mainNav = document.getElementById("mainNav");
  navToggle.addEventListener("click", () => mainNav.classList.toggle("open"));
  mainNav.addEventListener("click", (e) => {
    if (e.target.tagName === "A") mainNav.classList.remove("open");
  });

  /* --- Formulaire de contact / RDV (démo, pas d'envoi réel) --- */
  const form = document.getElementById("contactForm");
  const feedback = document.getElementById("formFeedback");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      feedback.hidden = false;
      feedback.className = "form-feedback error";
      feedback.textContent = "Merci de remplir les champs obligatoires.";
      return;
    }
    feedback.hidden = false;
    feedback.className = "form-feedback success";
    feedback.textContent = "✅ Merci ! Votre demande a bien été envoyée, je vous rappelle très vite.";
    form.reset();
  });

  /* --- Init --- */
  const lbcProfile = document.getElementById("lbcProfileLink");
  if (lbcProfile && typeof LEBONCOIN_PROFILE === "string") lbcProfile.href = LEBONCOIN_PROFILE;

  // Bouton de réservation en ligne (Calendly ou autre) : ne s'affiche que si BOOKING_URL est renseigné.
  const bookingBtn = document.getElementById("bookingBtn");
  if (bookingBtn && typeof BOOKING_URL === "string" && BOOKING_URL) {
    bookingBtn.href = BOOKING_URL;
    bookingBtn.hidden = false;
  }

  document.getElementById("year").textContent = new Date().getFullYear();
  // Les véhicules vendus restent dans les données mais ne sont pas affichés.
  render(CARS.filter((c) => !c.vendu));
})();
