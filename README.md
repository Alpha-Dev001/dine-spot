# Tableau Restaurant Management System

A full‑stack **restaurant reservation and management** web application built with **React + Vite** (frontend) and **Express + TypeScript** (backend).  It provides:

- **Landing**, **Sign‑In**, **Onboarding**, **Dashboard**, and **Discover** views for guests and owners.
- Real‑time booking, live activity feed, and owner‑only dashboard.
- A small REST API (restaurants, bookings, activities, owners) powered by MongoDB.

---

## Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Development Environment](#running-the-development-environment)
- [Available Scripts](#available-scripts)
- [Features Overview](#features-overview)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/dine-spot.git
cd dine-spot

# Install dependencies for both frontend and backend (root package.json handles both)
npm install
```

## Configuration

Create a `.env` file at the project root (a sample is provided in `.env.example`). At minimum you need:

```env
# Backend
MONGODB_URI=mongodb://localhost:27017/tableau
PORT=5000

# Frontend (Vite)
VITE_API_URL=http://localhost:5000
```

> **Note** – The backend uses MongoDB. Make sure a MongoDB instance is running locally or provide a remote connection string.

---

## Running the Development Environment

Two processes are required – one for the frontend and one for the backend:

```bash
# Terminal 1 – Frontend (Vite)
npm run dev   # Vite dev server runs on http://localhost:3000

# Terminal 2 – Backend (Express)
npm run server:dev   # Uses tsx to watch TypeScript files
```

Open `http://localhost:3000` in your browser to explore the UI.

---

## Available Scripts

| Script | Description |
|--------|-------------|
| `dev` | Starts the Vite development server (frontend). |
| `build` | Produces a production bundle in `dist/`. |
| `preview` | Serves the production bundle locally. |
| `clean` | Removes `dist/` and compiled server files. |
| `lint` | Runs TypeScript type‑checking (`tsc --noEmit`). |
| `server:dev` | Starts the backend with live reload (`tsx watch server/src/index.ts`). |
| `server:build` | Compiles the backend TypeScript to JavaScript (`tsc -p server/tsconfig.json`). |
| `seed` | Populates the database with sample restaurants, bookings and activities. |

---

## Features Overview

- **LandingView** – Showcase a list of restaurants with quick navigation.
- **SignInView** – Owner authentication (email / password).
- **OnboardingView** – Owner creates the first restaurant and baseline data.
- **DashboardView** – Owner can see live bookings, activities, and manage restaurant info.
- **DiscoverView** – Guest can browse restaurants and make bookings.
- **Real‑time Activity Feed** – Each action (booking, status change, onboarding) appears as a live activity.
- **REST API** – Simple CRUD routes for restaurants, bookings, activities, and owner accounts.
- **MongoDB Persistence** – Data stored in a single `tableau` database.
- **TypeScript** – Full type safety on both client and server.

---

## API Endpoints

The server is mounted at `/api`.

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/restaurants` | List all restaurants. |
| `POST` | `/restaurants` | Create a new restaurant (used during onboarding). |
| `GET` | `/bookings` | List all bookings. |
| `POST` | `/bookings` | Create a new booking. |
| `PATCH` | `/bookings/:id/status` | Update a booking’s status (`seated`, `confirmed`, `arriving`, `canceled`). |
| `GET` | `/activities` | Retrieve the live activity feed. |
| `POST` | `/activities` | Add a new activity (used by the client). |
| `POST` | `/owners/signup` | Register a new owner account. |
| `POST` | `/owners/login` | Authenticate an owner (returns the stored account). |
| `PATCH` | `/owners/:email` | Update owner profile / authentication flag. |

All endpoints expect and return JSON.  Errors are handled by the global `errorHandler` middleware.

---

## Contributing

Contributions are welcome! Follow these steps:

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/awesome-feature`).
3. Install dependencies (`npm install`).
4. Make your changes and ensure the TypeScript compiler passes (`npm run lint`).
5. Add tests if applicable and run them.
6. Submit a pull request.

Please keep the code style consistent – the project uses Prettier via the Vite‑React plugin and `eslint` for linting.

---

## License

MIT License © 2026 Your Name (or organization).

---

## Contact

**Author**: Your Name – <you@example.com>  
**GitHub**: https://github.com/yourusername/tableau-restaurant  
**Demo**: (optional link to a live deployment)

---

*This README was generated and populated with real project information. Replace placeholder values (GitHub URL, author name, etc.) with your actual details before the first commit.*
