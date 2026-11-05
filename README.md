# Profilo

My personal portfolio, designed like a desktop: profile, projects, and links open as draggable windows over an animated sky.

<!-- Add a screenshot: save one as public/screenshot.png and uncomment the line below -->
<!-- ![Profilo screenshot](public/screenshot.png) -->

## Features

- **Desktop-style windows**: each section opens as a draggable window you can bring to the front or close.
- **Live weather sky**: in light mode the background matches the visitor's current weather (clouds, rain, snow, fog, thunderstorms), using their approximate location and falling back to Brooklyn, NY.
- **Dark mode**: a twinkling starry night sky; your choice is remembered between visits.
- **Content from JSON**: profile, experience, skills, projects, and links all live in `data/`, so updating the site doesn't require touching components.

## Tech stack

- [Next.js 16](https://nextjs.org) (App Router) and React 19
- TypeScript
- Tailwind CSS 4
- HTML Canvas for the animated backgrounds
- [Open-Meteo](https://open-meteo.com) for weather and [GeoJS](https://www.geojs.io) for IP-based location (both free, no API key)
- Docker for deployment

## Running locally

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

To preview a specific weather condition, add `?weather=` to the URL with one of `clear`, `cloudy`, `overcast`, `fog`, `drizzle`, `rain`, `snow`, or `thunder`, for example: <http://localhost:3000/?weather=rain>

## Running with Docker

Production (optimized build):

```bash
docker compose up -d --build
```

Development (live reload from your source files):

```bash
docker compose -f docker-compose.dev.yml up
```

Both serve the site on port 3000.

## Updating content

| File | What it controls |
|---|---|
| `data/profile.json` | Name, title, bio, education, avatar, résumé link |
| `data/experience.json` | Work and program experience |
| `data/skills.json` | Skill categories shown in the profile |
| `data/projects.json` | Project cards |
| `data/links.json` | GitHub, LinkedIn, and email links |

The résumé button links to `public/SimonZhengResume.pdf` (set by `resumeUrl` in `data/profile.json`).
