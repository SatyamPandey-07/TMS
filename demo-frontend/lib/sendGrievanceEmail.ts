import nodemailer from 'nodemailer';

interface BookingDetails {
  bookingId: string;
  userName: string;
  userEmail: string;
  slotDate: string;
  startHour: number;
  endHour: number;
  venue: string;
  cancelledAt: Date;
  reason: string;
}

export async function sendGrievanceEmail(bookingDetails: BookingDetails) {
  console.log('=== STARTING EMAIL SENDING PROCESS ===');
  console.log('Booking Details:', {
    bookingId: bookingDetails.bookingId,
    userName: bookingDetails.userName,
    userEmail: bookingDetails.userEmail,
    venue: bookingDetails.venue,
    slotDate: bookingDetails.slotDate,
    startHour: bookingDetails.startHour,
    endHour: bookingDetails.endHour,
    cancelledAt: bookingDetails.cancelledAt,
    reasonLength: bookingDetails.reason?.length || 0
  });

  try {
    // Check if user email exists
    console.log('=== EMAIL VALIDATION ===');
    console.log('User email provided:', bookingDetails.userEmail);
    console.log('Email validation check:', {
      exists: !!bookingDetails.userEmail,
      notUnknown: bookingDetails.userEmail !== 'Unknown Email',
      isValid: bookingDetails.userEmail && bookingDetails.userEmail !== 'Unknown Email'
    });

    if (!bookingDetails.userEmail || bookingDetails.userEmail === 'Unknown Email') {
      console.warn('❌ No valid user email found, skipping email notification');
      console.log('Email check failed - userEmail:', bookingDetails.userEmail);
      return;
    }
    console.log('✅ Email validation passed');

    // Check if required environment variables exist
    console.log('=== ENVIRONMENT VARIABLES CHECK ===');
    console.log('Environment variables check:', {
      EMAIL_SENDER_EXISTS: !!process.env.EMAIL_SENDER,
      EMAIL_PASSWORD_EXISTS: !!process.env.EMAIL_PASSWORD,
      EMAIL_SENDER_VALUE: process.env.EMAIL_SENDER ? `${process.env.EMAIL_SENDER.substring(0, 3)}***` : 'NOT SET',
      EMAIL_PASSWORD_LENGTH: process.env.EMAIL_PASSWORD ? process.env.EMAIL_PASSWORD.length : 0
    });

    if (!process.env.EMAIL_SENDER || !process.env.EMAIL_PASSWORD) {
      console.error('❌ Email credentials not configured');
      console.log('Missing credentials:', {
        EMAIL_SENDER: !process.env.EMAIL_SENDER ? 'MISSING' : 'EXISTS',
        EMAIL_PASSWORD: !process.env.EMAIL_PASSWORD ? 'MISSING' : 'EXISTS'
      });
      return;
    }
    console.log('✅ Environment variables validation passed');

    // Create transporter
    console.log('=== CREATING EMAIL TRANSPORTER ===');
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_SENDER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    console.log('✅ Transporter created successfully');

    // Verify transporter
    console.log('=== VERIFYING TRANSPORTER ===');
    try {
      await transporter.verify();
      console.log('✅ Transporter verification successful');
    } catch (verifyError) {
      console.error('❌ Transporter verification failed:', verifyError);
      throw new Error(`Transporter verification failed: ${verifyError}`);
    }

    // Format the date for better readability
    console.log('=== FORMATTING EMAIL CONTENT ===');
    const formattedDate = new Date(bookingDetails.slotDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const formattedTime = `${bookingDetails.startHour}:00 - ${bookingDetails.endHour}:00`;
    
    console.log('Formatted data:', {
      originalDate: bookingDetails.slotDate,
      formattedDate: formattedDate,
      formattedTime: formattedTime
    });

    // Email content for user cancellation confirmation
    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #d32f2f; border-bottom: 2px solid #d32f2f; padding-bottom: 10px;">
          Turf Booking Cancellation Confirmation
        </h2>
        
        <p>Dear <strong>${bookingDetails.userName}</strong>,</p>
        
        <p>Your turf slot booking has been successfully cancelled. Below are the details of your cancelled booking:</p>
        
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #333; margin-top: 0;">Cancelled Booking Details:</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #555;">Booking ID:</td>
              <td style="padding: 8px 0;">${bookingDetails.bookingId}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #555;">Venue:</td>
              <td style="padding: 8px 0;">${bookingDetails.venue}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #555;">Date:</td>
              <td style="padding: 8px 0;">${formattedDate}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #555;">Time Slot:</td>
              <td style="padding: 8px 0;">${formattedTime}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #555;">Cancelled At:</td>
              <td style="padding: 8px 0;">${bookingDetails.cancelledAt.toLocaleString()}</td>
            </tr>
          </table>
        </div>
        
        <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="color: #856404; margin-top: 0;">Reason for Cancellation:</h3>
          <p style="margin: 0; color: #856404; font-style: italic;">
            "${bookingDetails.reason}"
          </p>
        </div>
        
        <div style="background-color: #e8f5e8; border: 1px solid #c3e6c3; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 0; color: #2e7d32;">
            <strong>✓ Your booking has been cancelled successfully.</strong><br>
            The slot is now available for other users to book.
          </p>
        </div>
        
        <p>If you need to make a new booking or have any questions about this cancellation, please visit our booking portal or contact our support team.</p>
        
        <p>Thank you for using our turf booking system.</p>
        
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        <p style="font-size: 12px; color: #666; text-align: center;">
          <em>This is an automated confirmation email. Please do not reply to this email.</em>
        </p>
      </div>
    `;

    console.log('✅ Email content prepared');
    console.log('Email content length:', emailContent.length);

    // Prepare mail options
    const mailOptions = {
      from: process.env.EMAIL_SENDER,
      to: bookingDetails.userEmail,
      subject: `Turf Booking Cancelled - ${bookingDetails.venue} on ${formattedDate}`,
      html: emailContent,
    };

    console.log('=== PREPARING TO SEND EMAIL ===');
    console.log('Mail options:', {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject,
      htmlLength: mailOptions.html.length
    });

    // Send cancellation confirmation email to user only
    console.log('=== SENDING EMAIL ===');
    console.log('Attempting to send email to:', bookingDetails.userEmail);
    
    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅ EMAIL SENT SUCCESSFULLY!');
    console.log('Email send info:', {
      messageId: info.messageId,
      response: info.response,
      accepted: info.accepted,
      rejected: info.rejected,
      pending: info.pending,
      envelope: info.envelope
    });

    // Additional success logging
    console.log('Email delivery details:', {
      recipientAccepted: info.accepted?.includes(bookingDetails.userEmail),
      recipientRejected: info.rejected?.includes(bookingDetails.userEmail),
      finalRecipient: bookingDetails.userEmail,
      timestamp: new Date().toISOString()
    });

    console.log('=== EMAIL PROCESS COMPLETED SUCCESSFULLY ===');

  } catch (error) {
    console.error('=== EMAIL SENDING ERROR ===');
    console.error('❌ Error sending cancellation email:', error);
    
    // Detailed error logging
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
        cause: error.cause
      });
    }

    // Log specific error types
    
    // Log email attempt details for debugging
    console.error('Email attempt details:', {
      targetEmail: bookingDetails.userEmail,
      fromEmail: process.env.EMAIL_SENDER,
      bookingId: bookingDetails.bookingId,
      venue: bookingDetails.venue,
      attemptTime: new Date().toISOString()
    });

    // Don't throw error to prevent booking cancellation from failing
    console.warn('⚠️ Email sending failed, but booking cancellation completed');
    console.log('=== EMAIL PROCESS COMPLETED WITH ERRORS ===');
  }
}
