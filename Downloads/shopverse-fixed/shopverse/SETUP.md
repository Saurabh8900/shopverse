# ⚡ ShopVerse — Quick Setup Guide (Windows)

## Step 1 — Install dependencies

Open PowerShell in the `shopverse` folder, then run each command one at a time:

```powershell
npm install
```
```powershell
cd server
npm install
cd ..
```
```powershell
cd client
npm install
cd ..
```

## Step 2 — Configure environment

The `server/.env` file is already included with defaults for local MongoDB.
If you're using MongoDB Atlas, replace the `MONGO_URI` line:

```
MONGO_URI=mongodb+srv://youruser:yourpass@cluster.mongodb.net/shopverse
```

## Step 3 — Seed the database

```powershell
cd server
node config/seed.js
cd ..
```

Expected output:
```
✅ MongoDB connected
🌱 Seeding...
✅ Seeded: 6 categories, 10 products
👤 Admin: admin@shopverse.com / admin123
```

## Step 4 — Run the app

```powershell
npm run dev
```

This starts:
- 🖥️  Frontend → http://localhost:5173
- 🔌  Backend  → http://localhost:5000/api

---

## ❓ Troubleshooting

| Problem | Fix |
|---------|-----|
| `EADDRINUSE` port 5000 | Change `PORT=5001` in `server/.env` |
| MongoDB connection error | Make sure MongoDB is running locally OR update `MONGO_URI` to Atlas |
| `concurrently` not found | Run `npm install` in the root folder |
| Blank page on frontend | Check browser console — usually a CORS or API url issue |
| `require is not defined` | Server needs `"type":"module"` in package.json (already set) |

---

## 🗂️ What each folder does

```
shopverse/
├── client/        ← React app (run: cd client && npm run dev)
├── server/        ← Express API (run: cd server && npm run dev)
├── server/.env    ← Your secret config (DO NOT commit to git)
└── README.md      ← Full documentation
```

## 🔑 Default Login

| Field    | Value                      |
|----------|----------------------------|
| Email    | admin@shopverse.com        |
| Password | admin123                   |
| Role     | admin                      |
