// Google Apps Script backend code
// Copy this to script.google.com

function doPost(e) {
  try {
    const { name, email, phone, consent } = e.parameter;
    const ss = SpreadsheetApp.openById('YOUR_SHEET_ID_HERE');
    const investorsSheet = ss.getSheetByName('Investors');
    
    // Check if investor exists
    const data = investorsSheet.getDataRange().getValues();
    const headers = data[0];
    const emailIndex = headers.indexOf('Email');
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][emailIndex] === email) {
        return createResponse({ success: false, message: 'Investor already exists' });
      }
    }
    
    // Add new investor
    const newRow = [
      email,
      name,
      phone,
      'LEGAL_CONSENT_ACCEPTED',
      0, 0, 0, 0,
      new Date().toISOString().split('T')[0],
      'Monthly',
      new Date().toISOString(),
      'YES'
    ];
    
    investorsSheet.appendRow(newRow);
    logLegalConsent(ss, name, email, phone);
    
    return createResponse({ success: true, message: 'Legal consent recorded' });
    
  } catch (error) {
    return createResponse({ success: false, message: error.toString() });
  }
}

function doGet(e) {
  try {
    const { email } = e.parameter;
    const ss = SpreadsheetApp.openById('YOUR_SHEET_ID_HERE');
    
    if (!email) {
      return getOverviewData(ss);
    } else {
      return getInvestorData(ss, email);
    }
    
  } catch (error) {
    return createResponse({ success: false, message: error.toString() });
  }
}

function getOverviewData(ss) {
  const investorsSheet = ss.getSheetByName('Investors');
  const data = investorsSheet.getDataRange().getValues();
  const headers = data[0];
  
  let totalInvestments = 0;
  let totalPayouts = 0;
  let activeInvestors = 0;
  
  for (let i = 1; i < data.length; i++) {
    totalInvestments += Number(data[i][headers.indexOf('TotalInvestment')]) || 0;
    totalPayouts += Number(data[i][headers.indexOf('LastPayout')]) || 0;
    if (data[i][headers.indexOf('Email')]) activeInvestors++;
  }
  
  return createResponse({
    success: true,
    data: {
      totalInvestments: '₹' + (totalInvestments / 10000000).toFixed(2) + ' Cr',
      totalPayouts: '₹' + (totalPayouts / 10000000).toFixed(2) + ' Cr',
      activeInvestors: activeInvestors,
      avgReturns: '11.5%'
    }
  });
}

function getInvestorData(ss, email) {
  const investorsSheet = ss.getSheetByName('Investors');
  const data = investorsSheet.getDataRange().getValues();
  const headers = data[0];
  const emailIndex = headers.indexOf('Email');
  
  let investorData = null;
  for (let i = 1; i < data.length; i++) {
    if (data[i][emailIndex] === email) {
      investorData = {
        name: data[i][headers.indexOf('Name')],
        email: data[i][emailIndex],
        phone: data[i][headers.indexOf('Phone')],
        consent: data[i][headers.indexOf('Consent')],
        totalInvestment: formatCurrency(data[i][headers.indexOf('TotalInvestment')]),
        lastPayout: formatCurrency(data[i][headers.indexOf('LastPayout')]),
        currentValue: formatCurrency(data[i][headers.indexOf('CurrentValue')]),
        roi: data[i][headers.indexOf('ROI')] + '%',
        memberSince: formatDate(data[i][headers.indexOf('MemberSince')]),
        exists: true
      };
      break;
    }
  }
  
  if (!investorData) {
    return createResponse({ success: false, message: 'Investor not found' });
  }
  
  return createResponse({ success: true, ...investorData });
}

function logLegalConsent(ss, name, email, phone) {
  try {
    let legalSheet = ss.getSheetByName('LegalConsents');
    if (!legalSheet) {
      legalSheet = ss.insertSheet('LegalConsents');
      legalSheet.appendRow(['Timestamp', 'Name', 'Email', 'Phone', 'ConsentType']);
    }
    
    legalSheet.appendRow([
      new Date().toISOString(),
      name,
      email,
      phone,
      'FULL_LEGAL_CONSENT'
    ]);
  } catch (error) {
    console.error('Error logging legal consent:', error);
  }
}

function createResponse(data) {
  const response = ContentService.createTextOutput(JSON.stringify(data));
  response.setMimeType(ContentService.MimeType.JSON);
  return response;
}

function formatCurrency(amount) {
  if (!amount) return '0';
  return new Intl.NumberFormat('en-IN').format(amount);
}

function formatDate(dateString) {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
  } catch (e) {
    return '-';
  }
}
