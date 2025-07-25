import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectDb } from '@/lib/dbConnect';
import Owner from '@/models/Owner';

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

    // Create export data
    const exportData = {
      exportDate: new Date().toISOString(),
      businessInfo: {
        businessName: owner.businessName,
        ownerName: owner.name,
        email: owner.email,
        phone: owner.phone,
        address: owner.address,
        gstin: owner.gstin,
        panNumber: owner.panNumber,
      },
      notificationSettings: owner.notificationSettings || {},
      businessSettings: owner.businessSettings || {},
      securitySettings: {
        ...owner.securitySettings,
        twoFactorAuth: owner.securitySettings?.twoFactorAuth || false // Don't export sensitive security info
      },
      paymentSettings: owner.paymentSettings || {}
    };

    // Set headers for file download
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');
    headers.set('Content-Disposition', `attachment; filename="settings-export-${new Date().toISOString().split('T')[0]}.json"`);

    return new NextResponse(JSON.stringify(exportData, null, 2), {
      status: 200,
      headers
    });
  } catch (error) {
    console.error('Error exporting settings:', error);
    return NextResponse.json({ error: 'Failed to export settings' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const importData = await request.json();
    
    await connectDb();
    const owner = await Owner.findOne({ email: session.user?.email });
    
    if (!owner) {
      return NextResponse.json({ error: 'Owner not found' }, { status: 404 });
    }

    // Validate import data structure
    if (!importData.businessInfo && !importData.notificationSettings && !importData.businessSettings) {
      return NextResponse.json({ error: 'Invalid import data format' }, { status: 400 });
    }

    // Update only safe settings (exclude sensitive data)
    const updateData: any = {};
    
    if (importData.businessInfo) {
      updateData.businessName = importData.businessInfo.businessName;
      updateData.phone = importData.businessInfo.phone;
      updateData.address = importData.businessInfo.address;
      // Don't import email, gstin, panNumber for security
    }
    
    if (importData.notificationSettings) {
      updateData.notificationSettings = importData.notificationSettings;
    }
    
    if (importData.businessSettings) {
      updateData.businessSettings = importData.businessSettings;
    }
    
    if (importData.paymentSettings) {
      updateData.paymentSettings = importData.paymentSettings;
    }

    updateData.lastUpdated = new Date();

    await Owner.findByIdAndUpdate(owner._id, updateData);

    return NextResponse.json({ 
      message: 'Settings imported successfully',
      importedSections: Object.keys(updateData).filter(key => key !== 'lastUpdated')
    });
  } catch (error) {
    console.error('Error importing settings:', error);
    return NextResponse.json({ error: 'Failed to import settings' }, { status: 500 });
  }
}
