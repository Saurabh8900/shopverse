<div align="center">

# 🛒 ShopVerse
### Next-Generation Full-Stack E-Commerce Platform

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.x-47A248?style=flat-square&logo=mongodb)](https://mongodb.com)
[![Express](https://img.shields.io/badge/Express-4.x-000000?style=flat-square&logo=express)](https://expressjs.com)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)

**A production-grade e-commerce web app inspired by Amazon, Flipkart & Myntra**
**— with AI-powered features, real-time updates, and a stunning animated UI.**

[Live Demo](#) · [Report Bug](https://github.com/Saurabh8900/shopverse/issues) · [Request Feature](https://github.com/Saurabh8900/shopverse/issues)

</div>

---

## 📸 Screenshots

| Home Page | Product Page | Cart |
|-----------|-------------|------|
| ![Home](https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400) | ![Product](https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400) | ![Cart](https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400) |

---

## ✨ Features

### 🛍️ Core E-Commerce
- Product listing with filters (category, brand, price, rating, eco score)
- Product detail page with image gallery, size/color variants
- Animated slide-in cart drawer
- Instant search with live product suggestions
- Wishlist with localStorage persistence
- User authentication (JWT)
- Order placement and tracking

### 🚀 Unique Features
| Feature | Description |
|---------|-------------|
| 🤖 AI Style Assistant | Type natural language → get matching products |
| 👥 Group Buy | Buy with friends for group discount via Socket.io |
| 🔔 Price Drop Alerts | Set target price, get email notification |
| 🌿 Eco Score | Sustainability rating on every product |
| 🔄 Try Before Buy | 30-day risk-free return toggle per order |
| 🎯 Mood Shopping | Pick a mood → curated product feed |
| ⚡ Flash Sale Timer | Live countdown on limited deals |
| 📍 Pincode Checker | Real-time delivery date estimate |

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| React 18 + Vite | UI framework + fast dev server |
| Tailwind CSS | Utility-first styling |
| Framer Motion | Page transitions + animations |
| Redux Toolkit | Global state management |
| React Router v6 | Client-side routing |
| Axios | HTTP client |
| React Hot Toast | Notifications |
| Socket.io Client | Real-time features |

### Backend
| Technology | Purpose |
|-----------|---------|
| Node.js + Express | REST API server |
| MongoDB + Mongoose | Database + ODM |
| JWT + bcrypt | Authentication + password hashing |
| Socket.io | Real-time group buy counter |
| Nodemailer | Email notifications |
| Multer | File/image uploads |
| dotenv | Environment config |

---

## 📁 Project Structure

```
shopverse/
├── client/                     # React Frontend (Vite)
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Navbar.jsx
│   │   │   ├── CartDrawer.jsx
│   │   │   ├── SearchOverlay.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   ├── CountdownTimer.jsx
│   │   │   └── Footer.jsx
│   │   ├── pages/              # Route-level pages
│   │   │   ├── HomePage.jsx
│   │   │   ├── ProductsPage.jsx
│   │   │   ├── ProductPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   └── WishlistPage.jsx
│   │   ├── redux/              # State management
│   │   │   ├── store.js
│   │   │   └── slices/
│   │   │       ├── authSlice.js
│   │   │       ├── cartSlice.js
│   │   │       ├── wishlistSlice.js
│   │   │       └── uiSlice.js
│   │   └── utils/
│   │       ├── api.js          # Axios instance + API helpers
│   │       └── helpers.js      # Formatters, debounce, etc.
│   ├── index.html
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/                     # Node.js Backend
│   ├── config/
│   │   └── seed.js             # Database seeder (36 products)
│   ├── controllers/
│   │   ├── productController.js
│   │   └── userController.js
│   ├── middleware/
│   │   └── auth.js             # JWT middleware
│   ├── models/
│   │   ├── Product.js
│   │   ├── User.js
│   │   ├── Order.js
│   │   └── Category.js
│   ├── routes/
│   │   ├── productRoutes.js
│   │   ├── userRoutes.js
│   │   ├── orderRoutes.js
│   │   └── categoryRoutes.js
│   ├── index.js                # Server entry point
│   └── .env                   # Environment variables
│
├── package.json                # Root (concurrently)
├── README.md
└── SETUP.md
```

---

## ⚡ Quick Start

### Prerequisites
- Node.js v18+
- MongoDB (local) or MongoDB Atlas account
- Git

### 1. Clone the repository
```bash
git clone https://github.com/Saurabh8900/shopverse.git
cd shopverse
```

### 2. Install all dependencies
```bash
# Install root + server + client dependencies
npm install
cd server && npm install && cd ..
cd client && npm install && cd ..
```

### 3. Configure environment
```bash
# server/.env is pre-configured for local MongoDB
# For Atlas, edit MONGO_URI in server/.env:
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/shopverse
JWT_SECRET=your_secret_key_here
PORT=5000
CLIENT_URL=http://localhost:5173
```

### 4. Seed the database
```bash
cd server
node config/seed.js
# Output: ✅ Seeded 6 categories, 36 products
# Admin login: admin@shopverse.com / admin123
cd ..
```

### 5. Start development servers
```bash
npm run dev
# Frontend → http://localhost:5173
# Backend  → http://localhost:5000/api
```

---

## 🔌 API Reference

### Products
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/products` | List with filters & pagination | No |
| GET | `/api/products/featured` | Featured products | No |
| GET | `/api/products/flash-sale` | Flash sale products | No |
| GET | `/api/products/:id` | Single product detail | No |
| POST | `/api/products/:id/reviews` | Add review | Yes |
| POST | `/api/products` | Create product | Seller |
| PUT | `/api/products/:id` | Update product | Seller |
| DELETE | `/api/products/:id` | Delete product | Admin |

### Users
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/users/register` | Register new user | No |
| POST | `/api/users/login` | Login → returns JWT | No |
| GET | `/api/users/profile` | Get user profile | Yes |
| PUT | `/api/users/profile` | Update profile | Yes |
| POST | `/api/users/wishlist/:id` | Toggle wishlist item | Yes |
| POST | `/api/users/cart` | Update cart | Yes |

### Orders
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/orders` | Place order | Yes |
| GET | `/api/orders/myorders` | Get my orders | Yes |
| GET | `/api/orders/:id` | Order detail | Yes |

### Query Parameters for `/api/products`
```
?search=nike          # Full-text search (name, brand, tags)
?category=Fashion     # Filter by category name
?brand=Nike,Puma      # Filter by brand (comma-separated)
?minPrice=500         # Minimum price
?maxPrice=5000        # Maximum price
?rating=4             # Minimum rating
?ecoScore=green       # Eco score filter (green/fair/high-impact)
?featured=true        # Featured products only
?flashSale=true       # Flash sale products only
?sort=newest          # Sort (newest/popular/price_asc/price_desc/rating)
?page=1&limit=20      # Pagination
```

---

## 🗄️ Database Schema

```javascript
// Product
{
  name, slug, description, price, discountPrice,
  images: [{ url, public_id }],
  category: ObjectId → Category,
  brand, stock, sold, ratings, numReviews,
  reviews: [{ user, name, rating, comment }],
  colors: [{ name, hex }], sizes: [String],
  tags: [String],
  ecoScore: 'green' | 'fair' | 'high-impact',
  isFeatured, isFlashSale, flashSaleEndsAt,
  groupBuyThreshold, groupBuyDiscount,
  deliveryDays, returnDays
}

// User
{
  name, email, password (hashed),
  role: 'user' | 'seller' | 'admin',
  addresses, wishlist, cart,
  loyaltyPoints, priceAlerts
}

// Order
{
  user, items, shippingAddress,
  paymentMethod, totalPrice,
  status: 'placed'→'delivered',
  tracking: [{ status, timestamp }],
  isTryBeforeBuy, isGroupBuy,
  loyaltyPointsEarned
}
```

---

## 🎯 Learning Outcomes

After building this project I gained hands-on experience with:

- ✅ **REST API Design** — structured endpoints, controllers, middleware separation
- ✅ **MongoDB Schema Design** — relationships, indexing, population
- ✅ **JWT Authentication** — token generation, protected routes, role-based access
- ✅ **React Architecture** — component composition, custom hooks, code splitting
- ✅ **Redux Toolkit** — createSlice, createAsyncThunk, selector patterns
- ✅ **Real-time Communication** — Socket.io rooms, emit/listen events
- ✅ **Animation** — Framer Motion transitions, scroll reveals, micro-interactions
- ✅ **Responsive Design** — mobile-first layouts with Tailwind CSS
- ✅ **Git Workflow** — feature branches, meaningful commits, README documentation
- ✅ **API Security** — CORS, env variables, input validation, error handling

---

## 🗺️ Roadmap

- [x] Product listing + filters
- [x] Cart + wishlist
- [x] JWT authentication
- [x] Order placement
- [x] Flash sale countdown
- [x] Mood shopping
- [x] Group buy (Socket.io)
- [ ] Razorpay payment integration
- [ ] Seller dashboard
- [ ] Admin analytics panel
- [ ] AI chat (OpenAI/Claude API)
- [ ] PWA support
- [ ] Email notifications
- [ ] Deployment (Vercel + Railway)

---

## 👨‍💻 Author

**Saurabh Kumar Singh**

- 🎓 B.Tech CSE — Lovely Professional University, Punjab
- 💼 LinkedIn: [linkedin.com/in/saurabhkumarsingh31](https://linkedin.com/in/saurabhkumarsingh31)
- 🐙 GitHub: [github.com/Saurabh8900](https://github.com/Saurabh8900)
- 📧 Email: saurabhsingh200331@gmail.com

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<div align="center">
⭐ If you found this project helpful, please give it a star!<br/>
It helps others discover it and motivates me to keep building.
</div># shopverse
Full-stack e-commerce platform built with React, Redux Toolkit, Node.js, Express, and MongoDB. Features include product browsing, shopping cart, wishlist, user authentication, order management, and real-time group buy countdown timers. Responsive design with Tailwind CSS.
