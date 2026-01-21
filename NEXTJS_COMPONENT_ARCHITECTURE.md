# 🎨 Next.js Component Architecture & Design System

**Purpose**: Define all React components, their props, responsibilities, and design patterns  
**Status**: Design Phase  
**Version**: 3.0 Design  

---

## 📐 Component Hierarchy

```
App (_app.js)
├── Layout
│   ├── Navbar
│   │   ├── Logo
│   │   ├── NavLinks
│   │   ├── Premium Button
│   │   └── User Profile Dropdown
│   ├── Sidebar
│   │   └── NavItems (Scraper, Composer, Campaign, Saved)
│   └── Main Content
│       ├── Hero (home page)
│       ├── Dashboard
│       │   ├── ScraperTab
│       │   │   ├── URLInput
│       │   │   ├── SearchLimitIndicator
│       │   │   ├── EmailGrid
│       │   │   └── CopyButtons
│       │   ├── ComposerTab
│       │   │   ├── CategorySelect
│       │   │   ├── RecipientInput
│       │   │   ├── PurposeInput
│       │   │   ├── GenerateButton
│       │   │   └── EmailPreview
│       │   ├── CampaignTab
│       │   │   ├── EmailListInput
│       │   │   ├── SubjectInput
│       │   │   ├── BodyEditor
│       │   │   ├── SenderInput
│       │   │   └── SendButton
│       │   └── SavedTab
│       │       └── EmailTable
│       └── Admin
│           ├── AdminLogin
│           ├── StatsCards
│           └── PaymentTable
├── Modals
│   ├── PaymentModal
│   ├── AdminLoginModal
│   ├── GoogleAuthModal
│   └── ConfirmationModal
└── Footer

```

---

## 🧩 Core Components

### **1. Layout Component**
```js
// components/Layout.js
export default function Layout({ children, showSidebar = true }) {
  // Wraps all pages with Navbar, Sidebar, Footer
  // Provides consistent structure
}
```
**Props:**
- `children` - Page content
- `showSidebar` - Show/hide sidebar (false on login page)

**Responsibilities:**
- Render Navbar
- Render Sidebar (if showSidebar)
- Render main content area
- Render Footer
- Handle responsive layout

---

### **2. Navbar Component**
```js
// components/Navbar.js
export default function Navbar() {
  // Top sticky navigation bar
  // Contains logo, nav links, premium button, user profile
}
```
**Subcomponents:**
- `Logo` - "📧 EmailPro"
- `NavLinks` - Links to dashboard tabs
- `PremiumButton` - Opens payment modal
- `UserProfile` - Shows avatar + name, dropdown menu

**Features:**
- Sticky positioning
- Responsive (hide menu on mobile, hamburger icon)
- Dark mode support (optional)

---

### **3. Sidebar Component**
```js
// components/Sidebar.js
export default function Sidebar({ activeTab, setActiveTab }) {
  // Left-aligned navigation sidebar
  // Shows tools: Scraper, Composer, Campaign, Saved
}
```
**Props:**
- `activeTab` - Current active tab
- `setActiveTab` - Function to change tab

**Items:**
- Scraper (🔍)
- Composer (✏️)
- Campaign (✉️)
- Saved (📑)
- Admin 🔐 (bottom)

**Features:**
- Sticky positioning
- Active state highlighting
- Icons for visual cues
- Mobile: horizontal scroll instead of vertical

---

### **4. Hero Component**
```js
// components/Hero.js
export default function Hero() {
  // Landing page hero section
  // Title, subtitle, CTA buttons
}
```
**Features:**
- "Professional Email Marketing Made Simple"
- Subheading
- Two CTAs: "Get Started" + "Sign in with Google"
- Gradient background
- Responsive

---

### **5. Tab Components**

#### **ScraperTab**
```js
// components/Dashboard/ScraperTab.js
export default function ScraperTab() {
  // URL input → Scrape button → Results display
}
```
**Subcomponents:**
- `URLInput` - Website URL field
- `SearchLimitIndicator` - Progress bar (0/3)
- `ScrapeButton` - Trigger scraping
- `EmailGrid` - Display results
- `CopyButton` - Copy email to clipboard

