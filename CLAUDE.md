# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project context

Starter project for a Claude Code course: a React expense tracker that **intentionally** ships with a bug, poor UI, and messy code, all meant to be fixed over the course. Expect to find and fix problems rather than preserve existing patterns.

## Commands

```bash
npm install       # install dependencies
npm run dev       # Vite dev server (default http://localhost:5173; moves to the next free port if taken)
npm run build     # production build to dist/
npm run preview   # serve the production build
npm run lint      # ESLint (flat config in eslint.config.js)
```

There is no test framework configured.

## Architecture

- React 19 + Vite 7, plain JavaScript/JSX (no TypeScript). Entry: `index.html` → `src/main.jsx` → `src/App.jsx` (rendered in `StrictMode`).
- The entire app is a single component in `src/App.jsx`: seed transactions, the add-transaction form, summary totals (income / expenses / balance), and the filterable transaction table all live there, with state held in `useState` hooks. There is no persistence; data resets on reload.
- Styles: `src/index.css` (global) and `src/App.css` (app classes such as `.summary-card`, `.income-amount`, `.expense-amount`).
- A transaction has the shape `{ id, description, amount, type: "income" | "expense", category, date: "YYYY-MM-DD" }`. Categories are a hard-coded array in `App.jsx`.
- `amount` is stored as a **string** (both in the seed data and from the form input), while totals are computed with `reduce((sum, t) => sum + t.amount, 0)`. That concatenates strings instead of adding numbers, so keep it in mind when touching totals or amounts.

## Lint notes

`no-unused-vars` ignores identifiers that start with an uppercase letter or `_` (`varsIgnorePattern: '^[A-Z_]'`). The react-hooks and react-refresh (Vite) rule sets are enabled.
