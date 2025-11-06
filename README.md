# falgenie

FalGenie is a single-page, AI-assisted tarot application. Users draw a card, receive a concise four-part reading (General, Love, Career, Health), and continue a chat that is constrained strictly to that card’s symbolism. The UI features an animated hero, a “mystic draw” interaction, and a dark, brand-consistent theme.

Tech stack:

Frontend: React, Vite, TypeScript, Tailwind CSS, Framer Motion, shadcn/ui

Backend: Bun + Express, OpenAI (GPT-4o-mini)

Deployment: Frontend at falgenie.com on AWS S3 + CloudFront; Backend API on Render





To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.3.1. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.
