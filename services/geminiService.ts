
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getHotelInsights = async (metrics: any) => {
  try {
    const prompt = `
      Act as a world-class hotel consultant. Analyze the following hotel performance data:
      - Occupancy Rate: ${metrics.occupancy}%
      - Daily Revenue: $${metrics.revenue}
      - Pending Orders: ${metrics.pendingOrders}
      - Low Stock Items: ${metrics.lowStockCount}
      - Top Service: ${metrics.topService}

      Provide a concise 3-sentence summary of the current situation and one high-impact recommendation for the hotel manager.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    return response.text || "Unable to generate insights at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Intelligence services currently offline.";
  }
};

export const chatWithButler = async (message: string, context: any) => {
  try {
    const systemInstruction = `
      You are "Hotello Butler", an elite AI assistant for hotel management. 
      Current Hotel State:
      - Hotel Name: ${context.hotelName}
      - Total Rooms: ${context.totalRooms}
      - Occupied Rooms: ${context.occupiedRooms}
      - Staff on Duty: ${context.staffCount}
      
      Your goal is to help the manager with data, tasks, and recommendations. 
      Keep responses professional, concise, and helpful.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: message,
      config: {
        systemInstruction
      }
    });

    return response.text;
  } catch (error) {
    return "I'm sorry, I'm having trouble connecting to the system right now.";
  }
};
