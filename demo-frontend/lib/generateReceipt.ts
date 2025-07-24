import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

interface ReceiptData {
  bookingId: string;
  userName: string;
  userEmail: string;
  turfName: string;
  location: string;
  date: string;
  timeSlot: string;
  advancePaid: number;
  remainingPayment: number;
  totalAmount: number;
  bookingDate: string;
  sport?: string;
}

export const generateReceiptPDF = async (receiptData: ReceiptData): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: 'A4', margin: 50 });
      const chunks: Buffer[] = [];

      // Collect PDF data
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Header with logo/title
      doc.fillColor('#2563eb')
         .fontSize(24)
         .font('Helvetica-Bold')
         .text('TurfMaster', 50, 50);

      doc.fillColor('#64748b')
         .fontSize(12)
         .font('Helvetica')
         .text('Your Premium Turf Booking Platform', 50, 80);

      // Receipt title
      doc.fillColor('#1e293b')
         .fontSize(20)
         .font('Helvetica-Bold')
         .text('BOOKING RECEIPT', 50, 120);

      // Receipt details box
      const boxY = 160;
      doc.rect(50, boxY, 495, 30)
         .fillAndStroke('#f8fafc', '#e2e8f0');

      doc.fillColor('#1e293b')
         .fontSize(12)
         .font('Helvetica-Bold')
         .text('Receipt Details', 60, boxY + 10);

      // Booking information
      let currentY = boxY + 50;
      
      const addRow = (label: string, value: string, bold = false) => {
        doc.fillColor('#64748b')
           .fontSize(11)
           .font('Helvetica')
           .text(label, 60, currentY);
           
        doc.fillColor('#1e293b')
           .font(bold ? 'Helvetica-Bold' : 'Helvetica')
           .text(value, 250, currentY);
           
        currentY += 25;
      };

      addRow('Booking ID:', receiptData.bookingId, true);
      addRow('Customer Name:', receiptData.userName);
      addRow('Email:', receiptData.userEmail);
      addRow('Booking Date:', receiptData.bookingDate);

      // Separator line
      currentY += 10;
      doc.moveTo(50, currentY)
         .lineTo(545, currentY)
         .strokeColor('#e2e8f0')
         .stroke();
      currentY += 20;

      // Turf details section
      doc.rect(50, currentY, 495, 30)
         .fillAndStroke('#f0f9ff', '#bae6fd');

      doc.fillColor('#0369a1')
         .fontSize(12)
         .font('Helvetica-Bold')
         .text('Turf Details', 60, currentY + 10);

      currentY += 50;

      addRow('Turf Name:', receiptData.turfName, true);
      addRow('Location:', receiptData.location);
      addRow('Sport:', receiptData.sport || 'Not specified');
      addRow('Date:', receiptData.date);
      addRow('Time Slot:', receiptData.timeSlot);

      // Payment details section
      currentY += 10;
      doc.moveTo(50, currentY)
         .lineTo(545, currentY)
         .strokeColor('#e2e8f0')
         .stroke();
      currentY += 20;

      doc.rect(50, currentY, 495, 30)
         .fillAndStroke('#f0fdf4', '#bbf7d0');

      doc.fillColor('#166534')
         .fontSize(12)
         .font('Helvetica-Bold')
         .text('Payment Details', 60, currentY + 10);

      currentY += 50;

      addRow('Total Amount:', `₹${receiptData.totalAmount}`, true);
      addRow('Advance Paid:', `₹${receiptData.advancePaid}`);
      addRow('Remaining Balance:', `₹${receiptData.remainingPayment}`);

      // Status
      currentY += 10;
      const statusText = receiptData.remainingPayment > 0 ? 'PARTIALLY PAID' : 'FULLY PAID';
      const statusColor = receiptData.remainingPayment > 0 ? '#dc2626' : '#16a34a';
      
      doc.fillColor(statusColor)
         .fontSize(14)
         .font('Helvetica-Bold')
         .text(`Status: ${statusText}`, 60, currentY);

      // Important notes
      currentY += 50;
      doc.rect(50, currentY, 495, 80)
         .fillAndStroke('#fef3c7', '#f59e0b');

      doc.fillColor('#92400e')
         .fontSize(11)
         .font('Helvetica-Bold')
         .text('Important Notes:', 60, currentY + 15);

      doc.fillColor('#92400e')
         .font('Helvetica')
         .text('• Please arrive 15 minutes before your slot time', 60, currentY + 35)
         .text('• Carry this receipt for verification', 60, currentY + 50)
         .text('• Contact support for any queries: support@turfmaster.com', 60, currentY + 65);

      // Footer
      currentY += 120;
      doc.fontSize(9)
         .fillColor('#64748b')
         .text('This is a computer-generated receipt and does not require a signature.', 50, currentY, {
           align: 'center',
           width: 495
         });

      doc.text(`Generated on: ${new Date().toLocaleString()}`, 50, currentY + 15, {
        align: 'center',
        width: 495
      });

      // TurfMaster branding at bottom
      doc.fillColor('#2563eb')
         .fontSize(10)
         .font('Helvetica-Bold')
         .text('TurfMaster - Book. Play. Enjoy.', 50, currentY + 40, {
           align: 'center',
           width: 495
         });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

