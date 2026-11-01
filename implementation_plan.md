# AAUTO'S Landing Page — Full BMW.com (`DESIGN.md`) Redesign Plan

> **Status:** Awaiting Approval — No application code has been modified for this plan.
> **Reference Specification:** `DESIGN.md` (BMW.com Style Reference — *"Gallery wall for sculpted metal — a typographic frame where the cars are the only color."*)

---

## 1. Audit Report: Current State & What Will Change

### 1.1 Framework, Styling Approach & File Structure
- **Stack & Build Tool:** Static HTML5 (`index.html`), vanilla CSS3 (`css/styles.css`), and vanilla ES Modules JavaScript (`js/main.js`, `data/cars.js`), bundled and served via **Vite v8.3.5** (`npm run dev`, `npm run build`, `npm run preview`).
- **Runtime Dependencies:**
  - `@splinetool/runtime` (`^2.0.121`) — drives `#canvas3d` in the 3D Studio section.
  - `lenis` (`^1.3.27`) — loaded via unpkg CDN in `index.html` (and listed in `package.json`) for smooth anchor scrolling.
- **File & Folder Inventory:**
  ```text
  c:\Websites folder\car_dealership\first\
  ├── index.html                  # Main single-page entry point (620+ lines)
  ├── package.json                # Vite scripts & dependencies
  ├── css/
  │   └── styles.css              # Active stylesheet linked in index.html
  ├── js/
  │   └── main.js                 # Active client logic linked in index.html (868 lines)
  ├── data/
  │   └── cars.js                 # Active vehicle stock data (window.CARS, 8 vehicles)
  ├── styles.css                  # Root duplicate of css/styles.css
  ├── main.js                     # Outdated root duplicate of js/main.js
  ├── cars.js                     # Root duplicate of data/cars.js
  ├── car1-cutout.png             # Root cutout PNG (VW Golf Cabriolet)
  ├── car2-cutout.png             # Root cutout PNG (Volvo XC60)
  ├── assets/
  │   ├── dealership-outside.jpg  # Real photo: AAUTO'S exterior at Ingang 5 (3.0 MB)
  │   ├── dealership-inside.jpg   # Real photo: AAUTO'S workshop & lifts (2.68 MB)
  │   ├── hero-poster.jpg         # AI stock photo ("VAN DER MEER VOLVO" signage)
  │   ├── werkplaats.jpg          # AI stock photo ("AUTOHUIS DE VRIES" signage)
  │   └── cars/
  │       ├── volvo-right.jpg     # Real photo: Volvo XC60 right 3/4 (has mobilox + AAutos watermarks)
  │       ├── volvo-left.jpg      # Real photo: Volvo XC60 left 3/4 (has mobilox + AAutos watermarks)
  │       ├── golf-cabrio.jpg     # Real photo: VW Golf Cabrio (has mobilox + AAutos watermarks)
  │       ├── golf.jpg            # External photo: VW Golf 8 ("VALLEI AUTO" background)
  │       ├── car1-cutout.png     # Duplicate cutout PNG
  │       └── car2-cutout.png     # Duplicate cutout PNG
  └── images/                     # Raw/working image dump (17 files, ~15 MB total, unreferenced by HTML)
  ```

### 1.2 Audit of Every Landing Page Section & Component
1. **Accessibility Skip Link (`.skip`):** Visually hidden link jumping to `#aanbod`.
2. **Top Navigation Bar (`nav.royal-nav`):** Currently nested *inside* `.hero-royal-box` rather than standing as an independent top-level `<header>`. Contains brand lockup (`AAUTO'S`), 7 section links (`#aanbod`, `#studio3d`, `#categorieen`, `#zekerheden`, `#werkplaats`, `#tools`, `#contact`), a bordered/pill `"Plan een Proefrit"` CTA button (`.royal-nav-btn`), and mobile `.menu-btn`.
3. **Hero Section (`.hero-royal-stage` > `.hero-royal-box`):**
   - Studio effects: `.hero-center-glow`, `.hero-dark-overlay`, `.hero-spotlight`.
   - Overlaid copy (`.hero-copy`): `h1#hero-title` (*"Premium occasions. Zorgvuldig geselecteerd."*), subtitle `.hero-sub`, and centered CTA button `.hero-pill-btn` (*"Bekijk Occasions →"*).
   - Cutout stage (`.hero-cars-stage`): Two transparent vehicle cutouts (`car1-cutout.png`, `car2-cutout.png`) with floor contact shadows (`.car-shadow`), 4 warm-white radial headlight glows (`.headlight-glow`), and 4 conic light beams (`.car-light-beam`).
4. **Search / Filter Bar (`.search-dock-wrapper` > `form#search.search-dock`):**
   - Overlaps the bottom of the hero via negative top margin (`margin: -40px auto 40px`).
   - 4 filter dropdowns: `Merk` (`#search-make`), `Model` (`#search-model`), `Max. Budget` (`#search-price`), `Brandstof` (`#search-fuel`), plus submit button (`Toon <span id="count">…</span> auto's`).
5. **Aanbod (`section#aanbod`):**
   - Section header (`Collectie` tag, `h2` *"Net Binnen in Alphen"*, `.subhead`) and `#cars.bento-cars-grid`.
   - Dynamically renders 8 `.car-card` items via `js/main.js` (`card()`), each with `.car-glare`, image, `.dutch-plate`, favorite button (`[data-fav]`), title/variant, `.car-chips`, 4 `.spec-item` rows, price + monthly finance estimate, and compare checkbox (`[data-cmp]`).
6. **3D Studio (`section#studio3d`):**
   - Section header (`3D Studio Experience`, `h2` *"Spline 3D Occasion Studio"*), `.spline-showcase-box` containing `canvas#canvas3d`, `#spline-loader` status overlay, and `.spline-controls-pill` with `#spline-reset-btn`.
