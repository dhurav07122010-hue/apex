# ApexBooks — Vercel Production Deployment Guide

> **REMINDER**: As per master instructions, production deployment requires your explicit authorization. When you are ready to make ApexBooks live on the internet, follow the instructions below.

---

## 1. Prerequisites for Live Deployment
- A free account on [Vercel](https://vercel.com).
- A free account on [GitHub](https://github.com).
- Your Supabase Project URL and API Keys.

---

## 2. Step 1: Push Code to GitHub

1. Open PowerShell on Windows:
   ```powershell
   cd "c:\Users\Moni Singh\Documents\websites\ebook-marketplace"
   ```
2. Check your git status and commit all files:
   ```powershell
   git add .
   git commit -m "Complete eBook marketplace implementation: Phase 1 through Phase 7"
   ```
3. Create a new repository on [GitHub](https://github.com/new) named `ebook-marketplace`.
4. Link and push your code:
   ```powershell
   git remote add origin https://github.com/<your-username>/ebook-marketplace.git
   git branch -M master
   git push -u origin master
   ```

---

## 3. Step 2: Import Project into Vercel

1. Log into your [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **"Add New..."** → **Project**.
3. Select your `ebook-marketplace` GitHub repository and click **Import**.
4. In the **Configure Project** screen, leave Framework Preset as **Next.js**.

---

## 4. Step 3: Configure Environment Variables in Vercel

Under the **Environment Variables** section, add the following key-value pairs:

| Variable Name | Description | Value Example |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SITE_URL` | Your production Vercel URL | `https://your-store.vercel.app` |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project URL | `https://gylzxiqhyvejbrklymio.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Anon Key | `sb_publishable_...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Service Role Key | `sb_secret_...` |
| `ADMIN_EMAIL` | Authorized Admin Google Email | `dhurav07122010@gmail.com` |
| `DOWNLOAD_TOKEN_SECRET` | Secret key for signed download tokens | Any random 32-character string |
| `RAZORPAY_MODE` | Payment Gateway Mode | `test` (or `live` only after approval) |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Razorpay Key ID | `rzp_test_...` |
| `RAZORPAY_KEY_SECRET` | Razorpay Key Secret | From Razorpay Dashboard |
| `RAZORPAY_WEBHOOK_SECRET` | Razorpay Webhook Secret | From Razorpay Webhooks |

---

## 5. Step 4: Update Supabase Redirect URLs for Production

Once Vercel assigns your production URL (e.g., `https://apexbooks.vercel.app`):
1. Go to [Supabase Dashboard](https://supabase.com/dashboard/project/gylzxiqhyvejbrklymio) → **Authentication** → **URL Configuration**.
2. Set **Site URL** to:
   `https://your-app.vercel.app`
3. Under **Redirect URLs**, add:
   `https://your-app.vercel.app/auth/callback`
4. Click **Save**.

---

## 6. Step 5: Update Google Cloud Console Redirect URI

In [Google Cloud Console](https://console.cloud.google.com/):
1. Navigate to **APIs & Services** → **Credentials**.
2. Click your OAuth 2.0 Web Client.
3. Ensure the Supabase redirect URI is present:
   `https://gylzxiqhyvejbrklymio.supabase.co/auth/v1/callback`
4. Click **Save**.

Your production deployment is now complete and fully secured!
