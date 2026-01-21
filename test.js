import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const scrapingbee = require('scrapingbee');

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());
app.use(express.static(__dirname));

// Scraping function
async function scrapeEmails(url) {
  const client = new scrapingbee.ScrapingBeeClient('BGTLORKDB65S6YUBAJ5SY1COHW69VQC8FQ349U6QRNB8UD1T5DUBSH6WNZ76OSUF36QV3Y7ZNX2EFO7F');
  const response = await client.get({
    url: url,
    params: {
      extract_rules: {
        "email_addresses": {
          "selector": "a[href^='mailto']@href",
          "type": "list"
        }
      }
    }
  });
  return response;
}

// API endpoint for scraping - accepts URL from frontend
app.post("/api/scrape", async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const response = await scrapeEmails(url);
    const data = JSON.parse(response.data.toString());
    
    // Extract emails from the response
    const emails = data.email_addresses || [];

    res.json({ 
      success: true,
      emails: emails,
      count: emails.length
    });
  } catch (error) {
    console.error('Scraping error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to scrape website' 
    });
  }
});

// Serve the frontend
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`🌐 Open your browser and go to http://localhost:${PORT}`);
});