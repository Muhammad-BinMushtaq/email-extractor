# 📧 Email Campaign Manager

A professional email scraping, drafting, and campaign management platform. Extract emails, create targeted campaigns, and send bulk emails with ease.

**Live Demo**: https://email-extractor-one.vercel.app/

**Made by**: [Muhammad Bin Mushtaq](https://github.com/Muhammad-BinMushtaq)  
**Portfolio**: https://muhammadcode.netlify.app/  
**LinkedIn**: https://www.linkedin.com/in/muhammad-binmushtaq/

---

## 🌟 Features

### Core Features
- ✅ **Email Scraping** - Extract emails from any website using regex
- ✅ **Email Composition** - 9 professional templates by category (Principal, Professor, University, HR, CTO, Investor, etc.)
- ✅ **Email Drafting** - Generate email drafts with AI-powered templates
- ✅ **Bulk Email Sending** - Send campaigns to multiple recipients (Gmail integration)
- ✅ **Draft Management** - Save, load, and organize email drafts
- ✅ **Responsive Design** - Mobile-friendly interface

### Pricing Tiers
- **Free**: 10 email scrapes/day, 20 emails/month
- **Premium**: Unlimited scraping, 100 emails/month - Rs. 499 (EasyPaisa)
- **Enterprise**: Custom pricing with API access

---

## 🛠️ Tech Stack

- **Backend**: Node.js + Express.js (Vercel serverless)
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Email Scraping**: Regex-based extraction (axios)
- **Email Sending**: Nodemailer (Gmail SMTP)
- **Deployment**: Vercel (serverless functions)
- **Package Manager**: npm

---

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm
- Gmail account with app-specific password (for email sending)

---

## 🚀 Installation & Setup

### Local Development

1. **Clone the repository**
```bash
git clone https://github.com/Muhammad-BinMushtaq/email-extractor.git
cd email-extractor
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the server**
```bash
npm start
```

Server runs on `http://localhost:3000`

### Deployment to Vercel

1. **Push to GitHub** (already configured)
2. **Connect to Vercel**: https://vercel.com
3. **Auto-deployment** on every GitHub push
4. **Live at**: https://email-extractor-one.vercel.app/

---

## 🔐 API Security & Protection

### Current Protection
- ✅ **Rate Limiting**: Free tier limited to 10 requests/day
- ✅ **Public APIs**: For demo purposes (can be restricted with API keys)

### Production Recommendations
```javascript
// Add API Key authentication
const VALID_API_KEYS = {
    'your-api-key-1': { tier: 'premium' },
    'your-api-key-2': { tier: 'free' }
};

// Implement in middleware:
app.use((req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    if (!VALID_API_KEYS[apiKey]) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
});
```

### Security Best Practices
1. **Never share API keys** - Keep them in `.env` files
2. **Use HTTPS** - All connections encrypted
3. **Rate Limiting** - Prevent abuse
4. **Input Validation** - Sanitize all inputs
5. **CORS** - Restrict to known domains
6. **Email Credentials** - Use app-specific passwords, never master password

---

## 📡 API Endpoints

### 1. Scrape Emails
```bash
POST /api/scrape
Content-Type: application/json

{
  "url": "https://example.com"
}

Response:
{
  "success": true,
  "emails": ["contact@example.com", "info@example.com"],
  "count": 2
}
```

### 2. Generate Email Draft
```bash
POST /api/generate-email
Content-Type: application/json

{
  "subject": "Collaboration Proposal",
  "targetCompany": "ABC Company",
  "purpose": "Partnership Discussion"
}

Response:
{
  "success": true,
  "emailDraft": "Dear Hiring Manager...",
  "subject": "Collaboration Proposal"
}
```

### 3. Send Bulk Emails
```bash
POST /api/send-email
Content-Type: application/json

{
  "emailAddresses": ["user1@example.com", "user2@example.com"],
  "subject": "Campaign Subject",
  "emailBody": "Email content here",
  "senderEmail": "your-email@gmail.com",
  "senderPassword": "app-specific-password"
}

Response:
{
  "success": true,
  "results": [
    { "email": "user1@example.com", "status": "sent", "messageId": "..." },
    { "email": "user2@example.com", "status": "sent", "messageId": "..." }
  ],
  "totalSent": 2,
  "totalFailed": 0
}
```

### 4. Save Email Draft
```bash
POST /api/save-email
Content-Type: application/json

{
  "subject": "Email Subject",
  "emailBody": "Email content",
  "filename": "my-draft"
}

Response:
{
  "success": true,
  "message": "Email saved as my-draft",
  "filepath": "/saved_emails/my-draft.json"
}
```

### 5. Get Saved Emails List
```bash
GET /api/saved-emails

Response:
{
  "success": true,
  "emails": [
    { "filename": "draft-1", "filepath": "..." },
    { "filename": "draft-2", "filepath": "..." }
  ]
}
```

### 6. Load Saved Email
```bash
GET /api/load-email/:filename

Response:
{
  "success": true,
  "email": {
    "subject": "Email Subject",
    "body": "Email content",
    "savedDate": "1/21/2026, 3:45:00 PM",
    "filename": "draft-1"
  }
}
```

### 7. Delete Saved Email
```bash
DELETE /api/delete-email/:filename

Response:
{
  "success": true,
  "message": "Email draft-1 deleted successfully"
}
```

---

## 📝 Usage Examples

### Scraping Emails
1. Go to "🔍 Scrape Emails" tab
2. Enter website URL (e.g., `https://example.com`)
3. Click "Scrape Emails"
4. Copy emails or use in campaign

### Composing Professional Email
1. Go to "📝 Compose Email" tab
2. Select category (e.g., "Professor/Teacher")
3. Enter recipient name and purpose
4. Click "Generate Email"
5. Copy email text

### Sending Campaign
1. Go to "📤 Send Campaign" tab
2. Paste email addresses (or scrape them)
3. Enter subject and email body
4. Add Gmail credentials
5. Click "Send Campaign"

### Saving Drafts
1. After generating email, click "Save Draft"
2. Name your draft
3. Reload anytime from saved emails

---

## 🎨 Email Templates (Categories)

1. **Principal/Headmaster** - School leadership outreach
2. **Professor/Teacher** - Academic collaboration requests
3. **University/Institution** - Educational inquiries
4. **HR/Recruiter** - Job applications and inquiries
5. **CTO/Tech Lead** - Technical partnerships
6. **Investor/VC** - Funding pitches
7. **Business Client** - B2B communications
8. **Vendor/Supplier** - Supplier relations
9. **Media/Press** - Press releases

---

## 💳 Payment Integration

### EasyPaisa (Pakistan)
- **Free Plan**: Rs. 0 (10 scrapes/day limit)
- **Premium Plan**: Rs. 499/month (Unlimited)
- **Enterprise**: Custom pricing

Payment gateway integration coming soon!

---

## 🐛 Troubleshooting

### "Rate limit exceeded"
- You've exceeded the free tier limit (10 scrapes/day)
- Solution: Upgrade to Premium or wait until next day

### "Failed to scrape website"
- Website might be blocking automated requests
- Solution: Try a different website or check URL validity

### "Failed to send email"
- Gmail credentials incorrect or 2FA enabled
- Solution: Use app-specific password from Gmail settings

### "Email address not found"
- Verify the email hasn't already been added
- Check file permissions in `saved_emails` folder

---

## 📊 Future Enhancements

See [FEATURES.md](FEATURES.md) for 20+ planned features including:
- CSV bulk import
- Email scheduling
- Analytics dashboard
- Follow-up automation
- Contact management
- Team collaboration
- Mobile app
- AI improvements

---

## 📄 License

This project is open source and available under the MIT License.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

- **GitHub**: https://github.com/Muhammad-BinMushtaq
- **LinkedIn**: https://www.linkedin.com/in/muhammad-binmushtaq/
- **Portfolio**: https://muhammadcode.netlify.app/

---

**Made with ❤️ by Muhammad Bin Mushtaq**5. **Open in browser**
```
http://localhost:3000
```

## 📝 Usage

1. Enter a website URL in the input field
2. Click "Scrape Emails" button
3. View extracted emails in the table
4. Copy individual emails or export all to CSV
5. Clear results and try another URL

## 📦 Project Structure

```
├── test.js          # Express server & API routes
├── index.html       # Frontend UI
├── package.json     # Dependencies
└── .gitignore       # Git ignore file
```

## 🔌 API Endpoints

### POST /api/scrape
Scrapes emails from a given URL

**Request Body:**
```json
{
  "url": "https://example.com"
}
```

**Response:**
```json
{
  "success": true,
  "emails": ["email1@example.com", "email2@example.com"],
  "count": 2
}
```

## 🌐 Deployment

### Deploy to Heroku
```bash
# Install Heroku CLI
# https://devcenter.heroku.com/articles/heroku-cli

heroku login
heroku create your-app-name
git push heroku main
heroku open
```

### Deploy to Vercel
```bash
# Install Vercel CLI
npm install -g vercel

vercel
```

### Deploy to Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

railway login
railway up
```

## 🔒 Security

- Never commit your API keys
- Use `.env` files for sensitive data (add to `.gitignore`)
- Environment variables should be set in deployment platform

## 📄 License

MIT License - feel free to use this project

## 👨‍💻 Author

Created with ❤️

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues and questions, please open an issue on GitHub.

---

Made with ❤️ using Node.js + ScrapingBee
