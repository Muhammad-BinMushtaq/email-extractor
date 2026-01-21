# 🚀 EmailPro v3.0: Next.js Migration Plan

**Status**: Planning Phase  
**Version**: 3.0 (Next.js Full-Stack)  
**Target Date**: Q1 2026  
**Current Version**: 2.0 (HTML/Node.js)

---

## 📋 Executive Summary

This document outlines the complete migration strategy to transform EmailPro from a single-page application (HTML/Node.js) into a modern, scalable Next.js full-stack application with PostgreSQL, Prisma ORM, and NextAuth.js.

### Key Changes
- **Frontend**: HTML/CSS/JS → React (Next.js)
- **Backend**: Express.js API routes → Next.js API routes
- **Database**: localStorage → PostgreSQL (Supabase)
- **Authentication**: Custom Google Auth → NextAuth.js
- **ORM**: None → Prisma
- **Deployment**: Vercel (existing) → Vercel + Supabase

---

## 🎯 Phase-Based Implementation

### **Phase 1: Project Setup & Planning** (Week 1-2)
- [ ] Create new Next.js project structure
- [ ] Set up Supabase project (PostgreSQL + Auth)
- [ ] Configure environment variables
- [ ] Document project structure
- [ ] Set up Git branching strategy

### **Phase 2: Authentication** (Week 2-3)
- [ ] Implement NextAuth.js with Google provider
- [ ] Create authentication pages (login, profile, logout)
- [ ] Implement protected routes/API endpoints
- [ ] Migrate user session management
- [ ] Document auth flow

### **Phase 3: Database & ORM** (Week 3-4)
- [ ] Define Prisma schema (Users, Campaigns, Payments, etc.)
- [ ] Create database migrations
- [ ] Migrate data from localStorage to PostgreSQL
- [ ] Implement Prisma client in API routes
- [ ] Document database schema

### **Phase 4: Components & UI** (Week 4-6)
- [ ] Create reusable React components (Navbar, Sidebar, etc.)
- [ ] Migrate all UI from HTML to React
- [ ] Set up styling (Tailwind CSS or custom CSS)
- [ ] Implement responsive design
- [ ] Document component structure

### **Phase 5: API Routes & Features** (Week 6-8)
- [ ] Implement email scraping API route
- [ ] Implement email sending API route
- [ ] Implement campaign management API
- [ ] Implement payment handling
- [ ] Implement admin dashboard API
- [ ] Document all API endpoints

### **Phase 6: Advanced Features** (Week 8-10)
- [ ] Email verification (OTP)
- [ ] Analytics dashboard
- [ ] Search limit enforcement (database-backed)
- [ ] Premium feature enforcement
- [ ] Admin panel enhancements

### **Phase 7: Testing & Optimization** (Week 10-11)
- [ ] Unit tests for utilities
- [ ] Integration tests for API routes
- [ ] E2E tests for critical workflows
- [ ] Performance optimization
- [ ] Security audit

### **Phase 8: Deployment & Documentation** (Week 11-12)
- [ ] Deploy to Vercel (Next.js app)
- [ ] Configure Supabase (PostgreSQL + Auth)
- [ ] Set up CI/CD pipeline
- [ ] Complete all documentation
- [ ] Create deployment guide
- [ ] Launch v3.0

---

## 📁 New Project Structure

```
emailpro-nextjs/
├── .env.local (environment variables)
├── .env.example (example env)
├── .gitignore
├── next.config.js
├── package.json
├── tsconfig.json (optional, for TypeScript)
│
├── /pages
│   ├── _app.js (NextAuth provider)
│   ├── _document.js (custom document)
│   ├── index.js (hero/home page)
│   ├── dashboard.js (main app)
│   ├── admin.js (admin panel)
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth].js (NextAuth config)
│   │   ├── scrape.js (email scraping)
│   │   ├── send-email.js (bulk email sending)
│   │   ├── campaigns.js (campaign CRUD)
│   │   ├── payments.js (payment handling)
│   │   └── admin/ (admin endpoints)
│   └── auth/
│       ├── signin.js (login page)
│       └── callback.js (OAuth callback)
│
├── /components
│   ├── Layout.js
│   ├── Navbar.js
│   ├── Sidebar.js
│   ├── Hero.js
│   ├── Cards/
│   │   ├── StatCard.js
│   │   └── EmailCard.js
│   ├── Forms/
│   │   ├── ScrapeForm.js
│   │   ├── ComposeForm.js
│   │   └── CampaignForm.js
│   ├── Modals/
│   │   ├── PaymentModal.js
│   │   └── AdminLoginModal.js
│   ├── Dashboard/
│   │   ├── ScraperTab.js
│   │   ├── ComposerTab.js
│   │   ├── CampaignTab.js
│   │   └── SavedTab.js
│   └── Admin/
│       ├── AdminDashboard.js
│       ├── PaymentTable.js
│       └── StatsCards.js
│
├── /lib
│   ├── prisma.js (Prisma client)
│   ├── auth.js (auth utilities)
│   ├── email-templates.js (9 templates)
│   ├── scraper.js (scraping utility)
│   ├── email-sender.js (Nodemailer config)
│   └── validators.js (input validation)
│
├── /prisma
│   ├── schema.prisma (database schema)
│   └── /migrations (auto-generated)
│
├── /public
│   └── (static assets)
│
├── /styles
│   ├── globals.css
│   ├── variables.css
│   └── components.css
│
└── /docs
    ├── MIGRATION.md
    ├── API.md
    ├── DATABASE.md
    ├── DEPLOYMENT.md
    └── SECURITY.md
```

