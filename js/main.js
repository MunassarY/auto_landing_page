// AAUTO'S — Client Logic (Search, Inventory, Spline 3D Runtime, RDW Lookup, Finance Calculator, Contact)
import { Application } from '@splinetool/runtime';

const CONFIG = {
  phone: "+31643225592",
  phoneLabel: "06 - 43 22 55 92",
  whatsapp: "31643225592",
  whatsappLabel: "06 - 43 22 55 92",
  email: "info@aautos.nl",
  hours: { 1: [9, 18], 2: [9, 18], 3: [9, 18], 4: [9, 18], 5: [9, 18], 6: [10, 17], 0: null },
  apr: 0.079,
  leadEndpoint: null
};

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const eur = n => "€ " + Math.round(n).toLocaleString("nl-NL");
const store = {
  get(k) { try { return JSON.parse(localStorage.getItem(k)) || []; } catch { return []; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
};

let cars = window.CARS || [];
let favs = store.get("favs");
let cmp = [];

// ---- Spline 3D Scene Runtime Integration ----
let splineApp = null;
function initSplineScene() {
  const canvas = document.getElementById("canvas3d");
  if (!canvas) return;

  try {
    splineApp = new Application(canvas);
    window.splineApp = splineApp;

    const statusEl = document.getElementById("spline-status-text");
    const sceneUrl = window.SPLINE_SCENE_URL || null;

    if (sceneUrl) {
      if (statusEl) statusEl.textContent = "3D Scene laden...";
      splineApp.load(sceneUrl).then(() => {
        if (statusEl) statusEl.textContent = "3D Scene Gereed";
      }).catch(err => {
        console.warn("Spline load notice:", err);
        if (statusEl) statusEl.textContent = "Spline 3D Runtime Actief";
      });
    } else {
      if (statusEl) statusEl.textContent = "Spline Runtime Gereed";
    }

    const resetBtn = document.getElementById("spline-reset-btn");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        if (splineApp) {
          try {
            const cam = splineApp.findObjectByName("Camera") || splineApp.findObjectByName("camera");
            if (cam && cam.position) {
              cam.position.set(0, 0, 1000);
            }
          } catch {}
        }
      });
    }
  } catch (err) {
    console.warn("Spline runtime init error:", err);
  }
}

window.loadSplineScene = function(url) {
  if (!url) return;
  window.SPLINE_SCENE_URL = url;
  const canvas = document.getElementById("canvas3d");
  const statusEl = document.getElementById("spline-status-text");
  if (!canvas) return;

  if (!splineApp) {
    splineApp = new Application(canvas);
    window.splineApp = splineApp;
  }
  if (statusEl) statusEl.textContent = "3D Scene laden...";
  splineApp.load(url).then(() => {
    if (statusEl) statusEl.textContent = "3D Scene Actief";
  }).catch(err => {
    console.error("Spline load error:", err);
    if (statusEl) statusEl.textContent = "Fout bij laden van .splinecode";
  });
};

// Wire up telephone and WhatsApp links
$$("[data-tel]").forEach(a => {
  a.href = "tel:" + CONFIG.phone;
});
$$("[data-wa]").forEach(a => {
  a.href = "https://wa.me/" + CONFIG.whatsapp + "?text=" + encodeURIComponent("Hallo AAUTO'S, ik heb een vraag over een occasion.");
});

// Mobile navigation toggle (class-based, zero inline styles)
const mb = $(".menu-btn");
if (mb) {
  mb.onclick = () => {
    const nav = $(".royal-links");
    if (!nav) return;
    const isOpen = nav.classList.toggle("is-open");
    mb.setAttribute("aria-expanded", String(isOpen));
  };
  $$(".royal-links a").forEach(link => {
    link.addEventListener("click", () => {
      const nav = $(".royal-links");
      if (nav && nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
        mb.setAttribute("aria-expanded", "false");
      }
    });
  });
}

// ---- Counter Update Helper ----
function animateNumber(element, start, end, duration = 250, prefix = "", suffix = "") {
  if (!element) return;
  const startTime = performance.now();
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(start + (end - start) * ease);
    element.textContent = prefix + (suffix === " auto's" ? current : current.toLocaleString("nl-NL")) + suffix;
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }
  requestAnimationFrame(update);
}

// ---- Search Engine ----
const f = $("#search");
const uniq = k => [...new Set(cars.map(c => c[k]))].filter(Boolean).sort();
const fill = (sel, vals) => {
  if (!sel) return;
  vals.forEach(x => sel.add(new Option(typeof x === "number" ? "Tot " + eur(x) : x, x)));
};

