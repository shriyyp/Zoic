/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI } from "@google/genai";

let aiInstance: any = null;

function getAI() {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is not set. AI features will be unavailable.");
      // Return a mock that doesn't throw on creation but fails gracefully on use
      return {
        models: {
          generateContent: async () => { throw new Error("API Key missing"); }
        }
      };
    }
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
}

export async function identifySpecies(base64Image: string): Promise<{ species: string; info: string }> {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          parts: [
            { text: "Identify the animal in this image. Provide its common name and a brief 1-sentence fact." },
            { inlineData: { mimeType: "image/jpeg", data: base64Image.split(',')[1] || base64Image } }
          ]
        }
      ]
    });

    const text = response.text || "Unknown species";
    const [species, ...rest] = text.split('\n');
    return {
      species: species.replace(/[^a-zA-Z ]/g, '').trim(),
      info: rest.join(' ').trim() || "Wild animal observer."
    };
  } catch (error) {
    console.error("AI species ID failed:", error);
    return { species: "Unknown", info: "Check your internet connection." };
  }
}

export async function getRescueAdvice(condition: string): Promise<string> {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `I found an animal that is ${condition}. Give me a short, step-by-step triage guide (max 3 steps) and a warning if applicable. Be calm and helpful.`
    });
    return response.text || "Keep the animal warm and quiet. Contact a local wildlife rehabilitator immediately.";
  } catch (error) {
    return "Keep the animal warm and quiet. Contact a local professional.";
  }
}

export async function analyzeEmergency(base64Image: string): Promise<{ label: string; confidence: number; advice: string }> {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          parts: [
            { text: "Identify the animal species and likely injury. Format your response exactly like this:\nSpecies: [Name]\nConfidence: [0-1]\nAdvice: [Brief urgent instruction]" },
            { inlineData: { mimeType: "image/jpeg", data: base64Image.split(',')[1] || base64Image } }
          ]
        }
      ]
    });

    const text = response.text || "";
    const label = text.match(/Species: (.*)/)?.[1] || "Unknown";
    const confidence = parseFloat(text.match(/Confidence: (.*)/)?.[1] || "0.5");
    const advice = text.match(/Advice: (.*)/)?.[1] || "Keep animal stable.";

    return { label, confidence, advice };
  } catch (error) {
    return { label: "Animal", confidence: 0.5, advice: "Contact local rescue." };
  }
}
