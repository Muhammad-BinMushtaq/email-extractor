# 🗄️ Prisma Database Schema & ORM Implementation Guide

**Purpose**: Define database models, relationships, and migration strategy  
**Status**: Design Phase  
**Version**: 3.0 Database  

---

## 📊 Database Models Overview

```
User (authenticated users)
  ├── id (Primary)
  ├── email (Unique)
  ├── name
  ├── image
  ├── isPremium
  ├── isAdmin
  ├── createdAt
  ├── updatedAt
  └── Relations: payments, campaigns, savedEmails, searchLogs

Payment (payment records)
  ├── id (Primary)
  ├── userId (Foreign Key → User)
  ├── transactionId (Unique)
  ├── amount
  ├── status (pending/approved/rejected)
  ├── approvedAt (nullable)
  ├── createdAt
  └── updatedAt

Campaign (email campaigns)
  ├── id (Primary)
  ├── userId (Foreign Key → User)
  ├── subject
  ├── body
  ├── recipientCount
  ├── successCount
  ├── failureCount
  ├── createdAt
  └── updatedAt

SavedEmail (email drafts)
  ├── id (Primary)
  ├── userId (Foreign Key → User)
  ├── title
  ├── category
  ├── subject
  ├── body
  ├── createdAt
  └── updatedAt

SearchLog (email scraping logs)
  ├── id (Primary)
  ├── userId (Foreign Key → User)
  ├── url
  ├── emailCount
  ├── createdAt
  └── Auto-purges after 30 days
```

---

## 🔧 Prisma Schema File

**Location**: `/prisma/schema.prisma`

```prisma
// This is your Prisma schema file

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// ==================
// User Model
// ==================
model User {
  id        String     @id @default(cuid())
  email     String     @unique
  name      String?
  image     String?    // Google profile picture URL
  isPremium Boolean    @default(false)
  isAdmin   Boolean    @default(false)
  
  // Relations
  payments      Payment[]
  campaigns     Campaign[]
  savedEmails   SavedEmail[]
  searchLogs    SearchLog[]
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@index([email])
  @@index([isPremium])
}

// ==================
// Payment Model
// ==================
model Payment {
  id              String    @id @default(cuid())
  userId          String
  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  transactionId   String    @unique // EasyPaisa/payment gateway ID
  amount          Int       // in PKR (Pakistani Rupees)
  status          String    @default("pending") // pending, approved, rejected
  approvedAt      DateTime? // When admin approved
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@index([userId])
  @@index([status])
  @@index([transactionId])
}

// ==================
// Campaign Model
// ==================
model Campaign {
  id              String    @id @default(cuid())
  userId          String
  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  subject         String
  body            String    @db.Text // Rich text content
  recipientCount  Int       // Total recipients
  successCount    Int       // Successfully sent
  failureCount    Int       // Failed to send
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@index([userId])
  @@index([createdAt])
}

// ==================
// SavedEmail Model (Drafts)
// ==================
model SavedEmail {
  id        String    @id @default(cuid())
  userId    String
  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  title     String    @default("Untitled")
  category  String    // Principal, Professor, HR, etc.
  subject   String
  body      String    @db.Text
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@index([userId])
  @@index([createdAt])
}

// ==================
// SearchLog Model
// ==================
model SearchLog {
  id          String    @id @default(cuid())
  userId      String
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  url         String
  emailCount  Int
  
  createdAt DateTime @default(now())
  
  @@index([userId])
  @@index([createdAt])
}
```

---

## 🚀 Setup & Migration Steps

### 1. Install Prisma
```bash
npm install @prisma/client
npm install --save-dev prisma
```

### 2. Initialize Prisma
```bash
npx prisma init
```
This creates:
- `/prisma/schema.prisma` - Database schema
- `.env.local` - Environment variables (add DATABASE_URL)

### 3. Set Database URL
**In `.env.local`:**
```
DATABASE_URL="postgresql://user:password@host:port/database?schema=public"
```

For Supabase, the URL format is:
```
DATABASE_URL="postgresql://postgres.[project-id]:[password]@db.[project-id].supabase.co:5432/postgres"
```

