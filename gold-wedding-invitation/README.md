# Gold Wedding Invitation — React

Responsive Arabic RTL wedding invitation for Mahmoud & Kamar, featuring an animated gold arch, floating petals, invitation opening transition, live countdown, Google Maps location, and optional background music. The RSVP form and Google Sheets integration have been removed as requested.

## Requirements
- Node.js 20+
- npm

## Run locally
```bash
npm install
npm run dev
```

## Customize
Edit `src/main.jsx` and update the `WEDDING` object. Current details: Mahmoud & Kamar, 12 November 2026, coordinates `29.962511, 30.926514`. The Google Maps link is included.
- `groom`, `bride`
- `date` (ISO 8601 date/time including timezone offset)
- `dateLabel`, `timeLabel`
- `venue`, `address`, `mapsUrl`

Place a licensed audio file at `public/music.mp3` to enable the music toggle. Browsers require a user gesture before audio playback; the toggle handles this. Do not distribute music without the appropriate rights.

## Build
```bash
npm run build
npm run preview
```

## Deploy with Coolify

This repository includes a production `Dockerfile` and Nginx configuration. In Coolify:

1. Create a new **Application** from this Git repository.
2. Choose **Dockerfile** as the build pack.
3. Set the exposed port to `80`.
4. Deploy. No environment variables are required.

The Nginx config includes SPA fallback support and static-asset caching.
