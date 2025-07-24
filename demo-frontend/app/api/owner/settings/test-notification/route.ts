import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { sendEmail } from '@/lib/sendEmail';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { type, email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    let subject = '';
    let html = '';

    switch (type) {
      case 'email':
        subject = 'Test Email Notification - TMS';
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center;">
              <h1 style="color: white; margin: 0;">📧 Email Test Successful!</h1>
            </div>
            <div style="padding: 30px; background: #f8f9fa; border-radius: 0 0 10px 10px;">
              <p style="font-size: 16px; color: #333;">Hello!</p>
              <p style="color: #666;">This is a test email notification from your TMS (Turf Management System). If you're seeing this, your email notifications are working perfectly!</p>
              
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
                <h3 style="margin: 0 0 10px 0; color: #333;">✅ Test Results:</h3>
                <ul style="color: #666; margin: 0; padding-left: 20px;">
                  <li>Email delivery: ✅ Working</li>
                  <li>HTML formatting: ✅ Working</li>
                  <li>Timestamp: ${new Date().toLocaleString()}</li>
                </ul>
              </div>
              
              <p style="color: #666;">You can now confidently receive notifications for:</p>
              <ul style="color: #666;">
                <li>🏟️ New bookings</li>
                <li>💰 Payment confirmations</li>
                <li>⭐ New reviews</li>
                <li>🔧 Settings changes</li>
                <li>🚨 Important alerts</li>
              </ul>
              
              <div style="text-align: center; margin-top: 30px;">
                <p style="color: #999; font-size: 14px;">Sent from TMS - Turf Management System</p>
              </div>
            </div>
          </div>
        `;
        break;
        
      case 'booking':
        subject = 'Test Booking Notification - TMS';
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); padding: 30px; border-radius: 10px; text-align: center;">
              <h1 style="color: white; margin: 0;">🏆 New Booking Alert!</h1>
            </div>
            <div style="padding: 30px; background: #f8f9fa; border-radius: 0 0 10px 10px;">
              <p style="font-size: 16px; color: #333;">Great news! You have a new booking:</p>
              
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <h3 style="margin: 0 0 15px 0; color: #11998e;">📋 Booking Details:</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-weight: bold;">Turf:</td>
                    <td style="padding: 8px 0; color: #333;">Elite Sports Arena (Test)</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-weight: bold;">Date:</td>
                    <td style="padding: 8px 0; color: #333;">${new Date().toLocaleDateString()}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-weight: bold;">Time:</td>
                    <td style="padding: 8px 0; color: #333;">6:00 PM - 7:00 PM</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-weight: bold;">Customer:</td>
                    <td style="padding: 8px 0; color: #333;">Test Customer</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-weight: bold;">Amount:</td>
                    <td style="padding: 8px 0; color: #11998e; font-weight: bold;">₹500</td>
                  </tr>
                </table>
              </div>
              
              <div style="text-align: center; margin-top: 30px;">
                <p style="color: #999; font-size: 14px;">This is a test notification. Your booking alerts are working!</p>
              </div>
            </div>
          </div>
        `;
        break;
        
      case 'payment':
        subject = 'Test Payment Notification - TMS';
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 30px; border-radius: 10px; text-align: center;">
              <h1 style="color: white; margin: 0;">💰 Payment Received!</h1>
            </div>
            <div style="padding: 30px; background: #f8f9fa; border-radius: 0 0 10px 10px;">
              <p style="font-size: 16px; color: #333;">Payment notification test:</p>
              
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <h3 style="margin: 0 0 15px 0; color: #f5576c;">💳 Payment Details:</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-weight: bold;">Amount:</td>
                    <td style="padding: 8px 0; color: #f5576c; font-weight: bold; font-size: 18px;">₹500</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-weight: bold;">Method:</td>
                    <td style="padding: 8px 0; color: #333;">UPI (Test)</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-weight: bold;">Reference:</td>
                    <td style="padding: 8px 0; color: #333;">TEST123456789</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-weight: bold;">Status:</td>
                    <td style="padding: 8px 0; color: #28a745; font-weight: bold;">✅ Success</td>
                  </tr>
                </table>
              </div>
              
              <div style="text-align: center; margin-top: 30px;">
                <p style="color: #999; font-size: 14px;">This is a test notification. Your payment alerts are working!</p>
              </div>
            </div>
          </div>
        `;
        break;
        
      default:
        return NextResponse.json({ error: 'Invalid notification type' }, { status: 400 });
    }

    await sendEmail({ to: email, subject, html });

    return NextResponse.json({ 
      message: `Test ${type} notification sent successfully`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error sending test notification:', error);
    return NextResponse.json({ 
      error: 'Failed to send test notification. Please check your email configuration.' 
    }, { status: 500 });
  }
}
