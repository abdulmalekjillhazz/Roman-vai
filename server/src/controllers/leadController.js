import axios from 'axios';

/**
 * Server-side sanitizer to prevent Formula Injection before forwarding to Google Sheets
 */
function sanitizeField(val, maxLen = 500) {
  if (val === undefined || val === null) return '';
  let str = String(val).trim().slice(0, maxLen);
  if (/^[=+\-@\t\r]/.test(str)) {
    str = "'" + str;
  }
  return str;
}

export async function submitLead(req, res) {
  try {
    const { name, phone, email, category, message, source } = req.body;

    if (!name || !phone) {
      return res.status(422).json({
        status: 'error',
        message: 'Name and Phone/WhatsApp number are required.'
      });
    }

    const sanitizedPayload = {
      token: process.env.GOOGLE_SHEETS_SECRET_TOKEN,
      name: sanitizeField(name, 120),
      phone: sanitizeField(phone, 40),
      email: sanitizeField(email, 120),
      category: sanitizeField(category || 'General Inquiry', 150),
      message: sanitizeField(message || 'N/A', 1000),
      source: sanitizeField(source || 'Website', 150)
    };

    const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
    if (!webhookUrl || webhookUrl.includes('YOUR_DEPLOYMENT_ID') || !sanitizedPayload.token || sanitizedPayload.token.includes('CHANGE_THIS')) {
      return res.status(503).json({
        status: 'error',
        message: 'Sample requests are temporarily unavailable. Please contact our team on WhatsApp.'
      });
    }

    // Server-to-Server call to Google Apps Script (follows 302 redirects and reads actual JSON response!)
    const response = await axios.post(webhookUrl, sanitizedPayload, {
      headers: { 'Content-Type': 'application/json' },
      maxRedirects: 5,
      timeout: 12000
    });

    const result = response.data;
    if (result && result.status === 'success') {
      return res.status(200).json({
        status: 'success',
        message: 'Thank you! Your inquiry has been logged in our system.',
        row: result.row
      });
    }

    return res.status(400).json({
      status: 'error',
      message: result?.message || 'Google Sheets webhook rejected the submission.'
    });
  } catch (error) {
    console.error('❌ Lead Submission Error:', error.message);
    return res.status(502).json({
      status: 'error',
      message: 'Failed to record inquiry. Please contact us directly via WhatsApp.'
    });
  }
}
