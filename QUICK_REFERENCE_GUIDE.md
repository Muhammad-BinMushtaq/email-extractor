# 📖 EmailPro v3.0 - Developer Quick Reference Guide

**Purpose**: Quick lookup for common development tasks and patterns  
**Status**: Ready to Use  
**Version**: 1.0  

---

## 🚀 Quick Start

### Setup (First Time)
```bash
# Clone repository
git clone https://github.com/[USERNAME]/emailpro-nextjs.git
cd emailpro-nextjs

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local and fill in actual values

# Run database migrations
npx prisma migrate dev

# Start development server
npm run dev

# Visit http://localhost:3000
```

### Daily Development
```bash
# Start server
npm run dev

# In another terminal, open Prisma Studio
npx prisma studio

# Run tests
npm test

# Build for production
npm run build
```

---

## 🔍 Common Code Patterns

### Get Current Session (In API Route)
```js
import { getSession } from 'next-auth/react';

export default async function handler(req, res) {
  const session = await getSession({ req });
  
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  const userId = session.user.email; // Use as identifier
  // ... rest of code
}
```

### Get Current Session (In React Component)
```js
import { useSession } from 'next-auth/react';

export default function MyComponent() {
  const { data: session, status } = useSession();
  
  if (status === 'loading') return <p>Loading...</p>;
  if (status === 'unauthenticated') return <p>Not signed in</p>;
  
  return <p>Welcome, {session.user.name}!</p>;
}
```

### Database Query (Single Record)
```js
import prisma from '@/lib/prisma';

// Find by ID
const user = await prisma.user.findUnique({
  where: { id: 'user-123' }
});

// Find by email
const user = await prisma.user.findUnique({
  where: { email: 'user@example.com' }
});
```

### Database Query (Multiple Records)
```js
// Get all campaigns for user
const campaigns = await prisma.campaign.findMany({
  where: { userId: user.id },
  orderBy: { createdAt: 'desc' },
  take: 10
});
```

### Database Create
```js
const user = await prisma.user.create({
  data: {
    email: 'new@example.com',
    name: 'John Doe',
    isPremium: false
  }
});
```

### Database Update
```js
const payment = await prisma.payment.update({
  where: { id: 'payment-123' },
  data: {
    status: 'approved',
    approvedAt: new Date()
  }
});
```

### Check if User is Premium
```js
const user = await prisma.user.findUnique({
  where: { email: session.user.email }
});

if (!user.isPremium) {
  return res.status(403).json({ error: 'Premium required' });
}
```

### Make API Call from Component
```js
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

const scrapeEmails = async (url) => {
  setLoading(true);
  setError(null);
  
  try {
    const response = await fetch('/api/scrape', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    });
    
    if (!response.ok) throw new Error('Failed to scrape');
    
    const data = await response.json();
    console.log(data.emails);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
```

### Environment Variable Access
```js
// In API routes and getServerSideProps
const secret = process.env.ADMIN_PASSWORD;

// In React components (must start with NEXT_PUBLIC_)
const apiUrl = process.env.NEXT_PUBLIC_APP_URL;
```

### Protected Route (Page)
```js
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  if (status === 'loading') return <p>Loading...</p>;
  
  if (!session) {
    router.push('/api/auth/signin');
    return null;
  }
  
  return <div>Dashboard content</div>;
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  
  if (!session) {
    return { redirect: { destination: '/api/auth/signin' } };
  }
  
  return { props: { session } };
}
```

---

## 📁 File Organization

### Where to Put Code

| Type | Location | Example |
|------|----------|---------|
| **Page** | `/pages` | `pages/dashboard.js` |
| **API Route** | `/pages/api` | `pages/api/scrape.js` |
| **Component** | `/components` | `components/Navbar.js` |
| **Hook** | `/lib` or `/hooks` | `lib/useSession.js` |
| **Utility Function** | `/lib` | `lib/emailValidator.js` |
| **Prisma Client** | `/lib` | `lib/prisma.js` |
| **Constants** | `/lib` | `lib/constants.js` |
| **Types** (TypeScript) | `/types` | `types/user.ts` |
| **Styles** | `/styles` | `styles/globals.css` |

---

## 🐛 Debugging Tips

### Check Database
```bash
# Open Prisma Studio
npx prisma studio
# Opens GUI at http://localhost:5555
```

### See API Response
```js
const response = await fetch('/api/scrape', { method: 'POST', ... });
console.log('Status:', response.status);
const data = await response.json();
console.log('Data:', data);
```

### See All Logs
```bash
# Terminal 1: Start Next.js with verbose logging
npm run dev

# Terminal 2: Check Prisma logs
PRISMA_CLIENT_DEBUG=* npm run dev
```

### Test API Route with cURL
```bash
# POST request
curl -X POST http://localhost:3000/api/scrape \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com"}'

# GET request
curl http://localhost:3000/api/admin/stats \
  -H "Cookie: sessionToken=..."
```

### Test API Route with Postman
1. Download Postman
2. Create new POST request
3. URL: `http://localhost:3000/api/scrape`
4. Body (raw JSON):
```json
{
  "url": "https://example.com"
}
```

---

## 🎨 Component Template

```js
import { useState } from 'react';
import styles from './MyComponent.module.css'; // Optional CSS modules

/**
 * MyComponent - Brief description
 * @param {string} title - Component title
 * @param {function} onAction - Callback when action happens
 * @returns {JSX.Element}
 */
export default function MyComponent({ title, onAction }) {
  const [state, setState] = useState(null);
  
  const handleClick = () => {
    onAction?.();
  };
  
  return (
    <div className={styles.container}>
      <h2>{title}</h2>
      <button onClick={handleClick}>Click Me</button>
    </div>
  );
}
```

---

