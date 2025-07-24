import nodemailer from 'nodemailer';

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
  subject: '✅ Turf Booking Confirmation',
  html: `
    <div style="max-width: 600px; margin: auto; font-family: Arial, sans-serif; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #4CAF50; color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0;">Booking Confirmed</h1>
        <p style="margin: 0;">You're all set to play! 🎉</p>
      </div>

      <div style="padding: 20px;">
        <h2 style="color: #333;">Turf Details</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px; font-weight: bold;">Turf</td>
            <td style="padding: 8px;">${turfName}</td>
          </tr>
          <tr style="background-color: #f9f9f9;">
            <td style="padding: 8px; font-weight: bold;">Location</td>
            <td style="padding: 8px;">${location}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold;">Slot Time</td>
            <td style="padding: 8px;">${slotTime}</td>
          </tr>
          <tr style="background-color: #f9f9f9;">
            <td style="padding: 8px; font-weight: bold;">Advance Paid</td>
            <td style="padding: 8px;">₹${advancePaid}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold;">Remaining Payment</td>
            <td style="padding: 8px;">₹${remainingPayment}</td>
          </tr>
        </table>

        <p style="margin-top: 20px; font-size: 15px;">Thank you for booking with <strong>Turf Booking</strong>. We look forward to seeing you on the field! ⚽🏏</p>
      </div>

      <div style="background-color: #f1f1f1; padding: 15px; text-align: center; font-size: 12px; color: #666;">
        If you have any questions, reply to this email or contact our support team.
      </div>
    </div>
  `,
};


  await transporter.sendMail(mailOptions);
};