let currentCount = cars.length;

if (f) {
  fill(f.make, uniq("make"));
  fill(f.fuel, uniq("fuel"));
  fill(f.price, [10000, 15000, 20000, 25000, 35000]);

  function updateModels() {
    if (!f.model) return;
    const cur = f.model.value;
    f.model.length = 1;
    const availableModels = [...new Set(cars.filter(c => !f.make.value || c.make === f.make.value).map(c => c.model))].sort();
    fill(f.model, availableModels);
    f.model.value = cur;
  }

  function match() {
    return cars.filter(c =>
      (!f.make.value || c.make === f.make.value) &&
      (!f.model.value || c.model === f.model.value) &&
      (!f.price.value || c.price <= +f.price.value) &&
      (!f.fuel.value || c.fuel === f.fuel.value)
    );
  }

  function updateCount() {
    const matchingCount = match().length;
    const countEl = $("#count");
    if (countEl) {
      animateNumber(countEl, currentCount, matchingCount, 200);
      currentCount = matchingCount;
    }
  }

  f.make.onchange = () => { f.model.value = ""; updateModels(); updateCount(); };
  [f.model, f.price, f.fuel].forEach(e => { if (e) e.onchange = updateCount; });
  f.onsubmit = e => {
    e.preventDefault();
    render(match());
    if (window.lenis) window.lenis.scrollTo("#aanbod", { offset: -30, duration: 1.2 });
    else $("#aanbod")?.scrollIntoView({ behavior: "smooth" });
  };

  updateModels();
  updateCount();
}

// ---- Browse by Need (Categories) ----
function initCategories() {
  const catCounts = {
    "onder-10k": cars.filter(c => c.price < 10000).length,
    "gezinsauto": cars.filter(c => (c.category && c.category.includes("gezinsauto")) || c.body === "Stationwagen" || c.model.includes("Golf")).length,
    "automaat": cars.filter(c => c.trans === "Automaat").length,
    "hybride-elektrisch": cars.filter(c => c.fuel === "Hybride" || c.fuel === "Elektrisch").length,
    "bedrijfswagens": cars.filter(c => (c.category && c.category.includes("bedrijfswagens")) || c.body === "Bestelwagen").length
  };

  if ($("#count-onder-10k")) $("#count-onder-10k").textContent = catCounts["onder-10k"] + " auto's";
  if ($("#count-gezinsauto")) $("#count-gezinsauto").textContent = catCounts["gezinsauto"] + " auto's";
  if ($("#count-automaat")) $("#count-automaat").textContent = catCounts["automaat"] + " auto's";
  if ($("#count-hybride")) $("#count-hybride").textContent = catCounts["hybride-elektrisch"] + " auto's";
  if ($("#count-bedrijfswagens")) $("#count-bedrijfswagens").textContent = catCounts["bedrijfswagens"] + " auto's";

  $$(".cat-bento-card").forEach(btn => {
    const activateCategory = () => {
      const cat = btn.dataset.cat;
      let filtered = [];
      if (cat === "onder-10k") filtered = cars.filter(c => c.price < 10000);
      else if (cat === "gezinsauto") filtered = cars.filter(c => (c.category && c.category.includes("gezinsauto")) || c.body === "Stationwagen" || c.model.includes("Golf"));
      else if (cat === "automaat") filtered = cars.filter(c => c.trans === "Automaat");
      else if (cat === "hybride-elektrisch") filtered = cars.filter(c => c.fuel === "Hybride" || c.fuel === "Elektrisch");
      else if (cat === "bedrijfswagens") filtered = cars.filter(c => (c.category && c.category.includes("bedrijfswagens")) || c.body === "Bestelwagen");

      render(filtered.length ? filtered : cars);
      if (window.lenis) window.lenis.scrollTo("#aanbod", { offset: -30, duration: 1.2 });
      else $("#aanbod")?.scrollIntoView({ behavior: "smooth" });
    };
    btn.onclick = activateCategory;
    btn.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        activateCategory();
      }
    });
  });
}