### 4. Create Initial Migration
```bash
npx prisma migrate dev --name init
```

This:
- Generates Prisma Client
- Creates migration file in `/prisma/migrations/`
- Runs migration on database
- Creates all tables

### 5. Generate Prisma Client
```bash
npx prisma generate
```

The client is used in your API routes:
```js
import prisma from '@/lib/prisma';

// Example queries
const user = await prisma.user.findUnique({
  where: { email: 'user@example.com' }
});
```

---

## 📝 Common Prisma Operations

### Create
```js
// Create user (from NextAuth session)
const user = await prisma.user.create({
  data: {
    email: 'user@example.com',
    name: 'John Doe',
    image: 'https://...',
    isPremium: false,
    isAdmin: false
  }
});

// Create payment
const payment = await prisma.payment.create({
  data: {
    userId: 'user-123',
    transactionId: 'TXN123456',
    amount: 499,
    status: 'pending'
  }
});

// Create campaign
const campaign = await prisma.campaign.create({
  data: {
    userId: 'user-123',
    subject: 'Newsletter',
    body: '<h1>Welcome!</h1>',
    recipientCount: 100,
    successCount: 95,
    failureCount: 5
  }
});
```

### Read
```js
// Find by ID
const user = await prisma.user.findUnique({
  where: { id: 'user-123' }
});

// Find by email
const user = await prisma.user.findUnique({
  where: { email: 'user@example.com' }
});

// Find first (no error if not found)
const user = await prisma.user.findFirst({
  where: { isPremium: true }
});

// Find many
const users = await prisma.user.findMany({
  where: { isPremium: true },
  orderBy: { createdAt: 'desc' },
  take: 10, // limit
  skip: 0   // offset
});

// Get related data
const user = await prisma.user.findUnique({
  where: { id: 'user-123' },
  include: {
    campaigns: true,
    payments: true,
    savedEmails: true
  }
});

// Aggregate
const totalRevenue = await prisma.payment.aggregate({
  where: { status: 'approved' },
  _sum: { amount: true }
});

// Count
const premiumCount = await prisma.user.count({
  where: { isPremium: true }
});
```

### Update
```js
// Update single field
const user = await prisma.user.update({
  where: { id: 'user-123' },
  data: { isPremium: true }
});

// Update multiple fields
const payment = await prisma.payment.update({
  where: { id: 'payment-456' },
  data: {
    status: 'approved',
    approvedAt: new Date()
  }
});

// Conditional update
const result = await prisma.user.updateMany({
  where: { isPremium: false },
  data: { image: null }
});
```

### Delete
```js
// Delete one
await prisma.payment.delete({
  where: { id: 'payment-456' }
});

// Delete many
const result = await prisma.payment.deleteMany({
  where: { status: 'rejected' }
});

// Delete all related (use Cascade in schema)
await prisma.user.delete({
  where: { id: 'user-123' }
}); // Automatically deletes all payments, campaigns, etc.
```

---

## 🔄 Data Migrations

### Migration 1: Initial Schema
```bash
npx prisma migrate dev --name init
```

### Migration 2: Add New Field
```bash
# Edit schema.prisma - add field to model
# Then run:
npx prisma migrate dev --name add_field_name
```

Example: Add `theme` field to User
```prisma
model User {
  // ... existing fields
  theme String @default("light") // light or dark
}
```

### Rollback Migration
```bash
npx prisma migrate resolve --rolled-back migration_name
npx prisma migrate deploy
```

### Reset Database (Development Only)
```bash
npx prisma migrate reset
```
⚠️ WARNING: This deletes all data!

---

## 🛡️ Security Best Practices

### 1. Never Expose Database URL
```js
// ❌ BAD
const connection = process.env.DATABASE_URL;
console.log(connection); // Don't log!

// ✅ GOOD
const prisma = new PrismaClient(); // Handle securely
```

### 2. Use Prisma Validators
```js
// ❌ BAD - SQL injection vulnerable (if using raw SQL)
const user = await db.query(`SELECT * FROM users WHERE email = '${email}'`);

// ✅ GOOD - Prisma prevents SQL injection
const user = await prisma.user.findUnique({
  where: { email } // Safe, parameterized
});
```

