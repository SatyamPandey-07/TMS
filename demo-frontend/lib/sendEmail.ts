import nodemailer from 'nodemailer';
import { generateReceiptPDF, generateReceiptHTML } from './generateReceipt';

interface BookingReceiptData {
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

export const sendBookingReceiptEmail = async (receiptData: BookingReceiptData) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_SENDER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Generate PDF receipt
    const pdfBuffer = await generateReceiptPDF(receiptData);

    const mailOptions = {
      from: `"TurfMaster Bookings" <${process.env.EMAIL_SENDER}>`,
      to: receiptData.userEmail,
      subject: `🏟️ TurfMaster - Booking Receipt #${receiptData.bookingId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #2563eb, #1d4ed8); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">🏟️ TurfMaster</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Your booking is confirmed!</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h2 style="color: #1e293b; margin-top: 0;">Booking Confirmation ✅</h2>
            
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #2563eb;">📋 Quick Summary</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-weight: bold;">Turf:</td>
                  <td style="padding: 8px 0; color: #1e293b;">${receiptData.turfName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-weight: bold;">Date & Time:</td>
                  <td style="padding: 8px 0; color: #1e293b;">${receiptData.date} | ${receiptData.timeSlot}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-weight: bold;">Location:</td>
                  <td style="padding: 8px 0; color: #1e293b;">${receiptData.location}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-weight: bold;">Amount Paid:</td>
                  <td style="padding: 8px 0; color: #16a34a; font-weight: bold;">₹${receiptData.advancePaid}</td>
                </tr>
                ${receiptData.remainingPayment > 0 ? `
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-weight: bold;">Remaining:</td>
                  <td style="padding: 8px 0; color: #dc2626; font-weight: bold;">₹${receiptData.remainingPayment}</td>
                </tr>
                ` : ''}
              </table>
            </div>

            <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0;">
              <h4 style="margin-top: 0; color: #92400e;">⚠️ Important Reminders:</h4>
              <ul style="margin-bottom: 0; color: #92400e;">
                <li>Please arrive 15 minutes before your slot time</li>
                <li>Carry a valid ID for verification</li>
                <li>Your detailed receipt is attached as PDF</li>
              </ul>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <p style="color: #64748b; margin: 0;">Need help? Contact us at <a href="mailto:support@turfmaster.com" style="color: #2563eb;">support@turfmaster.com</a></p>
            </div>

            <div style="text-align: center; padding: 20px; background: #f1f5f9; border-radius: 8px;">
              <h3 style="color: #2563eb; margin-top: 0;">🎾 Get Ready to Play!</h3>
              <p style="color: #64748b; margin-bottom: 15px;">Thank you for choosing TurfMaster. Have a great game!</p>
            </div>
          </div>
        </div>
      `,
      attachments: [
        {
          filename: `TurfMaster_Receipt_${receiptData.bookingId}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf'
        }
      ]
    };

    await transporter.sendMail(mailOptions);
    console.log(`Receipt email sent successfully to ${receiptData.userEmail}`);
  } catch (error) {
    console.error('Error sending receipt email:', error);
    throw error;
  }
};

export const sendBookingConfirmationEmail = async ({
  to,
  turfName,
  location,
  slotTime,
  advancePaid,
  remainingPayment,
}: {
  to: string;
  turfName: string;
  location: string;
  slotTime: string;
  advancePaid: number;
  remainingPayment: number;
}) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_SENDER,
      pass: process.env.EMAIL_PASSWORD, // Use app password for Gmail
    },
  });

  const mailOptions = {
    from: `"Turf Booking" <${process.env.EMAIL_SENDER}>`,
    to,
    subject: 'Turf Booking Confirmation',
    html: `
      <h2>Booking Confirmed ✅</h2>
      <p><strong>Turf:</strong> ${turfName}</p>
      <p><strong>Location:</strong> ${location}</p>
      <p><strong>Slot:</strong> ${slotTime}</p>
      <p><strong>Advance Paid:</strong> ₹${advancePaid}</p>
      <p><strong>Remaining:</strong> ₹${remainingPayment}</p>
      <p>Thank you for booking with us!</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export const sendEmail = async ({
  to,
  subject,
  html,
  attachments,
}: {
  to: string;
  subject: string;
  html: string;
  attachments?: Array<{
    filename: string;
    content: Buffer;
    contentType: string;
  }>;
}) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_SENDER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: `"TMS Notifications" <${process.env.EMAIL_SENDER}>`,
    to,
    subject,
    html,
    attachments,
  };

  await transporter.sendMail(mailOptions);
};
