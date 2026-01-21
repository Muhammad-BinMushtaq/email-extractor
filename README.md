# 📧 Email Scraper

A beautiful web application for scraping email addresses from websites using the ScrapingBee API. Extract emails and export them to CSV with an intuitive UI.

## 🌟 Features

- **Beautiful UI**: Modern, responsive interface with gradient design
- **Email Extraction**: Scrape emails from any website URL
- **CSV Export**: Download scraped emails in CSV format with timestamps
- **Copy to Clipboard**: Quickly copy individual email addresses
- **Real-time Feedback**: Loading spinners, error messages, and success notifications
- **Mobile Responsive**: Works perfectly on desktop and mobile devices

## 🛠️ Tech Stack

- **Backend**: Node.js + Express.js
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Web Scraping**: ScrapingBee API
- **Package Manager**: npm

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm
- ScrapingBee API key

## 🚀 Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/email-scraper.git
cd email-scraper
```

2. **Install dependencies**
```bash
npm install
```

3. **Update API Key**
Open `test.js` and replace the API key:
```javascript
const client = new scrapingbee.ScrapingBeeClient('YOUR_API_KEY_HERE');
```

4. **Start the server**
```bash
npm start
```

5. **Open in browser**
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
