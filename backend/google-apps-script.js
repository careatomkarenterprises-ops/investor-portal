// Google Apps Script for Omkar Enterprises Investor Dashboard
function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  try {
    // Set CORS headers
    var response = {
      'contentType': 'application/json',
      'headers': {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    };

    var action = e.parameter.action;
    var email = e.parameter.email;
    
    // Open the spreadsheet - REPLACE WITH YOUR ACTUAL SPREADSHEET ID
    var sheet = SpreadsheetApp.openById('1kkZbYC3UzeFI47Iym8V8EQzz6Y2G_-t7dZk1V4VPKEM').getActiveSheet();
    var data = sheet.getDataRange().getValues();
    var headers = data[0];
    
    // Handle POST requests (consent form submission)
    if (e.postData) {
      var postData = JSON.parse(e.postData.contents);
      return handleConsentSubmission(sheet, headers, postData, response);
    }
    
    // Handle GET requests
    if (email) {
      return handleInvestorDataRequest(data, headers, email, response);
    } else {
      return handleOverviewDataRequest(data, headers, response);
    }
    
  } catch (error) {
    return createErrorResponse(error, response);
  }
}

function handleConsentSubmission(sheet, headers, postData, response) {
  var email = postData.email;
  var data = sheet.getDataRange().getValues();
  
  // Check if investor already exists
  var existingInvestor = findInvestorByEmail(data, headers, email);
  
  if (existingInvestor) {
    response.data = {
      success: true,
      message: "Investor already exists",
      exists: true
    };
  } else {
    // Add new investor with proper data structure
    var newRow = [
      new Date(), // Timestamp
      postData.name,
      postData.email,
      postData.phone,
      'Consent Given', // ConsentStatus
      'Active', // Status
      0, // TotalInvestment
      0, // TotalPayouts
      0, // CurrentPortfolioValue
      '0%', // ROI
      'Not Set', // NextPayoutDate
      new Date().toLocaleDateString(), // MemberSince
      JSON.stringify([]), // Investments
      JSON.stringify([]), // UpcomingPayouts
      JSON.stringify([]) // Agreements
    ];
    
    sheet.appendRow(newRow);
    response.data = {
      success: true,
      message: "Investor created successfully",
      exists: false
    };
  }
  
  return ContentService.createTextOutput(JSON.stringify(response.data))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders(response.headers);
}

function handleInvestorDataRequest(data, headers, email, response) {
  var investor = findInvestorByEmail(data, headers, email);
  
  if (investor) {
    var investments = JSON.parse(investor[headers.indexOf('Investments')] || '[]');
    var payouts = JSON.parse(investor[headers.indexOf('UpcomingPayouts')] || '[]');
    var agreements = JSON.parse(investor[headers.indexOf('Agreements')] || '[]');
    
    response.data = {
      success: true,
      exists: true,
      name: investor[headers.indexOf('Name')],
      email: investor[headers.indexOf('Email')],
      phone: investor[headers.indexOf('Phone')],
      consent: investor[headers.indexOf('ConsentStatus')],
      status: investor[headers.indexOf('Status')],
      totalInvestment: investor[headers.indexOf('TotalInvestment')],
      totalPayouts: investor[headers.indexOf('TotalPayouts')],
      currentPortfolioValue: investor[headers.indexOf('CurrentPortfolioValue')],
      roi: investor[headers.indexOf('ROI')],
      nextPayoutDate: investor[headers.indexOf('NextPayoutDate')],
      memberSince: investor[headers.indexOf('MemberSince')],
      investments: investments,
      upcomingPayouts: payouts,
      agreements: agreements,
      
      // Chart data
      investmentHistory: [0.8, 1.2, 0.9, 1.5, 1.8, 1.2, 1.6, 1.4, 1.7, 1.3],
      payoutHistory: [0.15, 0.18, 0.22, 0.25, 0.28, 0.24, 0.26, 0.29, 0.31, 0.27],
      tenureDistribution: [15, 25, 45, 15],
      portfolioGrowth: [500000, 650000, 800000, 950000, 1100000, 1250000, 1300000, 1350000, 1375000, 1400000],
      portfolioAllocation: [40, 28, 32]
    };
  } else {
    response.data = {
      success: false,
      exists: false,
      message: "Investor not found"
    };
  }
  
  return ContentService.createTextOutput(JSON.stringify(response.data))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders(response.headers);
}

function handleOverviewDataRequest(data, headers, response) {
  var totalInvestors = data.length - 1; // exclude header
  var totalInvestment = 0;
  var totalPayouts = 0;
  
  for (var i = 1; i < data.length; i++) {
    totalInvestment += Number(data[i][headers.indexOf('TotalInvestment')]) || 0;
    totalPayouts += Number(data[i][headers.indexOf('TotalPayouts')]) || 0;
  }
  
  response.data = {
    success: true,
    overview: {
      totalInvestments: '₹' + (totalInvestment / 10000000).toFixed(1) + 'Cr',
      totalPayouts: '₹' + (totalPayouts / 100000).toFixed(0) + 'L',
      totalInvestors: totalInvestors,
      avgReturns: '12.5%'
    }
  };
  
  return ContentService.createTextOutput(JSON.stringify(response.data))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders(response.headers);
}

function findInvestorByEmail(data, headers, email) {
  var emailIndex = headers.indexOf('Email');
  for (var i = 1; i < data.length; i++) {
    if (data[i][emailIndex] === email) {
      return data[i];
    }
  }
  return null;
}

function createErrorResponse(error, response) {
  var errorResponse = {
    success: false,
    message: "Error: " + error.toString()
  };
  
  return ContentService.createTextOutput(JSON.stringify(errorResponse))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders(response.headers);
}

// Handle preflight OPTIONS request
function doOptions() {
  return ContentService.createTextOutput(JSON.stringify({}))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400'
    });
}
