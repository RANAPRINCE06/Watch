# Deploy to GitHub - Commands

## Step 1: Commit Your Changes
```bash
git add .
git commit -m "Setup environment and deployment configs"
```

## Step 2: Push to GitHub

### If repository already exists on GitHub:
```bash
git push origin main
```

### If new repository (first time):
```bash
# Create repo on GitHub first, then:
git remote add origin https://github.com/YOUR_USERNAME/chrono-luxury.git
git branch -M main
git push -u origin main
```

## Step 3: Deploy Backend (Render - Free)

1. Go to: https://render.com (Sign up free)
2. Click "New +" → "Web Service"
3. Connect your GitHub repo
4. Configure:
   - **Name**: chrono-luxury-api
   - **Root Directory**: server
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node
5. Add Environment Variables (click "Advanced"):
   ```
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=chrono-luxury-jwt-secret-key-2024
   CLIENT_URL=https://your-frontend-url.vercel.app
   RAZORPAY_KEY_ID=rzp_test_xxxx
   RAZORPAY_KEY_SECRET=your_secret
   STRIPE_SECRET_KEY=sk_test_xxxx
   CLOUDINARY_CLOUD_NAME=your_cloud
   CLOUDINARY_API_KEY=your_key
   CLOUDINARY_API_SECRET=your_secret
   ```
6. Click "Create Web Service"
7. Copy your API URL (e.g., https://chrono-luxury-api.onrender.com)

## Step 4: Deploy Frontend (Vercel - Free)

1. Go to: https://vercel.com (Sign up free)
2. Click "Add New" → "Project"
3. Import your GitHub repo
4. Configure:
   - **Framework**: Next.js
   - **Root Directory**: LEAVE EMPTY (use root)
   - **Build Command**: `cd client && npm install && npm run build`
   - **Output Directory**: `client/.next`
   - **Install Command**: `cd client && npm install`
5. Add Environment Variables:
   ```
   NEXT_PUBLIC_API_URL=https://chrono-luxury-api.onrender.com/api
   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxx
   NEXT_PUBLIC_STRIPE_KEY=pk_test_xxxx
   ```
6. Click "Deploy"
7. Your site will be live at: https://your-project.vercel.app

**If you get 404 error:**
- Go to Project Settings → General
- Set Root Directory to: `client`
- Redeploy

## Step 5: Setup MongoDB Atlas (Free)

1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Create free M0 cluster
3. Create database user
4. Whitelist IP: 0.0.0.0/0 (allow all)
5. Get connection string
6. Update MONGODB_URI in Render environment variables

## Step 6: Seed Production Database

After deployment, run seed via Render:
1. Go to your Render service
2. Click "Shell" tab
3. Run: `node src/seed.js`

## Quick Deploy Commands (Copy & Paste):

```bash
# 1. Commit everything
git add .
git commit -m "Deploy CHRONO luxury watch e-commerce"

# 2. Push to GitHub
git push origin main

# 3. Then deploy on Render + Vercel (use web interface)
```

## Your Live URLs Will Be:
- Frontend: https://chrono-luxury.vercel.app
- Backend: https://chrono-luxury-api.onrender.com
- Admin: https://chrono-luxury.vercel.app/admin

## Default Login:
- Email: admin@chronoluxury.com
- Password: admin123

## Notes:
- Render free tier: API sleeps after 15 min inactivity (wakes in ~30s)
- Vercel free tier: Unlimited bandwidth
- MongoDB Atlas free tier: 512MB storage
- All completely FREE for demo/portfolio!
