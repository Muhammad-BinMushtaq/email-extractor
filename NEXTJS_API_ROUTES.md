# 🔌 Next.js API Routes Architecture & Implementation Guide

**Purpose**: Define all backend API endpoints, request/response formats, authentication, and error handling  
**Status**: Design Phase  
**Version**: 3.0 API  

---

## 📋 API Routes Overview

```
/pages/api/
├── auth/
│   └── [...nextauth].js (NextAuth.js handler)
├── scrape.js (POST - Email scraping)
├── send-email.js (POST - Send bulk emails)
├── campaigns/ (Campaign management)
│   ├── index.js (GET, POST)
│   ├── [id].js (GET, PUT, DELETE)
│   └── [id]/send.js (POST - Send campaign)
├── emails/ (Email operations)
│   ├── save.js (POST - Save draft)
│   ├── saved.js (GET - Get all drafts)
│   └── [id].js (GET, DELETE)
├── payments/ (Payment management)
│   ├── submit.js (POST - User submits payment)
│   └── status.js (GET - Check payment status)
├── admin/ (Admin-only routes)
│   ├── stats.js (GET - Dashboard stats)
│   ├── payments.js (GET - All payments)
│   ├── payments/[id].js (PUT - Approve/reject)
│   ├── users.js (GET - All users)
│   └── users/[id].js (DELETE - Remove user)
└── health.js (GET - Health check)
```

---

## 🔐 Authentication & Authorization

### NextAuth Session
```js
// Get session in any API route
import { getSession } from 'next-auth/react';

export default async function handler(req, res) {
  const session = await getSession({ req });
  
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  const userId = session.user.id;
  // Use userId for database queries
}
```

### Admin Check
```js
async function isAdmin(req, res) {
  const session = await getSession({ req });
  if (!session) {
    res.status(401).json({ error: 'Not authenticated' });
    return false;
  }
  
  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  });
  
  if (!user || !user.isAdmin) {
    res.status(403).json({ error: 'Not authorized' });
    return false;
  }
  
  return true;
}
```

### Rate Limiting (Optional)
```js
// Use npm package: npm install express-rate-limit
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10 // Limit each IP to 10 requests per minute
});
```

---

## 📤 Core API Routes

### **1. Email Scraping Route**
```
POST /api/scrape
Purpose: Scrape emails from a website URL
```

**Request:**
```json
{
  "url": "https://example.com",
  "pattern": "email" // Optional filter
}
```

**Response (Success):**
```json
{
  "success": true,
  "emails": [
    "contact@example.com",
    "info@example.com"
  ],
  "count": 2,
  "source": "https://example.com"
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Invalid URL or no emails found"
}
```

**Implementation Notes:**
- Use Axios to fetch HTML
- Use Cheerio to parse DOM
- Use Regex for email extraction
- Validate against email pattern: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- Remove duplicates
- Log to database for analytics

**Code Skeleton:**
```js
import axios from 'axios';
import * as cheerio from 'cheerio';
import { getSession } from 'next-auth/react';
import prisma from '@/lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const session = await getSession({ req });
  if (!session) return res.status(401).json({ error: 'Unauthorized' });

  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL required' });

  try {
    // 1. Check search limit
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user.isPremium) {
      const searchCount = await prisma.searchLog.count({
        where: {
          userId: user.id,
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0))
          }
        }
      });

      if (searchCount >= 3) {
        return res.status(429).json({ 
          error: 'Daily search limit reached (3)',
          upgrade: true
        });
      }
    }

    // 2. Scrape emails
    const response = await axios.get(url, { timeout: 10000 });
    const $ = cheerio.load(response.data);
    const emailRegex = /[^\s@]+@[^\s@]+\.[^\s@]+/g;
    const html = $.html();
    const emails = [...new Set(html.match(emailRegex) || [])];

    // 3. Log search
    await prisma.searchLog.create({
      data: {
        userId: user.id,
        url,
        emailCount: emails.length
      }
    });

    res.status(200).json({
      success: true,
      emails,
      count: emails.length,
      source: url
    });
  } catch (error) {
    console.error('Scrape error:', error);
    res.status(500).json({ error: 'Scraping failed' });
  }
}
```

---

### **2. Send Email Route**
```
POST /api/send-email
Purpose: Send bulk emails to recipients
```

**Request:**
```json
{
  "emails": ["user1@test.com", "user2@test.com"],
  "subject": "Hello from EmailPro",
  "body": "This is the email body...",
  "sender": "your-gmail@gmail.com",
  "appPassword": "xxxx xxxx xxxx xxxx"
}
```

**Response (Success):**
```json
{
  "success": true,
  "sent": 2,
  "failed": 0,
  "results": [
    { email: "user1@test.com", status: "sent" },
    { email: "user2@test.com", status: "sent" }
  ]
}
```

