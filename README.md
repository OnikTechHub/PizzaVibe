# 🍕 PizzaVibe - Artisan Pizza Delivery & Custom Builder

> **OIBSIP Level 3 Task 1** | Developed by **Onik Das**  
> A full-stack real-time artisan pizza delivery and interactive 4-step custom pizza builder platform.

---

## 🚀 Overview

**PizzaVibe** is a pizza delivery platform engineered for taste, customization, and real-time tracking:
- **Interactive 4-Step Culinary Studio**: Custom crust selection (48-hr cold fermented sourdough), gourmet hand-ladled sauces, imported cheeses, and fresh farm-cut toppings with instant live price calculation.
- **Chef Signature Favorites**: Handcrafted artisan pies baked at 800°F with rapid oven-to-door dispatch within 30 minutes.
- **Cohesive Light Design**: Modern responsive UI engineered with Next.js 15 App Router, Tailwind CSS, and Lucide icons.
- **Robust Backend**: Node.js, Express, MongoDB with Mongoose, JWT authentication, and Razorpay payment integration.

---

## 📂 Project Architecture

```
PizzaVibe/
├── client/                     # Next.js 15 App Router Frontend
│   ├── src/
│   │   ├── app/                # Next.js App Router (page.tsx, layout.tsx, builder/)
│   │   └── components/         # Navbar, Hero, HeroAnimation, Features, FeaturedPizzas, Footer
│   ├── .env.local              # Client environment variables (ignored by git)
│   └── package.json
│
├── server/                     # Express & Node.js Backend API
│   ├── src/
│   │   ├── config/             # MongoDB connection (db.ts)
│   │   ├── models/             # User, Inventory, Pizza, Order schemas
│   │   ├── routes/             # Auth, Inventory, Pizza, Order, Admin routes
│   │   └── scripts/            # Database seeder (seed.ts)
│   ├── .env                    # Server environment variables (ignored by git)
│   └── package.json
│
├── .gitignore                  # Production-grade root gitignore
└── README.md                   # Project documentation
```

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (React 19), Tailwind CSS, Lucide React, React Hot Toast
- **Backend**: Express 5, TypeScript, Node.js
- **Database**: MongoDB (via Mongoose)
- **Authentication**: JWT (JSON Web Tokens), bcryptjs password hashing
- **Payments**: Razorpay Node SDK
- **Styling & Assets**: Tailwind CSS, CSS Animations, SVG Assets

---

## ⚙️ Installation & Setup

### 1. Prerequisites
- Node.js (v18+)
- MongoDB running locally or MongoDB Atlas connection URI

### 2. Server Setup
```bash
cd server
npm install

# Run database seeder
npm run seed

# Start development server
npm run dev
# Server runs at http://localhost:5000
```

### 3. Client Setup
```bash
cd client
npm install

# Start Next.js frontend
npm run dev
# App opens at http://localhost:3000
```

---

## 🔒 Security & Deployment Notes

- All `.env` and sensitive secret keys are strictly ignored by `.gitignore`.
- Designed for 1-click cloud deployments on **Vercel** (client) and **Render / Railway / Heroku** (server). Set runtime environment variables directly in their respective deployment dashboards.

---

## 📄 License
This project is licensed under the MIT License.
