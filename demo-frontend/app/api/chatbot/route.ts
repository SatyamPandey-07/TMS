// /app/api/chatbot/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // System prompt to help Gemini understand your app
    const systemPrompt = `
        You are an intelligent assistant for a turf booking platform called TurfMaster. The app helps users:

       
        - Filter by your current location
        - View turf details: name, price/hour, location, and availability
        - Book slots with date/time
        - Learn about the booking process
        - Ask general turf-related questions

        Do not provide fake data. Instead, suggest to explore or book via the app if specific data is unavailable. If the user asks to book or find turfs, give helpful suggestions or follow-ups.

        Respond in a friendly, concise tone.

        User message: "${message}"
        `;

    const result = await model.generateContent(systemPrompt);
    const text = result.response.text();

    return NextResponse.json({
      response: text,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('AI chatbot error:', error);
    return NextResponse.json(
      { response: "Sorry! I'm having trouble understanding your request. Please try again later." },
      { status: 500 }
    );
  }
}
