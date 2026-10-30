// AAUTO'S - Client logic with Spline 3D Runtime, Smooth Preloader, Reveal, & Micro-Interactions
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

// ---- Digital Cockpit Car Starting Entrance Sequence ----
function initCockpitStartup() {
  const preloader = $("#page-preloader");
  if (!preloader) return;

  const rpmProgress = $("#rpm-progress");
  const rpmVal = $("#rpm-val");
  const rpmStatus = $("#rpm-status");
  const speedProgress = $("#speed-progress");
  const speedVal = $("#speed-val");
  const tankFill = $("#tank-fill");
  const tankPercent = $("#tank-percent");
  const tankRange = $("#tank-range");
  const tempFill = $("#temp-fill");
  const tempVal = $("#temp-val");
  const headline = $("#cockpit-headline");
  const silhouette = $("#car-silhouette");
  const startBtn = $("#engine-start-btn");
  const skipBtn = $("#cockpit-skip");
  const ttReady = $("#tt-ready");
  const ttLights = $("#tt-lights");
  const clockEl = $("#cockpit-time");

  // Update clock with real time
  if (clockEl) {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    clockEl.textContent = `${timeStr} · 19.5°C · ALPHEN A/D RIJN`;
  }

  let isComplete = false;
  function finish() {
    if (isComplete) return;
    isComplete = true;
    preloader.classList.add("is-loaded");
    setTimeout(() => { preloader.style.display = "none"; }, 850);
  }

  if (skipBtn) skipBtn.onclick = finish;
  if (startBtn) startBtn.onclick = finish;

  // Arc stroke mapping (circumference 380)
  const setGauge = (el, pct) => {
    if (el) el.style.strokeDashoffset = (380 - (pct * 3.8)).toFixed(1);
  };

  // STEP 1: Fuel Tank (Benzinetank) & Temp Gauge Rise
  let tankP = 0;
  const tankTimer = setInterval(() => {
    tankP += 4;
    if (tankP >= 100) {
      tankP = 100;
      clearInterval(tankTimer);
    }
    if (tankFill) tankFill.style.width = tankP + "%";
    if (tankPercent) tankPercent.textContent = tankP + "%";
    if (tankRange) tankRange.textContent = `Actieradius: ${Math.round(tankP * 8.4)} km`;
    if (tempFill) tempFill.style.width = (tankP * 0.78) + "%";
    if (tempVal) tempVal.textContent = `${Math.round(20 + tankP * 0.7)}°C`;
  }, 25);

  // STEP 2: System Checks sequentially checking off
  setTimeout(() => {
    const s1 = $("#sys-1");
    if (s1) { s1.classList.add("checked"); s1.innerHTML = `<span class="sys-check">✓</span> CONTACT AAN`; }
    if (headline) headline.textContent = "CONTACT GEACTIVEERD";
  }, 300);

  setTimeout(() => {
    const s2 = $("#sys-2");
    if (s2) { s2.classList.add("checked"); s2.innerHTML = `<span class="sys-check">✓</span> RDW KOPPELING OK`; }
  }, 600);

  // STEP 3: Needle Sweep (Tachometer & Speedometer)
  setTimeout(() => {
    const s3 = $("#sys-3");
    if (s3) { s3.classList.add("checked"); s3.innerHTML = `<span class="sys-check">✓</span> 64-PNT CHECK OK`; }
    if (headline) headline.textContent = "INSTRUMENTEN CHECK...";
    if (silhouette) silhouette.classList.add("lights-on");
    if (ttLights) ttLights.classList.add("active-blue");

    // Sweep Up
    let sweep = 0;
    const sweepUp = setInterval(() => {
      sweep += 5;
      if (sweep >= 98) {
        sweep = 98;
        clearInterval(sweepUp);

        // Sweep Down
        setTimeout(() => {
          const sweepDown = setInterval(() => {
            sweep -= 6;
            if (sweep <= 0) {
              sweep = 0;
              clearInterval(sweepDown);
              onSweepComplete();
            }
            setGauge(rpmProgress, sweep);
            setGauge(speedProgress, sweep);
            if (rpmVal) rpmVal.textContent = ((sweep / 100) * 8.0).toFixed(1);
            if (speedVal) speedVal.textContent = Math.round((sweep / 100) * 260);
          }, 20);
        }, 120);
      }
      setGauge(rpmProgress, sweep);
      setGauge(speedProgress, sweep);
      if (rpmVal) rpmVal.textContent = ((sweep / 100) * 8.0).toFixed(1);
      if (speedVal) speedVal.textContent = Math.round((sweep / 100) * 260);
    }, 20);
  }, 800);

  function onSweepComplete() {
    const s4 = $("#sys-4");
    if (s4) { s4.classList.add("checked"); s4.innerHTML = `<span class="sys-check">✓</span> 100% NAP HISTORIE`; }

    // Warning test lights extinguish, leaving engine start
    $$(".cockpit-tell-tales .tell-tale").forEach(icon => {
      if (!icon.classList.contains("tt-ready") && !icon.classList.contains("tt-lights")) {
        icon.className = "tell-tale";
      }
    });

    if (ttReady) ttReady.classList.add("active-green");
    if (startBtn) startBtn.classList.add("is-active");
    if (headline) headline.textContent = "ENGINE START · KLAAR VOOR VERTREK";
    if (rpmStatus) rpmStatus.textContent = "STATIONAIR (IDLE)";

    // Engine Idle RPM: 850 RPM
    setGauge(rpmProgress, 11);
    if (rpmVal) rpmVal.textContent = "0.9";
    if (speedVal) speedVal.textContent = "0";

    // Smooth exit into the website
    setTimeout(() => {
      finish();
    }, 750);
  }

  // Safety fallback
  setTimeout(() => {
    finish();
  }, 4500);
}