### 3. Authenticate Before Database Access
```js
// ❌ BAD
const user = await prisma.user.findUnique({
  where: { id: req.query.id } // Anyone can request any user!
});

// ✅ GOOD
const session = await getSession({ req });
if (!session) return res.status(401).json({ error: 'Unauthorized' });

const user = await prisma.user.findUnique({
  where: { email: session.user.email } // Only get logged-in user
});
```

### 4. Audit Sensitive Operations
```js
// Log when admin approves payment
await prisma.payment.update({
  where: { id },
  data: { status: 'approved' }
});

// Log to audit trail (optional)
console.log(`Admin ${adminEmail} approved payment ${id}`);
```

---

## 📊 Database Relationships

### One-to-Many (User → Campaigns)
```js
// Create campaign under user
const campaign = await prisma.campaign.create({
  data: {
    userId: 'user-123',
    subject: 'Email'
  }
});

// Get user with campaigns
const user = await prisma.user.findUnique({
  where: { id: 'user-123' },
  include: { campaigns: true }
});
```

### Cascade Delete
If user is deleted, all their campaigns/payments/emails are auto-deleted:
```prisma
model Campaign {
  userId String
  user   User @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

---

## 🧹 Cleanup & Maintenance

### Auto-Delete Old SearchLogs (After 30 Days)
Use a cron job (e.g., GitHub Actions or Vercel cron):

**`/api/cron/cleanup.js`:**
```js
export default async function handler(req, res) {
  // Verify cron secret
  if (req.headers['authorization'] !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    const deleted = await prisma.searchLog.deleteMany({
      where: {
        createdAt: { lt: thirtyDaysAgo }
      }
    });

    res.status(200).json({
      success: true,
      deletedCount: deleted.count
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

---

## 📈 Performance Optimization

### Use Indexes
Already defined in schema:
```prisma
@@index([email])  // Index on email for faster lookups
@@index([userId]) // Index on userId for faster joins
@@index([status]) // Index on status for filtering
```

### Limit Query Results
```js
// ❌ BAD - Fetches all payments
const payments = await prisma.payment.findMany({});

// ✅ GOOD - Limits results
const payments = await prisma.payment.findMany({
  take: 20, // Get 20 results
  skip: 0,  // Start from position 0
  orderBy: { createdAt: 'desc' }
});
```

### Use `select` to Get Only Needed Fields
```js
// ❌ BAD - Fetches entire user object
const user = await prisma.user.findUnique({
  where: { id },
  include: { payments: true, campaigns: true }
});

// ✅ GOOD - Fetch only what's needed
const user = await prisma.user.findUnique({
  where: { id },
  select: {
    id: true,
    name: true,
    isPremium: true,
    payments: {
      where: { status: 'approved' },
      select: { id: true, amount: true }
    }
  }
});
```

---

## 🔍 Debugging Prisma

### Enable Query Logging
**In `.env.local`:**
```
# Log all queries to console (development only)
DATABASE_URL="postgresql://...?schema=public"
```

**In code:**
```js
const prisma = new PrismaClient({
  log: ['query', 'error', 'warn']
});
```

### Prisma Studio (GUI)
```bash
npx prisma studio
```
Opens http://localhost:5555 - visual database browser

---

## ✅ Database Setup Checklist

### Phase 3 (Database & ORM)
- [ ] Install Prisma: `npm install @prisma/client prisma`
- [ ] Initialize Prisma: `npx prisma init`
- [ ] Copy schema.prisma (from this doc)
- [ ] Set DATABASE_URL in .env.local
- [ ] Create initial migration: `npx prisma migrate dev --name init`
- [ ] Verify tables created in Supabase
- [ ] Test Prisma queries in API routes
- [ ] Set up cleanup cron job
- [ ] Enable query logging (dev only)
- [ ] Test cascade delete functionality

---

**Version**: 1.0  
**Status**: Design Phase  
**Next**: Implement database in Phase 3
