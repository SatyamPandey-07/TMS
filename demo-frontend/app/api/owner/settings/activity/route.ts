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

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');

    await connectDb();
    const owner = await Owner.findOne({ email: session.user?.email });
    
    if (!owner) {
      return NextResponse.json({ error: 'Owner not found' }, { status: 404 });
    }

    // Generate sample activity logs (in real app, this would come from a logs collection)
    const activities = [
      {
        id: '1',
        action: 'Settings Updated',
        description: 'Notification preferences were modified',
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        ip: '192.168.1.1',
        userAgent: 'Mozilla/5.0...',
        changes: ['emailNotifications: true', 'smsNotifications: false']
      },
      {
        id: '2',
        action: 'Login',
        description: 'Successful login to dashboard',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        ip: '192.168.1.1',
        userAgent: 'Mozilla/5.0...'
      },
      {
        id: '3',
        action: 'Business Information Updated',
        description: 'Phone number and address were updated',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        ip: '192.168.1.2',
        userAgent: 'Mozilla/5.0...',
        changes: ['phone: +91 9876543210', 'address: Updated address']
      },
      {
        id: '4',
        action: 'Payment Settings Modified',
        description: 'Payment methods were updated',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
        ip: '192.168.1.1',
        userAgent: 'Mozilla/5.0...',
        changes: ['wallet: false', 'upi: true']
      },
      {
        id: '5',
        action: 'Security Settings Changed',
        description: 'Two-factor authentication enabled',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
        ip: '192.168.1.1',
        userAgent: 'Mozilla/5.0...',
        changes: ['twoFactorAuth: true']
      }
    ];

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const paginatedActivities = activities.slice(startIndex, startIndex + limit);

    return NextResponse.json({
      activities: paginatedActivities,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(activities.length / limit),
        totalActivities: activities.length,
        hasNext: startIndex + limit < activities.length,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching activity logs:', error);
    return NextResponse.json({ error: 'Failed to fetch activity logs' }, { status: 500 });
  }
}
