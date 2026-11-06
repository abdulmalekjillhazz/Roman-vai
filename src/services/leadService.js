import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';

/**
 * Submits lead inquiry via Backend Proxy (/api/leads) which securely attaches
 * the shared secret token, sanitizes against Formula Injection, and verifies
 * the real HTTP response from Google Sheets.
 */
export async function submitLeadToGoogleSheets(formData) {
  if (!formData.name?.trim() || !formData.phone?.trim()) {
    throw new Error('Please enter both your Name and Phone / WhatsApp number.');
  }

  try {
    const response = await axios.post(
      `${API_BASE}/leads`,
      {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email?.trim() || '',
        category: formData.category || 'General Inquiry',
        message: formData.message?.trim() || '',
        source: window.location.pathname
      },
      { timeout: 15000 }
    );

    if (response.data && response.data.status === 'success') {
      return response.data;
    }

    throw new Error(response.data?.message || 'Submission could not be verified.');
  } catch (error) {
    const serverMessage =
      error.response?.data?.message ||
      error.message ||
      'Network error while submitting your inquiry. Please contact us via WhatsApp.';
    throw new Error(serverMessage);
  }
}
