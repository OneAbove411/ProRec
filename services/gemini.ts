import { GoogleGenAI, Type } from "@google/genai";
import { Product } from '../types';

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API_KEY not found");
  return new GoogleGenAI({ apiKey });
};

export const recommendProducts = async (query: string): Promise<Product[]> => {
  try {
    const ai = getClient();
    
    const prompt = `
      You are "ProRec", an advanced product recommendation engine for the Indian market.
      The user is looking for: "${query}".
      
      Act as a specialized shopping assistant. Aggregate opinions from Reddit (r/IndianGaming, r/IndiaShopping, r/GadgetsIndia).
      
      Return a list of 5-8 highly recommended products available in India.
      
      For each product, generate:
      1. Accurate INR Price (approximate).
      2. Sentiment Score (0-100) based on positivity.
      3. Brand Trust Score (0-100) based on brand reputation.
      4. Price Performance Tier (Budget, Value, Premium, Overpriced).
      5. "Top Praises" (List of 3 distinct positive phrases from reviews).
      6. "Top Complaints" (List of 3 distinct negative phrases/issues).
      
      Strictly return JSON.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              name: { type: Type.STRING },
              category: { type: Type.STRING },
              price: { type: Type.NUMBER },
              sentimentScore: { type: Type.NUMBER },
              reliabilityScore: { type: Type.NUMBER },
              brandTrustScore: { type: Type.NUMBER },
              popularity: { type: Type.NUMBER, description: "Relative popularity 0-100" },
              pricePerformance: {
                type: Type.OBJECT,
                properties: {
                  rating: { type: Type.NUMBER },
                  tier: { type: Type.STRING, enum: ['Budget', 'Value', 'Premium', 'Overpriced'] }
                }
              },
              redditSummary: {
                type: Type.OBJECT,
                properties: {
                  pros: { type: Type.ARRAY, items: { type: Type.STRING } },
                  cons: { type: Type.ARRAY, items: { type: Type.STRING } },
                  topPraises: { type: Type.ARRAY, items: { type: Type.STRING } },
                  topComplaints: { type: Type.ARRAY, items: { type: Type.STRING } },
                  verdict: { type: Type.STRING }
                }
              },
              specs: {
                type: Type.OBJECT,
                properties: {
                  brand: { type: Type.STRING },
                  model: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });

    const rawData = JSON.parse(response.text || "[]");
    
    // Enrich with mocked image URLs and Source links
    return rawData.map((item: any, index: number) => ({
      ...item,
      id: item.id || `prod-${index}`,
      image: `https://picsum.photos/400/400?random=${index + Math.random()}`,
      sources: [
        { name: 'Amazon.in', url: 'https://www.amazon.in', price: item.price },
        { name: 'Flipkart', url: 'https://www.flipkart.com', price: Math.floor(item.price * 0.98) },
        { name: 'Croma', url: 'https://www.croma.com', price: Math.floor(item.price * 1.02) }
      ],
      specs: item.specs || { Brand: "Generic", Warranty: "1 Year" },
      // Fallbacks if model misses fields
      brandTrustScore: item.brandTrustScore || 85,
      popularity: item.popularity || Math.floor(Math.random() * 40) + 60,
      redditSummary: {
        ...item.redditSummary,
        topPraises: item.redditSummary?.topPraises || item.redditSummary?.pros?.slice(0, 3) || [],
        topComplaints: item.redditSummary?.topComplaints || item.redditSummary?.cons?.slice(0, 3) || []
      }
    }));

  } catch (error) {
    console.error("Gemini Error:", error);
    return [];
  }
};