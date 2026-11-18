# ApexBooks — Windows Beginner Setup & Operations Guide

Welcome to **ApexBooks**! This guide is written in clear, simple terms for Windows users who are new to programming. It explains everything you need to run your store, set up Google login, and configure payments.

---

## 1. Running ApexBooks on Your Windows PC

Your project is located at:
`c:\Users\Moni Singh\Documents\websites\ebook-marketplace`

### To Start the Website:
1. Press `Windows Key + R`, type `powershell`, and press **Enter**.
2. Run this command:
   ```powershell
   cd "c:\Users\Moni Singh\Documents\websites\ebook-marketplace"
   npm.cmd run start
   ```
3. Open your browser (Chrome, Edge, or Brave) and visit:
   **[http://localhost:3000](http://localhost:3000)**

---

## 2. Accessing the Admin Dashboard

Your store has an administrative dashboard where you can:
- View live sales telemetry and customer count.
- Add new eBooks and upload PDFs to the private storage vault.
- Edit prices, discounts, and publishing statuses.
- Inspect payment transactions and download audit logs.

### Administrator Rules:
- **Admin Email**: `dhurav07122010@gmail.com`
- **Authentication**: **Google OAuth ONLY**.
- For security, you cannot log into the admin panel using an email/password. You must click **"Sign in with Google"** using your allowlisted email `dhurav07122010@gmail.com`.
- Public registration for admin accounts is permanently disabled.

To access the admin gateway, go to:
**[http://localhost:3000/admin](http://localhost:3000/admin)**

---

## 3. Setting Up Google Login (Step-by-Step)

To enable Google sign-in for yourself (as admin) and for your customers:

### Step 1: Open Google Cloud Console
1. Open your browser and go to [Google Cloud Console](https://console.cloud.google.com/).
2. Sign in with your Google account.
3. In the top bar, click the project dropdown and click **"New Project"**. Name it **ApexBooks** and click **Create**.

### Step 2: Configure OAuth Consent Screen
1. In the left menu, search for **"OAuth consent screen"**.
2. Select **External** and click **Create**.
3. Fill in:
   - **App name**: ApexBooks
   - **User support email**: `dhurav07122010@gmail.com`
   - **Developer contact email**: `dhurav07122010@gmail.com`
4. Click **Save and Continue** through Scopes and Test Users.

### Step 3: Create OAuth Client ID
1. In the left menu, click **Credentials** → **Create Credentials** → **OAuth client ID**.
2. Application type: Select **Web application**.
3. Under **Authorized redirect URIs**, add your Supabase Auth callback URL:
   `https://gylzxiqhyvejbrklymio.supabase.co/auth/v1/callback`
4. Click **Create**.
5. Copy your **Client ID** and **Client Secret**.

### Step 4: Paste into Supabase Dashboard
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard/project/gylzxiqhyvejbrklymio).
2. Click **Authentication** in the left sidebar, then click **Providers**.
3. Find **Google**, toggle it **ON**.
4. Paste your **Client ID** and **Client Secret**.
5. Click **Save**.

That's it! Google login will now work automatically on your storefront and admin portal.

---

## 4. Payment Modes: Demo Mode vs Razorpay Test Mode

### A. Demo Sandbox (Active Now)
The store is currently configured with the **Isolated Demo Payment Simulator**:
- Customers can add eBooks to their cart, enter their email, and click **"Complete Demo Checkout"**.
- The simulator verifies prices directly from the PostgreSQL database (preventing price tampering).
- It creates an official order with order number prefix `DEMO-ORD-...`.
- It grants immediate digital purchase entitlements.
- It displays an official order confirmation receipt.
- Customers can instantly download their purchased eBooks from their account bookshelf.

### B. Razorpay Test Mode (When You're Ready)
When you want to test credit card, UPI, and net banking payments using Razorpay's simulated test cards:

1. Sign up for a free account at [Razorpay](https://razorpay.com/).
2. In the Razorpay dashboard, toggle the switch in the top left to **"Test Mode"**.
3. Go to **Settings** → **API Keys** and click **Generate Key**.
4. Open `c:\Users\Moni Singh\Documents\websites\ebook-marketplace\.env.local` in Notepad.
5. Fill in your test keys:
   ```env
   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_YourKeyIdHere
   RAZORPAY_KEY_SECRET=YourSecretKeyHere
   RAZORPAY_WEBHOOK_SECRET=YourWebhookSecretHere
   ```
6. Save the file.

> **IMPORTANT RULE**: Live payments will NEVER be enabled without your explicit approval. The site will stay in Test/Demo mode until you decide to go live.

---

## 5. Adding and Managing eBooks

1. Go to **[http://localhost:3000/admin/products](http://localhost:3000/admin/products)**.
2. Click **"+ Add New eBook"**.
3. Fill in the book details:
   - **Title**, **Subtitle**, and **Author**.
   - **Category**: Pick from the 10 available categories (Programming, Technology, Business, etc.).
   - **Price**: Enter the price in INR (e.g., 499).
   - **Original Price**: Enter the strikethrough price (e.g., 1299).
   - **Upload PDF File**: Select your PDF from your computer. The system automatically encrypts and saves it into the **private `ebooks` storage bucket** (`public = false`).
   - **Upload Cover Image**: Upload a JPEG or PNG cover for the catalogue.
4. Click **"Save Product"**. The eBook will immediately appear in your storefront.

---

## 6. How Digital Downloads Work

- The original PDF file is **never** accessible through a public web address.
- When an authorized customer requests a download:
  1. The server checks that the customer purchased the book.
  2. The server checks that the customer has not exceeded their download quota (default: 50 downloads).
  3. The server generates a temporary, cryptographically signed URL valid for **1 hour only**.
  4. The server logs the customer's IP address, device, and exact timestamp into the **Download Logs** for audit protection.