**Implementation Notes:**
- Validate Gmail app password (16 characters, spaces)
- Use Nodemailer with Gmail SMTP
- Send one by one (or batch with delays to avoid rate limits)
- Return detailed results (success/failure for each)
- Store campaign in database
- Rate limit to prevent abuse

**Code Skeleton:**
```js
import nodemailer from 'nodemailer';
import { getSession } from 'next-auth/react';
import prisma from '@/lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const session = await getSession({ req });
  if (!session) return res.status(401).json({ error: 'Unauthorized' });

  const { emails, subject, body, sender, appPassword } = req.body;

  if (!emails || !subject || !body || !sender || !appPassword) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: sender,
        pass: appPassword
      }
    });

    // Send emails
    const results = [];
    for (const email of emails) {
      try {
        await transporter.sendMail({
          from: sender,
          to: email,
          subject,
          html: body
        });
        results.push({ email, status: 'sent' });
      } catch (error) {
        results.push({ email, status: 'failed', error: error.message });
      }
    }

    // Store campaign
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    await prisma.campaign.create({
      data: {
        userId: user.id,
        subject,
        body,
        recipientCount: emails.length,
        successCount: results.filter(r => r.status === 'sent').length,
        failureCount: results.filter(r => r.status === 'failed').length
      }
    });

    res.status(200).json({
      success: true,
      sent: results.filter(r => r.status === 'sent').length,
      failed: results.filter(r => r.status === 'failed').length,
      results
    });
  } catch (error) {
    console.error('Send email error:', error);
    res.status(500).json({ error: 'Failed to send emails' });
  }
}
```

---

### **3. Save Email Draft Route**
```
POST /api/emails/save
Purpose: Save email draft to database
```

**Request:**
```json
{
  "subject": "Email subject",
  "body": "Email content",
  "category": "Principal",
  "title": "My Draft Name"
}
```

**Response:**
```json
{
  "success": true,
  "id": "uuid-1234",
  "message": "Email saved successfully"
}
```

**Code Skeleton:**
```js
import { getSession } from 'next-auth/react';
import prisma from '@/lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const session = await getSession({ req });
  if (!session) return res.status(401).json({ error: 'Unauthorized' });

  const { subject, body, category, title } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    const savedEmail = await prisma.savedEmail.create({
      data: {
        userId: user.id,
        subject,
        body,
        category,
        title: title || 'Untitled'
      }
    });

    res.status(201).json({
      success: true,
      id: savedEmail.id,
      message: 'Email saved successfully'
    });
  } catch (error) {
    console.error('Save error:', error);
    res.status(500).json({ error: 'Failed to save email' });
  }
}
```

---

### **4. Get Saved Emails Route**
```
GET /api/emails/saved
Purpose: Retrieve all saved email drafts for user
```

