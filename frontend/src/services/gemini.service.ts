// C:\Users\Admin\OneDrive\Desktop\BuyzaProject\hotellosys\src\services\gemini.service.ts

import { GoogleGenerativeAI } from "@google/generative-ai";

// Vite uses import.meta.env instead of process.env
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export const chatWithButler = async (message: string, context: any) => {
  try {
    // We use gemini-1.5-flash because it is fast and perfect for a "Butler" chat
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: `
        You are "Hotello Butler", the virtual concierge for ${context.hotelName}. 
        You have access to the following live data:
        - Total Rooms: ${context.totalRooms}
        - Occupied: ${context.occupiedRooms}
        - Staff Count: ${context.staffCount}

        Be professional, efficient, and slightly formal. If asked for advice, 
        prioritize guest satisfaction and operational efficiency.
      `,
    });

    const result = await model.generateContent(message);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini Service Error:", error);
    return "I apologize, my communication modules are currently resetting. Please try again in a moment.";
  }
};

export const getHotelInsights = async (metrics: any) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `
      Analyze these hotel metrics: 
      Occupancy: ${metrics.occupancy}%, Revenue: $${metrics.revenue}. 
      Give a 1-sentence executive summary.
    `;
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    return "Insights currently unavailable.";
  }
};