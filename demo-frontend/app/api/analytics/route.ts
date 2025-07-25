import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDb } from '@/lib/dbConnect';
import Booking from '@/models/Booking';
import Turf from '@/models/Turf';
import mongoose from 'mongoose';

export const GET = async (req: NextRequest) => {
  await connectDb();
  
  const session = await getServerSession(authOptions);
  const ownerId = session?.user?.id;
  
  if (!ownerId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Ensure models are loaded
  if (!mongoose.models.Booking) {
    require('@/models/Booking');
  }
  if (!mongoose.models.Turf) {
    require('@/models/Turf');
  }

  try {
    // Find all turfs owned by this owner
    const turfs = await Turf.find({ ownerId: ownerId }).select('_id');
    const turfIds = turfs.map(t => t._id);

    if (turfIds.length === 0) {
      return NextResponse.json({ 
        weeklyData: [],
        totalRevenue: 0,
        totalBookings: 0,
        projectedIncome: 0,
        growthRate: 0,
        monthlyComparison: [],
        peakDays: []
      });
    }

    // Get all bookings for the owner's turfs with turf details populated (last 3 months for better analysis)
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    
    const bookings = await Booking.find({ 
      turfId: { $in: turfIds },
      status: 'confirmed',
      createdAt: { $gte: threeMonthsAgo }
    })
    .populate('turfId', 'priceBase') // Populate turf price
    .sort({ createdAt: 1 });


    console.log(bookings)

    // Separate paid and unpaid bookings
    const paidBookings = bookings.filter(booking => booking.isPaymentReceived === true);
    const unpaidBookings = bookings.filter(booking => booking.isPaymentReceived === false);

    // Calculate weekly data
    const weeklyData = processWeeklyData(paidBookings);
    
    // Calculate metrics based on turf price and payment status
    const totalRevenue = paidBookings.reduce((sum, booking) => {
      const amount = booking.turfId?.priceBase || parseFloat(booking.paymentreceived || '0');
      return sum + amount;
    }, 0);

    // Future income from unpaid bookings
    const futureIncome = unpaidBookings.reduce((sum, booking) => {
      const amount = booking.turfId?.priceBase || parseFloat(booking.paymentreceived || '0');
      return sum + amount;
    }, 0);

    const totalBookings = bookings.length;
    
    // Calculate growth rate (last 2 weeks)
    const growthRate = calculateGrowthRate(weeklyData);
    
    // Monthly comparison
    const monthlyComparison = calculateMonthlyComparison(paidBookings, unpaidBookings);
    
    // Peak performance days
    const peakDays = calculatePeakDays(paidBookings);

    return NextResponse.json({
      weeklyData,
      totalRevenue,
      totalBookings,
      projectedIncome: futureIncome, // This is now the future income from unpaid bookings
      growthRate,
      monthlyComparison,
      peakDays
    }, { status: 200 });

  } catch (err) {
    console.error('Analytics API Error:', err);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
};

// Helper function to process weekly data (only for paid bookings)
function processWeeklyData(paidBookings: any[]) {
  const weeklyMap = new Map();
  
  paidBookings.forEach(booking => {
    const date = new Date(booking.createdAt);
    // Get the start of the week (Monday)
    const dayOfWeek = date.getDay();
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    startOfWeek.setHours(0, 0, 0, 0);
    
    const weekKey = startOfWeek.toISOString().split('T')[0];
    
    if (!weeklyMap.has(weekKey)) {
      weeklyMap.set(weekKey, {
        week: weekKey,
        weekLabel: getWeekLabel(startOfWeek),
        revenue: 0,
        bookings: 0,
        startDate: startOfWeek
      });
    }
    
    const weekData = weeklyMap.get(weekKey);
    // Use turf price for revenue calculation
    const amount = booking.turfId?.price || parseFloat(booking.paymentreceived || '0');
    weekData.revenue += amount;
    weekData.bookings += 1;
  });
  
  // Convert to array and sort by date
  return Array.from(weeklyMap.values())
    .sort((a, b) => new Date(a.week).getTime() - new Date(b.week).getTime())
    .slice(-12); // Last 12 weeks for better visualization
}

// Helper function to get week label
function getWeekLabel(startDate: Date) {
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6);
  
  const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
  return `${startDate.toLocaleDateString('en-US', options)} - ${endDate.toLocaleDateString('en-US', options)}`;
}

// Helper function to calculate growth rate
function calculateGrowthRate(weeklyData: any[]) {
  if (weeklyData.length < 2) return 0;
  
  const lastWeek = weeklyData[weeklyData.length - 1];
  const previousWeek = weeklyData[weeklyData.length - 2];
  
  if (previousWeek.revenue === 0) return 0;
  
  return ((lastWeek.revenue - previousWeek.revenue) / previousWeek.revenue) * 100;
}

// Updated helper function to calculate monthly comparison
function calculateMonthlyComparison(paidBookings: any[], unpaidBookings: any[]) {
  const monthlyMap = new Map();
  
  // Process paid bookings for revenue
  paidBookings.forEach(booking => {
    const date = new Date(booking.createdAt);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const monthName = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    
    if (!monthlyMap.has(monthKey)) {
      monthlyMap.set(monthKey, {
        month: monthName,
        revenue: 0,
        bookings: 0,
        pendingRevenue: 0
      });
    }
    
    const monthData = monthlyMap.get(monthKey);
    const amount = booking.turfId?.price || parseFloat(booking.paymentreceived || '0');
    monthData.revenue += amount;
    monthData.bookings += 1;
  });

  // Process unpaid bookings for pending revenue
  unpaidBookings.forEach(booking => {
    const date = new Date(booking.createdAt);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const monthName = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    
    if (!monthlyMap.has(monthKey)) {
      monthlyMap.set(monthKey, {
        month: monthName,
        revenue: 0,
        bookings: 0,
        pendingRevenue: 0
      });
    }
    
    const monthData = monthlyMap.get(monthKey);
    const amount = booking.turfId?.price || parseFloat(booking.paymentreceived || '0');
    monthData.pendingRevenue += amount;
    // Don't count unpaid bookings in the bookings count for revenue analysis
  });
  
  return Array.from(monthlyMap.values()).slice(-3); // Last 3 months
}

// Helper function to calculate peak days (only for paid bookings)
function calculatePeakDays(paidBookings: any[]) {
  const dayMap = new Map();
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  // Initialize all days
  days.forEach(day => {
    dayMap.set(day, { day, bookings: 0, revenue: 0 });
  });
  
  paidBookings.forEach(booking => {
    const date = new Date(booking.createdAt);
    const dayName = days[date.getDay()];
    const dayData = dayMap.get(dayName);
    dayData.bookings += 1;
    const amount = booking.turfId?.price || parseFloat(booking.paymentreceived || '0');
    dayData.revenue += amount;
  });
  
  return Array.from(dayMap.values()).sort((a, b) => b.revenue - a.revenue);
}
