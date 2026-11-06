# Greyvaldo Christian, S.T — Civil Engineering Portfolio & Financial Vault

**Live Production Application:** [https://greyvaldo-christian.web.app](https://greyvaldo-christian.web.app)

An ultra-minimalist, bilingual (`EN` / `ID`) **Civil Engineering & QA/QC Portfolio** and **PIN-Protected Financial Ledger** built for **Greyvaldo Christian, S.T** (Quality Control Specialist for Indonesia's National Strategic Infrastructure — *Ibu Kota Nusantara / IKN*).

---

## 1. Architectural Overview

The application is engineered around a strict **Vercel Ink** design language (`#000000` canvas, `#0A0A0A` surfaces, `1px solid #1F1F1F` structural hairlines, `#EDEDED` primary typography, `#8F8F8F` secondary telemetry, and `#0070F3` Electric Blue as the sole interactive accent—with zero gradients and zero decorative icons).

### Core Stack
- **Frontend Framework:** React 18 + TypeScript + Vite 6
- **3D WebGL Engine:** Three.js (`@react-three/fiber`, `@react-three/drei`)
- **Scroll & Spring Physics:** Framer Motion (`useScroll`, `useInView`)
- **Financial Data Visualization:** Recharts (Interactive Category & Ratio Donut Charts)
- **Cloud Database & Hosting:** Google Firebase (Cloud Firestore real-time `onSnapshot` + Firebase Hosting)
- **Natural Language Ledger Parser:** DeepSeek Chat API (`deepseek-chat`) with deterministic local NLP fallback
- **Spreadsheet Export:** Native CSV + SheetJS (`xlsx`) for 1-click `.xlsx` export

---

## 2. Design System: "Vercel Ink" Specification

| Token | Hex Value | Role |
| :--- | :--- | :--- |
| `neutral` | `#000000` | Full-viewport foundation & WebGL background |
| `surface` | `#0A0A0A` | Card & container surfaces |
| `primary` | `#EDEDED` | Headlines and primary body text |
| `secondary` | `#8F8F8F` | Technical metadata, STA coordinates, captions |
| `tertiary` | `#0070F3` | Sole interactive accent & load-bearing node highlights |
| `border` | `#1F1F1F` | `1px solid` structural hairlines |

### Typography
- **`Geist` (Sans-Serif):** Display (`4rem`, weight `600`, tracking `-0.04em`), Section Headers (`2.25rem`, weight `600`), and Body (`0.95rem`, line-height `1.55`).
- **`Geist Mono` (Monospace):** Used for all `STA` stationing readouts, structural coordinates, KPIs, timestamps, and tabular `IDR` financial figures (`font-variant-numeric: tabular-nums`).

---

## 3. Scroll-Driven 3D WebGL Structural Canvas (`src/components/StructuralCanvas.tsx`)

A fixed, full-viewport Three.js scene evolves mathematically as the user scrolls from `STA 0+000` to `STA 7+200` (or can be manually switched via the bottom CAD HUD bar):

1. **Stage 1 (0%–25% Scroll — Bridge Truss & Flyover Wireframe):**
   - 3D box-girder highway flyover and Warren truss wireframe inspired by the *IKN Fly Over (Istana Negara, Kantor Presiden, Kemensetneg)* project.
   - Features `#8F8F8F` structural edges and raycast-interactive `#0070F3` load-bearing nodes that report shear/moment telemetry on hover.
2. **Stage 2 (25%–55% Scroll — 7+ KM Rigid Pavement & Rebar Matrix):**
   - Longitudinal camera glide along a 2-layer steel reinforcement cage, contraction joint dowel cradles, and `#0070F3` inspection checkpoints (`STA 0+000` to `STA 7+000`).
3. **Stage 3 (55%–100% Scroll — Finite Element Mesh):**
   - SAP2000-inspired geodesic space-frame mesh with live 3D coordinate vector badges (`σx`, `σy`, `Mmax`).

---

## 4. Bilingual Civil Engineering Portfolio (`EN` / `ID`)

- **Instant Language Toggle (`EN` | `ID`):** Persisted in `localStorage`, translating every section, KPI label, work experience bullet, academic record, and modal between English and Bahasa Indonesia.
- **CAD Viewfinder Photo Frames (`src/components/CadPhotoFrame.tsx`):**
  - Houses local field & academic photography inside `1px` reticle frames with grayscale-to-color hover transitions and a 1:1 full-resolution inspection lightbox:
    - `public/assets/GreyvaldoDiIstanaGarudaIKN.jpeg` — Hero Portrait at Istana Garuda, IKN
    - `public/assets/QualityTalkPenjelasanKepadaSeluruhStakeholderPUOwnerKonsultanTenagaKerja.jpeg` — Multi-Stakeholder Quality Talk at IKN
    - `public/assets/BestGraduateCivilEngineeringDellaSalle.jpeg` — Top Graduate of Civil Engineering (`Cum Laude 3.64 / 4.00`)
- **Printable Engineering Dossier (`src/components/DossierModal.tsx`):**
  - Provides 1-click `.TXT` CV export, browser PDF print formatting, and direct contact links.

---

## 5. PIN-Protected Financial Vault & Cloud Firestore Ledger (`src/components/FinanceVault.tsx`)

Accessible via the navbar `[FINANCE VAULT]` button and protected by an environment-configured PIN (`VITE_VAULT_PIN`).

### Separated Workspace Architecture
1. **`01 // OVERVIEW & SPREADSHEET LEDGER`:**
   - **4 Executive Telemetry Cards:** `TOTAL INCOME`, `TOTAL EXPENSE`, `NET BALANCE` (with savings retention ratio `%`), and `LARGEST EXPENSE CATEGORY`.
   - **Interactive Donut Charts (`Recharts`):** Monochrome surgical shades (`#EDEDED` to `#262626`) with `#0070F3` highlighting the peak or selected expense slice. Clicking any slice filters the spreadsheet below.
   - **Dual-Mode Responsive Spreadsheet:**
     - **Desktop / Sheet View:** 8-column tabular `Geist Mono` spreadsheet with click-to-edit inline cells (Date, Type, Category, Description, Payment Method, Amount), running balance calculation, search/category filters, `+ Add Row`, `[EXPORT CSV]`, and `[EXCEL .XLSX]`.
     - **Mobile Card View:** Touch-optimized card stream for inline editing on narrow viewports (`< 768px`).
   - **Reset Controls:**
     - `[RESET TO RP 0]`: Executes a Firestore batch delete to clear all ledger entries to a zero-balance slate.
     - `[RESTORE DEMO]`: Restores the 6 baseline engineering income/expense seed entries.

2. **`02 // TEXT-TO-LEDGER QUICK INPUT`:**
   - Dedicated natural-language terminal supporting English and Bahasa Indonesia shorthand (e.g., *"Salary came in 18.5 juta, paid kos 2.5 juta, bought coffee 55k"* or *"Ubah kos ke 2.7 juta"*).
   - Paired with a live **Firestore Summary Sidebar** displaying real-time synced documents and net liquidity.

---

## 6. Security & Environment Variables Setup

All sensitive keys, PIN codes, and Firebase project credentials are excluded from version control via [`.gitignore`](.gitignore) and loaded at build/runtime through Vite environment variables (`import.meta.env.VITE_*`).

1. Copy the template file [`.env.example`](.env.example) to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Populate `.env` with your credentials:
   ```env
   VITE_VAULT_PIN=your_vault_pin_here
   VITE_DEEPSEEK_API_KEY=your_deepseek_api_key_here
   VITE_DEEPSEEK_ENDPOINT=https://api.deepseek.com/chat/completions

   VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
   VITE_FIREBASE_APP_ID=your_firebase_app_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
   VITE_FIREBASE_API_KEY=your_firebase_web_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

---

## 7. Local Development & Deployment

```bash
# 1. Install dependencies
npm install --legacy-peer-deps

# 2. Start local development server
npm run dev

# 3. Type-check and build production bundle into dist/
npm run build

# 4. Deploy Cloud Firestore rules and Hosting bundle
firebase deploy --only firestore:rules,hosting:greyvaldo-christian
```

---

## 8. Project Structure

```text
├── public/
│   └── assets/                  # Preserved local engineering & academic photographs
├── src/
│   ├── components/
│   │   ├── AnimatedCounter.tsx  # Spring-eased numerical roll-up counters
│   │   ├── CadHudOverlay.tsx    # Fixed viewport STA stationing & 3D stage selector
│   │   ├── CadPhotoFrame.tsx    # Reticle photo frame & 1:1 inspection lightbox
│   │   ├── DossierModal.tsx     # Bilingual CV dossier export & direct contact modal
│   │   ├── FinanceVault.tsx     # PIN-protected financial dashboard, charts & chat parser
│   │   └── StructuralCanvas.tsx # 3-stage scroll-linked Three.js WebGL scene
│   ├── data/
│   │   └── portfolioData.ts     # Bilingual (EN/ID) CV dataset & UI dictionary
│   ├── services/
│   │   └── financeService.ts    # Cloud Firestore real-time sync & DeepSeek parser
│   ├── App.tsx                  # Main application layout & language state
│   ├── index.css                # Vercel Ink design tokens & responsive utilities
│   ├── main.tsx                 # React DOM entry point
│   └── vite-env.d.ts            # TypeScript definitions for Vite env variables
├── .env.example                 # Safe environment variable template
├── .firebaserc                  # Firebase project target mapping
├── .gitignore                   # Excludes node_modules, dist, .env, and logs
├── firebase.json                # Firebase Hosting & Firestore rules configuration
├── firestore.rules              # Cloud Firestore security rules
├── package.json                 # Dependencies and build scripts
└── vite.config.ts               # Rollup modular chunk splitting configuration
```
