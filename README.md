# CHRONO — Luxury Watch E-Commerce

A production-ready luxury e-commerce platform for premium watches (Rolex-style branding) with a dark gold theme, smooth animations, and full-stack functionality.

## Tech Stack

| Layer      | Technology                |
|-----------|---------------------------|
| Frontend  | Next.js 14 (App Router), Tailwind CSS, Framer Motion, GSAP |
| Backend   | Node.js, Express          |
| Database  | MongoDB (Mongoose)        |
| Auth      | JWT (Login/Register)      |
| Payments  | Razorpay + Stripe         |
| Images    | Cloudinary                |
| State     | Zustand (cart, auth)      |

## Project Structure

```
watch/
├── client/                 # Next.js 14 frontend
│   ├── src/
│   │   ├── app/            # App Router pages & layouts
│   │   ├── components/     # UI components, home sections
│   │   ├── lib/            # API client, types
│   │   └── store/          # Zustand (cart, auth)
│   └── package.json
├── server/                 # Express backend
│   ├── src/
│   │   ├── config/         # DB connection
│   │   ├── models/         # User, Product, Order, Coupon
│   │   ├── middleware/     # auth, errorHandler, upload
│   │   ├── routes/         # auth, products, orders, users, payment, admin
│   │   └── utils/         # cloudinary, email, invoice PDF
│   └── package.json
├── .env.example
└── README.md
```

## Setup

### 1. Environment

- Copy `.env.example` to `server/.env` and set values (MongoDB, JWT, Razorpay, Stripe, Cloudinary, optional SMTP).
- Create `client/.env.local` with:
  - `NEXT_PUBLIC_API_URL=http://localhost:5000/api`
  - `NEXT_PUBLIC_RAZORPAY_KEY_ID` (same as server Razorpay key for checkout)

### 2. Database

- Install and run MongoDB locally or use Atlas.
- Set `MONGODB_URI` in `server/.env`.

### 3. Backend

```bash
cd server
npm install
npm run dev
```

Server runs at `http://localhost:5000`.

### 4. Seed (optional)

```bash
cd server
node src/seed.js
```

Creates:

- Admin user: `admin@chronoluxury.com` / `admin123`
- Sample watches (featured + categories)
- Coupon `WELCOME10` (10% off, min order ₹50k, max discount ₹10k)

### 5. Frontend

```bash
cd client
npm install
npm run dev
```

App runs at `http://localhost:3000`.

## Features

- **Home**: Hero (GSAP zoom), featured watches, categories, brand story, testimonials, footer.
- **Products**: Listing with filters (price, category, model, strap, dial), sort, pagination; detail page with gallery zoom, specs, add to cart / buy now; related products.
- **Cart**: Update quantity, remove, subtotal, GST 18%, grand total.
- **Checkout**: Shipping form, coupon code, order summary, Razorpay/Stripe payment, order confirmation.
- **Auth**: Register, login, JWT; protected dashboard and admin.
- **User dashboard**: Order history, status (Pending / Shipped / Delivered), cancel (if not shipped), invoice PDF download.
- **Admin**: Orders list & update status; products list, add, edit, delete, image upload (Cloudinary); coupons list.
- **Security**: bcrypt passwords, JWT middleware, admin-only routes, validation, error handler.
- **Extras**: Wishlist (API ready), coupon system, stock management, email confirmation (if SMTP set), Razorpay webhook, PDF invoice.

## Design

- Dark luxury theme (black + gold palette).
- Framer Motion: page transitions, staggered list, hover states.
- GSAP: hero slow zoom, text reveal.
- Loader: logo intro on first load.
- Responsive layout for mobile and desktop.

## API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | /api/auth/register | Register |
| POST   | /api/auth/login    | Login |
| GET    | /api/auth/me       | Current user (protected) |
| GET    | /api/products      | List (query: page, limit, sort, category, minPrice, maxPrice, etc.) |
| GET    | /api/products/featured | Featured products |
| GET    | /api/products/:id | Product + related |
| GET    | /api/orders        | User orders (protected) |
| POST   | /api/orders        | Create order (protected) |
| POST   | /api/orders/validate-coupon | Validate coupon |
| GET    | /api/orders/:id/invoice | PDF invoice (protected) |
| POST   | /api/payment/create-order | Create Razorpay/Stripe order (protected) |
| POST   | /api/payment/verify-razorpay | Verify Razorpay (protected) |
| GET    | /api/admin/orders  | All orders (admin) |
| PATCH  | /api/admin/orders/:id/status | Update order status (admin) |
| GET/POST/PUT/DELETE | /api/admin/products | CRUD products (admin) |

## Deployment

- **Backend**: Deploy `server` to a Node host (e.g. Railway, Render). Set env vars and `CLIENT_URL` to your frontend URL.
- **Frontend**: `cd client && npm run build && npm start`, or deploy to Vercel; set `NEXT_PUBLIC_API_URL` to your API URL.
- **MongoDB**: Use Atlas or another managed MongoDB.
- **Razorpay/Stripe**: Use live keys and configure webhooks (Razorpay webhook URL: `https://your-api.com/api/payment/razorpay-webhook`).

## License

MIT.
