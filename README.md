# University Dormitory Management System (UDMS)

An interactive frontend prototype exploring student housing workflows for a university setting.

**AI Studio demo:** https://ai.studio/apps/drive/1PvM1iDc_WG0pv5p0HzWGtBoBdYsIU2YM

## What it demonstrates

- Student, administrator, maintenance, and security workflows
- Room occupancy, maintenance requests, visitor registration, and payment screens
- Dashboard visualizations and role-based interface states
- Gemini-assisted chat and maintenance-image analysis

## Tech stack

React 19 · TypeScript · Vite · Google GenAI SDK · Recharts

## Run locally

**Requirements:** Node.js and npm.

```bash
npm install
```

Create `.env.local` in the project root and add a Gemini API key:

```env
GEMINI_API_KEY=your_api_key
```

Then run:

```bash
npm run dev
```

## Prototype notes

The interface is backed by sample data in `constants.ts`; it is not connected to a production university database or payment service. Do not enter real student or payment information. Gemini-powered features require an API key. Keep keys out of Git and avoid exposing production credentials in a client-side build.
