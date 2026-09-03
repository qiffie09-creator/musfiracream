import { jsPDF } from 'jspdf';
import { Order } from '../types';

export const generateInvoicePDF = (order: Order) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;

  // 1. Top Decorative Header Bar (Metallic Gold)
  doc.setFillColor(184, 134, 11); // #b8860b
  doc.rect(0, 0, pageWidth, 5, 'F');

  // 2. Brand & Company Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(24, 28, 36);
  doc.text('MUSFIRA BEAUTY CREAM', margin, 20);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(120, 90, 20);
  doc.text('100% Herbal & Steroid-Free Skincare Formula • Official Store Pakistan', margin, 26);

  doc.setFontSize(8);
  doc.setTextColor(100, 110, 120);
  doc.text('Helpline / WhatsApp: 0300-1234567 | Email: musfirabeautycream@gmail.com', margin, 31);
  doc.text('Official Dispatch Warehouse: Shahrah-e-Faisal / Gulberg Hub, Pakistan', margin, 35);

  // Right Side Header: Invoice Title & Meta Badge
  doc.setFillColor(248, 243, 230);
  doc.roundedRect(pageWidth - margin - 65, 12, 65, 26, 3, 3, 'F');
  doc.setDrawColor(212, 175, 55);
  doc.roundedRect(pageWidth - margin - 65, 12, 65, 26, 3, 3, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(184, 134, 11);
  doc.text('TAX INVOICE / CHALLAN', pageWidth - margin - 61, 18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(40, 45, 55);
  doc.text(`Order #: ${order.orderNumber}`, pageWidth - margin - 61, 24);
  const dateStr = order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-GB') : new Date().toLocaleDateString('en-GB');
  doc.text(`Date: ${dateStr}`, pageWidth - margin - 61, 29);
  doc.text(`Payment: CASH ON DELIVERY`, pageWidth - margin - 61, 34);

  // Divider
  doc.setDrawColor(220, 210, 190);
  doc.setLineWidth(0.5);
  doc.line(margin, 42, pageWidth - margin, 42);

  // 3. Customer & Delivery Destination Details
  let currentY = 48;

  doc.setFillColor(252, 250, 246);
  doc.roundedRect(margin, currentY, contentWidth, 38, 3, 3, 'F');
  doc.setDrawColor(230, 220, 200);
  doc.roundedRect(margin, currentY, contentWidth, 38, 3, 3, 'S');

  // Customer Section Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(184, 134, 11);
  doc.text('CUSTOMER & COURIER DELIVERY DETAILS (خریدار کا پتہ)', margin + 4, currentY + 6);

  doc.setFontSize(8.5);
  doc.setTextColor(60, 65, 75);

  // Left Column: Customer Name & Contacts
  doc.setFont('helvetica', 'bold');
  doc.text('Customer Name:', margin + 4, currentY + 13);
  doc.setFont('helvetica', 'normal');
  doc.text(order.customerName || 'Valued Customer', margin + 32, currentY + 13);

  doc.setFont('helvetica', 'bold');
  doc.text('Primary Phone:', margin + 4, currentY + 19);
  doc.setFont('helvetica', 'normal');
  doc.text(order.phone || '-', margin + 32, currentY + 19);

  if (order.alternatePhone) {
    doc.setFont('helvetica', 'bold');
    doc.text('Alt Phone:', margin + 4, currentY + 25);
    doc.setFont('helvetica', 'normal');
    doc.text(order.alternatePhone, margin + 32, currentY + 25);
  }

  doc.setFont('helvetica', 'bold');
  doc.text('Courier Partner:', margin + 4, currentY + (order.alternatePhone ? 31 : 25));
  doc.setFont('helvetica', 'normal');
  doc.text(order.courierName || 'TCS / Leopards Courier (COD)', margin + 32, currentY + (order.alternatePhone ? 31 : 25));

  // Right Column: Address & City
  const col2X = margin + 95;
  doc.setFont('helvetica', 'bold');
  doc.text('City / Province:', col2X, currentY + 13);
  doc.setFont('helvetica', 'normal');
  const cityProvince = `${order.city || ''}${order.province ? `, ${order.province}` : ''}`;
  doc.text(cityProvince || '-', col2X + 26, currentY + 13);

  doc.setFont('helvetica', 'bold');
  doc.text('Address:', col2X, currentY + 19);
  doc.setFont('helvetica', 'normal');
  
  // Format street address nicely
  const fullAddress = [order.address, order.areaSector].filter(Boolean).join(', ');
  const addressLines = doc.splitTextToSize(fullAddress || 'Address not specified', contentWidth - 125);
  doc.text(addressLines, col2X + 26, currentY + 19);

  const landmarkY = currentY + 19 + Math.max(addressLines.length * 4.5, 9);
  if (order.nearbyFamousPlace) {
    doc.setFont('helvetica', 'bold');
    doc.text('Landmark:', col2X, landmarkY);
    doc.setFont('helvetica', 'normal');
    const landmarkLines = doc.splitTextToSize(order.nearbyFamousPlace, contentWidth - 125);
    doc.text(landmarkLines, col2X + 26, landmarkY);
  }

  // 4. Items Table
  currentY = 94;

  // Table Header
  doc.setFillColor(26, 32, 44); // Dark slate header
  doc.rect(margin, currentY, contentWidth, 8, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(255, 255, 255);
  doc.text('SR#', margin + 3, currentY + 5.5);
  doc.text('ITEM DESCRIPTION', margin + 15, currentY + 5.5);
  doc.text('PACKAGE / BUNDLE', margin + 95, currentY + 5.5);
  doc.text('QTY', margin + 135, currentY + 5.5);
  doc.text('PRICE (PKR)', margin + 150, currentY + 5.5);
  doc.text('TOTAL (PKR)', margin + 172, currentY + 5.5);

  currentY += 8;

  // Table Rows
  const items = order.items && order.items.length > 0 ? order.items : [
    {
      productId: 'prod_musfira_cream',
      productName: 'Musfira Beauty Cream (100% Original)',
      bundleName: '1 Pack (Single Jar)',
      quantity: 1,
      price: order.total || 1550,
    },
  ];

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 35, 45);

  items.forEach((item, index) => {
    const rowBg = index % 2 === 0 ? 255 : 250;
    doc.setFillColor(rowBg, rowBg, rowBg);
    doc.rect(margin, currentY, contentWidth, 8, 'F');
    doc.setDrawColor(235, 230, 220);
    doc.rect(margin, currentY, contentWidth, 8, 'S');

    doc.text(`${index + 1}`, margin + 4, currentY + 5.5);
    doc.text(item.productName || 'Musfira Beauty Skincare', margin + 15, currentY + 5.5);
    doc.text(item.bundleName || 'Standard Single Pack', margin + 95, currentY + 5.5);
    doc.text(`${item.quantity}`, margin + 138, currentY + 5.5);
    doc.text(`Rs. ${item.price?.toLocaleString() || '0'}`, margin + 150, currentY + 5.5);
    doc.text(`Rs. ${((item.price || 0) * (item.quantity || 1)).toLocaleString()}`, margin + 172, currentY + 5.5);

    currentY += 8;
  });

  // Notes row if customer provided notes
  if (order.notes) {
    doc.setFillColor(255, 252, 245);
    doc.rect(margin, currentY, contentWidth, 8, 'F');
    doc.setDrawColor(240, 225, 190);
    doc.rect(margin, currentY, contentWidth, 8, 'S');
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(140, 95, 20);
    doc.text(`Special Delivery Instructions: ${order.notes}`, margin + 4, currentY + 5.5);
    currentY += 8;
  }

  // 5. Total & Payment Summary Box (Right Aligned)
  currentY += 4;
  const summaryBoxWidth = 80;
  const summaryX = pageWidth - margin - summaryBoxWidth;

  doc.setFillColor(252, 250, 245);
  doc.roundedRect(summaryX, currentY, summaryBoxWidth, 32, 2, 2, 'F');
  doc.setDrawColor(212, 175, 55);
  doc.roundedRect(summaryX, currentY, summaryBoxWidth, 32, 2, 2, 'S');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(70, 75, 85);
  doc.text('Order Subtotal:', summaryX + 4, currentY + 7);
  doc.text(`Rs. ${(order.subtotal || order.total).toLocaleString()} PKR`, summaryX + summaryBoxWidth - 4, currentY + 7, { align: 'right' });

  doc.text('Delivery Charges (Shipping):', summaryX + 4, currentY + 14);
  doc.setTextColor(20, 130, 60);
  doc.text('FREE (Rs. 0)', summaryX + summaryBoxWidth - 4, currentY + 14, { align: 'right' });

  doc.setDrawColor(220, 200, 160);
  doc.line(summaryX + 3, currentY + 18, summaryX + summaryBoxWidth - 3, currentY + 18);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(184, 134, 11);
  doc.text('TOTAL AMOUNT (COD):', summaryX + 4, currentY + 26);
  doc.text(`Rs. ${(order.total || 0).toLocaleString()} PKR`, summaryX + summaryBoxWidth - 4, currentY + 26, { align: 'right' });

  // 6. Courier Instructions & Verification Box (Left Aligned)
  doc.setFillColor(245, 247, 250);
  doc.roundedRect(margin, currentY, contentWidth - summaryBoxWidth - 6, 32, 2, 2, 'F');
  doc.setDrawColor(215, 225, 235);
  doc.roundedRect(margin, currentY, contentWidth - summaryBoxWidth - 6, 32, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  doc.text('COURIER DISPATCH & PAYMENT NOTICE:', margin + 4, currentY + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text('• Collect Cash On Delivery before handing parcel to consignee.', margin + 4, currentY + 13);
  doc.text('• Fragile Cosmetic Item: Handle with utmost care. Do not press.', margin + 4, currentY + 18);
  doc.text('• In case of non-availability, call the primary or alternate phone twice.', margin + 4, currentY + 23);
  doc.text('• Helpline for rider assistance: 0300-1234567', margin + 4, currentY + 28);

  currentY += 40;

  // 7. Quality Guarantee & Return Policy
  doc.setFillColor(254, 252, 240);
  doc.roundedRect(margin, currentY, contentWidth, 22, 2, 2, 'F');
  doc.setDrawColor(240, 220, 150);
  doc.roundedRect(margin, currentY, contentWidth, 22, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(184, 134, 11);
  doc.text('100% ORIGINAL PRODUCT GUARANTEE & 7-DAY RETURN POLICY', margin + 4, currentY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(80, 80, 80);
  doc.text('This parcel contains authentic Musfira Skincare formulation sealed with our tamper-proof security stamp.', margin + 4, currentY + 11);
  doc.text('If you have any questions or require skin guidance, please WhatsApp our skin specialist team at 0300-1234567.', margin + 4, currentY + 16);

  // 8. Footer Bar
  doc.setFontSize(7);
  doc.setTextColor(150, 150, 150);
  doc.text(`Generated by Musfira Beauty Skincare System • Invoice #${order.orderNumber} • Page 1 of 1`, pageWidth / 2, 287, { align: 'center' });

  // Save the PDF
  doc.save(`Musfira_Invoice_${order.orderNumber}.pdf`);
};
