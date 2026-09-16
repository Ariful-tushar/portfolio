---
title: Flower Garden — Role-Based E-Commerce Platform
date: 2021-11-25
summary: A full-stack MERN flower-shop platform with email/password auth, real role-based admin access, a Material UI dashboard, product management, order tracking, and customer reviews — a step up from my earliest projects toward proper role-based access control.
tech: [React, Material UI, React Router, Firebase Auth, Node.js, Express, MongoDB, React Hook Form]
github: https://github.com/Ariful-tushar/flower-garden-client
demo: https://flower-garden-403eb.web.app/
featured: false
cover: cover.png
gallery: [login.png]
---

**Client repo:** github.com/Ariful-tushar/flower-garden-client
**Server repo:** github.com/Ariful-tushar/flower-garden-server
**Role:** Solo developer (frontend, backend, and deployment)
**Type:** Full-stack learning project — role-based e-commerce platform

---

## Overview

Flower Garden is a full-stack MERN e-commerce platform for browsing and ordering flowers, built shortly after Travel Taker as a step up in complexity: instead of every signed-in user seeing the same admin links, this one has a real `admin` role stored per-user in MongoDB, a dedicated `AdminRoute` guard on the client, and a Material UI dashboard with a persistent sidebar that shows a completely different set of links depending on whether the signed-in user is a regular customer or an admin.

**A note on the live demo:** like Travel Taker, the frontend is still live on Firebase Hosting, but the Express/MongoDB API was deployed on Heroku's free tier, which Heroku retired in November 2022 — so the backend is no longer running. The homepage hero and the login screen still render correctly (see the screenshots below), but the product catalogue, dashboard data, and admin actions won't load live since there's no API behind them anymore. Both repos — client and server — are unchanged and available in full at the links above.

---

## Key Features

- **Email/password authentication** via Firebase Auth, with new users written to a `users` collection in MongoDB on registration.
- **Real role-based access control** — an `AdminRoute` guard checks both that a user is signed in *and* that their stored role is `admin` before allowing access to admin-only pages, redirecting everyone else.
- **Material UI dashboard** with a persistent sidebar (temporary/collapsible on mobile, permanent on desktop) that renders a different navigation set for admins (Manage All Orders, Manage All Products, Add New Product, Make Admin) versus customers (Pay, My Orders, Review).
- **Product catalogue** — an Explore page listing all flowers pulled from MongoDB, plus an admin-only Add Product form and a Manage All Products view with delete/update.
- **Order lifecycle** — customers place orders and track "My Orders"; admins see every order across all customers in Manage All Orders and can update order status.
- **Customer reviews** — a star-rating review form (`react-rating`) that posts to a `reviews` collection, shown on the homepage.
- **Make Admin panel** — lets an existing admin promote another user's account to admin by email.

---

## How It Works

1. **Register / sign in** — Firebase email/password auth; new accounts are also saved to a `users` collection via `POST /users`.
2. **Admin check** — on every auth state change, the client calls `GET /users/:email`, and the server checks that user's stored `role` field to decide whether to grant admin UI access.
3. **Browse & order** — the Explore page lists all flowers from `GET /flowers`; placing an order posts to `POST /orders` tied to the signed-in user's email.
4. **Customer dashboard** — "My Orders" fetches only that user's orders (`GET /orders?email=...`); "Review" posts a rating and comment to `POST /reviews`.
5. **Admin dashboard** — "Manage All Orders" lists every order (`GET /orders`) with status updates (`PUT /orders/:id`); "Manage All Products" and "Add New Product" cover the catalogue (`POST /flowers`, `DELETE /flowers/:id`); "Make Admin" promotes another user via `PUT /users/makeadmin`.

---

## Tech Stack & Skills Demonstrated

**Frontend**
React 17 · React Router v5 (role-gated private routes) · Material UI (MUI v5) · Emotion · React Hook Form · `react-rating` · `react-material-ui-carousel` · Font Awesome

**Backend**
Node.js · Express · MongoDB (native driver, Atlas-hosted) · CORS · dotenv-based config

**Auth & deployment**
Firebase Authentication (email/password) · Firebase Hosting (client) · Heroku (API, since retired)

**Engineering practice**
Role-based access control with a dedicated route guard · a five-collection MongoDB schema (flowers, orders, reviews, users, and role data) · a responsive dashboard shell shared between two different user-facing views · REST API design across multiple related resources

---

## Project Structure

```
flower-garden-client/
├── src/
│   ├── Pages/
│   │   ├── Home/               # Banner, product grid, reviews
│   │   ├── Explore/             # Full product catalogue
│   │   ├── Login/                # Firebase config, Login, Register, PrivateRoute, AdminRoute
│   │   ├── Purchase/             # Order placement
│   │   ├── DashBoard/
│   │   │   ├── DashBoard/        # MUI sidebar shell, role-based nav
│   │   │   ├── AddProduct/       # Admin: add flower
│   │   │   ├── ManageAllProducts/# Admin: edit/delete flowers
│   │   │   ├── ManageAllOrders/  # Admin: all-orders view
│   │   │   ├── MakeAdmin/        # Admin: promote a user
│   │   │   ├── Myorders/         # Customer: own orders
│   │   │   ├── GiveReview/       # Customer: star-rating review form
│   │   │   └── Payment/          # Placeholder — payment gateway not implemented
│   │   └── Shared/                # Navigation, Footer
│   ├── Context/                   # Firebase auth context provider
│   └── Hooks/                     # useFirebase, useAuth

flower-garden-server/
└── index.js                        # Express app — flowers, orders, reviews, users endpoints
```

---

## Reflection

Compared to Travel Taker, this project's route-guarding is real — `AdminRoute` actually checks a stored role, not just whether someone is logged in. That said, the server-side `/users/makeadmin` endpoint has no auth check of its own (the guard only exists in the React app), so anyone who found the API directly could call it — the kind of gap that's obvious in hindsight and exactly why authorization has to be enforced server-side, not just hidden in the UI. The Payment page was also never finished — it's a "coming soon" placeholder rather than a real gateway integration. I'm keeping this one in the portfolio alongside Travel Taker because together they show the progression from "any logged-in user can reach admin pages" to "a dedicated role check gates them," even though neither one enforces that check on the server.