// ---- Scroll Entrance Reveal (IntersectionObserver) ----
function initScrollReveal() {
  const targets = document.querySelectorAll(".reveal-on-scroll");
  if (!targets.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-revealed");
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: "0px 0px -40px 0px"
  });

  targets.forEach(t => observer.observe(t));
}

// ---- Spline 3D Scene Runtime Integration ----
let splineApp = null;
function initSplineScene() {
  const canvas = document.getElementById("canvas3d");
  if (!canvas) return;

  try {
    splineApp = new Application(canvas);
    window.splineApp = splineApp;

    const statusEl = document.getElementById("spline-status-text");
    
    // User can define window.SPLINE_SCENE_URL or pass it when ready
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
      if (statusEl) statusEl.textContent = "Spline Runtime Gereed (Wachten op SCENE_URL)";
    }

    // Camera reset button
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

// Function allowing user or dynamic script to load/change the Spline scene
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

// ---- Magnetic Buttons Micro-Interactions ----
function initMagneticButtons() {
  const btns = document.querySelectorAll(".hero-pill-btn, .btn-primary, .royal-nav-btn");
  btns.forEach(btn => {
    btn.classList.add("magnetic-btn");
    btn.addEventListener("mousemove", e => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${(x * 0.18).toFixed(1)}px, ${(y * 0.18).toFixed(1)}px)`;
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "translate(0px, 0px)";
    });
  });
}

// ---- Bento Cards 3D Micro-Tilt ----
function initBentoCardInteractions() {
  const bentoCards = document.querySelectorAll(".cat-bento-card, .trust-card, .tool-card");
  bentoCards.forEach(card => {
    card.addEventListener("mousemove", e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotX = ((centerY - y) / centerY) * 3;
      const rotY = ((x - centerX) / centerX) * 3;
      card.style.transform = `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateY(-4px)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)";
    });
  });
}

// Wire up telephone and WhatsApp links
$$("[data-tel]").forEach(a => {
  a.href = "tel:" + CONFIG.phone;
  if (a.classList.contains("tel-link") || a.classList.contains("tel")) a.textContent = CONFIG.phoneLabel;
});
$$("[data-wa]").forEach(a => {
  a.href = "https://wa.me/" + CONFIG.whatsapp + "?text=" + encodeURIComponent("Hallo AAUTO'S, ik heb een vraag over een occasion.");
});

