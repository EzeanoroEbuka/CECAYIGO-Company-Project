# CeC Ayigo - E-Commerce Platform

A modern, full-stack e-commerce web application built for **CeC Ayigo** (electronics, electrical equipment, and home tech retail). The platform features a customer-facing storefront, an order placement pipeline with WhatsApp integration, an embedded Dialogflow AI support chatbot, and a secure administration portal.

---

## Table of Contents
1. [Tech Stack](#tech-stack)
2. [Key Features](#key-features)
3. [Directory Structure](#directory-structure)
4. [Step-by-Step Firebase Setup Guide (Beginner Friendly)](#step-by-step-firebase-setup-guide)
5. [Environment Variables Configuration](#environment-variables-configuration)
6. [Running the Application Locally](#running-the-application-locally)
7. [Admin Access & Setup](#admin-access--setup)
8. [Scripts Reference](#scripts-reference)

---

## Tech Stack

- **Frontend & Server Framework**: [Next.js 14.2](https://nextjs.org/) (Pages Router), React 18, TypeScript 5
- **Styling & UI**: [Tailwind CSS 3.4](https://tailwindcss.com/), Radix UI Primitives, Lucide React Icons, Framer Motion
- **Database & Backend Services**: 
  - Client: Firebase SDK v11 (Firestore, Auth, Storage, Realtime Database)
  - Server: `firebase-admin` v13 (Server-side Next.js API endpoints)
- **Customer Support AI**: Google Dialogflow Messenger ("Ask Ayigo")
- **Analytics & Marketing**: Google Analytics 4 (GA4), TikTok Pixel, OpenWidget
- **Hosting & Process Management**: Vercel configuration (`vercel.json`) & PM2 (`ecosystem.config.js`)

---

## Key Features

- **Storefront & Product Catalog**:
  - Hero banner with promotional highlights and product categories.
  - Interactive product search, category filtering, and product details with image galleries.
- **Cart & Order Flow**:
  - Global shopping cart managed through `CartContext`.
  - Checkout form capturing customer delivery information.
  - Dual-action ordering: writes order records directly to Firestore (`orders` collection) and generates an instant one-click WhatsApp message formatted with Nigerian Naira (`₦`) totals.
  - Post-purchase confirmation page (`/order-success`).
- **Interactive AI Support**:
  - Integrated Dialogflow widget ("Ask Ayigo") floating on all pages for customer assistance.
- **Admin Management Portal (`/admin`)**:
  - Admin login with email/password authentication.
  - Metrics dashboard (Total Products, Total Orders, Revenue, Customers).
  - Product catalog management (create, edit, delete, mark featured).
  - Blog post CMS (create, edit, publish news & guides).
  - Customer order status tracking and review.

---

## Directory Structure

```
cec_ayigo_website/
├── public/                 # Static assets (images, logos, favicon)
│   └── image/cec.png       # CeC brand logo
├── src/
│   ├── components/
│   │   ├── admin/          # Admin-specific UI components
│   │   ├── home/           # Homepage components (HeroSection, Categories, FeaturedProducts)
│   │   ├── layout/         # Header, Footer, Layout wrapper, and Dialogflow Chatbot
│   │   └── ui/             # Radix + Tailwind reusable components (button, card, dialog, etc.)
│   ├── contexts/           # CartContext, ThemeContext, WishlistContext
│   ├── lib/
│   │   ├── firebase.ts     # Client Firebase SDK initialization
│   │   └── firebase-admin.ts # Server-side Firebase Admin SDK initialization
│   ├── pages/
│   │   ├── _app.tsx        # Application root, fonts, third-party tracking scripts
│   │   ├── index.tsx       # Homepage
│   │   ├── products/       # Product catalog index and [id].tsx detail pages
│   │   ├── cart/           # Shopping cart & checkout flow
│   │   ├── order-success.tsx # Order confirmation receipt
│   │   ├── blogs/          # Blog articles and single post view
│   │   ├── admin/          # Admin portal (dashboard, login, products, orders, blogs)
│   │   └── api/            # Serverless backend routes (products, blogs)
│   ├── services/           # Data services (productService, cartService, blogService)
│   └── styles/             # Global CSS and Tailwind definitions
├── .env.example            # Environment variables template
├── firestore.rules         # Firebase Cloud Firestore security rules
├── storage.rules           # Firebase Cloud Storage security rules
└── package.json            # Dependencies and npm scripts
```

---

## Step-by-Step Firebase Setup Guide

If you are new to Firebase, follow these exact steps to create your Firebase project and get all the required configuration keys.

### 1. Create a Firebase Account and Project
1. Go to [https://console.firebase.google.com/](https://console.firebase.google.com/) and sign in with your Google account.
2. Click **"Add project"** (or "Create a project").
3. Name your project (for example: `cec-ayigo-store`).
4. (Optional) Enable Google Analytics and select or create an account.
5. Click **"Create project"** and wait for it to finish.

---

### 2. Register a Web App (Gets Your Public Client Keys)
1. On your Firebase project overview dashboard, click the **Web icon** (`</>`) to add a web application.
2. Enter an app nickname (e.g., `CeC Ayigo Web`). You do **not** need to check "Firebase Hosting" right now.
3. Click **"Register app"**.
4. Firebase will display a code snippet containing `firebaseConfig`. Copy these values into your `.env` file:

```env
NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSy..."
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project-id.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project-id.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="123456789012"
NEXT_PUBLIC_FIREBASE_APP_ID="1:123456789012:web:abcdef..."
NEXT_PUBLIC_FIREBASE_DATABASE_URL="https://your-project-id-default-rtdb.firebaseio.com"
```
*(If you ever need to view these again, go to Project Settings (gear icon in left sidebar) > General > Your apps).*

---

### 3. Enable Authentication
1. In the left sidebar, click **Build** > **Authentication**.
2. Click **"Get started"**.
3. Under the **Sign-in method** tab:
   - **Email/Password**: Click it, toggle **Enable**, and save. (This is used for admin login).
   - **Anonymous**: Click it, toggle **Enable**, and save. (This allows guest visitors to read products and create shopping carts).
4. Go to the **Users** tab and click **"Add user"**:
   - Create an admin email and password (e.g. `admin@cecayigo.com`). You will use this to sign into `/admin/login`.

---

### 4. Create Cloud Firestore (Database)
1. In the left sidebar, click **Build** > **Firestore Database**.
2. Click **"Create database"**.
3. Choose a location closest to your users (e.g., `europe-west` or `us-central`).
4. Choose **Start in test mode** for local development, or copy the rules from `firestore.rules` into the **Rules** tab:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```
5. Click **Publish**.

---

### 5. Enable Firebase Storage (For Product & Blog Images)
1. In the left sidebar, click **Build** > **Storage**.
2. Click **"Get started"**.
3. Choose default security rules and bucket location, then click **Done**.

---

### 6. Generate Firebase Admin Service Account Key (Server-side)
The Next.js API routes need server-level permissions to access Firestore without client restrictions.
1. In the Firebase console, click the **Gear icon (⚙️)** next to "Project Overview" > **Project settings**.
2. Go to the **"Service accounts"** tab.
3. Click the blue button **"Generate new private key"**, then confirm **"Generate key"**.
4. A `.json` file will download to your computer. Open that file in a text editor.
5. Copy the corresponding fields into your `.env` file:
   - `project_id` &rarr; `FIREBASE_PROJECT_ID`
   - `client_email` &rarr; `FIREBASE_CLIENT_EMAIL`
   - `private_key` &rarr; `FIREBASE_PRIVATE_KEY` (be sure to keep the double quotes and escaped `\n` characters intact).

---

## Environment Variables Configuration

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Fill in `.env` with your Firebase details:

```env
# Client-side (Public)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your-project.firebaseio.com

# Server-side (Firebase Admin - Keep secret, never commit)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgk...YOUR_KEY...\n-----END PRIVATE KEY-----\n"
FIREBASE_DATABASE_URL=https://your-project.firebaseio.com
```

---

## Running the Application Locally

### Prerequisites
- Node.js 18+ (tested with Node 20 and Node 24)
- npm or yarn

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Development Server
```bash
npm run dev
```
The application will start on **[http://localhost:3000](http://localhost:3000)**.

### 3. Verify Code Quality & Type Safety
```bash
# Check TypeScript compilation
npx tsc --noEmit

# Run ESLint
npm run lint
```

---

## Admin Access & Setup

1. Open **[http://localhost:3000/admin/login](http://localhost:3000/admin/login)**.
2. Sign in with the email and password you added under Firebase Console > Authentication > Users.
3. Once logged in, you will be redirected to **[http://localhost:3000/admin/dashboard](http://localhost:3000/admin/dashboard)** to:
   - Add new products with prices, images, and categories.
   - Edit or mark products as featured (displayed on the homepage).
   - Write and publish blog posts.
   - View and manage customer orders.

---

## Scripts Reference

| Command | Description |
|---|---|
| `npm run dev` | Runs the Next.js app in development mode on `http://localhost:3000` |
| `npm run build` | Compiles the production build |
| `npm run start` | Starts the production server |
| `npm run lint` | Runs ESLint across all TypeScript and React files |
