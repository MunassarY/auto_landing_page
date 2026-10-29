# AAUTO'S — Modern Automotive Dealership Experience

A high-performance, luxury automotive dealership landing page built for **AAUTO'S B.V.** (Alphen aan den Rijn, The Netherlands). Featuring cutting-edge 3D interactive mechanics, digital cockpit car starting animations, Spline 3D runtime integration, and official RDW vehicle registry lookup.

---

## 🌟 Key Features

1. **Digital Cockpit Car Starting Entrance Reveal**:
   - High-fidelity instrument cluster with battery, oil, engine check, ABS, and handbrake tell-tale lights self-test.
   - Dynamic fuel tank (`⛽ BENZINETANK`) rising from 0% to 100% with real-time range calculation (`Actieradius: 840 km`).
   - Tachometer & Speedometer needle sweep check with realistic engine idle transition at 900 RPM.
2. **RoyalCar-Inspired 3D Motion Studio Hero**:
   - Dual-car framing composition featuring real inventory (Volkswagen Golf Cabriolet & Volvo XC60 AWD).
   - Interactive 3D mouse parallax tracking and ambient spotlight cursor follower.
   - Cinematic scroll ejection powered by Lenis smooth scrolling.
3. **Spline 3D Runtime Integration**:
   - Ready-to-render `<canvas id="canvas3d"></canvas>` integrated with `@splinetool/runtime` for 360° vehicle inspection.
4. **Occasions Collection with 3D Tilt & Specular Glare**:
   - Cards dynamically tilt on hover with cursor-following specular light reflections.
   - Live inventory counter, favorite toggles, and side-by-side comparison modal dialog (up to 3 cars).
5. **Interactive Tools**:
   - **Inruilwaarde**: 3D embossed Dutch license plate with high-tech laser beam scanning effect and live RDW Open Data API verification.
   - **Financieringscalculator**: Fluid range sliders with synchronized euro badges and real-time monthly payment calculation.
6. **Showroom & Real Workshop**:
   - Highlighting real dealership facilities (Ingang 5 buitenterrein and service garage with hydraulic lifts).
   - Real-time "Nu Geopend" pulsing beacon calculated against Dutch business hours.

---

## 🚀 Quick Start

### Installation
```bash
git clone https://github.com/MunassarY/auto_landing_page.git
cd auto_landing_page
npm install
```

### Development Server
```bash
npm run dev
```
Open [http://localhost:5173/](http://localhost:5173/) to view the live app.

### Production Build
```bash
npm run build
npm run preview
```

---

## 📂 Tech Stack
- **Runtime & Bundler**: Vite (ESM)
- **Smooth Scroll**: Darkroom Engineering Lenis
- **3D Engine**: Spline Runtime (`@splinetool/runtime`)
- **Styling**: Vanilla CSS (Variables, Bento grids, 3D perspective, glassmorphism)
- **External APIs**: RDW Open Data Service (`opendata.rdw.nl`)
