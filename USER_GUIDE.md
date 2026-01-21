# 📱 User Guide - EmailPro v2.0

## Welcome to EmailPro! 👋

This guide will help you get started with the newly redesigned EmailPro platform with professional UI, authentication, and advanced features.

---

## 🔐 Getting Started

### Step 1: Sign In with Google
1. Visit: https://email-extractor-one.vercel.app/
2. Click the **"Sign in with Google"** button in the hero section (or navbar)
3. Enter your email address
4. Enter your full name
5. Click **"Continue"**
6. You're now logged in! ✅

**Your Profile:**
- Name appears in the top-right navbar
- Avatar shows your first initial
- Email is securely stored in your browser

### Step 2: Check Your Search Limit
After signing in, you'll see a **Search Limit Indicator** in the Scraper tab:
```
Daily Search Limit (Free)       0/3
[░░░░░░░░░░░░░░░░░░░░░░░░░░░░] 0%
```
- **Free users**: 3 searches per day
- **Premium users**: Unlimited searches
- Limit resets daily at midnight UTC

---

## 🔍 Using the Email Scraper

### Basic Scraping
1. **Click "Scraper"** in the sidebar (or navbar)
2. **Enter a URL**: https://example.com
3. **Click "Scrape Emails"** button
4. Wait for results (usually 2-5 seconds)
5. **View Found Emails**: Results appear in a grid
6. **Copy Emails**: Click the 📋 icon next to any email to copy it

### Example Results
```
Found 15 Emails:
[email1@company.com] 📋
[email2@company.com] 📋
[email3@company.com] 📋
... and 12 more
```

### Search Limit Tips
- Track your usage with the progress bar
- Each successful scrape counts as 1 search
- Even if scraping finds 0 emails, it counts toward your limit
- Get 3 free searches: Use them wisely!
- Upgrade to Premium for unlimited access

---

## ✏️ Creating Professional Emails

### Step 1: Select Category
1. Go to **Composer** tab
2. Select from **9 Email Categories**:
   - 🎓 Principal/Headmaster
   - 👨‍🏫 Professor/Teacher
   - 🏫 University/Institution
   - 💼 HR/Recruiter
   - 🖥️ CTO/Tech Lead
   - 💰 Investor/VC
   - 🤝 Business Client
   - 📦 Vendor/Supplier
   - 📰 Media/Press

### Step 2: Customize Your Email
1. **Recipient Name**: Who are you emailing? (e.g., "Dr. Smith")
2. **Purpose**: What's your goal? (e.g., "Partnership", "Job Application")
3. **Click "Generate Email"**
4. AI-powered template generates a professional email tailored to your needs

### Step 3: Review & Edit
- **Subject Line**: Auto-generated based on category
- **Email Body**: Full template appears
- **Edit as Needed**: Modify placeholders manually

### Step 4: Use in Campaign
Choose one of these options:

**Option A: Send Immediately**
- Click "Use in Campaign"
- Fills the Campaign tab with subject and body
- Go to Campaign tab to send

**Option B: Save for Later**
- Click "Save Draft"
- Appears in the "Saved" tab
- Edit and use anytime

---

## 📧 Sending Email Campaigns

