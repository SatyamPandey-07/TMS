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
}: {
  to: string;
  subject: string;
  html: string;
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
  };

  await transporter.sendMail(mailOptions);
};