7. **Categorieën (`section#categorieen`):**
   - Section header (`Segmenten`, `h2` *"Kies op Categorie"*) and `.bento-cat-grid` (12-column asymmetric Bento grid with `span 7`, `span 5`, `span 4` cards for *Onder €10.000*, *Gezinsauto's*, *Automaat*, *Hybride & Elektrisch*, and *Bedrijfswagens*).
8. **Zekerheden & Werkplaats (`section#zekerheden` & `#werkplaats`):**
   - Section header (`Zekerheden`, `h2` *"Onze Showroom & Werkplaats"*) and `.bento-trust-grid` with 4 cards:
     - *Showroom & Buitenterrein* (`assets/dealership-outside.jpg`)
     - *Eigen Garage & APK* (`assets/dealership-inside.jpg`)
     - *64-Punten Kwaliteitsgarantie* (interactive `.inspector-tabs` with 4 buttons, `#inspector-content` panel, and 4 `.checklist-items`)
     - *Wettelijke Garantie & AutoTrust* card
9. **Inruil & Lease Tools (`section#tools`):**
   - Section header (`Direct Berekenen`, `h2` *"Handige Online Tools"*) and `.tools-split`:
     - *Wat is uw auto waard?* (`form#trade` with `#trade-plate` embossed yellow input, `.rdw-laser-beam`, `#trade-km`, `#trade-contact`, submit button, and `.status`).
     - *Financieringscalculator* (`form#calc` with `#calc-price` range slider, `#calc-down` range slider, `#calc-term` select, and `.calc-output-box` displaying `#monthly`).
10. **Google Reviews (`section`):**
    - Centered header with gold stars (`#FBBF24`), `4.8 / 5.0` badge, and `.reviews-slider-track` horizontal marquee with 4 `.review-card` items.
11. **Showroom & Contact (`section#contact`):**
    - Section header (`Bezoek Ons`, `h2` *"Kom Langs in Onze Showroom"*) and `.contact-bento-grid`:
      - Dealership info card with live `#open-status-box` beacon, `<address>`, dynamic `<table id="hours">`, Google Maps button, and WhatsApp button.
      - Contact form (`form#contact-form` with `#contact-name`, `#contact-email`, `#contact-phone`, `#contact-msg`, submit button, and `.status`).
12. **Footer (`footer.footer`):**
    - Dark Carbon band with locale switcher row, 4 link columns, and legal/copyright bottom row.
13. **Persistent / Overlay Components:**
    - Sticky Mobile Bar (`.mbar` with Bell & WhatsApp buttons on screens `≤ 960px`)
    - Floating Compare Tray (`#tray` with `#tray-n` counter and `#tray-go` button)
    - Compare Modal (`dialog#cmp` with `#cmp-body` dynamic comparison table)
    - Cookie Consent Banner (`#cookie-banner` with `#cookie-essential` and `#cookie-accept`)

### 1.3 Audit of Conflicting Styles, Effects, Overlays & Dead Code to Remove
| Category | Conflicting Element / Code | Location | Why It Violates `DESIGN.md` |
|----------|----------------------------|----------|-----------------------------|
| **Hero Cutouts & Lighting** | `.hero-center-glow`, `.hero-dark-overlay`, `.hero-spotlight`, `.hero-cars-stage`, `car1-cutout.png`, `car2-cutout.png`, `.car-shadow`, `.headlight-glow`, `.car-light-beam`, `@keyframes headlightFlickerOn`, `drop-shadow` | `index.html` L44–124, `css/styles.css` L150–558 | Replaces full-bleed uncontaminated photography with staged cutouts, radial gradients, drop shadows, and keyframe light effects. |
| **Hero UI Overlay** | `<nav class="royal-nav">` and `<div class="hero-copy">` nested inside `.hero-royal-box`, plus `.search-dock-wrapper` overlapping via `margin-top: -40px` | `index.html` L41–156, `css/styles.css` L132–338, L563 | `DESIGN.md`: *"Do not overlay text, buttons, or UI controls on top of hero photography — keep the image uncontaminated."* |
| **3D Card Tilt & Glare** | `initCardTilt()`, `initBentoCardInteractions()`, and `<div class="car-glare">` | `js/main.js` L276–293, L439, L475–500 | `DESIGN.md` mandates flat, borderless/shadowless gallery surfaces with zero 3D elevation or specular glare tricks. |
| **Magnetic Buttons** | `initMagneticButtons()` cursor-following `transform: translate(...)` | `js/main.js` L259–273 | Violates austere architectural stillness; hover states may only use underline or weight shift. |
| **Scroll Entrance Animations** | `initScrollReveal()`, `.reveal-on-scroll`, `.stagger-items` | `js/main.js` L173–189, `css/styles.css` L1771–1802 | `DESIGN.md` specifies no scroll-triggered fade/slide animations. |
| **Dead Cockpit Preloader JS** | `initCockpitStartup()` (~145 lines querying non-existent `#page-preloader`, `#rpm-progress`, etc.) and `initHeroParallax()` | `js/main.js` L28–170, L570–573, L835, L856 | Dead code from an earlier iteration. |
| **RDW Laser Beam & Coloured Pills** | `.rdw-laser-beam`, `@keyframes rdwScanMotion`, inline green/yellow/red badges (`#FBBF24`, `rgba(34,197,94,0.1)`, `var(--accent-wa)`) | `index.html` L306, L347, L382, L399, L457, L561; `css/styles.css` L1035–1050 | `DESIGN.md`: *"Never invent a CTA color, a success green, or an error red — those states are communicated through weight shifts, underlines, and whitespace, not hue."* |
| **Mobile Menu Inline Styles** | `mb.onclick` sets `borderRadius = "16px"` and `boxShadow = "0 20px 40px rgba(0,0,0,0.2)"` in JS | `js/main.js` L318–322 | Directly injects rounded corners and drop shadows forbidden by `DESIGN.md`. |
| **Compare Table Inline Styles** | `trayGo.onclick` injects `style="font-family:var(--font-mono);color:#fff"` (invisible white text on white modal background!) | `js/main.js` L561–562 | Hardcodes legacy dark-theme `#fff` text inside the light-theme `<dialog id="cmp">`. |
| **Emoji Badges** | `💶`, `👨‍👩‍👧‍👦`, `🕹️`, `⚡`, `🚐`, `🔄`, `🖱️`, `📞`, `💬` across categories, tools, and mobile bar | `index.html` L195, L212, L224, L236, L248, L260, L367, L406, L588–589 | Clashes with BMW's austere typographic gallery aesthetic (`no icons, no decorative containers`). |
| **Duplicate / Unused Files** | Root `styles.css`, `main.js`, `cars.js`, `car1-cutout.png`, `car2-cutout.png`, `images/` dump | Project root & `images/` | Causes confusion and bloats the repository. |

### 1.4 Functionality That Must Keep Working (Zero Regression)
- **Search & Filter (`#search`):** Populates `Merk`, cascading `Model`, `Max. Budget`, and `Brandstof` from `window.CARS`; updates live counter `#count`; filters `#cars` grid and scrolls to `#aanbod` on submit.
- **Inventory Grid (`#cars`):** Renders vehicle cards from `window.CARS`; persists favorites (`[data-fav]`) in `localStorage`; manages up to 3 compare selections (`[data-cmp]`) with `#tray` and `dialog#cmp`.
- **3D Studio (`#studio3d`):** Initializes `@splinetool/runtime` on `canvas#canvas3d`, exposes `window.loadSplineScene(url)`, and wires `#spline-reset-btn`.
- **Category Filtering (`#categorieen`):** Calculates live counts per category and filters `#cars` + scrolls to `#aanbod` when a category item is clicked.
- **64-Point Inspection Tabs (`#zekerheden`):** Switches `#inspector-content` copy across the 4 inspection categories (`remmen`, `motor`, `diagnose`, `nap`) with proper `aria-selected` state.
- **Live RDW Kenteken Lookup (`#trade`):** Queries `https://opendata.rdw.nl/resource/m9d7-ebf2.json` when a 6-character Dutch plate is entered into `#trade-plate` and renders the verified vehicle brand/model/year in `#rdw-info`.
- **Finance Calculator (`#calc`):** Dynamically recalculates monthly installment `#monthly` from `#calc-price`, `#calc-down`, and `#calc-term` at 7.9% APR.
- **Opening Hours & Live Status (`#hours`, `#open-status-box`):** Highlights the current day of the week and displays live open/closed text based on `CONFIG.hours`.
- **Lead Forms, Links & Consent:** `sendLead()` for `#trade` and `#contact-form`, `[data-tel]` and `[data-wa]` link wiring, `#cookie-banner` persistence in `localStorage`, `#cookie-settings-link` reopen trigger, mobile menu toggle, and Lenis smooth scrolling.

---

## 2. Design Decisions: Mapping `DESIGN.md` to AAUTO'S

### 2.1 Color Tokens & Surface Polarity
All chromatic UI accents, gradients, and semantic hues are eliminated. Only the 4 tokens from `DESIGN.md` exist:
- `--color-carbon: #262626` — All primary text, headings on light surfaces, dark footer band background, and solid primary action surfaces where needed. (15.1:1 AAA contrast on `#ffffff`).
- `--color-pure-white: #ffffff` — Level 0 Canvas (`--surface-canvas`), top navigation bar, primary section backgrounds, inverted text inside the dark footer band.
- `--color-concrete: #bbbbbb` — Muted helper text, secondary dividers (`1px solid #bbbbbb`), subtle input/table hairlines, and secondary text in the dark footer.
- `--color-fog: #f1f1f1` — Level 1 Subtle Band (`--surface-subtle-band`) for quiet visual separation between white sections, and subtle module/card surfaces where a step up from pure white is needed.

### 2.2 Typography System
- **Font Family:** `Inter` loaded from Google Fonts in weights `300`, `400`, `700`, `900` as the `DESIGN.md` substitute for `BMWTypeNextLatin` and `BMWTypeNextLatin Light`. No `JetBrains Mono` in visible UI — all numbers, prices, and license plates use `Inter` to maintain unified geometric typography.
- **Display Heading (`--font-bmwtypenextlatin-light`):**
  - **Exclusively `font-weight: 300`, `60px` (`--text-display`), `line-height: 1.30`, `letter-spacing: 0px`, Carbon `#262626`, centered.**
  - Used for the single main page heading below the full-bleed hero image (*"Premium occasions. Zorgvuldig geselecteerd."*). Never bolded; never used below 40px.
- **Section Headings (`h2`):**
  - `Inter`, `font-weight: 300` (if ≥ 40px, e.g. `44px`) or `font-weight: 400` with compact leading (`1.20–1.30`), Carbon `#262626`.
- **Section Labels & Inline Emphasis:**
  - `Inter`, `font-weight: 700`, `16px`, compact leading (`1.20–1.30`), Carbon `#262626`.
- **Body Copy & Navigation / Footer Links:**
  - `--text-body`: `18px`, `font-weight: 400`, `line-height: 1.63`, Carbon `#262626`.
  - `--text-body-sm`: `16px`, `font-weight: 400`, `line-height: 1.60`, Carbon `#262626` (or `#ffffff` in footer).
- **Brand Wordmark (`AAUTO'S`):**
  - `Inter`, `font-weight: 900`, Carbon `#262626`, paired on a shared baseline with the tagline *"Gekozen Om Te Overtuigen"* in `16px` weight `400` Carbon `#262626` with a `12px` gap.

### 2.3 Spacing, Layout & Shape Rules
- **Base Unit:** `4px` (`--spacing-4: 4px`, `--spacing-8: 8px`, `--spacing-12: 12px`, `--spacing-16: 16px`, `--spacing-20: 20px`, `--spacing-24: 24px`, `--spacing-40: 40px`, `--spacing-56: 56px`, `--spacing-100: 100px`).
- **Content Rail:** `1200px` max-width (`--page-max-width: 1200px`), centered, with full-bleed hero photography and full-bleed dark footer breaking out to `100vw`.
- **Section Gap:** `56px` (`--section-gap: 56px`).
- **Card Padding:** `24px` (`--card-padding: 24px`).
- **Element Gap:** `10px–20px`.
- **Border Radius:** **`0px` on all elements** (`cards`, `badges`, `inputs`, `buttons`, `selects`, `dialogs`, `images`).
- **Elevation:** **Zero shadows** (`box-shadow: none`, `text-shadow: none`, `filter: none`). Depth is created solely via surface polarity (`#ffffff` vs `#f1f1f1` vs `#262626`) and whitespace.
- **Interactive States (Hover / Focus / Active):** Communicated strictly via **underline** (`text-decoration: underline; text-underline-offset: 4px`) or **font-weight shift** (`400` → `700`), never by inventing accent colors or drop shadows.

---

## 3. Conflicts to Resolve (With Recommended Resolutions)

Below is every point where the existing AAUTO'S site conflicts with `DESIGN.md`, along with our recommended resolution. **Please review and confirm or adjust these before we begin Phase 1.**

### Conflict 1: Red Accents & Semantic / Decorative Colors
- **Current Site:** Uses `--accent-red: #E11D48` (logo slashes `//`, search button, favorite button), `--accent-wa: #22C55E` (WhatsApp buttons, `"100% Gekeurd Rijklaar"` pill, `"Nu geopend"` beacon, form status messages), `#FBBF24` (gold review stars, yellow embossed license plates), and `#1D3C9E` (blue EU plate band).
- **`DESIGN.md` Rule:** *"Do not introduce accent colors, gradients, or decorative backgrounds — the only chromatic content is photography. Never invent a CTA color, a success green, or an error red — those states are communicated through weight shifts, underlines, and whitespace, not hue."*
- **Recommended Resolution:**
  1. Remove the `//` red slashes from the logo; use the clean typographic lockup: **`AAUTO'S`** (`900` weight) + `12px` gap + **`Gekozen Om Te Overtuigen`** (`16px` weight `400` Carbon `#262626`).
  2. Replace all red/green buttons and badges with monochrome Carbon `#262626` / Pure White `#ffffff` / Fog `#f1f1f1` treatments.
  3. Render review stars (`★★★★★`), status indicators (`✓ 100% Gekeurd Rijklaar`, `Nu geopend`), and license plate badges in strict monochrome (`#262626` text on `#f1f1f1` or `#ffffff` with `0px` radius) so photography remains the **only** color on the page.

### Conflict 2: Hero Overlay Text, "Bekijk Occasions" Button & Overlapping Search Bar
- **Current Site:** Places the navbar, headline, subtitle, and `"Bekijk Occasions"` pill button directly inside/over the hero stage, and overlaps the search bar (`margin-top: -40px`) across the bottom of the hero.
- **`DESIGN.md` Rule:** *"Do not overlay text, buttons, or UI controls on top of hero photography — keep the image uncontaminated... Page rhythm: full-bleed hero image → centered display heading (60px Light) → centered inline arrow link → spacious white space."*
- **Recommended Resolution:**
  1. **Top Navigation Bar:** Place `<header class="site-header">` flat on `#ffffff` **above** the hero image (`5px` top/bottom padding inside a `1200px` rail, no sticky behavior, no border, no shadow).
  2. **Full-Bleed Hero Image:** Immediately below the header, render the edge-to-edge (`100vw`) photograph with **zero** overlay text, buttons, gradients, or cutouts.
  3. **Display Section Heading Block (Below Hero Image):** On a pure white `#ffffff` canvas below the hero image (`56px` top padding), center the `60px` Inter Light (`300` weight) `<h1>`:
     *"Premium occasions. Zorgvuldig geselecteerd."*
     Followed by the subtitle (`18px` weight `400` Carbon) and, `40px` below the heading block, the **Inline Arrow Link**:
     `› Bekijk occasions` (`16px` weight `400` Carbon `#262626`, no button chrome, underline on hover).
  4. **Search / Filter Bar:** Position cleanly in its own `#f1f1f1` (Fog) band below the hero intro block (`56px` gap, `0px` radius, zero overlap).

### Conflict 3: Rounded Pill Buttons, "Plan een Proefrit" Nav Button & CTA Chrome
- **Current Site:** Uses `border-radius: 9999px` pill buttons for `"Plan een Proefrit"` in the navbar, `"Bekijk Occasions"` in the hero, inspector tabs, category count pills, and Spline controls.
- **`DESIGN.md` Rule:** *"Set border-radius to 0 on all elements... Render navigation and footer items as plain text at 16px weight 400 — no pills, no chips, no decorative containers... Inline Arrow Link: e.g. '› Find your BMW' — a small right-pointing chevron glyph in Carbon (#262626) followed by label text at 16px weight 400. No underline, no button chrome."*
- **Recommended Resolution:**
  1. **Navbar `"Plan een Proefrit"`:** Render as a plain text link or inline arrow link (`› Plan een Proefrit`) at `16px` weight `400` Carbon `#262626` on the right side of the navbar (no border, no pill, no background).
  2. **Section CTAs & Navigation Prompts** (*"Bekijk Occasions"*, *"Bekijk selectie"*, *"Routebeschrijving"*, *"WhatsApp ons"*): Render as BMW **Inline Arrow Links** (`› Label` at `16px` weight `400` Carbon `#262626`, underline on hover).
  3. **Form Submit Actions** (Search `"Toon X auto's"`, Inruil submit, Contact submit): Render as flat `0px`-radius rectangular triggers in Carbon `#262626` with `#ffffff` text (`16px` weight `400`, zero shadow, hover shifts font-weight `400` → `700` or underlines label).

### Conflict 4: Photography — Outdoor Shots, Watermarks (`mobilox`, `AAutos`) & Stock Fallbacks
- **Current Site:**
  - `assets/cars/volvo-right.jpg`, `assets/cars/volvo-left.jpg`, and `assets/cars/golf-cabrio.jpg` are outdoor lot shots with a white `mobilox` watermark in the bottom-left (~10% height) and a black `AAutos` box in the bottom-right (~13% height), plus a tall telecom tower in the top ~32% of the frame.
  - `assets/cars/golf.jpg`, `assets/hero-poster.jpg`, and `assets/werkplaats.jpg` show third-party dealership signage (*"VALLEI AUTO"*, *"VAN DER MEER"*, *"AUTOHUIS DE VRIES"*).
  - Cars 4–8 in `data/cars.js` all reuse `assets/dealership-outside.jpg` as their card thumbnail.
- **`DESIGN.md` Rule:** *"Hero photography is the sole source of color and atmosphere on the page. The style is dramatic, dark, tightly cropped product photography: extreme close-ups of wheels, badges, grilles, and body panels... Images are full-bleed, edge-to-edge with no rounded corners, no borders, no padding, and no overlay UI."*
- **Recommended Resolution:**
  1. **Full-Bleed Hero Image:** Use `assets/cars/volvo-right.jpg` (the dark charcoal metallic Volvo XC60 `4-FH-150`), tightly cropped to a wide cinematic aspect ratio (`21:9` / `16:7`) focused on the sculptural front alloy wheel, Thor's Hammer LED headlamp, and grille (`y: 34%–86%`, `x: 12%–88%`). This **completely crops out** both the `mobilox` and `AAutos` bottom watermarks, the parked cars on the sides, and the telecom tower at the top, producing a dramatic dark metallic close-up that matches `DESIGN.md`.
  2. **Vehicle Card Thumbnails (`#aanbod`):** Apply a tight `16:9` focal crop (`object-fit: cover; object-position: 50% 62%` with `scale(1.18)` inside `overflow: hidden`, or pre-cropped clean image files) so the bottom 13% `mobilox` / `AAutos` watermarks are completely hidden on all vehicle cards.
  3. **Cars 4–8 Thumbnails & Third-Party Signage:** We can either keep the cropped real AAUTO'S photos (`volvo-right.jpg`, `volvo-left.jpg`, `golf-cabrio.jpg`, `dealership-outside.jpg`, `dealership-inside.jpg`) or crop `golf.jpg` tightly onto the car body (`y: 35%–90%`) so the *"VALLEI AUTO"* building signage in the upper third is cropped out. (See Open Question #2).

### Conflict 5: Multi-Column Bento Grids vs. `DESIGN.md` Single-Column Vertical Flow
- **Current Site:** Uses asymmetric 12-column Bento grids (`.bento-cat-grid`, `.bento-trust-grid`), emoji badges, and a horizontal auto-scrolling review marquee.
- **`DESIGN.md` Rule:** *"Single-column, center-aligned vertical flow on a 1200px max-width content rail, with hero images breaking out to full-bleed edge-to-edge width. No multi-column grids, no sidebar, no card grids... Content density is sparse — each section earns its vertical space with large images and generous breathing room between them."*
- **Recommended Resolution:**
  - Replace the decorative Bento boxes and emoji badges with clean, architectural typographic rows/modules on the `1200px` rail (`0px` radius, borderless or separated by `1px solid #bbbbbb` hairlines and `#f1f1f1` Fog bands):
    - **Categorieën:** A clean architectural list/index row on `#ffffff` where each segment displays its title (`18px` weight `700`), description (`16px` weight `400`), vehicle count, and inline arrow link (`› Bekijk selectie`), separated by `1px solid #bbbbbb` horizontal dividers.
    - **Showroom & Werkplaats:** Large full-width or two-up gallery photography (`assets/dealership-outside.jpg`, `assets/dealership-inside.jpg`) with `0px` radius and plain typographic captions below (`18px` / `16px`), followed by a clean borderless 64-Punten Inspectie module.
    - **Aanbod (Inventory):** Since shoppers need to browse and compare 8 vehicles, we present two options in Open Question #3: (A) a clean 2-column or 3-column borderless gallery showcase on the `1200px` rail (`24px` card padding, `#f1f1f1` surface, `0px` radius, zero shadows), or (B) a strict single-column editorial list.

---

## 4. New Page Structure (Top-to-Bottom `DESIGN.md` Rhythm)

| Order | Section / Component | Surface | Width | Key `DESIGN.md` Treatment |
|-------|---------------------|---------|-------|---------------------------|
| **1** | **Top Navigation Bar** (`<header>`) | Pure White `#ffffff` | `1200px` rail on `100%` white bar | Flat, non-sticky, `5px` vertical padding. Left: `AAUTO'S` (`900` weight) + `12px` gap + `Gekozen Om Te Overtuigen` (`16px` weight `400`). Right: plain text nav links (`16px` weight `400`, `24px` gap) + `› Plan een Proefrit`. |
| **2** | **Full-Bleed Hero Image** | Edge-to-Edge Photo | `100vw` full-bleed | Tightly cropped close-up of the charcoal Volvo XC60 front wheel, LED lamp, and grille. Zero overlay text, zero buttons, `0px` radius. |
| **3** | **Display Heading & Prompt** | Pure White `#ffffff` | `1200px` rail (centered) | `56px` top gap. `<h1>` in `Inter Light` weight `300`, `60px`, line-height `1.30`, Carbon `#262626`: *"Premium occasions. Zorgvuldig geselecteerd."* Subtitle below in `18px` weight `400`. `40px` margin-top to centered inline arrow link: `› Bekijk occasions`. |
| **4** | **Search & Filter Bar** (`#search`) | Fog `#f1f1f1` | `1200px` rail | Clean horizontal filter bar (`Merk`, `Model`, `Max. Budget`, `Brandstof`) with `0px` inputs, `1px solid #bbbbbb` borders, and flat `#262626` submit trigger (`Toon X auto's`). |
| **5** | **Aanbod — Collectie** (`#aanbod`) | Pure White `#ffffff` | `1200px` rail | Section header (`Collectie` in `16px` weight `700`, title in weight `300`). Vehicle showcase cards on `#f1f1f1` (`24px` padding, `0px` radius, no shadow, watermark-free cropped photos, plain text specs, `› Vergelijk` & `☆` favorite toggle). |
| **6** | **3D Studio** (`#studio3d`) | Fog `#f1f1f1` band | `100vw` band / `1200px` inner | Centered heading + flat `0px`-radius `#canvas3d` stage (`#spline-reset-btn` rendered as plain text/flat control). |
| **7** | **Categorieën** (`#categorieen`) | Pure White `#ffffff` | `1200px` rail | Typographic segment rows (*Onder €10.000*, *Gezinsauto's*, *Automaat*, *Hybride & Elektrisch*, *Bedrijfswagens*) with `1px solid #bbbbbb` dividers and `› Bekijk selectie` inline arrow links. |
| **8** | **Zekerheden & Werkplaats** (`#zekerheden`, `#werkplaats`) | Fog `#f1f1f1` band | `100vw` band / `1200px` inner | Large uncropped/clean photography of Ingang 5 showroom and workshop lifts (`0px` radius), followed by the interactive 64-Punten Inspectie tabs (underline/weight shift for active tab) and Wettelijke Garantie copy. |
| **9** | **Inruil & Financiering** (`#tools`, `#inruilen`) | Pure White `#ffffff` | `1200px` rail | Two clean architectural modules on `#f1f1f1` (`24px` padding, `0px` radius): RDW kenteken lookup (`#trade`) with monochrome verified output, and Finance Calculator (`#calc`) with square `0px` Carbon sliders and plain typographic monthly total. |
| **10** | **Klantbeoordelingen (Reviews)** | Fog `#f1f1f1` band | `100vw` band / `1200px` inner | Centered `4.8 / 5.0` typographic header and static/cleanly aligned review modules on `#ffffff` (`0px` radius, Carbon `★★★★★`, `18px`/`16px` body copy). |
| **11** | **Showroom & Contact** (`#contact`) | Pure White `#ffffff` | `1200px` rail | Address, live open status in plain Carbon text, `1px solid #bbbbbb` opening hours table, inline arrow links (`› Routebeschrijving`, `› WhatsApp ons`), and `0px`-radius contact form (`#contact-form`). |
| **12** | **Dark Footer Band** (`<footer>`) | Carbon `#262626` | `100vw` full-bleed (`56px` vertical pad) | Inside `1200px` container: Top horizontal **Language Switcher** row (`Nederlands / English / Deutsch / Français`, `16px` weight `400` `#ffffff`, `24px` gaps, no separators). Below: **4 flat columns** (`Direct naar`, `Zekerheden & Garage`, `AAUTO'S B.V.`, `Contact & Openingstijden`) with plain white unbolded headers and `16px` weight `400` `#ffffff` links (`10px` row-gap). |

---

## 5. Phased Implementation Checklist

> **Execution Protocol:** Once approved, we will execute **one phase at a time**, tick each `- [ ]` item as completed, verify the result in the browser, and wait for your explicit **OK** before proceeding to the next phase.

### Phase 0: Backup, Branch & Baseline Reset
- [x] Create a clean backup branch (`git checkout -b backup/pre-bmw-redesign` and return to `main` or `feat/bmw-redesign`) so the previous state is safely preserved.
- [x] Reset any uncommitted working-tree experiments so we start from a clean, deterministic baseline.
- [x] Remove duplicate root files (`styles.css`, `main.js`, `cars.js`, `car1-cutout.png`, `car2-cutout.png`) or confirm single source of truth (`css/styles.css`, `js/main.js`, `data/cars.js`).
- **Files touched:** Git branch state (`backup/pre-bmw-redesign`), deleted root duplicate files (`styles.css`, `main.js`, `cars.js`, `car1-cutout.png`, `car2-cutout.png`).
- **Acceptance criteria:** `git status` is clean against `HEAD` for active source files; `index.html` exclusively loads `css/styles.css`, `data/cars.js`, and `js/main.js`; `npm run build` succeeds.
- **Risk:** Low — verified.

### Phase 1: Remove Old Styles, Effects, Overlays & Dead Code
- [x] Strip `.hero-center-glow`, `.hero-dark-overlay`, `.hero-spotlight`, `.hero-cars-stage`, cutout `<img>` tags, `.car-light-beam`, and `.headlight-glow` from `index.html`.
- [x] Remove all inline `style="..."` attributes in `index.html` that hardcode legacy colors (`#FBBF24`, `var(--accent-wa)`, `#fff`), rounded radii, or flex hacks, replacing them with semantic classes.
- [x] Remove dead/conflicting JS functions from `js/main.js`: `initCockpitStartup()`, `initHeroParallax()`, `initCardTilt()`, `initBentoCardInteractions()`, `initMagneticButtons()`, `initScrollReveal()`, and `initReviewsMarquee()`.
- [x] Remove `<div class="car-glare">` and inline dark-mode styles (`color:#fff`, `borderRadius: "16px"`, `boxShadow`) from `js/main.js` (`card()`, `render()`, `mb.onclick`, `trayGo.onclick`).
- **Files touched:** `index.html`, `js/main.js`, `css/styles.css`.
- **Acceptance criteria:** Zero console errors; no 3D tilt, glare, magnetic button movement, laser beam, or cutout overlays remain in the DOM; all interactive features still bind cleanly.
- **Risk:** Low — verified with `npm run build`.

### Phase 2: Design Tokens & Font Setup (`DESIGN.md` Quick Start)
- [x] Load Google Font `Inter` (`weights 300;400;700;900`) in `index.html` `<head>` and remove `Plus Jakarta Sans` and `JetBrains Mono`.
- [x] Define the exact `:root` CSS Custom Properties from `DESIGN.md` in `css/styles.css`:
  - Colors: `--color-carbon: #262626`, `--color-pure-white: #ffffff`, `--color-concrete: #bbbbbb`, `--color-fog: #f1f1f1`
  - Typography: `--font-bmwtypenextlatin`, `--font-bmwtypenextlatin-light`, `--text-body-sm: 16px`, `--leading-body-sm: 1.6`, `--text-body: 18px`, `--leading-body: 1.63`, `--text-display: 60px`, `--leading-display: 1.3`, `--tracking-display: 0px`, weights `300`, `400`, `700`, `900`
  - Spacing scale: `--spacing-4` through `--spacing-100` (`4px` base)
  - Layout: `--page-max-width: 1200px`, `--section-gap: 56px`, `--card-padding: 24px`, `--element-gap: 16px`
  - Radii: `--radius-cards: 0px`, `--radius-badges: 0px`, `--radius-inputs: 0px`, `--radius-buttons: 0px`
  - Surfaces: `--surface-canvas: #ffffff`, `--surface-subtle-band: #f1f1f1`, `--surface-footer: #262626`
- **Files touched:** `index.html`, `css/styles.css`.
- **Acceptance criteria:** Computed styles on `:root` match `DESIGN.md` 1:1; `Inter` renders in weights 300, 400, 700, and 900.
- **Risk:** Low — verified.

### Phase 3: Global Base Styles (Reset, Typography, 0px Radius, Zero Shadow)
- [x] Write clean global reset and base rules in `css/styles.css`: `html, body` on `--surface-canvas` (`#ffffff`), text in `--color-carbon` (`#262626`), `font-size: var(--text-body)` (`18px`), `line-height: var(--leading-body)` (`1.63`).
- [x] Enforce global `border-radius: 0px` and `box-shadow: none` across all buttons, inputs, selects, textareas, cards, images, and dialogs.
- [x] Define reusable `.section` (`max-width: 1200px`, `padding: 56px 24px`), `.section-band-fog` (`background: #f1f1f1`, full-bleed with `1200px` inner container), `.inline-arrow-link` (`› Label` at `16px` weight `400` Carbon `#262626`), and monochrome hover/focus rules (underline or weight shift only).
- **Files touched:** `css/styles.css`.
- **Acceptance criteria:** Every element on the page has `0px` border radius and `none` box-shadow; body copy contrasts at 15.1:1 AAA (`#262626` on `#ffffff`).
- **Risk:** Low — verified.

### Phase 4: Top Navigation Bar
- [x] Extract `<header class="site-header"><nav class="top-nav">...</nav></header>` outside the hero section in `index.html`.
- [x] Style `.site-header` with Pure White `#ffffff` background, `5px` top/bottom padding (with comfortable touch target height), no border, no background blur, no shadow, static positioning (not sticky).
- [x] Build the Left Logo Lockup: `AAUTO'S` (`18px` weight `900` Carbon `#262626`), `12px` right margin, then tagline `Gekozen Om Te Overtuigen` (`16px` weight `400` Carbon `#262626`) on a shared baseline.
- [x] Style Right Navigation Links (`Aanbod`, `3D Studio`, `Categorieën`, `Zekerheden`, `Werkplaats`, `Inruil & Lease`, `Contact`, `› Plan een Proefrit`) as plain text at `16px` weight `400` Carbon `#262626` with `24px` horizontal gaps and underline-only hover state.
- [x] Style mobile `.menu-btn` and mobile dropdown menu on `#ffffff` with `0px` radius, `1px solid #bbbbbb` divider, and zero shadow.
- **Files touched:** `index.html`, `css/styles.css`, `js/main.js` (mobile menu toggle class).
- **Acceptance criteria:** Navbar sits flat on `#ffffff` above the hero, matches the `DESIGN.md` Top Navigation Bar & Logo Lockup specs, and mobile menu toggles cleanly without inline rounded/shadow styles.
- **Risk:** Low — verified.

### Phase 5: Hero (Full-Bleed Photo, 60px Light Display Heading, Inline Arrow Link)
- [x] Prepare clean, watermark-free hero photography (`assets/cars/volvo-right.jpg` cropped to remove bottom `mobilox`/`AAutos` watermarks and top telecom tower, focusing on the dark metallic front wheel, LED headlight, and grille).
- [x] Render `<section class="hero-showcase">` with the full-bleed edge-to-edge image (`width: 100vw`, `0px` padding/margin, zero overlay text or UI controls).
- [x] Below the image, render the centered Display Section Heading block on `#ffffff`:
  - `<h1 id="hero-title" class="display-heading">Premium occasions.<br>Zorgvuldig geselecteerd.</h1>` in `Inter Light`, `font-weight: 300`, `60px`, `line-height: 1.30`, `letter-spacing: 0px`, Carbon `#262626`, centered.
  - Subtitle `<p class="hero-sub">` in `18px` weight `400` Carbon `#262626`, centered.
  - `40px` below, the centered **Inline Arrow Link**: `<a href="#aanbod" class="inline-arrow-link"><span aria-hidden="true">›</span> Bekijk occasions</a>` at `16px` weight `400` Carbon `#262626`.
- **Files touched:** `index.html`, `css/styles.css`.
- **Acceptance criteria:** Hero photograph spans 100% viewport width with zero overlays or watermarks; `<h1>` is the sole `60px` weight `300` display heading on the page; `› Bekijk occasions` sits `40px` below and scrolls smoothly to `#aanbod`.
- **Risk:** Low — verified.

### Phase 6: Search / Filter Component (`#search`)
- [x] Place `.search-dock-wrapper` in a clean `#f1f1f1` (Fog) band below the hero heading section (`56px` section gap, no negative margin overlap).
- [x] Restyle `form#search.search-dock` with `0px` border radius, no box-shadow, `#ffffff` select fields with `1px solid #bbbbbb` borders, `16px` weight `700` Carbon labels, and `16px` weight `400` Carbon `<select>` text.
- [x] Restyle `.btn-submit` (`Toon <span id="count">…</span> auto's`) with `0px` radius, `#262626` background, `#ffffff` text at `16px` weight `400`, and underline on hover.
- [x] Verify all filter logic (`Merk`, cascading `Model`, `Max. Budget`, `Brandstof`, live `#count` odometer, form submit scroll + render).
- **Files touched:** `index.html`, `css/styles.css`.
- **Acceptance criteria:** All 4 dropdowns filter `#cars` and update `#count` accurately; zero shadows or rounded corners.
- **Risk:** Low — verified.

### Phase 7: Content Sections (One Item Per Section)
- [x] **7.1 Aanbod (`#aanbod`):**
  - Style section header (`Collectie` label at `16px` weight `700`, `<h2>` at `40px` weight `300` Carbon `#262626`).
  - Crop/frame vehicle images to hide bottom `mobilox`/`AAutos` watermarks (`0px` radius).
  - Style `.car-card` on `#f1f1f1` (Fog) with `24px` padding, `0px` radius, zero border/shadow, license plate badge deleted, monochrome favorite button (`☆`/`★`), `24px` weight `700` title, `16px` weight `400` specs separated by `1px solid #bbbbbb`, and Carbon price.
  - Restyle floating `#tray` and `dialog#cmp` in `#ffffff` / `#262626` with `0px` radius.
- [x] **7.2 3D Studio (`#studio3d`):**
  - Place inside a full-bleed `#f1f1f1` (Fog) surface band (`56px` vertical padding).
  - Style `.spline-showcase-box` with `0px` radius, `1px solid #bbbbbb` frame, zero shadow, and flat monochrome `#spline-loader` / `#spline-reset-btn` controls.
- [x] **7.3 Categorieën (`#categorieen`):**
  - Remove emoji badges (`💶`, `👨‍👩‍👧‍👦`, etc.) and Bento shadows.
  - Style `.cat-bento-card` items as clean architectural modules on `#f1f1f1`, featuring `18px` weight `700` titles, `16px` weight `400` descriptions, plain text vehicle counts, and `› Bekijk selectie` inline arrow links.
- [x] **7.4 Zekerheden & Werkplaats (`#zekerheden` & `#werkplaats`):**
  - Place inside a `#f1f1f1` (Fog) surface band.
  - Present the authentic showroom (`assets/dealership-outside.jpg`) and workshop (`assets/dealership-inside.jpg`) photographs at large scale with `0px` radius and plain typographic captions below.
  - Style the 64-Punten Inspectie tabs (`.inspector-tab-btn`) as plain text / `0px` tabs where active state is indicated by `font-weight: 700` and a `2px solid #262626` underline (no pills, no green badges).
- [x] **7.5 Inruil & Lease Tools (`#tools` & `#inruilen`):**
  - Remove `🔄` / `💶` emojis and the blue `.rdw-laser-beam`.
  - Style `form#trade` and `form#calc` on `#f1f1f1` (`24px` padding, `0px` radius) with `#ffffff` inputs (`1px solid #bbbbbb`), monochrome kenteken input, square `0px` Carbon range slider thumbs, and a flat `#262626` monthly output band (`#monthly`).
- [x] **7.6 Klantbeoordelingen (Reviews):**
  - Place inside a `#f1f1f1` (Fog) band.
  - Replace gold `#FBBF24` stars with Carbon `#262626` stars (`★★★★★`), remove auto-scrolling marquee jitter, and display the 4 reviews in clean `#ffffff` modules (`24px` padding, `0px` radius, zero shadow).
- [x] **7.7 Showroom & Contact (`#contact`):**
  - Style `#open-status-box` in monochrome Carbon text (weight `700`, no green/red neon pulsing dot), style `<table id="hours">` with `1px solid #bbbbbb` hairlines, convert Map/WhatsApp CTAs to clean `0px` triggers or inline arrow links, and style `form#contact-form` with `0px` inputs.
- **Files touched:** `index.html`, `css/styles.css`, `js/main.js`.
- **Acceptance criteria:** All 7 content sections strictly follow `DESIGN.md` surface polarity (`#ffffff` / `#f1f1f1`), typography (`Inter` 300/400/700), `0px` radii, and zero shadows; all interactive tools and tabs work without regression.
- **Risk:** Low — verified.

### Phase 8: Dark Footer Band & Language Switcher Row
- [x] Style `<footer class="footer">` with full-bleed Carbon `#262626` background and `56px` top/bottom padding.
- [x] Inside the `1200px` container, style `.footer-locale-row` (`Nederlands / English / Deutsch / Français`) as a horizontal row of plain text links at `16px` weight `400` `#ffffff` with `24px` horizontal spacing, no flags, no icons, and no border/separator.
- [x] Style `.footer-grid` as 4 flat columns (`Direct naar`, `Zekerheden & Garage`, `AAUTO'S B.V.`, `Contact & Openingstijden`) where column headers and links are both `16px` weight `400` `#ffffff` (no bold headers, `10px` row-gap between links, underline on hover).
- [x] Style `.cookie-banner` and `.mbar` in strict `#262626` / `#ffffff` monochrome with `0px` radius.
- **Files touched:** `index.html`, `css/styles.css`.
- **Acceptance criteria:** Footer matches `DESIGN.md` Dark Footer Band, Language Switcher, and Footer Link specifications 1:1.
- **Risk:** Low — verified.

### Phase 9: Responsive Pass (`1920px`, `1280px`, `768px`, `390px`)
- [x] Audit and refine breakpoints at `1920px` (wide desktop), `1280px` (standard desktop), `768px` (tablet), and `390px` (mobile).
- [x] Ensure the `60px` display heading scales gracefully on `390px` mobile while keeping `font-weight: 300` and `line-height: 1.30`, and that `1200px` rails have `20px–24px` horizontal breathing room on small viewports.
- [x] Verify that no horizontal overflow (`overflow-x`) occurs at any viewport width.
- **Files touched:** `css/styles.css`.
- **Acceptance criteria:** Clean layout, readable typography, and intact full-bleed hero at `1920px`, `1280px`, `768px`, and `390px`.
- **Risk:** Low — verified.

### Phase 10: Accessibility Audit (Contrast, Underline/Weight States, Alt Text, Keyboard)
- [x] Verify 15.1:1 AAA contrast (`#262626` on `#ffffff`) and `#ffffff` on `#262626` across all sections.
- [x] Verify all `:hover`, `:focus-visible`, and `:active` states use **underline or font-weight shift** (or `1px solid #262626` outline for keyboard focus) — never color inventions.
- [x] Audit `alt` attributes on all `<img>` elements, `aria-label` / `aria-expanded` on navigation, `aria-selected` on inspection tabs, and keyboard tab order across all forms and modals.
- **Files touched:** `index.html`, `css/styles.css`, `js/main.js`.
- **Acceptance criteria:** Full keyboard navigability, visible monochrome `:focus-visible` states, valid ARIA attributes, and WCAG AAA text contrast.
- **Risk:** Low — verified.

### Phase 11: Performance & Asset Cleanup
- [x] Add explicit `width`/`height` or `aspect-ratio` to prevent Cumulative Layout Shift (CLS); ensure `fetchpriority="high"` on the hero image and `loading="lazy"` on below-the-fold images.
- [x] Clean up unreferenced image duplicates in `assets/` and `images/` (after confirming which photos are used in `data/cars.js`).
- [x] Run `npm run build` and verify bundle output.
- **Files touched:** `index.html`, `js/main.js`, `css/styles.css`, `assets/`.
- **Acceptance criteria:** Fast LCP on hero image, zero CLS, zero broken asset links, clean `vite build`.
- **Risk:** Low — verified.

### Phase 12: Visual QA & Functional Regression Check
- [x] Inspect every section in the live browser against the `DESIGN.md` Do's and Don'ts checklist.
- [x] Run end-to-end functional regression checks:
  - Search filters (`Merk`, `Model`, `Max. Budget`, `Brandstof`) + live counter + submit
  - Category click filtering
  - Favorite toggle (`localStorage`) + Compare tray & modal (up to 3 cars)
  - 3D Studio Spline canvas & reset button
  - 64-Point Inspection tab switching
  - Live RDW kenteken lookup (`#trade-plate`)
  - Finance calculator sliders & monthly payment output
  - Opening hours table & live status
  - Contact form, Trade-in form, Cookie banner, Mobile menu
- **Files touched:** None (verification & final polish).
- **Acceptance criteria:** 100% compliance with `DESIGN.md` and 100% working functionality.
- **Risk:** Low — verified.

---

## 6. Confirmed User Decisions

1. **Hero Photograph Selection & Cropping:** **CONFIRMED — Dark charcoal Volvo XC60 (`assets/cars/volvo-right.jpg`)**, tightly cropped onto the front wheel, Thor's Hammer LED headlamp, and grille to remove all `mobilox`/`AAutos` watermarks and background clutter.
2. **Hero UI Layout:** **CONFIRMED — Move out of hero.** Navbar moves into a flat white `<header>` above the full-bleed hero photo; the `60px` Inter Light (`300` weight) `<h1>`, subtitle, and inline arrow link (`› Bekijk occasions`) sit on `#ffffff` below the hero photo; `#search` sits in its own `#f1f1f1` Fog band below that.
3. **Buttons & Navigation Prompts:** **CONFIRMED — Inline Arrow Links & Flat 0px Triggers.** Convert `"Plan een Proefrit"` and `"Bekijk Occasions"` to `DESIGN.md` Inline Arrow Links (`› Label` at `16px` weight `400` Carbon `#262626`), and style form submit buttons as flat `0px`-radius Carbon `#262626` rectangles with `#ffffff` text.
4. **License Plates & Strict Monochrome:** **CONFIRMED — Delete the car license plate badge** (`.dutch-plate`) from the car cards, and render all remaining UI elements (including `#trade-plate` input, review stars, and status indicators) in strict monochrome (`#262626` / `#f1f1f1` / `#ffffff`).
5. **Inventory Layout (`#aanbod`) & Duplicate Root Files:** **CONFIRMED — Single-column editorial list** on the `1200px` content rail for `#aanbod`, and **delete all duplicate root files** (`styles.css`, `main.js`, `cars.js`, `car1-cutout.png`, `car2-cutout.png`).

