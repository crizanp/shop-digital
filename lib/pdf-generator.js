import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Generate a beautiful quotation PDF
 * @param {Object} packageData - The package details
 * @param {number} quantity - Quantity ordered
 * @param {Object} selectedOptions - Selected pricing options
 * @param {string} totalPrice - Formatted total price
 * @returns {Promise<void>}
 */
export const generateQuotationPDF = async (packageData, quantity, selectedOptions, totalPrice, currencyInfo) => {
  try {
    // Create a hidden container for PDF content
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.width = '800px';
    container.style.backgroundColor = '#ffffff';
    container.innerHTML = generatePDFHTML(packageData, quantity, selectedOptions, totalPrice, currencyInfo);
    
    document.body.appendChild(container);

    // Convert HTML to canvas
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
      windowWidth: 800,
    });

    // Remove the temporary container
    document.body.removeChild(container);

    // Create PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const imgData = canvas.toDataURL('image/png');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

    // Open the PDF in a new tab instead of downloading
    const pdfBlob = pdf.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, '_blank');
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Failed to generate PDF. Please try again.');
  }
};

/**
 * Generate HTML content for the PDF
 */
function generatePDFHTML(packageData, quantity, selectedOptions, totalPrice, currencyInfo) {
  // Extract numeric value from total price
  const priceMatch = totalPrice.match(/(\d+\.?\d*)/);
  const numericTotal = priceMatch ? priceMatch[0] : totalPrice;

  // Calculate subtotal
  const subtotal = parseFloat(numericTotal) / quantity;

  // Format selected options
  let optionsHTML = '';
  if (packageData.pricing && packageData.pricing.length > 0) {
    packageData.pricing.forEach((category, categoryIndex) => {
      const selectedIndices = selectedOptions[categoryIndex] || [];
      if (selectedIndices.length > 0) {
        optionsHTML += `<div style="margin-bottom: 12px;">
          <strong style="color: #1f2937; font-size: 13px;">${category.title}</strong>
          <ul style="margin: 6px 0 0 20px; padding: 0; list-style: none;">`;
        
        selectedIndices.forEach(optionIndex => {
          const option = category.options[optionIndex];
          if (option) {
            optionsHTML += `<li style="color: #4b5563; font-size: 12px; margin-bottom: 4px;">
              • ${option.name} - $${option.price}
            </li>`;
          }
        });
        optionsHTML += `</ul></div>`;
      }
    });
  }

  return `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; color: #1f2937; line-height: 1.6;">
      <!-- Header with Logo -->
      <div style="background: linear-gradient(135deg, #1f2937 0%, #111827 100%); color: white; padding: 30px; text-align: center;">
        <img src="/images/logo_black1.png" style="max-width: 120px; height: auto; margin-bottom: 16px;" alt="Foxbeep Logo" />
        <div style="font-size: 28px; font-weight: bold; margin-bottom: 8px;">
          FOXBEEP TECHNOLOGY      </div>
        <div style="font-size: 13px; opacity: 0.9; margin-bottom: 2px;">
          Your tech partner for growth
        </div>
        <div style="font-size: 11px; opacity: 0.8;">
          www.foxbeep.com | WhatsApp: 97 0551 6131
        </div>
      </div>

      <!-- Main Content -->
      <div style="padding: 30px; background: white;">
        <!-- Quotation Title -->
        <div style="margin-bottom: 24px; border-bottom: 2px solid #e5e7eb; padding-bottom: 16px;">
          <div style="font-size: 18px; color: #111827; font-weight: bold; margin-bottom: 4px;">
            QUOTATION REQUEST
          </div>
          <div style="font-size: 11px; color: #6b7280;">
            Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} | 
            Time: ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
          </div>
        </div>

        <!-- Package Section -->
        <div style="background: #f9fafb; padding: 16px; border-radius: 6px; margin-bottom: 20px; ">
          <div style="font-size: 14px; font-weight: bold; color: #111827; margin-bottom: 8px;">
            ${packageData.title || packageData.name}
          </div>
          ${packageData.subtitle ? `<div style="font-size: 12px; color: #4b5563; margin-bottom: 8px; font-style: italic;">
            ${packageData.subtitle}
          </div>` : ''}
         
        </div>

        <!-- Pricing Table -->
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 12px;">
          <thead>
            <tr style="background: #f3f4f6; border-bottom: 2px solid #d1d5db;">
              <th style="padding: 10px; text-align: left; color: #1f2937; font-weight: bold;">Item</th>
              <th style="padding: 10px; text-align: center; color: #1f2937; font-weight: bold;">Qty</th>
              <th style="padding: 10px; text-align: right; color: #1f2937; font-weight: bold;">Price</th>
              <th style="padding: 10px; text-align: right; color: #1f2937; font-weight: bold;">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 10px; color: #374151;">Base Package</td>
              <td style="padding: 10px; text-align: center; color: #374151;">${quantity}</td>
              <td style="padding: 10px; text-align: right; color: #374151;">$${packageData.price || 'Contact for pricing'}</td>
              <td style="padding: 10px; text-align: right; color: #1f2937; font-weight: 600;">
                ${packageData.price ? `$${(parseFloat(packageData.price.replace(/[^0-9.]/g, '')) * quantity).toFixed(2)}` : 'Contact for pricing'}
              </td>
            </tr>
            ${optionsHTML ? `<tr style="background: #fafbfc; border-bottom: 1px solid #e5e7eb;">
              <td colspan="4" style="padding: 10px; color: #374151;">
                ${optionsHTML}
              </td>
            </tr>` : ''}
          </tbody>
        </table>

        <!-- Total Section -->
        <div style="background: #f0f9ff; padding: 16px; border-radius: 6px; border: 2px solid #0284c7; margin-bottom: 20px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span style="color: #4b5563; font-size: 12px;">Subtotal:</span>
            <span style="color: #374151; font-weight: 600; font-size: 12px;">$ ${totalPrice}</span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span style="color: #4b5563; font-size: 12px;">Tax (if applicable):</span>
            <span style="color: #374151; font-weight: 600; font-size: 12px;">To be confirmed</span>
          </div>
          <div style="border-top: 2px solid #0284c7; padding-top: 10px; display: flex; justify-content: space-between; align-items: center;">
            <span style="color: #1f2937; font-size: 14px; font-weight: bold;">GRAND TOTAL:</span>
            <span style="color: #0284c7; font-size: 20px; font-weight: bold;">$ ${totalPrice}</span>
          </div>
        </div>

        <!-- Contact & WhatsApp -->
        <div style="background: #dbeafe; padding: 16px; border-radius: 6px; margin-bottom: 20px;">
          <div style="font-size: 12px; font-weight: bold; color: #1f2937; margin-bottom: 8px;">
            📞 CONTACT & SUPPORT
          </div>
          <div style="font-size: 11px; color: #1f2937; line-height: 1.6;">
            <div style="margin-bottom: 4px;">
              <strong>WhatsApp:</strong> <a href="https://wa.me/970551631" style="color: #0284c7; text-decoration: none;">97 0551 6131</a>
            </div>
            <div style="margin-bottom: 4px;">
              <strong>Website:</strong> www.foxbeep.com
            </div>
            <div style="margin-bottom: 4px;">
              <strong>Response Time:</strong> Within 2 hours
            </div>
          </div>
        </div>

        <!-- Footer Note -->
        <div style="background: #eff6ff; padding: 12px; border-radius: 6px; font-size: 10px; color: #1e40af; text-align: center; line-height: 1.5;">
          <strong>Note:</strong> This is an automated quotation. Please confirm via WhatsApp for final details and payment terms. Valid for 7 days from issue date.
        </div>
      </div>

      <!-- Footer -->
      <div style="background: #1f2937; color: white; padding: 20px; text-align: center; font-size: 10px;">
        <div style="margin-bottom: 4px;">© 2024-2026 FOXBEEP. All rights reserved.</div>
        <div style="opacity: 0.8;">Thank you for choosing Foxbeep!</div>
      </div>
    </div>
  `;
}
