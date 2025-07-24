import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import User from '@/models/User';
import Owner from '@/models/Owner';
import { connectDb } from '@/lib/dbConnect';

export async function POST(req: Request) {
  await connectDb();

  try {
    const body = await req.json();
    const { name, email, password, role, phone, acceptedPaymentMethods } = body;

    // Validate required fields
    if (!name || !email || !password || !role) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }


    // Create user
    const newUser = await User.create({
      name,
      email,
      password,
      role,
      phone,
    });

    // If owner, create Owner model instance
    if (role === 'admin') {
      await Owner.create({
        user: newUser._id,
        acceptedPaymentMethods,
        turfIds: [],
        bookingIds: [],
      });
    }

    return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });

  } catch (error) {
    console.error('[REGISTER_ERROR]', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
