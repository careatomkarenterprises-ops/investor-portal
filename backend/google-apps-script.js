// === GOOGLE APPS SCRIPT BACKEND - COMPLETE VERSION ===
const CONFIG = {
  SHEET_ID: "1kkZbYC3UzeFI47Iym8V8EQzz6Y2G_-t7dZk1V4VPKEM", // Replace with your Google Sheet ID
  SHEETS: {
    INVESTORS: "Investors",
    INVESTMENTS: "Investments", 
    PAYOUTS: "Payouts",
    AGREEMENTS: "Agreements",
    HOT_DEALS: "HotDeals",
    FAQ: "FAQ",
    LEGAL_CONSENTS: "LegalConsents"
  }
};

// === MAIN ENTRY POINTS ===
function doPost(e) {
  try {
    console.log('=== POST REQUEST RECEIVED ===');
    
    const params = e.postData ? JSON.parse(e.postData.contents) : e.parameter;
    const action = params.action || 'createInvestor';
    
    console.log('Action:', action);
    console.log('Params:', params);
    
    switch(action) {
      case 'createInvestor':
        return handleCreateInvestor(params);
      case 'updateInvestment':
        return handleUpdateInvestment(params);
      case 'recordConsent':
        return handleRecordConsent(params);
      default:
        return handleCreateInvestor(params);
    }
  } catch (error) {
    console.error('POST Error:', error);
    return createResponse(false, 'Server error: ' + error.message);
  }
}

function doGet(e) {
  try {
    console.log('=== GET REQUEST RECEIVED ===');
    console.log('Parameters:', e.parameter);
    
    const { email, action } = e.parameter;
    
    if (action === 'overview') {
      return handleGetOverview();
    } else if (email) {
      return handleGetInvestorData(email);
    } else {
      return handleGetOverview();
    }
  } catch (error) {
    console.error('GET Error:', error);
    return createResponse(false, 'Server error: ' + error.message);
  }
}

// === REQUEST HANDLERS ===
function handleCreateInvestor(params) {
  const { name, email, phone, consent } = params;
  
  // ✅ NULL CHECKS
  if (!name || !email || !phone) {
    return createResponse(false, "Missing required fields: name, email, phone");
  }
  
  const ss = SpreadsheetApp.openById(CONFIG.SHEET_ID);
  const investorSheet = ss.getSheetByName(CONFIG.SHEETS.INVESTORS);
  
  // Check if investor already exists
  const existingInvestor = findInvestorByEmail(email);
  if (existingInvestor) {
    console.log('Investor already exists:', email);
    
    // Record consent anyway
    recordLegalConsent(name, email, phone, 'REAFFIRMATION');
    
    return createResponse(true, "Investor already exists", {
      exists: true,
      investor: existingInvestor
    });
  }
  
  // Create new investor
  const timestamp = new Date().toISOString();
  const investorData = {
    name: name,
    email: email,
    phone: phone,
    status: "Active",
    consent: "LEGAL_CONSENT_ACCEPTED",
    memberSince: timestamp,
    totalInvestment: 0,
    totalPayouts: 0,
    currentPortfolioValue: 0,
    roi: 0,
    nextPayoutDate: null
  };
  
  // Add to investors sheet
  investorSheet.appendRow([
    name,
    email,
    phone,
    timestamp,
    "LEGAL_CONSENT_ACCEPTED",
    "Active",
    0, // totalInvestment
    0, // totalPayouts  
    0, // currentPortfolioValue
    0, // roi
    null, // nextPayoutDate
    timestamp // memberSince
  ]);
  
  // Record legal consent
  recordLegalConsent(name, email, phone, 'INITIAL');
  
  console.log('New investor created:', email);
  return createResponse(true, "Investor created successfully", {
    exists: true,
    investor: investorData
  });
}