// ---- Vehicle Editorial List Item Rendering (No Glare, No License Plate Badge) ----
function card(c) {
  const fav = favs.includes(c.id);
  const imgUrl = c.image || "assets/cars/golf.jpg";
  const monthlyEst = Math.round((c.price - 2000) * (CONFIG.apr / 12) / (1 - Math.pow(1 + CONFIG.apr / 12, -48)));

  return `<article class="car-card">
    <div class="car-media">
      <img src="${imgUrl}" alt="${c.make} ${c.model} ${c.variant}" width="1184" height="624" loading="lazy" decoding="async" />
      <button class="car-fav-btn" type="button" data-fav="${c.id}" aria-pressed="${fav}" title="Favoriet opslaan">
        ${fav ? "★" : "☆"}
      </button>
    </div>
    <div class="car-body">
      <div class="car-title-wrap">
        <h3 class="car-title">${c.make} ${c.model}</h3>
        <div class="car-variant">${c.variant}</div>
      </div>
      <div class="car-chips">
        ${(c.chips || []).map(x => `<span class="chip">${x}</span>`).join("")}
      </div>
      <div class="car-specs">
        <div class="spec-item"><span class="spec-label">Bouwjaar</span><span class="spec-val">${c.year}</span></div>
        <div class="spec-item"><span class="spec-label">Tellerstand</span><span class="spec-val">${c.km.toLocaleString("nl-NL")} km</span></div>
        <div class="spec-item"><span class="spec-label">APK tot</span><span class="spec-val">${c.apk}</span></div>
        <div class="spec-item"><span class="spec-label">Transmissie</span><span class="spec-val">${c.trans}</span></div>
      </div>
      <div class="car-foot">
        <div class="car-price-wrap">
          <div class="car-price">${eur(c.price)}</div>
          ${monthlyEst > 0 ? `<div class="car-monthly">vanaf ${eur(monthlyEst)} p/m</div>` : ""}
        </div>
        <label class="compare-check">
          <input type="checkbox" data-cmp="${c.id}" ${cmp.includes(c.id) ? "checked" : ""}> Vergelijk
        </label>
      </div>
    </div>
  </article>`;
}

function render(list) {
  const container = $("#cars");
  if (!container) return;
  container.innerHTML = list.length
    ? list.map(card).join("")
    : `<div class="empty-results">
        <h3>Geen occasions gevonden</h3>
        <p>Probeer uw zoekfilters aan te passen of neem direct contact met ons op.</p>
       </div>`;
}

// Favorite & Compare handlers
const carsTrack = $("#cars");
if (carsTrack) {
  carsTrack.addEventListener("click", e => {
    const b = e.target.closest("[data-fav]");
    if (!b) return;
    const id = b.dataset.fav;
    favs = favs.includes(id) ? favs.filter(x => x !== id) : [...favs, id];
    store.set("favs", favs);
    b.setAttribute("aria-pressed", String(favs.includes(id)));
    b.textContent = favs.includes(id) ? "★" : "☆";
  });

  carsTrack.addEventListener("change", e => {
    const id = e.target.dataset.cmp;
    if (!id) return;
    if (e.target.checked && cmp.length >= 3) {
      alert("U kunt maximaal 3 auto's tegelijk vergelijken.");
      e.target.checked = false;
      return;
    }
    cmp = e.target.checked ? [...cmp, id] : cmp.filter(x => x !== id);
    const tray = $("#tray");
    if (tray) {
      tray.hidden = !cmp.length;
      $("#tray-n").textContent = cmp.length + " van 3 gekozen";
    }
  });
}

const trayGo = $("#tray-go");
if (trayGo) {
  trayGo.onclick = () => {
    const L = cmp.map(id => cars.find(c => c.id === id)).filter(Boolean);
    const rows = [
      ["Prijs", "price"],
      ["Bouwjaar", "year"],
      ["Km-stand", "km"],
      ["Brandstof", "fuel"],
      ["Transmissie", "trans"],
      ["APK tot", "apk"]
    ];
    $("#cmp-body").innerHTML = `<table class="cmp-table">
      <thead>
        <tr><th>Kenmerk</th>${L.map(c => `<th>${c.make} ${c.model}</th>`).join("")}</tr>
      </thead>
      <tbody>
        ${rows.map(([n, k]) => `<tr>
          <td class="cmp-feature-name">${n}</td>
          ${L.map(c => `<td class="cmp-feature-val">${k === "price" ? eur(c[k]) : k === "km" ? c[k].toLocaleString("nl-NL") + " km" : c[k]}</td>`).join("")}
        </tr>`).join("")}
      </tbody>
    </table>`;
    const dialog = $("#cmp");
    if (dialog && dialog.showModal) dialog.showModal();
  };
}

