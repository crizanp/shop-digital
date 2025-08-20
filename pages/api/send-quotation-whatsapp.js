// Server API: send quotation via WhatsApp (Cloud API) when configured, otherwise return wa.me link
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const payload = req.body || {};
    // Expect payload to include: packageTitle, categoryName, subcategoryName, quantity, totalPrice, addons (array), recipient
    const {
      packageTitle,
      categoryName,
      subcategoryName,
      quantity,
      totalPrice,
      addons = [],
      recipient = '9705516131'
    } = payload;

    // Build a friendly message
    let message = `Quotation Request for *${packageTitle}*\n`;
    if (categoryName) message += `Category: ${categoryName}\n`;
    if (subcategoryName) message += `Subcategory: ${subcategoryName}\n`;
    message += `Quantity: ${quantity || 1}\n`;
    if (addons && addons.length) {
      message += `Addons:\n`;
      addons.forEach(a => {
        message += ` - ${a.title || a.name}: ${a.price || ''}\n`;
      });
    }
    message += `Total: ${totalPrice || ''}\n`;
    message += `\nPlease contact the customer to proceed.`;

    // If WhatsApp Cloud environment variables are provided, attempt server-side send
    const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
    const WHATSAPP_PHONE_ID = process.env.WHATSAPP_PHONE_ID; // the sender phone id
    const RECIPIENT = recipient.replace(/[^0-9]/g, '');

    if (WHATSAPP_TOKEN && WHATSAPP_PHONE_ID) {
      // Send via Facebook/Meta WhatsApp Cloud API
      const apiUrl = `https://graph.facebook.com/v15.0/${WHATSAPP_PHONE_ID}/messages`;
      const body = {
        messaging_product: 'whatsapp',
        to: RECIPIENT,
        type: 'text',
        text: { body: message }
      };

      const resp = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${WHATSAPP_TOKEN}`
        },
        body: JSON.stringify(body)
      });

      const data = await resp.json();
      if (!resp.ok) {
        // Fallback to wa.me link if API fails
        const waLink = `https://wa.me/${RECIPIENT}?text=${encodeURIComponent(message)}`;
        return res.status(200).json({ success: false, error: data, waLink });
      }

      return res.status(200).json({ success: true, result: data });
    }

    // No server-side config - return wa.me link so client can open WhatsApp
    const waLink = `https://wa.me/${RECIPIENT}?text=${encodeURIComponent(message)}`;
    return res.status(200).json({ success: true, waLink });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
}
