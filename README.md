# 🎓 VarsityQuest — College Discovery & Decision-Making Platform

Welcome to **VarsityQuest** (formerly CampusIQ), a premium, high-performance web platform designed to help students discover, compare, and save elite Indian educational institutions with objective admissions intelligence.

The application is engineered on Next.js 16 (App Router), styled using a modern and responsive theme matching Stitch tokens, and backed by a serverless **Neon PostgreSQL** database with Prisma ORM.

---

## 🌟 Key Features

*   **⚡ Category-Branded Directories:** Dynamic filtering for *Engineering*, *Medical*, *Management*, *Law*, *Arts*, and *Commerce* directories styled with soft, premium pastel themes.
*   **⚖️ 4-Way Comparison Matrix:** Side-by-side comparative table supporting up to 4 colleges concurrently with dynamic, brand-colored image fallback gradients for broken campus photos.
*   **👤 Student Account Dashboard:** Premium tabbed portal split into **Profile Details** (custom local base64 avatar uploads) and **Security & Password** tabs.
*   **🔐 Unified Google OAuth Pipeline:** Automatic credentials-to-Google OAuth user account merging and secure CUID database primary key mapping.
*   **🌱 High-Speed Concurrent Seeding:** Re-engineered parallel seeding scripts executing concurrent database insertions over Neon serverless instances in under 5 seconds.
*   **🚄 Data Locality Optimization:** Pre-configured `vercel.json` forcing Vercel serverless function deployments to the Singapore (`sin1`) region to match the physical data center of the Neon database.

---

## 🛠️ Technology Stack

*   **Frontend Framework:** Next.js 16.2.6 (App Router, Turbopack) & React 19
*   **Database layer:** PostgreSQL hosted on Neon serverless & Prisma ORM v7.8.0
*   **Authentication:** NextAuth.js v5 (Beta) supporting credentials and Google provider
*   **State Management:** TanStack React Query v5 & Zustand persisted stores
*   **Validation:** Zod schemas for registrations, settings, and administrator uploads
*   **Styles:** TailwindCSS v4 with semantic colors (Teal base, Golden accents)

---

## 🚀 Getting Started (Local Development)

### 1. Clone the repository & install dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file at the root of the project:
```env
# Neon PostgreSQL Connection URL
DATABASE_URL="postgresql://<user>:<password>@<host>.ap-southeast-1.aws.neon.tech/neondb?sslmode=verify-full"

# NextAuth Configurations
NEXTAUTH_SECRET="your-32-byte-secret"
NEXTAUTH_URL="http://localhost:3000"

# Google Developer OAuth Credentials
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### 3. Generate Database Client & Seed Data
Initialize your local environment and seed all 53 elite colleges:
```bash
npx prisma generate
npx tsx prisma/seed.ts
```

### 4. Launch the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to explore the platform.

---

## 🌐 Production Deployment (Vercel)

VarsityQuest is pre-optimized for serverless cloud deployment:

1.  **Singapore Compute Region (`sin1`):** A custom `vercel.json` file is present in the root folder setting the serverless compute region to Singapore (`sin1`). This places your API routes directly next to the Singapore Neon database, reducing query latency from **1.5s to ~30ms**!
2.  **Prisma Auto-Generation:** The build script is configured with `prisma generate && next build` to guarantee compilation success on Vercel's build environment.
3.  **Neon Connection Pooling:** In your Vercel Project Settings, configure the `DATABASE_URL` environment variable using your Neon pooled connection host (appended with `-pooler`) to prevent connection limit exhaustion on serverless scale-ups:
    ```env
    DATABASE_URL="postgresql://<user>:<password>@<host>-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=verify-full"
    ```

---

## 📂 Project Structure

```
├── app/                  # Next.js App Router Pages & API Routes
│   ├── admin/            # College Creation Flow (/admin/colleges/new)
│   ├── api/              # Zod-validated serverless endpoints
│   ├── colleges/         # Directory listing & college detail views
│   ├── compare/          # 4-college side-by-side grid matrix
│   └── dashboard/        # Multi-tab account settings modal & saved metrics
├── components/           # Reusable UI components & layouts
├── hooks/                # Custom TanStack query fetching hooks
├── lib/                  # Database client, NextAuth configs & Zod validation schemas
├── prisma/               # Prisma Schema definitions & high-speed seed script
└── store/                # Zustand client state (e.g. comparison queue)
```

---

## 🛡️ License
Distributed under the MIT License. See `LICENSE` for more information.
