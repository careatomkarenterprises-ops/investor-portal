// === CONFIGURATION ===
const SHEET_ID = "YOUR_SHEET_ID_HERE"; // <--- Replace with your Google Sheet ID

// Sheet names
const SHEETS = {
  investors: "Investors",
  investments: "Investments",
  payouts: "Payouts",
  agreements: "Agreements",
  legalConsents: "LegalConsents"
};

// === ENTRY POINTS ===

// Handle POST (new investor consent)
function doPost(e) {
  try {
    const params = e.parameter;
    const email = params.email;
    const name = params.name;
    const phone = params.phone;
    const timestamp = params.timestamp;

    if (!email || !name || !phone) {
      return jsonResponse({ success: false, message: "Missing required fields" });
    }

    const ss = SpreadsheetApp.openById(SHEET_ID);
    const investorSheet = ss.getSheetByName(SHEETS.investors);

    // Check if email already exists
    const data = investorSheet.getDataRange().getValues();
    let exists = false;
    for (let i = 1; i < data.length; i++) {
      if (data[i][1] === email) { // assuming 2nd col is email
        exists = true;
        break;
      }
    }

    if (!exists) {
      investorSheet.appendRow([name, email, phone, timestamp, "consent given"]);
    }

    // Log consent separately
    const consentSheet = ss.getSheetByName(SHEETS.legalConsents);
    consentSheet.appendRow([name, email, phone, timestamp, "consent"]);

    return jsonResponse({ success: true, message: exists ? "Investor already exists" : "New investor added" });
  } catch (err) {
    return jsonResponse({ success: false, message: err.message });
  }
}

// Handle GET (overview or investor data)
function doGet(e) {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const email = e.parameter.email;

    if (!email) {
      // Visitor overview
      return jsonResponse({ success: true, overview: getOverviewData(ss) });
    }

    const investor = getInvestorByEmail(ss, email);
    if (!investor) {
      return jsonResponse({ success: false, message: "Investor not found" });
    }

    return jsonResponse({
      success: true,
      investor: investor,
      investments: getInvestmentsByEmail(ss, email),
      payouts: getPayoutsByEmail(ss, email),
      agreements: getAgreementsByEmail(ss, email)
    });
  } catch (err) {
    return jsonResponse({ success: false, message: err.message });
  }
}

// === HELPERS ===
function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function getOverviewData(ss) {
  // Dummy aggregator (replace with SUM formulas if you want live)
  const investors = ss.getSheetByName(SHEETS.investors).getLastRow() - 1;
  return {
    totalInvestments: "₹2.8Cr",
    totalPayouts: "₹32L",
    totalInvestors: investors,
    avgReturns: "12.5%"
  };
}

function getInvestorByEmail(ss, email) {
  const sheet = ss.getSheetByName(SHEETS.investors);
  const rows = sheet.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][1] === email) { // assuming col B = Email
      return {
        name: rows[i][0],
        email: rows[i][1],
        phone: rows[i][2],
        memberSince: rows[i][3],
        consent: rows[i][4],
        totalInvestment: 500000, // placeholder, sum from investments
        lastPayout: 20000,       // placeholder, from payouts
        currentValue: 520000,    // placeholder
        roi: "12%",
        nextPayout: "2025-10-10" // placeholder
      };
    }
  }
  return null;
}

function getInvestmentsByEmail(ss, email) {
  const sheet = ss.getSheetByName(SHEETS.investments);
  const rows = sheet.getDataRange().getValues();
  let list = [];
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][1] === email) { // assume col B = email
      list.push({
        date: rows[i][0],
        amount: rows[i][2],
        type: rows[i][3],
        status: rows[i][4]
      });
    }
  }
  return list;
}

function getPayoutsByEmail(ss, email) {
  const sheet = ss.getSheetByName(SHEETS.payouts);
  const rows = sheet.getDataRange().getValues();
  let list = [];
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][1] === email) {
      list.push({
        date: rows[i][0],
        amount: rows[i][2],
        investment: rows[i][3]
      });
    }
  }
  return list;
}

function getAgreementsByEmail(ss, email) {
  const sheet = ss.getSheetByName(SHEETS.agreements);
  const rows = sheet.getDataRange().getValues();
  let list = [];
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][1] === email) {
      list.push({
        id: rows[i][0],
        date: rows[i][2],
        type: rows[i][3],
        amount: rows[i][4],
        status: rows[i][5],
        documentUrl: rows[i][6]
      });
    }
  }
  return list;
}