// Mobile navigation toggle
const mb = $(".menu-btn");
if (mb) {
  mb.onclick = () => {
    const nav = $(".royal-links");
    if (!nav) return;
    const isShown = nav.style.display === "flex";
    nav.style.display = isShown ? "none" : "flex";
    nav.style.position = "absolute";
    nav.style.top = "70px";
    nav.style.left = "20px";
    nav.style.right = "20px";
    nav.style.flexDirection = "column";
    nav.style.background = "#FFFFFF";
    nav.style.border = "1px solid rgba(15, 23, 42, 0.15)";
    nav.style.borderRadius = "16px";
    nav.style.padding = "20px";
    nav.style.gap = "14px";
    nav.style.boxShadow = "0 20px 40px rgba(0, 0, 0, 0.2)";
    mb.setAttribute("aria-expanded", !isShown);
  };
}

// ---- Smooth Odometer / Counter Animation ----
function animateNumber(element, start, end, duration = 300, prefix = "", suffix = "") {
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
      animateNumber(countEl, currentCount, matchingCount, 250);
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
    btn.onclick = () => {
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
  });
}

// ---- Cars rendering in Bento Card format with 3D Specular Glare ----
function card(c) {
  const fav = favs.includes(c.id);
  const imgUrl = c.image || "assets/cars/golf.jpg";
  const monthlyEst = Math.round((c.price - 2000) * (CONFIG.apr / 12) / (1 - Math.pow(1 + CONFIG.apr / 12, -48)));

  return `<div class="car-card">
    <div class="car-glare" aria-hidden="true"></div>
    <div class="car-media">
      <img src="${imgUrl}" alt="${c.make} ${c.model}" loading="lazy" />
      <div class="dutch-plate">${c.plate}</div>
      <button class="car-fav-btn" data-fav="${c.id}" aria-pressed="${fav}" title="Favoriet opslaan">
        ${fav ? "★" : "☆"}
      </button>
    </div>
    <div class="car-body">
      <div class="car-title-wrap">
        <div class="car-title">${c.make} ${c.model}</div>
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
  </div>`;
}

// 3D Card Tilt with Specular Glare Follower
function initCardTilt() {
  const cards = document.querySelectorAll(".car-card");
  cards.forEach(card => {
    if (card._tiltBound) return;
    card._tiltBound = true;

    card.addEventListener("mousemove", e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((centerY - y) / centerY) * 5;
      const rotateY = ((x - centerX) / centerX) * 5;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
      card.style.setProperty("--glare-x", `${x}px`);
      card.style.setProperty("--glare-y", `${y}px`);
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)";
    });
  });
}

function render(list) {
  const container = $("#cars");
  if (!container) return;
  container.innerHTML = list.length
    ? list.map(card).join("")
    : `<div style="grid-column:1/-1;padding:60px 20px;text-align:center;background:var(--bg-card);border:1px solid var(--border-subtle);border-radius:var(--radius-lg)">
        <h3 style="font-size:20px;margin-bottom:8px">Geen occasions gevonden</h3>
        <p style="color:var(--text-secondary);font-size:14px">Probeer uw zoekfilters aan te passen of neem direct contact met ons op.</p>
       </div>`;
  
  // Re-attach 3D tilt after DOM render
  initCardTilt();
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
    b.setAttribute("aria-pressed", favs.includes(id));
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
    $("#cmp-body").innerHTML = `<table>
      <tr><th>Kenmerk</th>${L.map(c => `<th>${c.make} ${c.model}</th>`).join("")}</tr>
      ${rows.map(([n, k]) => `<tr>
        <td style="color:var(--text-muted)"><b>${n}</b></td>
        ${L.map(c => `<td style="font-family:var(--font-mono);color:#fff">${k === "price" ? eur(c[k]) : k === "km" ? c[k].toLocaleString("nl-NL") + " km" : c[k]}</td>`).join("")}
      </tr>`).join("")}
    </table>`;
    const dialog = $("#cmp");
    if (dialog && dialog.showModal) dialog.showModal();
  };
}