function handleGetInvestorData(email) {
  if (!email) {
    return createResponse(false, "Email parameter is required");
  }
  
  const investor = findInvestorByEmail(email);
  if (!investor) {
    return createResponse(false, "Investor not found");
  }
  
  // Get related data
  const investments = getInvestmentsByEmail(email);
  const agreements = getAgreementsByEmail(email);
  const payouts = getPayoutsByEmail(email);
  
  const responseData = {
    success: true,
    exists: true,
    name: investor.name,
    email: investor.email,
    phone: investor.phone,
    consent: investor.consent,
    status: investor.status,
    totalInvestment: investor.totalInvestment || 0,
    totalPayouts: investor.totalPayouts || 0,
    currentPortfolioValue: investor.currentPortfolioValue || 0,
    roi: investor.roi || 0,
    nextPayoutDate: investor.nextPayoutDate,
    memberSince: investor.memberSince,
    investments: investments,
    agreements: agreements,
    upcomingPayouts: getUpcomingPayouts(email),
    investmentHistory: [0.8, 1.2, 0.9, 1.5, 1.8, 1.2, 1.6, 1.4, 1.7, 1.3],
    payoutHistory: [0.15, 0.18, 0.22, 0.25, 0.28, 0.24, 0.26, 0.29, 0.31, 0.27],
    tenureDistribution: [15, 25, 45, 15],
    portfolioGrowth: [500000, 650000, 800000, 950000, 1100000, 1250000, 1300000, 1350000, 1375000, 1400000],
    portfolioAllocation: [40, 28, 32]
  };
  
  return createResponse(true, "Investor data retrieved", responseData);
}

function handleGetOverview() {
  const overviewData = {
    success: true,
    overview: {
      totalInvestments: "₹2.8Cr",
      totalPayouts: "₹32L", 
      totalInvestors: "47",
      avgReturns: "12.5%",
      activeDeals: "5",
      successRate: "98%"
    },
    hotDeals: getHotDeals(),
    faqs: getFAQs()
  };
  
  return createResponse(true, "Overview data retrieved", overviewData);
}

function handleRecordConsent(params) {
  const { name, email, phone, consentType } = params;
  
  recordLegalConsent(name, email, phone, consentType || 'GENERAL');
  
  return createResponse(true, "Consent recorded successfully");
}

// === DATA ACCESS FUNCTIONS ===
function findInvestorByEmail(email) {
  try {
    const ss = SpreadsheetApp.openById(CONFIG.SHEET_ID);
    const sheet = ss.getSheetByName(CONFIG.SHEETS.INVESTORS);
    const data = sheet.getDataRange().getValues();
    
    // Skip header row
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (row[1] === email) { // Email is column B (index 1)
        return {
          name: row[0] || '',
          email: row[1] || '',
          phone: row[2] || '',
          memberSince: row[3] || '',
          consent: row[4] || '',
          status: row[5] || 'Active',
          totalInvestment: parseFloat(row[6]) || 0,
          totalPayouts: parseFloat(row[7]) || 0,
          currentPortfolioValue: parseFloat(row[8]) || 0,
          roi: parseFloat(row[9]) || 0,
          nextPayoutDate: row[10] || null
        };
      }
    }
    return null;
  } catch (error) {
    console.error('Error finding investor:', error);
    return null;
  }
}

function getInvestmentsByEmail(email) {
  try {
    const ss = SpreadsheetApp.openById(CONFIG.SHEET_ID);
    const sheet = ss.getSheetByName(CONFIG.SHEETS.INVESTMENTS);
    const data = sheet.getDataRange().getValues();
    const investments = [];
    
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (row[1] === email) { // Email is column B
        investments.push({
          fundName: row[2] || 'General Investment',
          amount: parseFloat(row[3]) || 0,
          date: row[0] || '',
          status: row[4] || 'Active',
          returns: parseFloat(row[5]) || 0
        });
      }
    }
    
    // If no investments found, return demo data
    if (investments.length === 0) {
      return [{
        fundName: "MONTHLY INCOME PLAN",
        amount: 2000000,
        date: "2025-01-01",
        status: "Active",
        returns: 1.5
      }];
    }
    
    return investments;
  } catch (error) {
    console.error('Error getting investments:', error);
    return [];
  }
}

