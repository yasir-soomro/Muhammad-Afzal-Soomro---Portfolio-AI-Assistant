import { GoogleGenAI } from '@google/genai';

if (!process.env.GEMINI_API_KEY) {
  console.warn('[Gemini Setup] GEMINI_API_KEY is not defined in the environment. AI queries will return an error until configured.');
}

export const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
});
