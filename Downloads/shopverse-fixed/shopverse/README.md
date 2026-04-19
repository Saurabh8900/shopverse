# 🛒 ShopVerse — Full Stack E-Commerce Platform

> Next-gen e-commerce inspired by Amazon, Flipkart & Myntra with **unique AI-powered features**.

---

## 🚀 Tech Stack

| Layer     | Tech                                      |
|-----------|-------------------------------------------|
| Frontend  | React 18 + Vite + Tailwind CSS + Framer Motion |
| Backend   | Node.js + Express.js                      |
| Database  | MongoDB + Mongoose                        |
| Auth      | JWT (access tokens)                       |
| Realtime  | Socket.io (Group Buy live counter)        |
| State     | Redux Toolkit                             |
| Payments  | Razorpay / Stripe (config ready)          |
| Images    | Cloudinary                                |

---

## ✨ Unique Features

| Feature              | Description                                              |
|----------------------|----------------------------------------------------------|
| 🤖 AI Style Assistant | Chat widget to find products by natural language         |
| 👥 Group Buy          | Buy with friends to unlock extra discount (Socket.io)   |
| 🔔 Price Drop Alerts  | Email when wishlist items drop in price                  |
| 🌿 Eco Score          | Sustainability rating on every product                   |
| 🔄 Try Before You Buy | Mark order as return-friendly, 30-day no-questions return|
| 🎯 Mood Shopping      | Pick a mood → curated product feed                       |
| 📍 Pincode Checker    | Real-time delivery date & shipping cost estimate         |
| ⚡ Flash Sale Timer   | Live countdown on deal products                          |

---

## 📁 Project Structure

```
shopverse/
├── client/                   # React frontend (Vite)
│   ├── src/
│   │   ├── components/       # Navbar, CartDrawer, SearchOverlay, ProductCard...
│   │   ├── pages/            # HomePage, ProductsPage, ProductPage, LoginPage...
│   │   ├── redux/            # Store + slices (auth, cart, wishlist, ui)
│   │   └── utils/            # API helper, helpers
│   └── package.json
├── server/                   # Express backend
│   ├── controllers/          # productController, userController
│   ├── models/               # Product, User, Order, Category
│   ├── routes/               # API routes
│   ├── middleware/            # auth.js (JWT protect)
│   ├── config/seed.js        # DB seeder
│   └── index.js              # Entry point
└── package.json              # Root with concurrently
```

---

## ⚡ Quick Start

### 1. Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### 2. Clone & Install

```bash
# Install all dependencies (root + server + client)
npm run install-all
```

### 3. Configure environment

```bash
cd server
cp .env.example .env    # (or edit .env directly)
```

Edit `server/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/shopverse
JWT_SECRET=your_super_secret_key
CLIENT_URL=http://localhost:5173
```

### 4. Seed the database

```bash
cd server
node config/seed.js
```

This creates:
- ✅ 6 categories
- ✅ 10 realistic products
- ✅ Admin account: `admin@shopverse.com` / `admin123`

### 5. Run dev servers

```bash
# From root directory — starts both frontend & backend
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api

---

## 🔌 API Endpoints

### Products
| Method | Endpoint                    | Description          |
|--------|-----------------------------|----------------------|
| GET    | /api/products               | List with filters    |
| GET    | /api/products/featured      | Featured products    |
| GET    | /api/products/flash-sale    | Flash sale products  |
| GET    | /api/products/:id           | Single product       |
| POST   | /api/products/:id/reviews   | Add review (auth)    |
| POST   | /api/products               | Create (seller/admin)|

### Users
| Method | Endpoint                    | Description          |
|--------|-----------------------------|----------------------|
| POST   | /api/users/register         | Register             |
| POST   | /api/users/login            | Login → JWT          |
| GET    | /api/users/profile          | Get profile (auth)   |
| PUT    | /api/users/profile          | Update profile (auth)|
| POST   | /api/users/wishlist/:id     | Toggle wishlist      |
| POST   | /api/users/cart             | Update cart          |

### Orders
| Method | Endpoint                    | Description          |
|--------|-----------------------------|----------------------|
| POST   | /api/orders                 | Create order (auth)  |
| GET    | /api/orders/myorders        | My orders (auth)     |
| GET    | /api/orders/:id             | Order details        |

---

## 🎨 Design System

- **Font**: Clash Display (headings) + Satoshi (body)
- **Colors**: Brand pink `#ff1a7f` + Cyan `#00e5ff` + Purple `#7c3aed`
- **Theme**: Dark glassmorphism with animated mesh gradients
- **Animations**: Framer Motion page transitions + CSS keyframes

---

## 📅 Next Steps (Phase 2)

- [ ] Checkout page with Razorpay integration
- [ ] Seller dashboard (add/edit products, analytics)
- [ ] AI chat widget (OpenAI / Claude API)
- [ ] Live order tracking map
- [ ] Admin dashboard
- [ ] PWA support
- [ ] Email notifications (Nodemailer)
- [ ] Google OAuth

---

## 🤝 Built With

Saurabh Kumar Singh — Full Stack Developer
- GitHub: [@Saurabh8900](https://github.com/Saurabh8900)
- LinkedIn: [saurabhkumarsingh31](https://www.linkedin.com/in/saurabhkumarsingh31/)
