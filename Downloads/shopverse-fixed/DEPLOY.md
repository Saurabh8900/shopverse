# 🚀 ShopVerse Deployment Guide

## Prerequisites

- **Node.js** 18+ installed
- **MongoDB** (local or MongoDB Atlas)
- **Git** for version control

---

## Step 1: Environment Configuration

### Server (.env)

Edit `server/.env` with your production values:

```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/shopverse
JWT_SECRET=your_secure_random_secret_min_32_chars
JWT_EXPIRE=30d
CLIENT_URL=https://your-frontend.vercel.app
```

### Optional Services (if using)

- **Cloudinary**: For image uploads
- **Email**: Configure SMTP for order notifications
- **Razorpay**: For payment processing

---

## Step 2: Deploy to Render.com (Recommended - Free)

### Backend Deployment

1. Push your code to GitHub
2. Go to [Render.com](https://render.com) → Create Web Service
3. Connect your GitHub repo
4. Configure:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js`
5. Add Environment Variables from your `.env`
6. Deploy

### Frontend Deployment

1. Go to [Vercel.com](https://vercel.com) → Add New Project
2. Import your GitHub repo
3. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
4. Add Environment Variable:
   - `VITE_API_URL=https://your-render-backend.onrender.com/api`
5. Deploy

---

## Step 3: MongoDB Atlas Setup (if not using local)

1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create free cluster → Create Database User
3. Network Access → Allow IP `0.0.0.0/0`
4. Get connection string → Replace in `server/.env`

---

## Step 4: Verify Deployment

After deployment:
1. Test health endpoint: `https://your-backend.onrender.com/api/health`
2. Open frontend and verify:
   - Products load
   - User registration/login works
   - Cart functionality works

---

## Quick Commands

```powershell
# Install all dependencies
npm install
cd server && npm install && cd ..
cd client && npm install && cd ..

# Build client for production
cd client
npm run build

# Run server locally
cd server
npm start
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| CORS errors | Update `CLIENT_URL` in server/.env |
| MongoDB connection | Check MONGO_URI format |
| API not found | Ensure VITE_API_URL is set in Vercel |
| Images not loading | Configure Cloudinary or use base64 |

---

## Project Structure

```
shopverse-fixed/
├── client/          # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── redux/
│   │   └── utils/
│   └── vite.config.js
├── server/          # Express.js backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   └── index.js
└── .env             # Environment variables
```