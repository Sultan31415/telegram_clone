import { GoogleGenAI } from "@google/genai";

const GEMINI_API_KEY = 'AIzaSyD2MMQSsQ6e-Icoxl9hyVsZngCAkJMTTas';
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export const getAIResponse = async (message: string): Promise<string> => {
  try {
    console.log('Sending request to Gemini API...');
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: message,
    });

    console.log('Gemini API Response:', response);
    if (!response.text) {
      throw new Error('No response text received from Gemini API');
    }
    return response.text;
  } catch (error) {
    console.error('Detailed error:', error);
    if (error instanceof Error) {
      return `Error: ${error.message}`;
    }
    return 'Sorry, I encountered an error. Please try again.';
  }
}; 