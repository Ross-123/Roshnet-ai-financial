import { GoogleGenAI, Type } from "@google/genai";
import { Stock } from '../types';

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("No API Key found for Gemini");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateMarketSummary = async (stocks: Stock[]) => {
  const client = getClient();
  if (!client) return "AI services unavailable (Missing API Key).";

  const stockSummary = stocks.map(s => `${s.symbol}: $${s.price} (${s.changePercent}%)`).join(', ');
  
  try {
    const response = await client.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a senior financial analyst. Based on this market snapshot: [${stockSummary}], provide a 2-sentence market sentiment summary. Be professional and concise.`,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Market analysis temporarily unavailable.";
  }
};

export const generateStockDeepDive = async (stock: Stock) => {
  const client = getClient();
  if (!client) throw new Error("API Key Missing");

  const prompt = `
    Analyze ${stock.name} (${stock.symbol}). 
    Current Price: $${stock.price}, Change: ${stock.changePercent}%, PE Ratio: ${stock.peRatio}, Sector: ${stock.sector}.
    
    Provide a JSON response with the following structure:
    {
      "summary": "A 2-sentence executive summary of the stock's current standing.",
      "rating": "Buy" | "Hold" | "Sell",
      "riskLevel": "Low" | "Medium" | "High",
      "keyPoints": ["Point 1", "Point 2", "Point 3"]
    }
  `;

  try {
    const response = await client.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            rating: { type: Type.STRING, enum: ["Buy", "Hold", "Sell"] },
            riskLevel: { type: Type.STRING, enum: ["Low", "Medium", "High"] },
            keyPoints: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            }
          }
        }
      }
    });
    
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Gemini Deep Dive Error:", error);
    throw error;
  }
};