---

## 🔐 Authentication Strategy

### NextAuth.js Setup
- Use Next.js built-in API routes for OAuth
- Google OAuth 2.0 provider
- Store session in JWT (stateless)
- Optional: Database session adapter for Prisma

### Key Files
- `pages/api/auth/[...nextauth].js` - NextAuth configuration
- `lib/auth.js` - Auth utilities and middleware
- Protected pages with `getServerSideProps` or middleware

### Flow
```
User clicks "Sign in with Google"
  ↓
NextAuth redirects to Google OAuth
  ↓
User grants permission
  ↓
Google redirects back to /api/auth/callback/google
  ↓
NextAuth creates session (JWT or DB)
  ↓
User is redirected to dashboard
  ↓
Session available in API routes via getSession()
```

---

## 🗄️ Database Schema (Prisma)

### Core Entities
```prisma
// User
model User {
  id              String    @id @default(uuid())
  email           String    @unique
  name            String
  image           String?
  isPremium       Boolean   @default(false)
  emailVerified   DateTime?
  searchesUsed    Int       @default(0)
  lastSearchReset DateTime  @default(now())
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  // Relations
  payments        Payment[]
  campaigns       Campaign[]
  savedEmails     SavedEmail[]
  searchLogs      SearchLog[]
}

// Payment
model Payment {
  id              String    @id @default(uuid())
  userId          String
  user            User      @relation(fields: [userId], references: [id])
  transactionId   String    @unique
  email           String
  amount          Int
  status          String    @default("pending") // pending, approved, rejected
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}

// Campaign
model Campaign {
  id              String    @id @default(uuid())
  userId          String
  user            User      @relation(fields: [userId], references: [id])
  subject         String
  body            String
  recipients      String    // JSON array of emails
  sentCount       Int       @default(0)
  failedCount     Int       @default(0)
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}

// SavedEmail
model SavedEmail {
  id              String    @id @default(uuid())
  userId          String
  user            User      @relation(fields: [userId], references: [id])
  subject         String
  body            String
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}

// SearchLog
model SearchLog {
  id              String    @id @default(uuid())
  userId          String
  user            User      @relation(fields: [userId], references: [id])
  url             String
  emailsFound     Int
  createdAt       DateTime  @default(now())
}
```

---

## 🔌 API Routes Architecture

### Endpoints
```
POST /api/auth/[...nextauth]     - NextAuth handler
GET  /api/user                   - Get current user profile
PUT  /api/user                   - Update user profile

POST /api/scrape                 - Scrape emails from URL
POST /api/campaigns              - Create campaign
GET  /api/campaigns              - Get user's campaigns
PUT  /api/campaigns/[id]         - Update campaign
DELETE /api/campaigns/[id]       - Delete campaign
POST /api/campaigns/[id]/send    - Send campaign

POST /api/emails/save            - Save email draft
GET  /api/emails/saved           - Get saved emails
DELETE /api/emails/[id]          - Delete saved email

POST /api/payments               - Submit payment
GET  /api/payments               - Get payment status

GET  /api/admin/stats            - Admin stats (protected)
GET  /api/admin/payments         - Admin payment list
PUT  /api/admin/payments/[id]    - Approve/reject payment
```

---

## 🛠️ Development Tools & Libraries

### Core
- `next` - React framework
- `react` & `react-dom` - UI library
- `next-auth` - Authentication

### Database
- `@prisma/client` - ORM
- `prisma` - ORM CLI (dev dependency)

### Utilities
- `axios` - HTTP client
- `cheerio` - HTML parsing (scraping)
- `nodemailer` - Email sending
- `bcryptjs` - Password hashing

### Styling
- `tailwindcss` - CSS framework (optional)
- `postcss` - CSS processing

### Development
- `eslint` - Code linting
- `prettier` - Code formatting

---

## 🚀 Deployment Strategy

