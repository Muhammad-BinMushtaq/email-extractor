import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import axios from 'axios';
import nodemailer from 'nodemailer';

const require = createRequire(import.meta.url);

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(express.static(__dirname));

// Scraping function using axios
async function scrapeEmails(url) {
    try {
        const response = await axios.get(url);
        const html = response.data;
        
        // Extract emails from HTML using regex
        const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
        const emails = [...new Set(html.match(emailRegex) || [])]; // Remove duplicates
        
        return emails;
    } catch (error) {
        console.error('Scraping error:', error.message);
        throw error;
    }
}

// Simple email generation template
function generateEmailDraftSimple(subject, targetCompany, purpose) {
    const emailTemplate = `Dear Hiring Manager,

I hope this email finds you well. I am writing to you regarding ${purpose} at ${targetCompany}.

With my strong background and proven expertise, I believe I can bring significant value to your organization. I am confident that my skills and experience align perfectly with what you are looking for.

I would welcome the opportunity to discuss how I can contribute to your team. I am available at your earliest convenience for a discussion.

Thank you for considering my application. I look forward to hearing from you soon.

Best regards,
[Your Name]`;

    return emailTemplate;
}

// API endpoint for scraping
app.post("/api/scrape", async (req, res) => {
    try {
        const { url } = req.body;

        if (!url) {
            return res.status(400).json({ error: 'URL is required' });
        }

        const emails = await scrapeEmails(url);

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

// API endpoint for generating email draft
app.post("/api/generate-email", async (req, res) => {
    try {
        const { subject, targetCompany, purpose } = req.body;

        if (!subject || !targetCompany || !purpose) {
            return res.status(400).json({ error: 'Subject, target company, and purpose are required' });
        }

        // Generate simple email template
        const emailDraft = generateEmailDraftSimple(subject, targetCompany, purpose);

        res.json({
            success: true,
            emailDraft: emailDraft,
            subject: subject
        });
    } catch (error) {
        console.error('Email generation error:', error);
        res.status(500).json({
            error: error.message || 'Failed to generate email'
        });
    }
});

// API endpoint for sending emails
app.post("/api/send-email", async (req, res) => {
    try {
        const { emailAddresses, subject, emailBody, senderEmail, senderPassword } = req.body;

        if (!emailAddresses || !subject || !emailBody || !senderEmail || !senderPassword) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Create transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: senderEmail,
                pass: senderPassword
            }
        });

        // Send emails
        const results = [];
        for (const email of emailAddresses) {
            try {
                const info = await transporter.sendMail({
                    from: senderEmail,
                    to: email,
                    subject: subject,
                    html: emailBody.replace(/\n/g, '<br>')
                });
                results.push({ email, status: 'sent', messageId: info.messageId });
            } catch (err) {
                results.push({ email, status: 'failed', error: err.message });
            }
        }

        res.json({
            success: true,
            results: results,
            totalSent: results.filter(r => r.status === 'sent').length,
            totalFailed: results.filter(r => r.status === 'failed').length
        });
    } catch (error) {
        console.error('Email sending error:', error);
        res.status(500).json({
            error: error.message || 'Failed to send emails'
        });
    }
});

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve the frontend
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API endpoint to save email draft
app.post("/api/save-email", (req, res) => {
    try {
        const { subject, emailBody, filename } = req.body;

        if (!subject || !emailBody || !filename) {
            return res.status(400).json({ error: 'Subject, email body, and filename are required' });
        }

        const fs = require('fs');
        const emailData = {
            subject: subject,
            body: emailBody,
            savedDate: new Date().toLocaleString(),
            filename: filename
        };

        const savePath = path.join(__dirname, 'saved_emails', `${filename}.json`);
        const saveDir = path.join(__dirname, 'saved_emails');

        // Create directory if it doesn't exist
        if (!fs.existsSync(saveDir)) {
            fs.mkdirSync(saveDir, { recursive: true });
        }

        // Save the email
        fs.writeFileSync(savePath, JSON.stringify(emailData, null, 2));

        res.json({
            success: true,
            message: `Email saved as ${filename}`,
            filepath: savePath
        });
    } catch (error) {
        console.error('Save email error:', error);
        res.status(500).json({
            error: error.message || 'Failed to save email'
        });
    }
});

// API endpoint to get saved emails list
app.get("/api/saved-emails", (req, res) => {
    try {
        const fs = require('fs');
        const emailDir = path.join(__dirname, 'saved_emails');

        if (!fs.existsSync(emailDir)) {
            return res.json({ success: true, emails: [] });
        }

        const files = fs.readdirSync(emailDir);
        const emails = files
            .filter(file => file.endsWith('.json'))
            .map(file => ({
                filename: file.replace('.json', ''),
                filepath: path.join(emailDir, file)
            }));

        res.json({
            success: true,
            emails: emails
        });
    } catch (error) {
        console.error('Get saved emails error:', error);
        res.status(500).json({
            error: error.message || 'Failed to fetch saved emails'
        });
    }
});

// API endpoint to load a saved email
app.get("/api/load-email/:filename", (req, res) => {
    try {
        const fs = require('fs');
        const filename = req.params.filename;
        const filePath = path.join(__dirname, 'saved_emails', `${filename}.json`);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'Email file not found' });
        }

        const emailData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        res.json({
            success: true,
            email: emailData
        });
    } catch (error) {
        console.error('Load email error:', error);
        res.status(500).json({
            error: error.message || 'Failed to load email'
        });
    }
});

// API endpoint to delete a saved email
app.delete("/api/delete-email/:filename", (req, res) => {
    try {
        const fs = require('fs');
        const filename = req.params.filename;
        const filePath = path.join(__dirname, 'saved_emails', `${filename}.json`);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'Email file not found' });
        }

        fs.unlinkSync(filePath);

        res.json({
            success: true,
            message: `Email ${filename} deleted successfully`
        });
    } catch (error) {
        console.error('Delete email error:', error);
        res.status(500).json({
            error: error.message || 'Failed to delete email'
        });
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log(`🌐 Open your browser and go to http://localhost:${PORT}`);
});