import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectDb } from '@/lib/dbConnect';
import Owner from '@/models/Owner';
import { sendEmail } from '@/lib/sendEmail';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDb();
    const owner = await Owner.findOne({ email: session.user?.email });
    
    if (!owner) {
      return NextResponse.json({ error: 'Owner not found' }, { status: 404 });
    }

    // Return settings, excluding sensitive data
    const settings = {
      businessName: owner.businessName || '',
      ownerName: owner.name || '',
      email: owner.email || '',
      phone: owner.phone || '',
      address: owner.address || '',
      gstin: owner.gstin || '',
      panNumber: owner.panNumber || '',
      
      emailNotifications: owner.notificationSettings?.email ?? true,
      smsNotifications: owner.notificationSettings?.sms ?? true,
      pushNotifications: owner.notificationSettings?.push ?? true,
      bookingAlerts: owner.notificationSettings?.bookingAlerts ?? true,
      paymentAlerts: owner.notificationSettings?.paymentAlerts ?? true,
      reviewNotifications: owner.notificationSettings?.reviewNotifications ?? true,
      
      autoAcceptBookings: owner.businessSettings?.autoAcceptBookings ?? false,
      allowCancellations: owner.businessSettings?.allowCancellations ?? true,
      cancellationWindow: owner.businessSettings?.cancellationWindow ?? 24,
      requireAdvancePayment: owner.businessSettings?.requireAdvancePayment ?? true,
      advancePaymentPercentage: owner.businessSettings?.advancePaymentPercentage ?? 50,
      
      twoFactorAuth: owner.securitySettings?.twoFactorAuth ?? false,
      businessListingVisible: owner.securitySettings?.businessListingVisible ?? true,
      showContactInfo: owner.securitySettings?.showContactInfo ?? true,
      allowDirectMessages: owner.securitySettings?.allowDirectMessages ?? true,
      
      paymentMethods: owner.paymentSettings?.methods || {
        card: true,
        upi: true,
        netbanking: true,
        wallet: false
      },
      taxSettings: owner.paymentSettings?.tax || {
        includeTax: true,
        taxPercentage: 18
      }
    };

    return NextResponse.json({ settings });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const settings = await request.json();
    
    await connectDb();
    const owner = await Owner.findOne({ email: session.user?.email });
    
    if (!owner) {
      return NextResponse.json({ error: 'Owner not found' }, { status: 404 });
    }

    // Update owner settings
    const updateData = {
      businessName: settings.businessName,
      name: settings.ownerName,
      phone: settings.phone,
      address: settings.address,
      gstin: settings.gstin,
      panNumber: settings.panNumber,
      
      notificationSettings: {
        email: settings.emailNotifications,
        sms: settings.smsNotifications,
        push: settings.pushNotifications,
        bookingAlerts: settings.bookingAlerts,
        paymentAlerts: settings.paymentAlerts,
        reviewNotifications: settings.reviewNotifications
      },
      
      businessSettings: {
        autoAcceptBookings: settings.autoAcceptBookings,
        allowCancellations: settings.allowCancellations,
        cancellationWindow: settings.cancellationWindow,
        requireAdvancePayment: settings.requireAdvancePayment,
        advancePaymentPercentage: settings.advancePaymentPercentage
      },
      
      securitySettings: {
        twoFactorAuth: settings.twoFactorAuth,
        businessListingVisible: settings.businessListingVisible,
        showContactInfo: settings.showContactInfo,
        allowDirectMessages: settings.allowDirectMessages
      },
      
      paymentSettings: {
        methods: settings.paymentMethods,
        tax: settings.taxSettings
      },
      
      lastUpdated: new Date()
    };

    await Owner.findByIdAndUpdate(owner._id, updateData);

    // Send confirmation email if email notifications are enabled
    if (settings.emailNotifications) {
      try {
        await sendEmail({
          to: settings.email,
          subject: 'Settings Updated Successfully',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #2563eb;">Settings Updated</h2>
              <p>Hello ${settings.ownerName},</p>
              <p>Your business settings have been successfully updated for <strong>${settings.businessName}</strong>.</p>
              <p>If you didn't make these changes, please contact support immediately.</p>
              <p>Best regards,<br>TMS Team</p>
            </div>
          `
        });
      } catch (emailError) {
        console.error('Failed to send confirmation email:', emailError);
        // Don't fail the whole request if email fails
      }
    }

    return NextResponse.json({ 
      message: 'Settings updated successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