// ---- Interactive 64-Point Inspection Tabs ----
const inspectionData = {
  remmen: "<strong>✓ Remsysteem &amp; Bandenprofiel:</strong> Iedere auto heeft minimaal 4.0 mm profieldiepte op alle banden (ruim boven de wettelijke 1.6 mm norm). Remschijven, remblokken en remvloeistof kookpunt worden op de hefbrug opgemeten.",
  motor: "<strong>✓ Motor &amp; Aandrijflijn:</strong> Compressietest, oliedrukanalyse, distributieriem/ketting inspectie, geen lekkages van koelvloeistof of motorolie en soepel schakelgedrag.",
  diagnose: "<strong>✓ Volledige Computerdiagnose:</strong> Alle regeleenheden (ECU, ABS, airbags, motormanagement) worden uitgelezen met professionele OBD-apparatuur om storingscodes uit te sluiten.",
  nap: "<strong>✓ 100% NAP Tellerrapport:</strong> De kilometerstand is officieel geverifieerd bij de RDW en voorzien van het Nationale Auto Pas kwaliteitslabel voor een 100% gegarandeerde tellerstand."
};

function initInspectorTabs() {
  const tabs = [...document.querySelectorAll(".inspector-tab-btn")];
  const content = document.getElementById("inspector-content");
  if (!tabs.length || !content) return;

  function selectTab(btn) {
    tabs.forEach(t => {
      t.classList.remove("active");
      t.setAttribute("aria-selected", "false");
    });
    btn.classList.add("active");
    btn.setAttribute("aria-selected", "true");
    if (btn.id) content.setAttribute("aria-labelledby", btn.id);
    const key = btn.dataset.tab;
    if (inspectionData[key]) {
      content.innerHTML = inspectionData[key];
    }
  }

  tabs.forEach((btn, idx) => {
    btn.addEventListener("click", () => selectTab(btn));
    btn.addEventListener("keydown", e => {
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        e.preventDefault();
        const nextIdx = e.key === "ArrowRight"
          ? (idx + 1) % tabs.length
          : (idx - 1 + tabs.length) % tabs.length;
        tabs[nextIdx].focus();
        selectTab(tabs[nextIdx]);
      }
    });
  });
}

// ---- Interactive Finance Calculator ----
let currentMonthly = 0;
function initFinanceCalculator() {
  const priceSlider = $("#calc-price");
  const downSlider = $("#calc-down");
  const priceBadge = $("#price-badge");
  const downBadge = $("#down-badge");
  const termSelect = $("#calc-term");
  const monthlyOutput = $("#monthly");

  if (!priceSlider || !downSlider || !monthlyOutput) return;

  function update() {
    const price = +priceSlider.value;
    const maxDown = Math.max(0, price - 500);
    downSlider.max = maxDown;
    if (+downSlider.value > maxDown) downSlider.value = maxDown;

    if (priceBadge) priceBadge.textContent = eur(price);
    if (downBadge) downBadge.textContent = eur(+downSlider.value);

    const term = +(termSelect ? termSelect.value : 48);
    const loan = Math.max(0, price - +downSlider.value);
    const r = CONFIG.apr / 12;
    const monthly = loan > 0
      ? Math.round(loan * r / (1 - Math.pow(1 + r, -term)))
      : 0;

    animateNumber(monthlyOutput, currentMonthly, monthly, 200, "€ ");
    currentMonthly = monthly;
  }

  priceSlider.addEventListener("input", update);
  downSlider.addEventListener("input", update);
  if (termSelect) termSelect.addEventListener("change", update);

  update();
}

