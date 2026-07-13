# RoofLocker

A protective, trust-first web app connecting homeowners with vetted roofing
contractors and helping them document storm damage and file compliant
insurance claims in Michigan.

## Features

- **Vetted Contractor Directory** — license, court-docket, and scam-report
  checks surfaced per contractor
- **Damage Canvas** — pin storm damage on a roof plan with photo/video
  evidence and a material calculator
- **Secure Messaging Hub** — in-portal chat with automatic redaction of
  phone numbers and emails, plus Google Calendar scheduling
- **Red-Flag Contract Scanner** — highlights predatory clauses (contingency
  traps, deductible-waiver fraud, unlicensed adjusting) with statute citations
- **Three-Tier Dispute Center** — structured self-resolution, mediation, and
  arbitration workflow
- English/Spanish language toggle

> **Note:** This is currently a front-end prototype. Login, contractor data,
> chat replies, and admin views are simulated with mock data; the Google
> sign-in and Calendar integration are the only live services.

## Tech stack

React 19 · TypeScript (strict) · Vite 6 · Tailwind CSS 4 · Firebase Auth ·
lucide-react

## Getting started

**Prerequisites:** Node.js 20+

```bash
npm install
npm run dev        # start dev server on http://localhost:3000
```

Other scripts:

```bash
npm run build      # production build to dist/
npm run preview    # serve the production build locally
npm run typecheck  # TypeScript strict checking
npm run lint       # ESLint
```

## Configuration

Firebase web config defaults to `firebase-applet-config.json` (the AI Studio
applet project). To point a deployment at a different Firebase project, set
the `VITE_FIREBASE_*` variables — see [.env.example](.env.example).

The Google sign-in flow requests Calendar scopes so homeowners can schedule
contractor sessions; access tokens expire after ~1 hour, and the UI prompts
to reconnect when that happens.