export const generateReceiptHTML = (receiptData: ReceiptData): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Booking Receipt</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f8fafc; }
        .receipt { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { text-align: center; border-bottom: 2px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px; }
        .header h1 { color: #2563eb; margin: 0; font-size: 28px; }
        .header p { color: #64748b; margin: 5px 0; }
        .section { margin: 20px 0; }
        .section h3 { background: #f1f5f9; padding: 10px; margin: 0 0 15px 0; border-left: 4px solid #2563eb; }
        .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e2e8f0; }
        .row:last-child { border-bottom: none; }
        .label { font-weight: bold; color: #475569; }
        .value { color: #1e293b; }
        .highlight { background: #fef3c7; padding: 15px; border-radius: 5px; border-left: 4px solid #f59e0b; margin: 20px 0; }
        .status { text-align: center; font-size: 18px; font-weight: bold; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .paid { background: #dcfce7; color: #166534; }
        .partial { background: #fee2e2; color: #dc2626; }
        .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="receipt">
        <div class="header">
          <h1>🏟️ TurfMaster</h1>
          <p>Your Premium Turf Booking Platform</p>
          <h2 style="color: #1e293b; margin-top: 20px;">BOOKING RECEIPT</h2>
        </div>

        <div class="section">
          <h3>📋 Booking Information</h3>
          <div class="row"><span class="label">Booking ID:</span><span class="value">${receiptData.bookingId}</span></div>
          <div class="row"><span class="label">Customer Name:</span><span class="value">${receiptData.userName}</span></div>
          <div class="row"><span class="label">Email:</span><span class="value">${receiptData.userEmail}</span></div>
          <div class="row"><span class="label">Booking Date:</span><span class="value">${receiptData.bookingDate}</span></div>
        </div>

        <div class="section">
          <h3>🏟️ Turf Details</h3>
          <div class="row"><span class="label">Turf Name:</span><span class="value">${receiptData.turfName}</span></div>
          <div class="row"><span class="label">Location:</span><span class="value">${receiptData.location}</span></div>
          <div class="row"><span class="label">Sport:</span><span class="value">${receiptData.sport || 'Not specified'}</span></div>
          <div class="row"><span class="label">Date:</span><span class="value">${receiptData.date}</span></div>
          <div class="row"><span class="label">Time Slot:</span><span class="value">${receiptData.timeSlot}</span></div>
        </div>

        <div class="section">
          <h3>💰 Payment Details</h3>
          <div class="row"><span class="label">Total Amount:</span><span class="value">₹${receiptData.totalAmount}</span></div>
          <div class="row"><span class="label">Advance Paid:</span><span class="value">₹${receiptData.advancePaid}</span></div>
          <div class="row"><span class="label">Remaining Balance:</span><span class="value">₹${receiptData.remainingPayment}</span></div>
        </div>

        <div class="status ${receiptData.remainingPayment > 0 ? 'partial' : 'paid'}">
          Status: ${receiptData.remainingPayment > 0 ? 'PARTIALLY PAID' : 'FULLY PAID'}
        </div>

        <div class="highlight">
          <strong>⚠️ Important Notes:</strong><br>
          • Please arrive 15 minutes before your slot time<br>
          • Carry this receipt for verification<br>
          • Contact support for any queries: support@turfmaster.com
        </div>

        <div class="footer">
          <p>This is a computer-generated receipt and does not require a signature.</p>
          <p>Generated on: ${new Date().toLocaleString()}</p>
          <p><strong>TurfMaster - Book. Play. Enjoy.</strong></p>
        </div>
      </div>
    </body>
    </html>
  `;
};
