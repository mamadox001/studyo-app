# ☁️ Deploying Studyo on Cloudflare (100% Free Forever)

Studyo is architected to run with **zero hosting costs**, **zero server maintenance**, and **zero subscription paywalls**. 

By leveraging **Cloudflare Pages**, **Pages Functions**, and **Cloudflare D1 (Serverless SQL Database)**, your web app and user database are hosted on Cloudflare's global edge network at high speed for free.

---

## 🎁 Cloudflare Free Tier Capacity
| Service | Free Tier Allowance | What This Means for Studyo |
| :--- | :--- | :--- |
| **Cloudflare Pages** | **Unlimited** bandwidth & requests | Host your static web app forever with 0 bandwidth bills. |
| **Pages Functions** | **100,000 requests / day** | Powers fast authentication & cloud syncing. |
| **Cloudflare D1 SQL** | **5,000,000 reads / day**<br>**100,000 writes / day**<br>**5 GB storage** | Store tens of thousands of registered student accounts & study history. |
| **SSL / HTTPS** | **Automatic Free SSL** | Bank-grade HTTPS encryption included out of the box. |

---

## 🚀 3-Step Deployment Walkthrough

### Step 1: Push your Code to GitHub
Make sure your project repository is pushed to your GitHub account:
```bash
git add .
git commit -m "feat: complete study sanctuary with free cloudflare auth & d1 database"
git push origin main
```

---

### Step 2: Create your Free Cloudflare D1 Database

You can do this directly from the **Cloudflare Dashboard** OR using the **Cloudflare CLI (Wrangler)**:

#### Option A — Cloudflare Web Dashboard (Easiest)
1. Log in to [dash.cloudflare.com](https://dash.cloudflare.com/).
2. In the left navigation, click **Storage & Databases** → **D1 SQL Database**.
3. Click **Create Database**, name it `studyo-db`, and click **Create**.
4. Click on your newly created `studyo-db` → click the **Console** tab.
5. Open [`schema.sql`](./schema.sql) from this project, copy the SQL code, paste it into the console, and click **Execute**.
   *(This creates the `users` and `user_sync` tables).*

#### Option B — Wrangler Terminal CLI
Run this in your terminal:
```bash
npx wrangler d1 create studyo-db
```
Then execute the schema file:
```bash
npx wrangler d1 execute studyo-db --file=./schema.sql --remote
```

---

### Step 3: Deploy via Cloudflare Pages

1. In the Cloudflare Dashboard, go to **Compute (Workers) & Pages** → **Create Application** → click the **Pages** tab → **Connect to Git**.
2. Select your `studyo.app` GitHub repository.
3. Configure your build settings:
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
4. Click **Save and Deploy**.
5. **Bind the D1 Database (Important)**:
   - Once the first deployment finishes, go to your project in Cloudflare Pages.
   - Navigate to **Settings** → **Functions** → scroll down to **D1 Database Bindings**.
   - Click **Add binding**:
     - **Variable name**: `DB` *(Must be uppercase `DB`)*
     - **D1 Database**: Select `studyo-db`
   - Click **Save**.
6. Trigger a redeploy (or push a commit), and your app is live! Cloudflare will give you a free `*.pages.dev` domain (e.g. `https://studyo.pages.dev`), and you can attach any custom domain for free.

---

## 🔒 Security & Architecture Overview

- **Native Web Crypto (`crypto.subtle`)**: Uses PBKDF2 (100,000 iterations) with cryptographic salt for password hashing.
- **Stateless HMAC Sessions**: Session tokens are cryptographically signed using HMAC-SHA256.
- **Local-First / Dual-Engine Design**:
  - When running locally (`localhost:5173`), Studyo uses an embedded Web Crypto simulator so you can test registration and sign-in immediately without needing a live Cloudflare D1 connection.
  - When deployed on Cloudflare Pages, it automatically calls the edge endpoints in `functions/api/` and writes directly to Cloudflare D1 SQL.
- **No Forced Sign-In**: Visitors can use Studyo as a guest indefinitely with offline local storage, or create a free account to sync their sessions and streaks across devices.
