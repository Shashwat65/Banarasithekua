# Banarasi Thekua — Vite + React + Tailwind

A handcrafted e‑commerce frontend built with Vite, React, TypeScript, TailwindCSS and shadcn/ui.

## Getting started

Prerequisites:

Steps:
1. Install dependencies: npm i
2. Configure environment variables (see committed `.env` for production-ready defaults). No external DB required — uses file-based JSON under `./data`.
3. Run the app: npm run dev

## Tech stack
- Vite + React 18 + TypeScript
- TailwindCSS + shadcn/ui (Radix UI)
- Express API (file-based JSON store)

## Build

## License
Proprietary — All rights reserved.

## Development

### Storage (no external database)

This project no longer uses MongoDB. A simple file-based JSON store is used for persistence during development. Data is written to the `data/` directory at the project root with one file per collection (e.g., `data/users.json`, `data/products.json`).

You can safely delete the `data/` folder to reset local data.
