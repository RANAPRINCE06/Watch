# Quick Fix Guide - CHRONO Website

## Issues Found & Fixed:
✅ Missing .env files - CREATED
✅ Missing dependencies - Need to install
✅ MongoDB not configured - Need to setup

## Quick Start (3 Steps):

### Step 1: Install MongoDB
Choose ONE option:

**Option A: Local MongoDB (Recommended for development)**
1. Download: https://www.mongodb.com/try/download/community
2. Install with default settings
3. MongoDB will run automatically on: mongodb://localhost:27017

**Option B: MongoDB Atlas (Cloud - Free)**
1. Sign up: https://www.mongodb.com/cloud/atlas/register
2. Create free cluster
3. Get connection string
4. Update `server/.env` → Replace MONGODB_URI with your Atlas connection string

### Step 2: Install Dependencies & Seed Database
Double-click: `setup.bat`

This will:
- Install all server packages
- Install all client packages  
- Seed sample data (admin user, watches, coupons)

### Step 3: Start the Application
Double-click: `start-dev.bat`

This opens 2 windows:
- Server: http://localhost:5000
- Client: http://localhost:3000

## Default Login:
- Email: admin@chronoluxury.com
- Password: admin123

## If You Get Errors:

### "MongoDB connection failed"
- Make sure MongoDB is running
- Check MONGODB_URI in server/.env

### "Port 3000/5000 already in use"
- Close other apps using these ports
- Or change PORT in server/.env

### "Module not found"
- Run: `cd server && npm install`
- Run: `cd client && npm install`

## Payment Setup (Optional):
To enable payments, update in both files:
- `server/.env` → Add real Razorpay/Stripe keys
- `client/.env.local` → Add real Razorpay/Stripe public keys

Get keys from:
- Razorpay: https://razorpay.com
- Stripe: https://stripe.com

## Need Help?
Check the main README.md for full documentation.
