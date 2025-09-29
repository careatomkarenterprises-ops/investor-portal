# Omkar Enterprises Investor Dashboard

A professional investor dashboard with legal compliance features.

## Setup Instructions

### 1. Google Sheets Setup
1. Create a new Google Sheet
2. Create these sheets with exact names:
   - Investors
   - Investments  
   - Payouts
   - Agreements
   - HotDeals
   - FAQ
   - LegalConsents

### 2. Google Apps Script Setup
1. Go to [script.google.com](https://script.google.com)
2. Create new project
3. Replace code with `backend/google-apps-script.js`
4. Replace `YOUR_SHEET_ID_HERE` with actual Sheet ID
5. Deploy as Web App (Anyone can access)
6. Copy the Web App URL

### 3. Update Configuration
In `scripts/app.js`, update:
```javascript
this.scriptURL = "YOUR_GOOGLE_SCRIPT_WEB_APP_URL_HERE";