**State:**
- `url` - Input URL
- `emails` - Scraped emails array
- `loading` - Loading state
- `error` - Error message
- `searchesUsed` - Current user's search count

---

#### **ComposerTab**
```js
// components/Dashboard/ComposerTab.js
export default function ComposerTab() {
  // Category select → Generate email
}
```
**Subcomponents:**
- `CategorySelect` - 9 email template categories
- `RecipientInput` - Recipient name field
- `PurposeInput` - Purpose/context field
- `GenerateButton` - Generate email
- `EmailPreview` - Show generated email
- `ActionButtons` - Copy/Use in Campaign/Save Draft

**State:**
- `category` - Selected category
- `recipient` - Recipient name
- `purpose` - Purpose text
- `generatedEmail` - Generated email object

---

#### **CampaignTab**
```js
// components/Dashboard/CampaignTab.js
export default function CampaignTab() {
  // Campaign form and sending
}
```
**Subcomponents:**
- `EmailListInput` - Textarea for emails
- `SubjectInput` - Email subject
- `BodyEditor` - Rich text editor (textarea)
- `SenderInput` - Gmail address
- `PasswordInput` - App-specific password
- `SendButton` - Send campaign

**State:**
- `emails` - List of recipient emails
- `subject` - Email subject
- `body` - Email body
- `sender` - Sender email
- `password` - Gmail app password
- `sending` - Sending state
- `results` - Sent/failed counts

---

#### **SavedTab**
```js
// components/Dashboard/SavedTab.js
export default function SavedTab() {
  // Table of saved email drafts
}
```
**Subcomponents:**
- `EmailTable` - Display saved drafts
- `UseButton` - Load draft to campaign
- `DeleteButton` - Delete draft

**State:**
- `savedEmails` - Array of saved drafts
- `loading` - Loading state

---

### **6. Modal Components**

#### **PaymentModal**
```js
// components/Modals/PaymentModal.js
export default function PaymentModal({ isOpen, onClose }) {
  // EasyPaisa payment form
}
```
**Props:**
- `isOpen` - Modal visibility
- `onClose` - Close callback

**Fields:**
- Transaction ID
- Email address
- Submit button

**Features:**
- Benefits display
- Pricing (Rs. 499)
- Form validation

---

#### **AdminLoginModal**
```js
// components/Modals/AdminLoginModal.js
export default function AdminLoginModal({ isOpen, onClose, onLogin }) {
  // Admin password input
}
```
**Props:**
- `isOpen` - Modal visibility
- `onClose` - Close callback
- `onLogin` - Login callback

**Fields:**
- Password input
- Submit button

---

#### **GoogleAuthModal**
```js
// components/Modals/GoogleAuthModal.js
export default function GoogleAuthModal({ isOpen, onClose }) {
  // Manual Google Auth (or use NextAuth)
}
```
**Fields:**
- Email input
- Name input
- Continue button

---

### **7. Admin Dashboard Component**
```js
// components/Admin/AdminDashboard.js
export default function AdminDashboard() {
  // Full admin panel with stats and payment table
}
```
**Subcomponents:**
- `StatsCards` - Total Users, Pending, Approved, Revenue
- `PaymentTable` - All payments with approve/reject buttons

**Features:**
- Protected (requires admin auth)
- Real-time stats
- Payment management

---

### **8. Form Components**

#### **Input Fields**
- `TextInput` - Standard text input
- `EmailInput` - Email validation
- `PasswordInput` - Masked password field
- `SelectInput` - Dropdown select
- `TextAreaInput` - Multi-line textarea
- `FileInput` - File upload (for bulk import)

**All include:**
- Label
- Placeholder
- Error message
- Validation indicator

---

### **9. Card Components**

#### **StatCard**
```js
// components/Cards/StatCard.js
export default function StatCard({ value, label, icon, color }) {
  // Display statistic (user count, revenue, etc.)
}
```

#### **EmailCard**
```js
// components/Cards/EmailCard.js
export default function EmailCard({ email, onCopy, onDelete }) {
  // Single email display with action buttons
}
```

---

## 🎨 Styling Strategy

