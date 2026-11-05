/**
 * DST DECO - SECURE GOOGLE SHEETS LEAD CAPTURE WEBHOOK (FIXED)
 * -------------------------------------------------------------
 * SECURITY FIXES APPLIED:
 * 1. Formula Injection Prevention (OWASP Standard): Sanitizes any cell starting
 *    with '=', '+', '-', '@', tab, or carriage return by prefixing a single quote (').
 * 2. Shared Secret Authentication: Validates `data.token` against `SECRET_TOKEN`
 *    stored in Script Properties (or constant fallback) to block unauthorized spam.
 * 3. Input Length Capping & Validation: Prevents oversized payload attacks.
 *
 * SETUP INSTRUCTIONS:
 * 1. Open Google Sheets (https://sheets.new) -> Extensions > Apps Script.
 * 2. Paste this code into `Code.gs`.
 * 3. In Project Settings > Script Properties, add `SECRET_TOKEN` with the exact same
 *    value as `GOOGLE_SHEETS_SECRET_TOKEN` in your server `.env`.
 * 4. Run `setupSheet()` once to create the headers.
 * 5. Deploy > New deployment > Web app (Execute as: Me, Who has access: Anyone).
 */

var FALLBACK_SECRET_TOKEN = "CHANGE_THIS_IN_SCRIPT_PROPERTIES";

/**
 * Prevents Spreadsheet Formula Injection (CSV/Formula Injection)
 */
function sanitizeCell(value, maxLength) {
  maxLength = maxLength || 500;
  if (value === null || value === undefined) return "N/A";
  var str = String(value).trim();
  if (str.length === 0) return "N/A";
  if (str.length > maxLength) {
    str = str.substring(0, maxLength) + "...";
  }
  // If string starts with formula triggers (=, +, -, @, tab, CR), prefix with apostrophe
  if (/^[=+\-@\t\r]/.test(str)) {
    str = "'" + str;
  }
  return str;
}

function getSecretToken() {
  var propToken = PropertiesService.getScriptProperties().getProperty("SECRET_TOKEN");
  return propToken || FALLBACK_SECRET_TOKEN;
}

function setupSheet() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  sheet.clear();

  var headers = [
    ["Date & Time (UAE)", "Full Name", "Phone / WhatsApp", "Email", "Category / Product", "Project Details / Message", "Source Page", "Status"]
  ];

  var range = sheet.getRange(1, 1, 1, headers[0].length);
  range.setValues(headers);
  range.setBackground("#B38E46");
  range.setFontColor("#FFFFFF");
  range.setFontWeight("bold");
  range.setFontSize(11);
  range.setHorizontalAlignment("center");

  sheet.setFrozenRows(1);
  sheet.setColumnWidth(1, 160);
  sheet.setColumnWidth(2, 180);
  sheet.setColumnWidth(3, 160);
  sheet.setColumnWidth(4, 200);
  sheet.setColumnWidth(5, 220);
  sheet.setColumnWidth(6, 340);
  sheet.setColumnWidth(7, 150);
  sheet.setColumnWidth(8, 120);
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) {
    return createJsonResponse(503, "error", "Server busy, please try again.");
  }

  try {
    if (!e || !e.postData || !e.postData.contents) {
      return createJsonResponse(400, "error", "Missing request payload.");
    }

    var data = JSON.parse(e.postData.contents);

    // 1. Verify Shared Secret Token
    var expectedToken = getSecretToken();
    if (!data.token || data.token !== expectedToken) {
      return createJsonResponse(401, "error", "Unauthorized: Invalid security token.");
    }

    // 2. Validate Required Fields
    if (!data.name || !data.phone) {
      return createJsonResponse(422, "error", "Name and Phone/WhatsApp are required.");
    }

    // 3. Sanitize all fields against Formula Injection
    var timestamp = Utilities.formatDate(new Date(), "Asia/Dubai", "yyyy-MM-dd HH:mm:ss");
    var name = sanitizeCell(data.name, 120);
    var phone = sanitizeCell(data.phone, 40);
    var email = sanitizeCell(data.email, 120);
    var productOrCategory = sanitizeCell(data.category || data.product || "General Inquiry", 150);
    var message = sanitizeCell(data.message || data.details || "N/A", 1000);
    var source = sanitizeCell(data.source || "Website Form", 150);
    var status = "New Lead";

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    sheet.appendRow([timestamp, name, phone, email, productOrCategory, message, source, status]);

    var lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 1, 1, 8).setVerticalAlignment("middle");
    sheet.getRange(lastRow, 8).setBackground("#E6F4EA").setFontColor("#137333").setFontWeight("bold");

    return createJsonResponse(200, "success", "Lead recorded securely.", { row: lastRow });

  } catch (error) {
    return createJsonResponse(500, "error", "Internal script error: " + error.message);
  } finally {
    lock.releaseLock();
  }
}

function createJsonResponse(code, status, message, extra) {
  var payload = {
    code: code,
    status: status,
    message: message
  };
  if (extra) {
    for (var k in extra) {
      payload[k] = extra[k];
    }
  }
  return ContentService.createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  return createJsonResponse(200, "active", "DST Deco Secure Lead Webhook is running.");
}
