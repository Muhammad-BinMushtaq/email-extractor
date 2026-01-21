# 🗺️ EmailPro v3.0 - Phase-by-Phase Implementation Roadmap

**Purpose**: Provide detailed, actionable tasks for each migration phase  
**Status**: Ready to Execute  
**Version**: 1.0  

---

## 📅 Timeline Overview

| Phase | Duration | Focus | Status |
|-------|----------|-------|--------|
| **Phase 1** | Weeks 1-2 | Setup & Planning | 🔴 Not Started |
| **Phase 2** | Weeks 2-3 | Authentication | 🔴 Not Started |
| **Phase 3** | Weeks 3-4 | Database & ORM | 🔴 Not Started |
| **Phase 4** | Weeks 4-6 | Components & UI | 🔴 Not Started |
| **Phase 5** | Weeks 6-8 | API Routes | 🔴 Not Started |
| **Phase 6** | Weeks 8-10 | Advanced Features | 🔴 Not Started |
| **Phase 7** | Weeks 10-11 | Testing & Optimize | 🔴 Not Started |
| **Phase 8** | Weeks 11-12 | Deploy & Document | 🔴 Not Started |

**Total Duration**: 12 weeks (3 months)  
**Estimated Effort**: ~480 development hours  
**Team Size**: 1-2 developers

---

## 🚀 PHASE 1: Project Setup & Planning (Weeks 1-2)

### Objectives
✅ Create new Next.js project  
✅ Set up Git and GitHub repository  
✅ Configure environment variables  
✅ Create project documentation structure  
✅ Set up Supabase account and database  

### Tasks (Detailed)

#### Week 1: Initial Setup

**Task 1.1: Create Next.js Project**
```bash
cd c:\Users\Muhammad\Desktop
npx create-next-app@latest emailpro-nextjs

# When prompted, choose:
# ✅ TypeScript: Yes
# ✅ ESLint: Yes
# ✅ Tailwind CSS: Yes
# ✅ src/ directory: No
# ✅ App Router: No (use Pages Router for familiarity)
# ✅ Import alias: Yes (@/*)

cd emailpro-nextjs
npm install
npm run dev
# Visit http://localhost:3000
```

**Expected Output**: 
- Fresh Next.js project created
- Server running on localhost:3000
- Can see default Next.js homepage

**Acceptance Criteria**:
- [ ] Project folder exists at `c:\Users\Muhammad\Desktop\emailpro-nextjs`
- [ ] `npm run dev` starts server without errors
- [ ] http://localhost:3000 loads successfully
- [ ] Pages Router working (pages/ folder exists, not app/)

---

**Task 1.2: Initialize Git Repository**
```bash
# From emailpro-nextjs folder
git init
git config user.name "Muhammad BinMushtaq"
git config user.email "your-email@gmail.com"

# Create .gitignore (add if missing):
# node_modules/
# .env
# .env.local
# .env.*.local
# .next/
# .vercel/
# .DS_Store
# *.log
```

**Acceptance Criteria**:
- [ ] Git initialized in emailpro-nextjs folder
- [ ] .gitignore file exists and properly configured
- [ ] First commit created: `git add . && git commit -m "Initial Next.js setup"`

---

**Task 1.3: Create GitHub Repository**
1. Go to https://github.com/new
2. Repository name: `emailpro-nextjs`
3. Description: "Modern Next.js version of EmailPro with PostgreSQL and NextAuth.js"
4. Public repository
5. Initialize with .gitignore (Node.js) - optional (we have local .gitignore)
6. Copy the HTTPS URL

```bash
# Add remote and push
git remote add origin https://github.com/[YOUR_USERNAME]/emailpro-nextjs.git
git branch -M main
git push -u origin main
```

**Acceptance Criteria**:
- [ ] GitHub repo created
- [ ] Remote configured: `git remote -v`
- [ ] Initial code pushed to GitHub
- [ ] Repo visible at https://github.com/[YOUR_USERNAME]/emailpro-nextjs

---

**Task 1.4: Set Up Environment Variables**

Create `.env.local` file in project root:
```bash
# .env.local

# ===== NEXT.js =====
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# ===== Database =====
# DATABASE_URL will be added in Phase 3 (Supabase setup)
# Placeholder for now:
DATABASE_URL="postgresql://user:password@host/database"

# ===== Authentication =====
NEXTAUTH_SECRET=your-secret-key-min-32-chars-long
NEXTAUTH_URL=http://localhost:3000

# Google OAuth (get from Google Cloud Console)
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret

# ===== Email Service =====
# Will be provided by users (Gmail app-specific password)
# Leave empty for development
GMAIL_USER=
GMAIL_PASSWORD=

# ===== Admin Panel =====
ADMIN_PASSWORD=your-secure-admin-password-here

# ===== API Keys =====
CRON_SECRET=your-cron-secret-for-cleanup-jobs
```

