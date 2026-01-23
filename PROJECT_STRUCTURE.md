# Project Structure

This document describes the organization of the Email Campaign Manager codebase.

## Overview

The project has been refactored from a monolithic 1473-line HTML file into a clean, modular structure for better maintainability and performance.

## Directory Structure

```
email-extractor/
├── api/
│   └── index.js              # Vercel serverless API endpoints
├── public/                   # Static frontend files
│   ├── index.html           # Main HTML (341 lines)
│   ├── styles/
│   │   └── main.css         # All application styles (569 lines)
│   └── js/
│       └── main.js          # Client-side JavaScript (561 lines)
├── test.js                  # Local development server
├── package.json             # Dependencies and scripts
├── vercel.json              # Vercel deployment configuration
└── README.md                # Project documentation
```

## Key Files

### Frontend (public/)

- **index.html**: Minimal HTML structure with external CSS/JS references
  - Reduced from 1473 to 341 lines (77% reduction)
  - Better browser caching with separate files
  - Easier to maintain and debug

- **styles/main.css**: All application styles
  - CSS variables for theming
  - Component-specific styles (navbar, cards, forms, etc.)
  - Responsive media queries
  - 569 lines of organized CSS

- **js/main.js**: Client-side application logic
  - User authentication handling
  - Tab switching and UI interactions
  - API calls (scrape, compose, send emails)
  - Draft management
  - Payment modal handling
  - Admin dashboard logic
  - 561 lines of JavaScript

### Backend

- **api/index.js**: Production API (Vercel serverless)
  - Email scraping endpoint
  - Email composition endpoint
  - Bulk email sending
  - Draft save/load/delete operations
  - Rate limiting middleware

- **test.js**: Local development server
  - Same API endpoints as api/index.js
  - Serves static files from public/
  - Local testing and development

## Development Workflow

### Local Development

```bash
# Install dependencies
npm install

# Start local server
npm start

# Server runs at http://localhost:3000
```

### Production Deployment

The project is configured for Vercel deployment:
- Push to GitHub triggers automatic deployment
- `api/index.js` handles API routes
- `public/` directory serves static files
- Configuration in `vercel.json`

## Benefits of New Structure

1. **Maintainability**: Separated concerns make code easier to understand and modify
2. **Performance**: Browser can cache CSS and JS files separately
3. **Collaboration**: Team members can work on different files without conflicts
4. **Debugging**: Easier to locate and fix issues in specific files
5. **Scalability**: Ready for future enhancements and module additions

## Future Improvements

- Split CSS into multiple files (base, components, responsive)
- Split JS into modules (api.js, ui.js, auth.js)
- Add build tooling (Webpack/Vite) for optimization
- Implement environment variables for configuration
- Add TypeScript for type safety
