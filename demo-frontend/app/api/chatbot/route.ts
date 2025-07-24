import { NextRequest, NextResponse } from 'next/server';
import { connectDb } from '@/lib/dbConnect';
import Turf from '@/models/Turf';

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();
    
    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    await connectDb();
    
    const userMessage = message.toLowerCase();
    let response = '';

    // Check for turf search queries
    if (userMessage.includes('find') || userMessage.includes('search') || userMessage.includes('turf')) {
      // Extract location or sport if mentioned
      let location = '';
      let sport = '';
      
      if (userMessage.includes('football')) sport = 'Football';
      else if (userMessage.includes('cricket')) sport = 'Cricket';
      else if (userMessage.includes('badminton')) sport = 'Badminton';
      else if (userMessage.includes('basketball')) sport = 'Basketball';
      
      if (userMessage.includes('delhi') || userMessage.includes('noida')) location = 'Delhi';
      else if (userMessage.includes('mumbai') || userMessage.includes('andheri')) location = 'Mumbai';
      else if (userMessage.includes('bangalore') || userMessage.includes('bengaluru')) location = 'Bangalore';
      
      // Search for turfs based on criteria
      const searchCriteria: any = {};
      if (sport) searchCriteria.sport = new RegExp(sport, 'i');
      if (location) searchCriteria.location = new RegExp(location, 'i');
      
      const turfs = await Turf.find(searchCriteria).limit(3);
      
      if (turfs.length > 0) {
        response = `🏟️ I found ${turfs.length} turf(s) for you:\n\n`;
        turfs.forEach((turf, index) => {
          response += `${index + 1}. **${turf.name}**\n`;
          response += `   📍 ${turf.location}\n`;
          response += `   🏃 ${turf.sport}\n`;
          response += `   💰 ₹${turf.pricePerHour}/hour\n\n`;
        });
        response += "Would you like to book any of these turfs? I can guide you through the process!";
      } else {
        response = `I couldn't find any turfs matching your criteria. Let me help you explore our available options:\n\n`;
        response += `🔍 **Try these searches:**\n`;
        response += `• "Find football turfs in Delhi"\n`;
        response += `• "Cricket grounds near me"\n`;
        response += `• "Badminton courts in Mumbai"\n\n`;
        response += `Or visit our Explore page to browse all available turfs!`;
      }
    }
    // Price inquiry
    else if (userMessage.includes('price') || userMessage.includes('cost') || userMessage.includes('rate')) {
      const turfs = await Turf.find({}).limit(5);
      if (turfs.length > 0) {
        response = `💰 **Current Turf Pricing:**\n\n`;
        turfs.forEach(turf => {
          response += `• ${turf.name}: ₹${turf.pricePerHour}/hour\n`;
        });
        response += `\n📋 **Price Range by Sport:**\n`;
        response += `• Football: ₹600-₹1200/hour\n`;
        response += `• Cricket: ₹800-₹1500/hour\n`;
        response += `• Badminton: ₹400-₹800/hour\n`;
        response += `• Basketball: ₹500-₹900/hour\n\n`;
        response += `Prices vary by location, facilities, and peak hours. Check specific turfs for exact pricing!`;
      }
    }
    // Booking help
    else if (userMessage.includes('book') || userMessage.includes('booking') || userMessage.includes('reserve')) {
      response = `📅 **How to Book a Turf:**\n\n`;
      response += `1. 🔍 **Explore** - Browse available turfs\n`;
      response += `2. 📍 **Filter** - By location, sport, price\n`;
      response += `3. 📅 **Select** - Choose date and time slot\n`;
      response += `4. 💳 **Pay** - Secure advance payment\n`;
      response += `5. ✅ **Confirm** - Get instant confirmation\n\n`;
      response += `💡 **Pro Tips:**\n`;
      response += `• Book in advance for better availability\n`;
      response += `• Check weather forecasts\n`;
      response += `• Arrive 15 minutes early\n\n`;
      response += `Want me to help you find and book a turf right now?`;
    }
    // Default responses
    else {
      const defaultResponses = [
        `🏟️ Hello! I'm your TurfMaster assistant. I can help you:\n\n• Find turfs by location or sport\n• Check pricing and availability\n• Guide you through booking\n• Answer questions about our services\n\nWhat would you like to know?`,
        
        `🤖 I'm here to make your turf booking experience amazing! Try asking me:\n\n• "Find football turfs in Delhi"\n• "What are the prices?"\n• "How do I book a turf?"\n• "Show me cricket grounds"\n\nHow can I assist you today?`
      ];
      
      response = defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    }

    return NextResponse.json({ 
      response,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Chatbot API error:', error);
    return NextResponse.json({ 
      response: "I'm experiencing some technical difficulties. Please try again or contact our support team for assistance!",
      error: 'Internal server error'
    }, { status: 500 });
  }
}