Also create `.env.example` (for documentation):
```bash
# Copy without sensitive values
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
ADMIN_PASSWORD=...
CRON_SECRET=...
```

Add to .gitignore:
```
.env
.env.local
.env.*.local
```

**Acceptance Criteria**:
- [ ] `.env.local` file created
- [ ] All required variables listed (even if empty)
- [ ] `.env.example` created for documentation
- [ ] `.env.local` in .gitignore (not committed)

---

#### Week 2: Configuration & Planning

**Task 2.1: Set Up Supabase Account**

1. Visit https://supabase.com/
2. Sign up with Google or email
3. Create new organization (or use personal)
4. Create new project:
   - Name: `emailpro-v3`
   - Database password: Save securely (will need this)
   - Region: Choose closest to you (e.g., Singapore, US-East)
   - Pricing: Free tier (starts with enough for development)

5. Once project is created:
   - Go to Settings → Database
   - Copy connection string
   - Add to `.env.local` as `DATABASE_URL`

```bash
# Connection string format:
postgresql://postgres.[project-id]:[password]@db.[project-id].supabase.co:5432/postgres?schema=public
```

**Acceptance Criteria**:
- [ ] Supabase account created
- [ ] New project created in Supabase
- [ ] DATABASE_URL copied to `.env.local`
- [ ] Database connection string verified (no errors)

---

**Task 2.2: Install Core Dependencies**

```bash
# Essential packages
npm install next-auth axios nodemailer cheerio

# Development tools
npm install --save-dev prisma @prisma/client

# Utilities
npm install classnames cookie js-cookie

# Optional: Tailwind CSS plugins (if using Tailwind)
npm install -D @tailwindcss/forms @tailwindcss/typography
```

**Verify installation:**
```bash
npm list next-auth axios nodemailer cheerio prisma
```

**Acceptance Criteria**:
- [ ] All packages installed successfully
- [ ] No dependency conflicts
- [ ] `package.json` updated with new packages
- [ ] `npm list` shows all packages at correct versions

---

**Task 2.3: Create Project Documentation Structure**

Create these markdown files in project root:

1. **README.md**
```md
# EmailPro v3.0

Modern email marketing tool built with Next.js, PostgreSQL, and NextAuth.js.

## Features
- Email scraping from websites
- AI-powered email composition
- Bulk email sending
- Premium tier with unlimited features
- Admin dashboard for payments

## Tech Stack
- Frontend: React + Next.js
- Backend: Next.js API Routes
- Database: PostgreSQL (Supabase)
- ORM: Prisma
- Auth: NextAuth.js
- Deployment: Vercel

## Setup
1. Clone repository
2. Install dependencies: `npm install`
3. Set up environment variables (see .env.example)
4. Set up Supabase database
5. Run migrations: `npx prisma migrate dev`
6. Start dev server: `npm run dev`

## Documentation
- [Phase 1: Setup](./PHASE_1_SETUP.md)
- [Phase 2: Auth](./PHASE_2_AUTH.md)
- [Component Architecture](./NEXTJS_COMPONENT_ARCHITECTURE.md)
- [API Routes](./NEXTJS_API_ROUTES.md)
- [Database Schema](./NEXTJS_DATABASE_SCHEMA.md)
```

2. **DEVELOPMENT.md** (How to work on the project)
3. **DEPLOYMENT.md** (How to deploy)
4. Copy existing docs from /practice folder:
   - NEXTJS_MIGRATION_PLAN.md
   - NEXTJS_COMPONENT_ARCHITECTURE.md
   - NEXTJS_API_ROUTES.md
   - NEXTJS_DATABASE_SCHEMA.md

```bash
# Copy docs from practice folder
copy c:\Users\Muhammad\Desktop\practice\NEXTJS_*.md c:\Users\Muhammad\Desktop\emailpro-nextjs\
```

**Acceptance Criteria**:
- [ ] README.md created in project root
- [ ] DEVELOPMENT.md created with setup instructions
- [ ] Migration plan documents copied
- [ ] All docs linked from README
- [ ] Docs reviewed and updated for v3.0 specifics

---

**Task 2.4: Create Project Folder Structure**

```bash
cd emailpro-nextjs

# Create folders (if not created by Next.js)
mkdir -p pages/api/auth pages/api/campaigns pages/api/emails pages/api/admin pages/api/payments
mkdir -p components/Dashboard components/Modals components/Cards components/Layout
mkdir -p lib utils styles
mkdir -p public/images
mkdir -p prisma
mkdir -p docs
```

Create initial `.gitkeep` files:
```bash
# This ensures empty folders are tracked by Git
touch pages/api/.gitkeep
touch components/.gitkeep
touch lib/.gitkeep
touch public/images/.gitkeep
```