// ---- Hero 3D Mouse Parallax & Spotlight Follower ----
function initHeroParallax() {
  const box = document.querySelector(".hero-royal-box");
  if (!box) return;

  box.addEventListener("mousemove", e => {
    const rect = box.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const normX = (x / rect.width) * 2 - 1; // -1 to +1
    const normY = (y / rect.height) * 2 - 1; // -1 to +1

    // Spotlight gradient follow
    box.style.setProperty("--mouse-x", `${((x / rect.width) * 100).toFixed(1)}%`);
    box.style.setProperty("--mouse-y", `${((y / rect.height) * 100).toFixed(1)}%`);

    // Subtle typography opposing drift
    box.style.setProperty("--text-parallax-x", `${(-normX * 8).toFixed(1)}px`);
    box.style.setProperty("--text-parallax-y", `${(-normY * 6).toFixed(1)}px`);

    // Left car facing right (Volkswagen Golf Cabriolet)
    box.style.setProperty("--car-l-x", `${(normX * 12).toFixed(1)}px`);
    box.style.setProperty("--car-l-y", `${(normY * 6).toFixed(1)}px`);
    box.style.setProperty("--car-l-rot", `${(normX * 2.5).toFixed(1)}deg`);

    // Right car facing left (Volvo XC60)
    box.style.setProperty("--car-r-x", `${(-normX * 12).toFixed(1)}px`);
    box.style.setProperty("--car-r-y", `${(-normY * 6).toFixed(1)}px`);
    box.style.setProperty("--car-r-rot", `${(-normX * 2.5).toFixed(1)}deg`);
  });

  box.addEventListener("mouseleave", () => {
    box.style.setProperty("--mouse-x", "50%");
    box.style.setProperty("--mouse-y", "35%");
    box.style.setProperty("--text-parallax-x", "0px");
    box.style.setProperty("--text-parallax-y", "0px");
    box.style.setProperty("--car-l-x", "0px");
    box.style.setProperty("--car-l-y", "0px");
    box.style.setProperty("--car-l-rot", "0deg");
    box.style.setProperty("--car-r-x", "0px");
    box.style.setProperty("--car-r-y", "0px");
    box.style.setProperty("--car-r-rot", "0deg");
  });
}

// ---- Interactive 64-Point Inspection Tabs ----
const inspectionData = {
  remmen: "<strong>✓ Remsysteem &amp; Bandenprofiel:</strong> Iedere auto heeft minimaal 4.0 mm profieldiepte op alle banden (ruim boven de wettelijke 1.6 mm norm). Remschijven, remblokken en remvloeistof kookpunt worden op de hefbrug opgemeten.",
  motor: "<strong>✓ Motor &amp; Aandrijflijn:</strong> Compressietest, oliedrukanalyse, distributieriem/ketting inspectie, geen lekkages van koelvloeistof of motorolie en soepel schakelgedrag.",
  diagnose: "<strong>✓ Volledige Computerdiagnose:</strong> Alle regeleenheden (ECU, ABS, airbags, motormanagement) worden uitgelezen met professionele OBD-apparatuur om storingscodes uit te sluiten.",
  nap: "<strong>✓ 100% NAP Tellerrapport:</strong> De kilometerstand is officieel geverifieerd bij de RDW en voorzien van het Nationale Auto Pas kwaliteitslabel voor een 100% gegarandeerde tellerstand."
};