**Response:**
```json
{
  "success": true,
  "emails": [
    {
      "id": "uuid-1234",
      "title": "Principal Email",
      "subject": "Request for Internship",
      "body": "Dear Principal...",
      "category": "Principal",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

**Code Skeleton:**
```js
import { getSession } from 'next-auth/react';
import prisma from '@/lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const session = await getSession({ req });
  if (!session) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    const savedEmails = await prisma.savedEmail.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({
      success: true,
      emails: savedEmails
    });
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch emails' });
  }
}
```

---

### **5. Delete Email Draft Route**
```
DELETE /api/emails/[id]
Purpose: Delete a saved email draft
```

**Response:**
```json
{
  "success": true,
  "message": "Email deleted successfully"
}
```

---

### **6. Submit Payment Route**
```
POST /api/payments/submit
Purpose: Record user payment submission
```

**Request:**
```json
{
  "transactionId": "EasyPaisa123456",
  "amount": 499
}
```

**Response:**
```json
{
  "success": true,
  "paymentId": "uuid-5678",
  "status": "pending",
  "message": "Payment submitted for verification"
}
```

**Code Skeleton:**
```js
import { getSession } from 'next-auth/react';
import prisma from '@/lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const session = await getSession({ req });
  if (!session) return res.status(401).json({ error: 'Unauthorized' });

  const { transactionId, amount } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    const payment = await prisma.payment.create({
      data: {
        userId: user.id,
        transactionId,
        amount,
        status: 'pending'
      }
    });

    res.status(201).json({
      success: true,
      paymentId: payment.id,
      status: 'pending',
      message: 'Payment submitted for verification'
    });
  } catch (error) {
    console.error('Payment error:', error);
    res.status(500).json({ error: 'Failed to submit payment' });
  }
}
```

---

### **7. Admin Approve Payment Route**
```
PUT /api/admin/payments/[id]
Purpose: Admin approves or rejects payment
```

**Request:**
```json
{
  "action": "approve"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment approved",
  "userNowPremium": true
}
```

**Code Skeleton:**
```js
import { getSession } from 'next-auth/react';
import prisma from '@/lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const session = await getSession({ req });
  if (!session) return res.status(401).json({ error: 'Unauthorized' });

  // Check admin
  const admin = await prisma.user.findUnique({
    where: { email: session.user.email }
  });

  if (!admin.isAdmin) {
    return res.status(403).json({ error: 'Not authorized' });
  }

  const { id } = req.query;
  const { action } = req.body;

  try {
    if (action === 'approve') {
      const payment = await prisma.payment.findUnique({
        where: { id }
      });

      // Update payment status
      await prisma.payment.update({
        where: { id },
        data: { status: 'approved', approvedAt: new Date() }
      });

      // Set user as premium
      await prisma.user.update({
        where: { id: payment.userId },
        data: { isPremium: true }
      });

      res.status(200).json({
        success: true,
        message: 'Payment approved',
        userNowPremium: true
      });
    } else if (action === 'reject') {
      await prisma.payment.update({
        where: { id },
        data: { status: 'rejected', approvedAt: new Date() }
      });

      res.status(200).json({
        success: true,
        message: 'Payment rejected'
      });
    }
  } catch (error) {
    console.error('Admin approval error:', error);
    res.status(500).json({ error: 'Failed to process payment' });
  }
}
```

---

### **8. Admin Stats Route**
```
GET /api/admin/stats
Purpose: Get dashboard statistics for admin
```

**Response:**
```json
{
  "success": true,
  "stats": {
    "totalUsers": 150,
    "premiumUsers": 45,
    "totalRevenue": 22455,
    "pendingPayments": 5,
    "approvedPayments": 40,
    "rejectedPayments": 5,
    "totalEmails": 50000,
    "totalCampaigns": 300
  }
}
```

**Code Skeleton:**
```js
import { getSession } from 'next-auth/react';
import prisma from '@/lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const session = await getSession({ req });
  if (!session) return res.status(401).json({ error: 'Unauthorized' });

  // Check admin
  const admin = await prisma.user.findUnique({
    where: { email: session.user.email }
  });

  if (!admin.isAdmin) {
    return res.status(403).json({ error: 'Not authorized' });
  }

  try {
    const stats = {
      totalUsers: await prisma.user.count(),
      premiumUsers: await prisma.user.count({ where: { isPremium: true } }),
      totalRevenue: (await prisma.payment.aggregate({
        where: { status: 'approved' },
        _sum: { amount: true }
      }))._sum.amount || 0,
      pendingPayments: await prisma.payment.count({ where: { status: 'pending' } }),
      approvedPayments: await prisma.payment.count({ where: { status: 'approved' } }),
      rejectedPayments: await prisma.payment.count({ where: { status: 'rejected' } }),
      totalCampaigns: await prisma.campaign.count(),
      totalEmails: (await prisma.campaign.aggregate({
        _sum: { recipientCount: true }
      }))._sum.recipientCount || 0
    };

    res.status(200).json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
}
```

---

## 🛠️ Error Handling

All API routes should follow this pattern:

```js
// 400 - Bad Request (missing/invalid fields)
res.status(400).json({ error: 'Missing required fields' });

// 401 - Unauthorized (not logged in)
res.status(401).json({ error: 'Unauthorized' });

// 403 - Forbidden (logged in but not authorized)
res.status(403).json({ error: 'Not authorized' });

// 429 - Too Many Requests (rate limit)
res.status(429).json({ error: 'Rate limit exceeded' });

// 500 - Server Error
res.status(500).json({ error: 'Internal server error' });
```

---

## 📚 API Documentation

Create comprehensive API docs at `/docs/API.md` including:
- All endpoints (method, path, purpose)
- Request examples (curl, JavaScript)
- Response examples (success, error)
- Authentication requirements
- Rate limits
- Error codes and meanings

---

## ✅ API Routes Checklist

### Phase 5
- [ ] Authentication middleware
- [ ] /api/scrape.js
- [ ] /api/send-email.js
- [ ] /api/emails/save.js
- [ ] /api/emails/saved.js
- [ ] /api/emails/[id].js
- [ ] /api/campaigns/index.js
- [ ] /api/campaigns/[id].js
- [ ] /api/campaigns/[id]/send.js
- [ ] /api/payments/submit.js
- [ ] /api/payments/status.js
- [ ] /api/admin/stats.js
- [ ] /api/admin/payments.js
- [ ] /api/admin/payments/[id].js
- [ ] /api/admin/users.js
- [ ] /api/health.js
- [ ] Error handling utilities
- [ ] Rate limiting setup
- [ ] API documentation

---

**Version**: 1.0  
**Status**: Design Phase  
**Next**: Implement routes in Phase 5