**Expected Structure:**
```
emailpro-nextjs/
├── pages/
│   ├── _app.js
│   ├── _document.js
│   ├── index.js
│   └── api/
│       ├── auth/
│       │   └── [...nextauth].js
│       ├── campaigns/
│       ├── emails/
│       ├── payments/
│       └── admin/
├── components/
│   ├── Layout/
│   ├── Dashboard/
│   ├── Modals/
│   └── Cards/
├── lib/
│   ├── prisma.js
│   ├── auth.js
│   └── scraper.js
├── prisma/
│   └── schema.prisma
├── public/
│   └── images/
├── styles/
│   └── globals.css
├── docs/
├── .env.local
├── .env.example
├── .gitignore
├── package.json
├── next.config.js
├── jsconfig.json
└── README.md
```

**Acceptance Criteria**:
- [ ] All folder structure created
- [ ] .gitkeep files in empty folders
- [ ] Folder structure matches expected layout
- [ ] Ready for Phase 2 component creation

---

**Task 2.5: Configure Next.js Settings**

**Update `jsconfig.json`** for path aliases:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"],
      "@/components/*": ["components/*"],
      "@/pages/*": ["pages/*"],
      "@/lib/*": ["lib/*"],
      "@/styles/*": ["styles/*"]
    }
  },
  "include": ["next.env.d.ts", "**/*.ts", "**/*.tsx"]
}
```

**Update `next.config.js`**:
```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      'lh3.googleusercontent.com', // Google profile images
      'api.example.com'
    ]
  },
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL
  }
};

module.exports = nextConfig;
```

**Acceptance Criteria**:
- [ ] Path aliases configured
- [ ] Next.js config updated
- [ ] No TypeScript/build errors
- [ ] `npm run build` succeeds

---

**Task 2.6: First Commit & Push**

```bash
git add .
git commit -m "Phase 1: Initial project setup and configuration"
git push origin main
```

**Acceptance Criteria**:
- [ ] All Phase 1 files committed
- [ ] Pushed to GitHub successfully
- [ ] GitHub shows all files

---

### Phase 1 Checklist

Complete these before moving to Phase 2:

- [ ] Next.js project created and running
- [ ] Git initialized with clean .gitignore
- [ ] GitHub repository created and pushed
- [ ] Environment variables configured
- [ ] Supabase account and database created
- [ ] Core dependencies installed
- [ ] Documentation structure created
- [ ] Folder structure established
- [ ] Path aliases configured
- [ ] Initial commit and push to GitHub
- [ ] `npm run dev` works without errors
- [ ] All team members have repo access

### Phase 1 Success Criteria

✅ **Functionality**: Next.js app runs on localhost:3000  
✅ **Configuration**: All env vars and configs set up  
✅ **Organization**: Clean folder structure and naming conventions  
✅ **Documentation**: Setup and development guides created  
✅ **Version Control**: Git and GitHub configured, initial code pushed

---

## 🔐 PHASE 2: Authentication Setup (Weeks 2-3)

### Objectives
✅ Install and configure NextAuth.js  
✅ Set up Google OAuth credentials  
✅ Create authentication pages  
✅ Implement session management  
✅ Protect dashboard routes  

### Dependencies
- `next-auth` - Already installed in Phase 1
- `@next-auth/prisma-adapter` - Needed for this phase

### Quick Start Tasks

**Task 2.1: Install NextAuth Dependencies**
```bash
npm install @next-auth/prisma-adapter
```

**Task 2.2: Create Google OAuth Credentials**
1. Visit https://console.cloud.google.com/
2. Create new project "EmailPro"
3. Enable Google+ API
4. Create OAuth 2.0 credentials (Web Application)
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://yourdomain.vercel.app/api/auth/callback/google` (for production)
6. Copy Client ID and Client Secret
7. Add to `.env.local`

**Task 2.3: Create Authentication Configuration**
Create `/lib/auth.js` with NextAuth setup

**Task 2.4: Create Auth API Route**
Create `/pages/api/auth/[...nextauth].js` handler

**Task 2.5: Create Sign In Page**
Create `/pages/auth/signin.js` with Google sign-in button

**Task 2.6: Create Protected Pages**
Create `/pages/dashboard.js` with session protection

### Phase 2 Deliverables
- NextAuth.js configured
- Google OAuth working
- Login/logout flow functional
- Protected routes with session check
- User profile page

---

## 📊 PHASE 3: Database & ORM Setup (Weeks 3-4)

### Objectives
✅ Initialize Prisma ORM  
✅ Create database schema  
✅ Run migrations  
✅ Set up Prisma client  

### Quick Tasks