### Setup Your Sender Account
1. Go to **Campaign** tab
2. Fill in **Sender Email**: your-email@gmail.com
3. Fill in **Gmail Password**: 
   - **⚠️ Important**: Use an **App-Specific Password**, NOT your regular Gmail password
   - [Generate App Password Here](https://myaccount.google.com/apppasswords)

### Add Recipients
1. **Paste Email Addresses**: One per line or comma-separated
   ```
   email1@company.com
   email2@company.com, email3@company.com
   ```
2. Add as many as you want (no limit for premium)

### Compose Your Message
1. **Subject**: Email subject line
2. **Email Body**: Full HTML/text content
3. Tip: Use the Composer tab to generate templates first!

### Send Campaign
1. Click **"Send Campaign"** button
2. Wait for confirmation
3. See results:
   ```
   ✅ Campaign sent! 48 sent, 2 failed
   ```

### Email Sending Tips
- Test with 1-2 emails first
- Check Gmail authentication settings
- Large campaigns (100+) may take a few minutes
- Failed emails usually indicate invalid addresses

---

## 📑 Managing Your Drafts

### Save a Draft
Multiple ways to save:
1. **From Composer**: Click "Save Draft" button
2. **From Campaign**: Content auto-saves in localStorage

### View Saved Drafts
1. Click **"Saved"** in the sidebar
2. See all your saved drafts in a table:
   ```
   | Subject | Saved Date | Actions |
   |---------|------------|---------|
   | Email 1 | 12/15/2024 | [Use] [Delete] |
   | Email 2 | 12/14/2024 | [Use] [Delete] |
   ```

### Use a Draft
1. Find draft in "Saved" tab
2. Click **"Use"** button
3. Auto-fills Campaign tab
4. Ready to send!

### Delete a Draft
1. Click **"Delete"** button
2. Confirm deletion
3. Draft is permanently removed

---

## 💳 Upgrading to Premium

### Why Upgrade?
- ✅ **Unlimited Email Scraping** (vs. 3/day free)
- ✅ **100+ Emails/Month** (vs. limited free tier)
- ✅ **Priority Support** (coming soon)
- ✅ **Advanced Analytics** (coming soon)
- ✅ **Custom Templates** (coming soon)

### How to Upgrade
1. Click **"💳 Premium"** button in navbar
2. Payment modal opens
3. Fill in:
   - **Transaction ID**: From your EasyPaisa receipt (TXN123456789)
   - **Email Address**: Verify your email
4. Click **"Pay Rs. 499"**
5. Message: "✅ Payment submitted! Waiting for approval..."
6. **Admin Approval**: Within 24 hours, admin reviews and approves
7. Once approved: Premium badge appears on your profile! 🎉

### Payment Status
- **Pending**: Waiting for admin review
- **Approved**: Premium status activated ✅
- **Rejected**: Payment declined (contact support)

---

## 👤 User Profile & Settings

### View Your Profile
Click your **avatar + name** in the top-right navbar
- Shows: Email, Status (Free/Premium), Login date
- Manage account settings (coming soon)

### Sign Out (Logout)
- Currently: Refresh browser or clear localStorage
- Coming soon: Logout button in profile menu

### Your Data
- **Securely stored**: In your browser's localStorage
- **Private**: Not shared with anyone
- **Future**: Optional cloud backup with PostgreSQL

---

## 🔐 Admin Dashboard (Password Protected)

**Only for Admins** - View payments and manage the platform

### Access Admin Panel
1. Click **🔐** button (bottom-right)
2. Enter password: `123456`
3. Admin Dashboard opens

### What Admins Can Do
- **View Statistics**:
  - Total Users
  - Pending Payments
  - Approved Payments
  - Total Revenue (PKR)

- **Manage Payments**:
  - See all payment requests
  - View Transaction ID, Amount, Date
  - Click ✅ to approve payment
  - Click ✕ to reject payment

- **User Management** (coming soon):
  - View user activity
  - Block/unblock users
  - Refund payments

---

## 📊 Features Breakdown

### Free Plan
| Feature | Free | Premium |
|---------|------|---------|
| Daily Email Scrapes | 3 | Unlimited |
| Email Templates | All 9 | All 9 |
| Bulk Sending | Unlimited | Unlimited |
| Draft Storage | Unlimited | Unlimited |
| Google Sign-In | ✅ | ✅ |
| Admin Support | Soon | Priority |

### Coming Soon Features
- 🔜 **Database Storage**: PostgreSQL + Prisma
- 🔜 **Email Verification**: OTP confirmation
- 🔜 **2FA**: Two-factor authentication
- 🔜 **API Keys**: Programmatic access
- 🔜 **Webhooks**: Real-time notifications
- 🔜 **Analytics**: Detailed campaign metrics
- 🔜 **A/B Testing**: Compare email variants
- 🔜 **Email Scheduling**: Send at specific times

---

## 🆘 Troubleshooting

### "Sign in" button not working
- ❌ Problem: Modal doesn't open
- ✅ Solution: Refresh page, clear browser cache
- ✅ Solution: Try a different browser (Chrome/Firefox)

### Can't find scraped emails
- ❌ Problem: No emails found on website
- ✅ Solution: Check if website is accessible
- ✅ Solution: Try a different website
- ✅ Solution: Some websites block scrapers

### Email not sending
- ❌ Problem: "Failed to send email" error
- ✅ Solution: Use Gmail App-Specific Password (not regular password)
- ✅ Solution: Enable "Less secure app access" in Gmail
- ✅ Solution: Check email addresses are valid (test with 1 email first)
- ✅ Solution: Gmail may have SMTP limits

### Search limit not updating
- ❌ Problem: Limit shows 0/3 but should be 1/3
- ✅ Solution: Refresh page to update
- ✅ Solution: Check localStorage not disabled
- ✅ Solution: Sign in again

### Can't access admin dashboard
- ❌ Problem: Wrong password
- ✅ Solution: Default password is `123456`
- ✅ Solution: Contact site administrator to change

### Data not saving
- ❌ Problem: Drafts disappear after refresh
- ✅ Solution: Browser localStorage might be disabled
- ✅ Solution: Clear browser cache (Settings > Clear data)
- ✅ Solution: Try a different browser

---

## 💡 Pro Tips

1. **Batch Your Searches**: Plan emails before scraping to use searches wisely
2. **Use Templates**: Composer templates save time vs. writing from scratch
3. **Test First**: Send test email to yourself before bulk campaigns
4. **Save Drafts**: Keep templates for reuse in "Saved" tab
5. **Organize Recipients**: Group similar recipients for better campaigns
6. **Track Results**: Note which emails get responses
7. **Upgrade Early**: Premium is worth it for regular users (Rs. 499/month)

---

## 📞 Support & Contact

- **GitHub Issues**: [Muhammad-BinMushtaq/email-extractor](https://github.com/Muhammad-BinMushtaq/email-extractor)
- **Email**: support@emailpro.io (coming soon)
- **Twitter**: [@EmailProTeam](https://twitter.com) (coming soon)
- **Discord Community**: [Join our server](https://discord.gg) (coming soon)

---

## 🎓 Getting Help

1. **Check this guide first** - Most answers are here
2. **Visit GitHub Issues** - Others may have similar problems
3. **Contact support** - For urgent issues

---

**Version**: 2.0 (Professional UI Redesign)  
**Last Updated**: December 2024  
**Status**: ✅ Production Ready

Happy emailing! 📧