## 🔌 API Route Template

```js
import { getSession } from 'next-auth/react';
import prisma from '@/lib/prisma';

/**
 * API Route: POST /api/my-endpoint
 * Description: What this endpoint does
 * Auth: Required
 * Rate Limit: 10 per minute
 */
export default async function handler(req, res) {
  // Method check
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  // Auth check
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  // Input validation
  const { field1, field2 } = req.body;
  if (!field1 || !field2) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  try {
    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });
    
    // Business logic
    const result = await prisma.model.create({
      data: { field1, field2 }
    });
    
    // Success response
    return res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
```

---

## 🚨 Common Errors & Solutions

### Error: "Cannot find module '@/lib/prisma'"
```
Solution: Make sure file exists at lib/prisma.js
or jsconfig.json has correct path aliases
```

### Error: "session is null in getSession()"
```js
// WRONG
const session = await getSession();

// CORRECT
const session = await getSession({ req });
```

### Error: "DATABASE_URL not found"
```
Solution: Check .env.local has DATABASE_URL set
Verify it's the correct PostgreSQL connection string
```

### Error: "Prisma Client not initialized"
```
Solution: Create lib/prisma.js:
import { PrismaClient } from '@prisma/client';

let prisma;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export default prisma;
```

### Error: "Port 3000 already in use"
```bash
# Find process using port 3000
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Kill the process
kill -9 [PID]  # macOS/Linux
taskkill /PID [PID] /F  # Windows

# Or use different port
npm run dev -- -p 3001
```

---

## 📝 Commit Message Guidelines

```bash
# Format: type(scope): subject

# Examples:
git commit -m "feat(auth): implement Google OAuth login"
git commit -m "fix(api): fix email scraping regex pattern"
git commit -m "refactor(components): split Navbar into subcomponents"
git commit -m "docs(readme): update installation instructions"
git commit -m "test(api): add tests for payment API"

# Types: feat, fix, refactor, docs, test, chore, perf, style
# Scope: auth, api, components, database, etc.
```

---

## 🔑 Environment Variables Checklist

Before running each phase:

**Phase 1 Setup**:
- [ ] NODE_ENV
- [ ] NEXT_PUBLIC_APP_URL
- [ ] NEXTAUTH_SECRET
- [ ] NEXTAUTH_URL

**Phase 2 (Auth)**:
- [ ] GOOGLE_CLIENT_ID
- [ ] GOOGLE_CLIENT_SECRET

**Phase 3 (Database)**:
- [ ] DATABASE_URL

**Phase 5 (Email)**:
- [ ] GMAIL_USER (from user)
- [ ] GMAIL_PASSWORD (from user)

**Admin**:
- [ ] ADMIN_PASSWORD
- [ ] CRON_SECRET

---

## 🎯 Development Workflow

### Daily Routine
```
1. Pull latest from GitHub
   git pull origin main

2. Start dev server
   npm run dev

3. Open Prisma Studio (in another terminal)
   npx prisma studio

4. Make code changes

5. Test in browser (http://localhost:3000)

6. Commit changes with descriptive message
   git add .
   git commit -m "feat(xyz): description"

7. Push to GitHub
   git push origin main
   (or push to feature branch for PRs)

8. Verify on GitHub/Vercel
```

### Branch Strategy
```
main          - Production-ready code
develop       - Integration branch (optional)
feature/*     - Feature branches
bugfix/*      - Bug fix branches

Example:
git checkout -b feature/email-scraping
# ... make changes ...
git push origin feature/email-scraping
# Create PR on GitHub
```

---

## 📊 Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Production build
npm run start            # Start production server
npm run lint             # Run ESLint

# Prisma
npx prisma studio       # Open DB GUI
npx prisma migrate dev  # Create migration
npx prisma generate     # Generate Prisma Client
npx prisma db push      # Push schema to DB

# Git
git status              # See changes
git diff                # See actual changes
git log                 # See commit history
git branch              # See all branches
git checkout -b name    # Create new branch

# Package Management
npm install [package]   # Install package
npm update              # Update packages
npm list                # List installed packages
npm cache clean --force # Clear npm cache
```

---

## 🔐 Security Reminders

✅ **Always do**:
- Check authentication on protected routes
- Validate user input on backend
- Use environment variables for secrets
- Use HTTPS in production
- Check `onDelete: Cascade` in Prisma relations

❌ **Never do**:
- Expose DATABASE_URL in frontend code
- Commit .env.local to Git
- Use plain text passwords
- Trust client-side validation alone
- Log sensitive information

---

## 📚 Key Files Reference

| File | Purpose |
|------|---------|
| `pages/_app.js` | Root component wrapper, session provider |
| `pages/_document.js` | HTML structure wrapper |
| `lib/prisma.js` | Prisma client singleton |
| `lib/auth.js` | Auth utilities |
| `prisma/schema.prisma` | Database schema definition |
| `.env.local` | Environment variables (not committed) |
| `.env.example` | Example env vars (for documentation) |
| `package.json` | Dependencies and scripts |
| `next.config.js` | Next.js configuration |
| `jsconfig.json` | Path aliases |
| `.gitignore` | Git ignore rules |

---

## 🆘 Getting Help

When stuck:

1. **Check Documentation**: See `/docs` folder
2. **Search Error**: Copy full error message into Google
3. **Check Logs**: Look at terminal output and browser console
4. **Restart Server**: Kill and restart `npm run dev`
5. **Clear Cache**: `npm cache clean --force && rm -rf .next`
6. **Ask on Forums**: 
   - Stack Overflow
   - GitHub Discussions
   - Reddit: r/nextjs, r/reactjs
   - Discord communities

---

**Version**: 1.0  
**Last Updated**: 2024  
**Keep This Handy While Developing!**