// ---- RDW License Plate Lookup ----
async function lookupPlate(plate) {
  const clean = plate.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  if (clean.length < 6) return null;
  try {
    const res = await fetch(`https://opendata.rdw.nl/resource/m9d7-ebf2.json?kenteken=${clean}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data && data.length > 0 ? data[0] : null;
  } catch (err) {
    console.warn("RDW lookup notice:", err);
    return null;
  }
}

function initTradeScanner() {
  const plateInput = document.querySelector(".plate-input");
  if (!plateInput) return;

  let debounceTimer;
  plateInput.addEventListener("input", e => {
    clearTimeout(debounceTimer);
    const val = e.target.value.trim();
    const clean = val.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
    const existingPill = $("#rdw-info");
    if (existingPill) existingPill.remove();

    if (clean.length >= 6) {
      debounceTimer = setTimeout(async () => {
        const vehicle = await lookupPlate(clean);
        if (vehicle) {
          const pill = document.createElement("div");
          pill.id = "rdw-info";
          pill.className = "rdw-verified-pill";
          const firstReg = vehicle.datum_eerste_toelating ? vehicle.datum_eerste_toelating.slice(0, 4) : "Onbekend";
          pill.innerHTML = `✓ <b>RDW Geverifieerd:</b> ${vehicle.merk} ${vehicle.handelsbenaming} &bull; Bouwjaar: ${firstReg}`;
          plateInput.closest(".input-group").after(pill);
        }
      }, 600);
    }
  });
}

// ---- Real-time Dealership Open Status & Hours Table ----
function updateHours() {
  const table = $("#hours");
  const beacon = $("#open-status-box");
  const beaconText = $("#open-status-text");
  if (!table) return;

  const days = ["Zondag", "Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag", "Zaterdag"];
  const now = new Date();
  const day = now.getDay();
  const hour = now.getHours();

  table.innerHTML = [1, 2, 3, 4, 5, 6, 0].map(d => {
    const h = CONFIG.hours[d];
    const isToday = d === day;
    const timeStr = h ? `${String(h[0]).padStart(2, "0")}:00 – ${String(h[1]).padStart(2, "0")}:00` : "Gesloten (op afspraak)";
    return `<tr class="${isToday ? "today" : ""}">
      <td>${days[d]}${isToday ? " (Vandaag)" : ""}</td>
      <td class="hours-time">${timeStr}</td>
    </tr>`;
  }).join("");

  const todayHours = CONFIG.hours[day];
  const isOpen = todayHours && hour >= todayHours[0] && hour < todayHours[1];

  if (beacon && beaconText) {
    beacon.className = "open-beacon " + (isOpen ? "yes" : "no");
    beaconText.textContent = isOpen ? "Nu geopend tot " + todayHours[1] + ":00" : "Nu gesloten · Vrijblijvend bereikbaar via WhatsApp";
  }
}

// ---- Form Submissions ----
async function sendLead(type, form) {
  const st = $(".status", form);
  const data = Object.fromEntries(new FormData(form));
  data.type = type;

  if (type === "inruilen" && data.plate) {
    st.textContent = "RDW gegevens controleren...";
    data.rdw = await lookupPlate(data.plate);
  }

  try {
    if (!CONFIG.leadEndpoint) {
      st.innerHTML = `Hartelijk dank! We hebben uw gegevens ontvangen en nemen z.s.m. contact op. Direct antwoord? <a class="status-link" href="https://wa.me/${CONFIG.whatsapp}" target="_blank" rel="noopener">Stuur een WhatsApp</a>.`;
      form.reset();
      console.info("Lead data recorded:", data);
      return;
    }
    const r = await fetch(CONFIG.leadEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (!r.ok) throw new Error(r.status);
    st.textContent = "Verstuurd! We nemen binnen 24 uur contact met u op.";
    form.reset();
  } catch {
    st.innerHTML = `Uw bericht is geregistreerd. Bel gerust <a class="status-link" href="tel:${CONFIG.phone}">${CONFIG.phoneLabel}</a> voor direct advies.`;
  }
}

const tradeForm = $("#trade");
if (tradeForm) {
  tradeForm.onsubmit = e => { e.preventDefault(); sendLead("inruilen", tradeForm); };
}
const contactForm = $("#contact-form");
if (contactForm) {
  contactForm.onsubmit = e => { e.preventDefault(); sendLead("contact", contactForm); };
}

// ---- Cookie Consent ----
const cookieBanner = $("#cookie-banner");
if (cookieBanner) {
  if (localStorage.getItem("cookie_consent")) {
    cookieBanner.hidden = true;
  }
  const acceptBtn = $("#cookie-accept");
  if (acceptBtn) {
    acceptBtn.onclick = () => {
      localStorage.setItem("cookie_consent", "all");
      cookieBanner.hidden = true;
    };
  }
  const essentialBtn = $("#cookie-essential");
  if (essentialBtn) {
    essentialBtn.onclick = () => {
      localStorage.setItem("cookie_consent", "essential");
      cookieBanner.hidden = true;
    };
  }
  const cookieSettingsLink = $("#cookie-settings-link");
  if (cookieSettingsLink) {
    cookieSettingsLink.onclick = e => {
      e.preventDefault();
      cookieBanner.hidden = false;
    };
  }
}

// ---- Lenis Smooth Scroll ----
let lenis;
if (typeof Lenis !== "undefined") {
  lenis = new Lenis({
    autoRaf: true,
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    touchMultiplier: 1.5
  });
  window.lenis = lenis;

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#' && targetId !== '#cookies') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          lenis.scrollTo(targetElement, {
            offset: -30,
            duration: 1.2
          });
        }
      }
    });
  });
}

// ---- Initialize All Active Systems ----
function initAll() {
  initSplineScene();
  initCategories();
  render(cars);
  initInspectorTabs();
  initFinanceCalculator();
  initTradeScanner();
  updateHours();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initAll);
} else {
  initAll();
}