**Task 3.1: Initialize Prisma**
```bash
npx prisma init --datasource-provider postgresql
```

**Task 3.2: Copy Schema**
Copy `/prisma/schema.prisma` from NEXTJS_DATABASE_SCHEMA.md

**Task 3.3: Create Migrations**
```bash
npx prisma migrate dev --name init
```

**Task 3.4: Set Up Prisma Client**
Create `/lib/prisma.js` singleton

**Task 3.5: Verify Database**
```bash
npx prisma studio
# Browse database at localhost:5555
```

### Phase 3 Deliverables
- All database tables created
- Prisma client working
- Schema relationships verified
- Migration files created

---

## 🎨 PHASE 4: Components & UI (Weeks 4-6)

### Objectives
✅ Convert HTML to React components  
✅ Create reusable component library  
✅ Implement responsive design  
✅ Set up styling system  

### Key Components
- Layout (Navbar, Sidebar, Footer)
- Dashboard (ScraperTab, ComposerTab, CampaignTab, SavedTab)
- Modals (Payment, AdminLogin, Auth)
- Admin (Stats, PaymentTable)
- Forms and Cards

### Phase 4 Deliverables
- 15+ React components created
- Responsive design implemented
- Tailwind CSS configured
- Component storybook/documentation

---

## 🔌 PHASE 5: API Routes & Backend (Weeks 6-8)

### Objectives
✅ Implement all API endpoints  
✅ Add authentication checks  
✅ Create email scraping logic  
✅ Set up email sending  

### API Endpoints
- POST /api/scrape - Email scraping
- POST /api/send-email - Bulk sending
- POST /api/emails/save - Save drafts
- GET /api/emails/saved - Get drafts
- POST /api/payments/submit - Payment submission
- PUT /api/admin/payments/[id] - Payment approval

### Phase 5 Deliverables
- 15+ working API routes
- Email scraping implemented
- Email sending functional
- Admin payment management working

---

## 🚀 PHASE 6: Advanced Features (Weeks 8-10)

### Objectives
✅ Implement premium features  
✅ Create admin dashboard  
✅ Add analytics  
✅ Set up daily limits

### Features
- Email verification (OTP)
- User search limits (3/day free)
- Premium tier (unlimited)
- Admin statistics dashboard
- Payment history
- User management

### Phase 6 Deliverables
- Premium feature enforcement
- Admin panel functional
- Analytics dashboard created
- Cron job setup for daily resets

---

## ✅ PHASE 7: Testing & Optimization (Weeks 10-11)

### Objectives
✅ Write unit and integration tests  
✅ Performance optimization  
✅ Security audit  
✅ Lighthouse optimization  

### Testing
- Unit tests for utilities
- Integration tests for API routes
- End-to-end tests for critical flows
- Accessibility testing

### Optimization
- Code splitting
- Image optimization
- Caching strategy
- Database query optimization

### Phase 7 Deliverables
- 70%+ code coverage
- Lighthouse score 90+
- Security audit passed
- Performance benchmarks documented

---

## 🎉 PHASE 8: Deployment & Launch (Weeks 11-12)

### Objectives
✅ Deploy to production  
✅ Set up CI/CD  
✅ Create comprehensive documentation  
✅ User migration guide  

### Deployment
- Vercel deployment configured
- GitHub Actions CI/CD
- Database backups enabled
- Environment variables set

### Documentation
- API documentation
- Deployment guide
- User migration guide
- Security best practices
- Developer onboarding guide

### Phase 8 Deliverables
- v3.0 live in production
- CI/CD pipeline working
- Documentation complete
- Release notes published

---

## 🎯 Success Metrics

### By Phase End

**Phase 1**: ✅ Project foundation ready  
**Phase 2**: ✅ Users can sign in with Google  
**Phase 3**: ✅ Database fully operational  
**Phase 4**: ✅ UI matches v2.0 feature set  
**Phase 5**: ✅ All backend features working  
**Phase 6**: ✅ Premium features enforced  
**Phase 7**: ✅ Code quality and security verified  
**Phase 8**: ✅ v3.0 live and users can migrate  

### Final Metrics

- **Code Quality**: ESLint passes, no console errors
- **Performance**: Lighthouse 90+, API <200ms response
- **Security**: No OWASP top 10 vulnerabilities
- **Testing**: 70%+ code coverage, 0 critical bugs
- **Documentation**: All APIs and features documented
- **User Experience**: Feature parity with v2.0, improved UX

---

## 📚 Resource Links

- [Next.js Documentation](https://nextjs.org/docs)
- [NextAuth.js Guide](https://next-auth.js.org/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Supabase Guides](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Vercel Deployment](https://vercel.com/docs)

---

**Version**: 1.0  
**Last Updated**: 2024  
**Status**: Ready to Execute
