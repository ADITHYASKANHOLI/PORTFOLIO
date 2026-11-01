# Adithya S. Kanholi — Engineering Journal & Portfolio

[![Vite](https://img.shields.io/badge/Vite-6.4-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?style=flat&logo=vercel&logoColor=white)](https://vercel.com)

A distinctive personal portfolio and digital engineering journal for **Adithya S. Kanholi** — Electrical & Electronics Engineering undergraduate at the **College of Engineering Vadakara (CEV)**, software engineer, embedded hardware developer, and founder of **FOLE** (Free Open Learning & Education).

Designed to reject generic cookie-cutter templates, saturated neon glow loops, and arbitrary progress bars. Built around deliberate architectural composition, authentic dark engineering aesthetics, tactile liquid glass optics, responsive motion physics, and ground-up technical storytelling.

---

## 1. Portfolio Overview & Purpose

This repository powers Adithya's personal website and engineering journal. The platform serves three complementary goals:
1. **Engineering Showcase**: Presenting real-world systems across electrical engineering, embedded firmware (ESP32, sensor buses, actuator kinematics), and full-stack software.
2. **Pedagogical Archive**: Documenting peer-to-peer education, workshops, hardware labs, and community leadership through FOLE at CEV.
3. **Decoupled Content Management**: A headless CMS dashboard (`/admin`) connected to Supabase PostgreSQL and Storage, enabling dynamic updates to projects, hardware logs, teaching slides, and media without altering application source code.

---

## 2. Key Features & Capabilities

- **Zero-Layout-Shift React Bits Preloader**: An interactive stairs-variant loading sequence that verifies `document.readyState`, web font loading via `document.fonts.ready`, and DOM painting before unveiling the application.
- **Cinematic WebGL Circuit Canvas**: Interactive background particle and flux line vector simulation with mouse proximity deflection and ambient drift.
- **Apple-Inspired Optical Liquid Glass UI**: Refractive glass pill navigation, glass action links, and concentric back-to-top controls powered by `@zakisheriff/liquid-glass` SVG filters.
- **React Bits ScrollStack**: Pinned, stacked card deck for the "What I Work With" skills repertoire with dynamic layer scaling and depth perception.
- **React Bits Accordion Gallery**: Multi-panel expanding hardware showcase ("Beyond the Screen") detailing ESP32 robotics, sensor telemetry, and embedded integration.
- **React Bits MorphSlider**: Synchronized typographic and image morphing carousel documenting FOLE community initiatives, hardware workshops, and pedagogical sessions.
- **Rotating CircularText Control**: Concentric back-to-top floating glass button surrounded by an animated SVG circular typography ring.
- **React Bits TechText Interactive Typography**: Interactive typographic canvas rendering with dynamic lens magnification, technical typography annotations, springs, and cursor impulses across hero and section headings.
- **Restricted Administrative CMS (`/admin`)**: Fully secured editorial dashboard guarded by Supabase Auth and database-enforced `admin_users` table checks.
- **Public Navigation Seclusion**: Public desktop, mobile, drawer, and footer navigation bars have no public-facing admin buttons or login links, preserving a visitor-focused experience while keeping `/admin` accessible to authorized personnel.
- **Resilient Offline / Demo Mode**: The application is architected to run gracefully even when Supabase credentials are not provided, defaulting to structured seed data so visitors and automated auditors experience zero broken UI.

---

## 3. Technologies, Frameworks & Libraries

### Core Runtime
- **React 19 (`^19.0.0`)**: Modern UI rendering with strict mode and concurrent features.
- **TypeScript 5.7**: End-to-end static typing across components, data models, and API integrations.
- **Vite 6.4**: Ultra-fast module bundling, hot module replacement (HMR), and Rollup-based production chunking.

### Styling & Design System
- **Tailwind CSS 3.4**: Utility-first CSS architecture with custom theme extensions, font family definitions, and responsive breakpoints.
- **PostCSS & Autoprefixer**: Automated vendor prefixing and modern CSS feature compilation.
- **Google Fonts**: Space Grotesk (display headings), Inter (clean editorial body copy), and IBM Plex Mono (technical telemetry, specs, and code).

### Animation, Motion & Optics
- **Framer Motion (`^12.4.7`)**: Layout transitions, preloader stairs, modal animations, and component entrance triggers.
- **GSAP (`^3.15.0`) & ScrollTrigger**: Pinned timeline choreography, horizontal project gallery scrolling, and curtain transitions.
- **Lenis (`^1.1.20`)**: Normalized smooth scrolling physics synchronized with GSAP timelines.
- **@zakisheriff/liquid-glass (`^0.3.13`)**: SVG displacement filter engine for optical glass refraction and chromatic dispersion.
- **OGL (`^1.0.11`)**: Minimal WebGL library driving performant background canvas simulations.
- **Lucide React (`^0.475.0`)**: Crisp, geometric icons across all UI sections and admin panels.

### Backend, Auth & Storage
- **Supabase (`@supabase/supabase-js ^2.48.1`)**:
  - PostgreSQL database with Row Level Security (RLS).
  - Supabase Auth (email/password session management).
  - Supabase Storage buckets for project galleries, hardware photos, and teaching slides.

---

## 4. UI Design System & Motion Architecture

### Visual Palette
| Token | Hex | Role |
| :--- | :--- | :--- |
| **Dark Canvas** | `#08090B` | Primary immersive background, body canvas, and preloader fill |
| **Forest Surface** | `#12151A` | Secondary elevated surface, card backings, modal drawers |
| **Border Subdued** | `#292D33` | Technical dividers, schematic grids, structural brackets |
| **Text Paper** | `#FFFFFF` | Primary headings, titles, and high-contrast labels |
| **Muted Technical** | `#9299A3` | Metadata, coordinates, dates, secondary annotations |
| **Accent Ice** | `#D7DCE2` | Subtle active states, status pulses, and glass specular rims |

### Interactive Components
1. **Preloader (`src/components/Preloader.tsx` & `src/components/AppPreloader.tsx`)**:
   - Implements the React Bits stairs reveal animation.
   - Evaluates true browser readiness (`document.readyState === 'complete'`, `document.fonts.ready`, double `requestAnimationFrame`).
   - Automatically unmounts once the page is fully interactive and painted.
   - Preserves state across client-side route navigation; re-executes on full browser reload.
2. **ScrollStack (`src/components/ScrollStack.tsx`)**:
   - Pinned vertical card stack that cards smoothly slide over and compress.
   - Categorized into Programming, Backend Systems, Hardware & Embedded, Engineering Tools, and Open Education.
3. **AccordionGallery (`src/components/AccordionGallery.tsx`)**:
   - Horizontal expanding flex panels highlighting embedded hardware setups.
   - Keyboard accessible and touch optimized for mobile gestures.
4. **MorphSlider (`src/components/MorphSlider.jsx`)**:
   - Seamless cross-fade and image morphing carousel for teaching sessions and FOLE labs.

---

## 5. Project Architecture & Folder Structure

```
PORTFOLIO/
├── .antideploy.json              # Antideploy deployment manifest
├── .env.example                  # Environment variable template with safe placeholders
├── .gitignore                    # Comprehensive Git exclusion rules
├── api/                          # Vercel Serverless Functions
│   ├── _lib/                     # Internal server utilities (crypto, sessions, rate limiter)
│   │   └── auth.ts               # Timing-safe key verification & token management
│   └── admin/                    # Serverless admin auth endpoints
│       ├── login.ts              # POST /api/admin/login
│       ├── verify.ts             # GET/POST /api/admin/verify
│       └── logout.ts             # POST /api/admin/logout
├── components.json               # Shadcn / React Bits registry configuration
├── index.html                    # HTML5 entrypoint with CSP & Open Graph metadata
├── package.json                  # Dependencies, scripts, and Node engine constraints
├── postcss.config.js             # PostCSS plugin configuration
├── tailwind.config.js            # Tailwind typography, colors, and layout extensions
├── tsconfig.json                 # TypeScript compiler configuration (ESNext, React JSX)
├── tsconfig.node.json            # Node-specific TypeScript rules
├── vercel.json                   # Vercel deployment, SPA rewrites, and security headers
├── vite.config.ts                # Vite plugins, dev auth middleware, Rollup chunking & headers
├── public/                       # Static public assets (SVGs, favicon, images)
│   ├── _headers                  # Edge security headers definition
│   ├── favicon.svg               # Vector monogram favicon
│   ├── hardware/                 # Hardware card SVG diagrams
│   └── teaching/                 # Teaching card SVG diagrams
├── src/
│   ├── main.tsx                  # React DOM entrypoint
│   ├── App.tsx                   # Top-level application shell & route definitions
│   ├── index.css                 # Global CSS, Tailwind directives, font rules
│   ├── types.ts                  # Shared TypeScript interfaces
│   ├── server/                   # Local Vite server middleware
│   │   └── authMiddleware.ts     # Connect middleware matching Vercel serverless auth
│   ├── animations/               # Motion controllers, GSAP setup, and scroll engines
│   │   ├── gsapSetup.ts          # GSAP & Lenis initialization
│   │   ├── HorizontalProjectGallery.tsx # Horizontal desktop gallery
│   │   ├── PageCurtainTransition.tsx    # Smooth client-side route transitions
│   │   └── PortraitReveal.tsx    # Editorial portrait section
│   ├── components/               # React components and interactive widgets
│   │   ├── AccordionGallery.tsx  # React Bits hardware accordion
│   │   ├── AppPreloader.tsx      # Readiness controller for page load
│   │   ├── CircularText.jsx      # Animated circular typography ring
│   │   ├── MorphSlider.jsx       # React Bits morph slider
│   │   ├── Preloader.tsx         # React Bits preloader implementation
│   │   ├── ScrollStack.tsx       # React Bits skills card stack
│   │   ├── admin/                # Admin CMS components (Guard, Layout, Uploaders)
│   │   ├── effects/              # WebGL FluxLines and canvas backgrounds
│   │   ├── sections/             # Public page sections (Hero, About, Projects, etc.)
│   │   └── ui/                   # Liquid glass pills, buttons, and navigation
│   ├── lib/
│   │   ├── auth/                 # AuthContext and session state hooks
│   │   ├── data/                 # API client, Supabase queries, and fallback seed data
│   │   └── supabase/             # Supabase client instantiation
│   └── pages/
│       ├── HomePage.tsx          # Main single-page portfolio view
│       ├── ProjectDetailPage.tsx # Deep-dive slug-based project brief page
│       ├── NotFoundPage.tsx      # Custom 404 error page
│       └── admin/                # Admin CMS views (Dashboard, Projects, Content, etc.)
└── supabase/
    └── schema.sql                # Complete PostgreSQL schema, RLS policies, and triggers
```

---

## 6. Installation & Local Development Setup

### Prerequisites
- **Node.js**: `v18.0.0` or higher (Node 20+ LTS recommended)
- **Package Manager**: `npm` (v9+) or `pnpm`
- **Git**: Installed and configured locally

### Step-by-Step Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/ADITHYASKANHOLI/PORTFOLIO.git
   cd PORTFOLIO
   ```

2. **Install project dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
   Open `.env` and fill in your Supabase project keys if you wish to connect your live database:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key-here
   ```
   *(Note: If you leave `.env` empty, the application runs automatically in offline demo mode using bundled seed data).*

4. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open your browser to `http://localhost:5173`.

---

## 7. Build & Production Commands

| Command | Purpose |
| :--- | :--- |
| `npm run dev` | Starts Vite local development server on port 5173 with HMR |
| `npx tsc --noEmit` | Executes TypeScript type-checking across all `.ts` and `.tsx` files |
| `npm run build` | Compiles TypeScript and builds minified assets to the `/dist` directory |
| `npm run preview` | Runs local HTTP server serving the production `/dist` build on port 4173 |

---

## 8. Environment Variables Reference

| Variable Name | Required | Scope | Description |
| :--- | :---: | :---: | :--- |
| `ADMIN_KEY` | **Required for Admin** | **Server Only (Vercel)** | Secret access key for `/admin` portal login. Set in Vercel Project Settings > Environment Variables. **Never exposed to client bundles.** |
| `VITE_SUPABASE_URL` | Optional | Client / Build | Supabase project HTTPS URL (`https://xyz.supabase.co`) |
| `VITE_SUPABASE_ANON_KEY` | Optional | Client / Build | Supabase anonymous public key (safe for browser distribution) |

> [!IMPORTANT]
> - `ADMIN_KEY` is read strictly on the server by Vercel Serverless Functions (`/api/admin/*`) and Vite local middleware. It is never bundled into browser JavaScript or exposed as a `VITE_*` variable.
> - Never store Supabase `service_role` secrets in client code or environment files.
> - The application operates in zero-dependency demo mode if Supabase keys are not provided.

---

## 9. Admin Portal & Key Authentication Architecture

- **Protected Path**: `/admin` (with sub-routes `/admin/projects`, `/admin/content`, `/admin/skills`, `/admin/media`).
- **Server-Side Key Verification (`/api/admin/login`)**:
  - The login screen (`/admin/login`) requires the secret **Admin Access Key**.
  - Verified on the server using **constant-time SHA-256 buffer equality (`crypto.timingSafeEqual`)** to prevent timing attacks.
  - Protected by an in-memory **IP rate limiter** (max 5 failed attempts per 5-minute window with `Retry-After` enforcement).
- **Stateless Cryptographic Session**:
  - Upon valid key verification, the server issues a cryptographically signed HMAC-SHA256 session token stored in an `HttpOnly`, `SameSite=Lax`, `Path=/`, `Secure` cookie (`admin_session`).
  - Active sessions are verified on server-side `/api/admin/verify`.
  - Logging out immediately expires and clears the cookie via `/api/admin/logout`.
- **Zero Client Key Exposure**:
  - `process.env.ADMIN_KEY` is exclusively consumed in server-side functions under `/api/` and Vite dev middleware. It is never prefixed with `VITE_` and never bundled into frontend assets.
- **Route Guarding**: [`AdminGuard.tsx`](file:///Users/adithyaskanholi/Desktop/PORTFOLIO/src/components/admin/AdminGuard.tsx) checks server-verified admin authentication before rendering any administrative screens.
- **Unauthenticated Handling**: Any visitor accessing `/admin` directly is redirected immediately to `/admin/login`.
- **Public Privacy**: Public desktop navigation, mobile header actions, the mobile menu drawer, and the footer contain **no visible links or buttons** to the admin panel.
- **Local Development Parity**:
  - For local development with `npm run dev` or `npm run preview`, Vite dev middleware (`src/server/authMiddleware.ts`) implements the exact same endpoints (`/api/admin/login`, `/api/admin/verify`, `/api/admin/logout`) with `ADMIN_KEY` support.

---

## 10. Deploying to Vercel

The portfolio is pre-configured for deployment on **Vercel** via [`vercel.json`](file:///Users/adithyaskanholi/Desktop/PORTFOLIO/vercel.json).

### Method A: Deploy via GitHub (Recommended)

1. Push your latest commits to the GitHub repository:
   ```bash
   git push origin main
   ```
2. Navigate to [vercel.com](https://vercel.com) and log in.
3. Click **"Add New..."** → **"Project"**.
4. Import the **`ADITHYASKANHOLI/PORTFOLIO`** repository from your GitHub account.
5. In the **Configure Project** screen, Vercel will auto-detect the configuration:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `./` (project root)
   - **Build Command**: `npm run build` (or `vite build`)
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
6. Under **Environment Variables**, optionally add:
   - `VITE_SUPABASE_URL`: Your Supabase URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase Anon Key
7. Click **"Deploy"**.

### Method B: Deploy via Vercel CLI

If you have the Vercel CLI authenticated locally:
```bash
# 1. Log in to Vercel
npx vercel login

# 2. Deploy a preview build
npx vercel

# 3. Deploy to production
npx vercel --prod
```

### Vercel Routing & Edge Headers
[`vercel.json`](file:///Users/adithyaskanholi/Desktop/PORTFOLIO/vercel.json) enforces:
- **Client-Side SPA Routing**: All URLs (`/project/:slug`, `/admin`, etc.) rewrite to `/index.html`, eliminating 404 errors on direct navigation or page refresh.
- **Immutable Asset Caching**: Built scripts and styles under `/assets/*` are cached with `public, max-age=31536000, immutable`.
- **Security Headers**: Injects `Content-Security-Policy`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, and `Strict-Transport-Security: max-age=31536000`.

---

## 11. GitHub Integration & Automatic CI/CD

When connected to Vercel via GitHub:
- **Production Branch (`main`)**: Every push or merged Pull Request to `main` automatically triggers a zero-downtime production deployment.
- **Preview Branches**: Pushing to a feature branch automatically generates a unique Vercel Preview URL for testing before merging.

---

## 12. Custom Domain Configuration

To connect a custom domain (e.g. `adithyaskanholi.dev`):
1. In your Vercel Dashboard, go to **Settings** → **Domains**.
2. Enter your custom domain name.
3. Update your DNS records with your registrar:
   - **A Record**: `@` points to `76.76.21.21`
   - **CNAME Record**: `www` points to `cname.vercel-dns.com`
4. Vercel automatically provisions and renews SSL/TLS certificates via Let's Encrypt.

---

## 13. Troubleshooting

### Direct URL refresh gives 404
- Verify that [`vercel.json`](file:///Users/adithyaskanholi/Desktop/PORTFOLIO/vercel.json) contains the rewrite rule:
  ```json
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
  ```

### Shaders or Canvases not rendering
- WebGL requires hardware acceleration enabled in the browser.
- Check browser console for WebGL context creation warnings.

### Preloader displays indefinitely
- The preloader includes a 2.5s maximum safety timeout. If custom assets fail to load, the safety fallback automatically releases the screen.

---

## 14. License

Designed and authored by **Adithya S. Kanholi**.  
Open-source under the [MIT License](LICENSE).