### CSS Approach (Choose One)
1. **Tailwind CSS** (Recommended)
   - Utility-first approach
   - Fast development
   - Small bundle size
   - Easy responsive design

2. **CSS Modules**
   - Scoped styling
   - No conflicts
   - Better organization

3. **Styled Components**
   - CSS-in-JS
   - Dynamic styling
   - Component-scoped

### Color System
```css
:root {
  --primary: #667eea;
  --primary-dark: #764ba2;
  --secondary: #f093fb;
  --success: #43e97b;
  --danger: #f5576c;
  --warning: #ff9800;
  --light: #f8f9fa;
  --dark: #2c3e50;
  
  --border-radius: 12px;
  --transition: all 0.3s ease;
}
```

### Responsive Breakpoints
```css
Mobile: 320px - 640px
Tablet: 641px - 1024px
Desktop: 1025px+
```

---

## 🔄 State Management

### Local State (useState)
- Form inputs
- Modal visibility
- Loading states
- Tab selection

### Server State (Prisma/Database)
- User profile
- Campaigns
- Payments
- Saved emails

### Session State (NextAuth)
- Current user
- Authentication status
- User permissions

### Client-Side Cache (optional)
- Recent emails
- Template cache
- Search history

---

## 📱 Responsive Design Patterns

### Mobile-First Approach
```js
// Start with mobile styles
// Add desktop styles with media queries

<Sidebar> 
  // Desktop: vertical sidebar
  // Mobile: horizontal scroll or hamburger menu
</Sidebar>
```

### Breakpoint Usage
```js
const isMobile = window.innerWidth < 640;
const isTablet = window.innerWidth < 1024;
const isDesktop = window.innerWidth >= 1024;
```

---

## 🎯 Component Best Practices

### Naming Conventions
- Components: PascalCase (e.g., `Navbar.js`)
- Utilities: camelCase (e.g., `formatEmail.js`)
- Constants: UPPER_SNAKE_CASE (e.g., `API_URL`)
- CSS classes: kebab-case (e.g., `user-profile`)

### File Structure
```
/components
  /Dashboard
    /ScraperTab
      index.js (main component)
      ScraperTab.module.css (styles)
      ScraperTab.test.js (tests)
      types.js (TypeScript types, optional)
```

### Props Documentation
```js
/**
 * ScraperTab - Allows users to scrape emails
 * @param {string} userId - Current user ID
 * @param {number} searchLimit - Max searches per day
 * @returns {JSX.Element}
 */
export default function ScraperTab({ userId, searchLimit }) {
  ...
}
```

---

## 🔄 Data Flow

### Frontend to Backend
```
User Input (Form)
  ↓
Validation (Client-side)
  ↓
API Call (fetch/axios)
  ↓
Next.js API Route
  ↓
Prisma Database Operation
  ↓
Response back to frontend
  ↓
Update UI (setState)
  ↓
User sees result
```

### Example: Email Scraping
```
1. User enters URL in ScraperTab
2. Click "Scrape Emails" button
3. Frontend validates URL
4. Calls POST /api/scrape with { url }
5. Next.js API route fetches HTML (axios)
6. Parses with cheerio and regex
7. Returns { emails: [...] }
8. Frontend receives and displays in EmailGrid
9. Increment searchesUsed in database
```

---

## ✅ Component Checklist

### Phase 4 (Components)
- [ ] Layout component
- [ ] Navbar component
- [ ] Sidebar component
- [ ] Hero component
- [ ] ScraperTab
- [ ] ComposerTab
- [ ] CampaignTab
- [ ] SavedTab
- [ ] PaymentModal
- [ ] AdminLoginModal
- [ ] AdminDashboard
- [ ] StatsCards
- [ ] PaymentTable
- [ ] Form inputs
- [ ] Card components
- [ ] Responsive utilities

---

## 📚 Documentation for Developers

Each component should have:
- [ ] JSDoc comments
- [ ] Props definition
- [ ] Usage examples
- [ ] Styling notes
- [ ] Responsive behavior
- [ ] Accessibility notes

---

**Version**: 1.0  
**Status**: Design Phase  
**Next**: Implement components in Phase 4