function initInspectorTabs() {
  const tabs = document.querySelectorAll(".inspector-tab-btn");
  const content = document.getElementById("inspector-content");
  if (!tabs.length || !content) return;

  tabs.forEach(btn => {
    btn.addEventListener("click", () => {
      tabs.forEach(t => {
        t.classList.remove("active");
        t.setAttribute("aria-selected", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");
      const key = btn.dataset.tab;
      if (inspectionData[key]) {
        content.style.opacity = "0.3";
        setTimeout(() => {
          content.innerHTML = inspectionData[key];
          content.style.opacity = "1";
        }, 120);
      }
    });
  });
}

// ---- Interactive Finance Calculator with Fluid Range Sliders ----
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

// ---- RDW License Plate Lookup with Laser Scanner Effect ----
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
  const plateWrapper = document.getElementById("plate-wrapper");
  if (!plateInput) return;

  let debounceTimer;
  plateInput.addEventListener("input", e => {
    clearTimeout(debounceTimer);
    const val = e.target.value.trim();
    const clean = val.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
    const existingPill = $("#rdw-info");
    if (existingPill) existingPill.remove();

    if (clean.length >= 6) {
      if (plateWrapper) plateWrapper.classList.add("is-scanning");
      debounceTimer = setTimeout(async () => {
        const vehicle = await lookupPlate(clean);
        if (plateWrapper) plateWrapper.classList.remove("is-scanning");
        if (vehicle) {
          const pill = document.createElement("div");
          pill.id = "rdw-info";
          pill.className = "rdw-verified-pill";
          const firstReg = vehicle.datum_eerste_toelating ? vehicle.datum_eerste_toelating.slice(0, 4) : "Onbekend";
          pill.innerHTML = `✓ <b>RDW Geverifieerd:</b> ${vehicle.merk} ${vehicle.handelsbenaming} &bull; Bouwjaar: ${firstReg}`;
          plateInput.closest(".input-group").after(pill);
        }
      }, 600);
    } else {
      if (plateWrapper) plateWrapper.classList.remove("is-scanning");
    }
  });
}

// ---- Reviews Auto-Scroll Marquee ----
function initReviewsMarquee() {
  const track = document.querySelector(".reviews-slider-track");
  if (!track) return;
  let isHovered = false;
  track.addEventListener("mouseenter", () => isHovered = true);
  track.addEventListener("mouseleave", () => isHovered = false);

  setInterval(() => {
    if (isHovered) return;
    const maxScroll = track.scrollWidth - track.clientWidth;
    if (track.scrollLeft >= maxScroll - 10) {
      track.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      track.scrollBy({ left: 340, behavior: "smooth" });
    }
  }, 4500);
}

// ---- Real-time Dealership Open Beacon & Hours Table ----
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
      <td>${days[d]} ${isToday ? " (Vandaag)" : ""}</td>
      <td style="text-align:right">${timeStr}</td>
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
      st.innerHTML = `Hartelijk dank! We hebben uw gegevens ontvangen en nemen z.s.m. contact op. Direct antwoord? <a style="text-decoration:underline;color:inherit" href="https://wa.me/${CONFIG.whatsapp}" target="_blank">Stuur een WhatsApp</a>.`;
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
    st.innerHTML = `Uw bericht is geregistreerd. Bel gerust <a style="text-decoration:underline;color:inherit" href="tel:${CONFIG.phone}">${CONFIG.phoneLabel}</a> voor direct advies.`;
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
  $("#cookie-accept").onclick = () => {
    localStorage.setItem("cookie_consent", "all");
    cookieBanner.hidden = true;
  };
  $("#cookie-essential").onclick = () => {
    localStorage.setItem("cookie_consent", "essential");
    cookieBanner.hidden = true;
  };
}

// ---- Darkroom Engineering Lenis Smooth Scroll ----
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

  // Intercept all internal anchor links for smooth scrolling
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

  // Cinematic dual-cars scroll ejection
  const heroBox = document.querySelector(".hero-royal-box");
  lenis.on("scroll", e => {
    const scrollY = e.animatedScroll || window.scrollY || 0;
    if (heroBox && scrollY <= 650) {
      const p = Math.min(1, scrollY / 420);
      const ejectL = -p * 85;
      const ejectR = p * 85;
      const op = Math.max(0.2, 1 - p * 0.7);

      heroBox.style.setProperty("--scroll-car-l", `${ejectL.toFixed(1)}px`);
      heroBox.style.setProperty("--scroll-car-r", `${ejectR.toFixed(1)}px`);
      heroBox.style.setProperty("--car-l-opacity", `${op.toFixed(2)}`);
      heroBox.style.setProperty("--car-r-opacity", `${op.toFixed(2)}`);
    }
  });
}

// ---- Initialize All Systems ----
document.addEventListener("DOMContentLoaded", () => {
  initCockpitStartup();
  initScrollReveal();
  initSplineScene();
  initMagneticButtons();
  initBentoCardInteractions();
  initCategories();
  render(cars);
  initHeroParallax();
  initInspectorTabs();
  initFinanceCalculator();
  initTradeScanner();
  initReviewsMarquee();
  updateHours();

  const heroLiveBadge = $("#hero-live-badge");
  if (heroLiveBadge) {
    heroLiveBadge.textContent = `${cars.length} Gekeurde Occasions Direct Beschikbaar`;
  }
});

// Immediate invocation in case DOM is already ready
initCockpitStartup();
initScrollReveal();
initSplineScene();
initMagneticButtons();
initBentoCardInteractions();
initCategories();
render(cars);
initHeroParallax();
initInspectorTabs();
initFinanceCalculator();
initTradeScanner();
initReviewsMarquee();
updateHours();