### Frontend & Backend
- **Host**: Vercel (automatic Next.js deployment)
- **Process**: Push to GitHub → Vercel auto-deploys
- **Environment**: Production, Staging, Development

### Database & Auth
- **Host**: Supabase (PostgreSQL + Auth)
- **Setup**: Create project → Get connection string → Configure env vars
- **Backup**: Supabase handles automatic backups

### Environment Variables
```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
DATABASE_URL=postgresql://...

# NextAuth
NEXTAUTH_SECRET=...
NEXTAUTH_URL=https://...

# Google OAuth
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# Email (Nodemailer)
GMAIL_EMAIL=...
GMAIL_APP_PASSWORD=...

# Admin
ADMIN_PASSWORD=...
```

---

## 📚 Documentation Requirements

### Phase 1-2
- [ ] Project structure guide
- [ ] Authentication setup guide
- [ ] Environment variables documentation

### Phase 3-4
- [ ] Database schema documentation
- [ ] Component library documentation
- [ ] Styling guide

### Phase 5-6
- [ ] API endpoint documentation
- [ ] Feature implementation guides
- [ ] Integration testing guide

### Phase 7-8
- [ ] Deployment guide
- [ ] Security checklist
- [ ] Changelog
- [ ] Troubleshooting guide

---

## ✅ Success Criteria

### Functionality
- [x] All v2.0 features working in Next.js
- [x] User authentication via Google
- [x] Data persisted in PostgreSQL
- [x] Email scraping, composing, sending
- [x] Payment system functional
- [x] Admin dashboard operational

### Quality
- [x] Responsive design (mobile/tablet/desktop)
- [x] 90+ Lighthouse performance score
- [x] HTTPS secure
- [x] No console errors
- [x] Input validation on all forms

### Security
- [x] Environment variables protected
- [x] API endpoints protected with auth
- [x] SQL injection prevention (Prisma)
- [x] CSRF protection (NextAuth)
- [x] Rate limiting on API endpoints

### Documentation
- [x] Migration guide complete
- [x] API documentation complete
- [x] Deployment guide complete
- [x] Security guide complete
- [x] Feature roadmap documented

---

## 🔄 Git Strategy

### Branches
- `main` - Production-ready code
- `develop` - Development branch
- `feature/auth` - Authentication feature
- `feature/database` - Database setup
- `feature/ui` - Component migration
- etc.

### Workflow
1. Create feature branch from `develop`
2. Make changes locally
3. Test thoroughly
4. Push to GitHub
5. Create Pull Request with description
6. Code review
7. Merge to `develop`
8. When ready, merge `develop` → `main`
9. Tag version (v3.0.0, etc.)

---

## 📊 Migration Checklist

### Phase 1: Setup
- [ ] Create Next.js project
- [ ] Set up Supabase account
- [ ] Configure Git repository
- [ ] Create documentation structure

### Phase 2: Auth
- [ ] Set up NextAuth.js
- [ ] Implement Google OAuth
- [ ] Create login/signup pages
- [ ] Test authentication flow

### Phase 3: Database
- [ ] Define Prisma schema
- [ ] Create database migrations
- [ ] Test Prisma client
- [ ] Migrate user data

### Phase 4: UI Components
- [ ] Create Navbar component
- [ ] Create Sidebar component
- [ ] Create Dashboard layout
- [ ] Create all form components
- [ ] Create modal components

### Phase 5: API Routes
- [ ] Email scraping API
- [ ] Email sending API
- [ ] Campaign management API
- [ ] Payment API
- [ ] Admin API

### Phase 6: Integration
- [ ] Connect frontend to backend
- [ ] Test all user flows
- [ ] Test admin flows
- [ ] Test payment flow

### Phase 7: Testing & QA
- [ ] Unit tests
- [ ] Integration tests
- [ ] E2E tests
- [ ] Security audit
- [ ] Performance audit

### Phase 8: Deployment
- [ ] Deploy to Vercel
- [ ] Configure Supabase
- [ ] Set up environment variables
- [ ] Test in production
- [ ] Monitor for issues

---

## 📞 Getting Help

- **Supabase Docs**: https://supabase.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **NextAuth.js Docs**: https://next-auth.js.org/
- **Prisma Docs**: https://www.prisma.io/docs
- **Vercel Docs**: https://vercel.com/docs

---

## 📝 Next Steps

1. **Read this document** to understand the full scope
2. **Create new GitHub repo** for `emailpro-nextjs`
3. **Set up Supabase project** (get DB credentials)
4. **Generate Next.js starter** and begin Phase 1
5. **Follow the phase-based checklist** above

---

**Version**: 1.0  
**Created**: January 21, 2026  
**Status**: Planning  
**Next Review**: When Phase 1 is complete
