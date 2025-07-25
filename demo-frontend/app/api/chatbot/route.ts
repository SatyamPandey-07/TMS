// /app/api/chatbot/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
 // Your DB connection
import Turf from '@/models/Turf'; // Your Turf model
import { connectDb } from '@/lib/dbConnect';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Helper function to detect booking intent and extract turf name
async function analyzeBookingIntent(message: string) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  
  const intentPrompt = `
    Analyze this user message and determine:
    1. Does the user want to book a turf? (true/false)
    2. If yes, extract the turf name mentioned
    
    User message: "${message}"
    
    Respond ONLY with valid JSON, no markdown formatting:
    {"wantsToBook": boolean, "turfName": "extracted turf name or null"}
  `;

  try {
    const result = await model.generateContent(intentPrompt);
    let text = result.response.text();
    
    // Extract JSON from the response using regex
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }
    
    const jsonText = jsonMatch[0];
    console.log('Extracted JSON:', jsonText); // Debug log
    
    return JSON.parse(jsonText);
  } catch (error) {
    console.error('Intent analysis error:', error);
   // Debug log
    
    // Fallback: try to parse the intent manually
    return parseIntentManually(message);
  }
}

// Fallback manual parsing
function parseIntentManually(message: string): { wantsToBook: boolean; turfName: string | null } {
  const lowerMessage = message.toLowerCase();
  const bookingKeywords = ['book', 'booking', 'reserve', 'want to play', 'need a turf'];
  
  const wantsToBook = bookingKeywords.some(keyword => lowerMessage.includes(keyword));
  
  if (!wantsToBook) {
    return { wantsToBook: false, turfName: null };
  }
  
  // Simple turf name extraction (you can enhance this)
  const turfMatch = message.match(/(?:book|at|play at)\s+([a-zA-Z\s]+?)(?:\s|$|turf|ground|court)/i);
  const turfName = turfMatch ? turfMatch[1].trim() : null;
  
  return { wantsToBook, turfName };
}


// Helper function to search for turf by name
async function findTurfByName(turfName: string) {
  try {
    await connectDb()
    
    // Case-insensitive search with partial matching
    const turf = await Turf.findOne({
      name: { $regex: new RegExp(turfName, 'i') }
    });
    
    return turf;
  } catch (error) {
    console.error('Database search error:', error);
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // First, analyze if user wants to book and extract turf name
    const intent = await analyzeBookingIntent(message);
    
    if (intent.wantsToBook && intent.turfName) {
      // Search for the turf in database
      const turf = await findTurfByName(intent.turfName);
      
      if (turf) {
        // Return structured response with redirect info
        return NextResponse.json({
          type: 'redirect',
          action: 'book_turf',
          turfId: turf._id,
          turfName: turf.name,
          redirectUrl: `/dashboard/user/turfs/${turf._id}`,
          response: `Great! I found ${turf.name}. Redirecting you to the booking page...`,
          timestamp: new Date().toISOString()
        });
      } else {
        // Turf not found
        return NextResponse.json({
          type: 'message',
          response: `I couldn't find a turf named "${intent.turfName}". Would you like me to show you available turfs in your area instead?`,
          timestamp: new Date().toISOString()
        });
      }
    }

    // Regular chatbot response for non-booking queries
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const systemPrompt = `
      You are an intelligent assistant for a turf booking platform called TurfMaster. The app helps users:
      
      - Filter by your current location
      - View turf details: name, price/hour, location, and availability
      - Book slots with date/time
      - Learn about the booking process
      - Ask general turf-related questions

      Do not provide fake data. Instead, suggest to explore or book via the app if specific data is unavailable.
      Respond in a friendly, concise tone.

      User message: "${message}"
    `;

    const result = await model.generateContent(systemPrompt);
    const text = result.response.text();

    return NextResponse.json({
      type: 'message',
      response: text,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('AI chatbot error:', error);
    return NextResponse.json(
      { 
        type: 'message',
        response: "Sorry! I'm having trouble understanding your request. Please try again later." 
      },
      { status: 500 }
    );
  }
}
