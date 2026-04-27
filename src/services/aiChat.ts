/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI } from "@google/genai";

let aiInstance: any = null;

function getAI() {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return null;
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
}

export async function askZoic(question: string, history: { role: 'user' | 'model', parts: { text: string }[] }[] = []) {
  try {
    const ai = getAI();
    if (!ai) return "I'm offline right now. Please check back later.";

    const model = ai.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: "You are the Zoic AI, an expert animal specialist powered by Google Gemini. You help users with pet care, identifying wildlife, and rescue triage. You are concise, empathetic, and use some animal-related emojis. Refer to the 'Zoic' app features if relevant (Wildlife Journal, Rescue SOS, Animal care logs). Always prioritize safety—if an animal is injured, tell them to use the Rescue SOS feature in the app."
    });

    const chat = model.startChat({
      history: history,
    });

    const result = await chat.sendMessage(question);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Zoic AI Chat error:", error);
    return "Grrr... I'm having trouble thinking right now. Maybe try again later?";
  }
}