function getAgreementsByEmail(email) {
  try {
    const ss = SpreadsheetApp.openById(CONFIG.SHEET_ID);
    const sheet = ss.getSheetByName(CONFIG.SHEETS.AGREEMENTS);
    const data = sheet.getDataRange().getValues();
    const agreements = [];
    
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (row[1] === email) {
        agreements.push({
          agreementId: row[0] || 'AGR' + (i + 1000),
          type: row[2] || 'Investment Agreement',
          amount: parseFloat(row[3]) || 0,
          date: row[4] || '',
          status: row[5] || 'Active',
          documentUrl: row[6] || '#'
        });
      }
    }
    
    // Demo data if none found
    if (agreements.length === 0) {
      return [{
        agreementId: "AGR003",
        type: "higer earning opportunities",
        amount: 2000000,
        date: "2025-07-02",
        status: "Active",
        documentUrl: "#"
      }];
    }
    
    return agreements;
  } catch (error) {
    console.error('Error getting agreements:', error);
    return [];
  }
}

function getPayoutsByEmail(email) {
  try {
    const ss = SpreadsheetApp.openById(CONFIG.SHEET_ID);
    const sheet = ss.getSheetByName(CONFIG.SHEETS.PAYOUTS);
    const data = sheet.getDataRange().getValues();
    const payouts = [];
    
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (row[1] === email) {
        payouts.push({
          date: row[0] || '',
          amount: parseFloat(row[2]) || 0,
          investment: row[3] || '',
          status: row[4] || 'Completed'
        });
      }
    }
    
    return payouts;
  } catch (error) {
    console.error('Error getting payouts:', error);
    return [];
  }
}

function getUpcomingPayouts(email) {
  // This would typically calculate upcoming payouts based on investment terms
  // For now, return empty array or demo data
  return [];
}

function getHotDeals() {
  return [
    {
      id: 1,
      title: "Monthly Income Plan",
      description: "Get regular monthly returns with stable capital protection",
      returns: "12-15%",
      tenure: "12-24 Months",
      minInvestment: "₹50,000",
      badge: "Limited Time"
    },
    {
      id: 2, 
      title: "Commercial Real Estate",
      description: "Invest in premium commercial properties with high appreciation potential",
      returns: "15-18%",
      tenure: "24-36 Months", 
      minInvestment: "₹2,00,000",
      badge: "High Growth"
    }
  ];
}

function getFAQs() {
  return [
    {
      question: "How do I start investing?",
      answer: "To start investing, you need to complete the legal consent process, provide your details, and then you can explore available investment opportunities. All investments require signed agreements."
    },
    {
      question: "What is the minimum investment amount?",
      answer: "The minimum investment amount is ₹50,000. However, specific opportunities may have different minimum requirements."
    },
    {
      question: "How are returns paid out?",
      answer: "Returns are typically paid monthly or quarterly, depending on the investment plan. Payouts are made via bank transfer to your registered account."
    }
  ];
}

function recordLegalConsent(name, email, phone, consentType) {
  try {
    const ss = SpreadsheetApp.openById(CONFIG.SHEET_ID);
    const sheet = ss.getSheetByName(CONFIG.SHEETS.LEGAL_CONSENTS);
    
    const timestamp = new Date().toISOString();
    sheet.appendRow([name, email, phone, timestamp, consentType, 'ACCEPTED']);
    
    console.log('Legal consent recorded for:', email);
  } catch (error) {
    console.error('Error recording consent:', error);
  }
}

// === HELPER FUNCTIONS ===
function createResponse(success, message, data = null) {
  const response = {
    success: success,
    message: message,
    timestamp: new Date().toISOString()
  };
  
  if (data) {
    Object.assign(response, data);
  }
  
  return ContentService.createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
}

// === CORS HANDLING ===
function doOptions() {
  return ContentService.createTextOutput()
    .setHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
}

// === TEST FUNCTION ===
function testBackend() {
  console.log('=== TESTING BACKEND ===');
  
  // Test overview
  const overview = handleGetOverview();
  console.log('Overview test:', overview);
  
  // Test investor data
  const testEmail = "enquirysharebazaartips@gmail.com";
  const investorData = handleGetInvestorData(testEmail);
  console.log('Investor data test:', investorData);
  
  return 'Backend test completed';
}
