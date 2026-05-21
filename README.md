# CampNest

CampNest is a full-stack web app that Helps campers navigating around country with various campsites,reviews,ratings etc..It is built with **Node.js, Express, Passport (local auth), and MongoDB (Mongoose)**.
It includes:

- Campsites: post and browse campsites, add reviews + ratings
- Stories: long-form blog stories
- Auth: register/login/logout with sessions

## Prerequisites

- Node.js (LTS recommended)
- MongoDB + mongosh (you already installed these)

## 1) Configure environment variables

This repo uses `dotenv`. Create a `.env` file in the project root (same level as `app.js`).

Copy from `env.example`:

```bash
cp env.example .env
```

Then edit `.env` and set a strong `SESSION_SECRET`.

## 2) Start MongoDB

Depending on how MongoDB was installed, start the MongoDB server (`mongod`) using your system service manager.

To verify Mongo is reachable, run:

```bash
mongosh
```

Then inside mongosh:

```javascript
show dbs
```

## 3) Install dependencies (if needed)

```bash
npm install
```

## 4) Run the app

```bash
npm start
```

Open:

- `http://localhost:3000`

## (Optional) Add demo data

This will wipe existing CampNest data in your `campnest` database and insert demo users, camps, stories, and reviews:

```bash
npm run seed
```

## Notes

- Default DB: `mongodb://127.0.0.1:27017/campnest` (from `.env`)
- Image uploads are saved to `public/uploads/` and served at `/uploads/...`
- If you want to host later (Render/Railway/etc.), set `MONGODB_URI`, `SESSION_SECRET`, and `PORT` in the host's environment settings.

