import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

let client: any = null;
if (process.env.GEMINI_API_KEY) {
  try {
    client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    console.log("AI Services initialized successfully.");
  } catch (err: any) {
    console.warn("Failed to initialize Gemini Client:", err.message);
  }
} else {
  console.log("GEMINI_API_KEY not found. AI features will use fallback descriptions.");
}

export async function generateSensoryDescription(name: string, brand: string, origin: string, notes: string) {
  if (!client) {
    return { description: `A premium specialty coffee from ${origin} featuring rich notes of ${notes}. Hand-selected by ${brand} for its exceptional balance and depth.` };
  }
  try {
    const prompt = `Write a premium, poetic, and sophisticated 2-sentence description for a coffee named "${name}" from ${brand} (${origin}) with tasting notes of ${notes}. Make it sound like a high-end specialty coffee roaster's copy.`;
    const response = await client.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });
    return { description: response.text() };
  } catch (err: any) {
    console.error("Gemini Error:", err.message);
    return { description: `A premium specialty coffee from ${origin} featuring notes of ${notes}. Curated by ${brand}.` };
  }
}
