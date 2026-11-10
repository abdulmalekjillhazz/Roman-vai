/**
 * Dynamic WhatsApp Link Generator for Classical Decor ID (classicaldecorid)
 */
export function getWhatsAppInquiryLink({
  phone = '971543532585',
  product,
  category
}) {
  let message = "Hi Classical Decor ID, I'd like to request trade pricing and catalog details.";

  if (product) {
    const sku = product.sku || product.pfcCode || product.id || 'N/A';
    message = `Hi Classical Decor ID, I'd like to inquire about ${product.name} (SKU: ${sku}).`;
  } else if (category) {
    message = `Hi Classical Decor ID, I'd like to explore your ${category} collection and request samples.`;
  }

  const cleanPhone = String(phone).replace(/[^0-9]/g, '');
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
