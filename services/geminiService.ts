/*
  University Dormitory Management System (UDMS)
  Purpose: AI-assisted dormitory management logic and TTS services.
*/

import { GoogleGenAI, Type, Modality } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const defaultCompatibility = { 
  score: 65, 
  summary: "Profiles show standard alignment. Safe pairing recommended.", 
  pros: ["Shared academic focus"], 
  cons: ["Minor schedule variance"] 
};

/**
 * Announce system status via TTS
 */
export const announceAuthorship = async () => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: "UDMS Pro Logistics Core is online. All protocols are synchronized." }] }],
      config: {
        responseModalalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const audioData = atob(base64Audio);
      const arrayBuffer = new ArrayBuffer(audioData.length);
      const view = new Uint8Array(arrayBuffer);
      for (let i = 0; i < audioData.length; i++) {
        view[i] = audioData.charCodeAt(i);
      }
      
      const dataInt16 = new Int16Array(arrayBuffer);
      const buffer = audioContext.createBuffer(1, dataInt16.length, 24000);
      const channelData = buffer.getChannelData(0);
      for (let i = 0; i < dataInt16.length; i++) {
        channelData[i] = dataInt16[i] / 32768.0;
      }

      const source = audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContext.destination);
      source.start();
    }
  } catch (error) {
    console.error("TTS Error:", error);
  }
};

export const getDormAssistantResponse = async (history: { role: string; text: string }[]) => {
  const model = 'gemini-3-flash-preview';
  const contents = history.map(h => ({
    role: h.role === 'user' ? 'user' : 'model',
    parts: [{ text: h.text }]
  }));

  try {
    const response = await ai.models.generateContent({
      model,
      contents,
      config: {
        systemInstruction: `You are the UDMS Pro Ultimate Housing Concierge, a state-of-the-art interface for dormitory management.
        
        MANDATORY POLICIES:
        - Quiet Hours: 10 PM - 7 AM.
        - Guest Registration: 24h notice required.
        - Emergency Protocol: If 'LOCKDOWN' is active, advise students to stay in rooms and lock doors.
        
        TONE: Authoritative yet encouraging.
        GAMIFICATION: Remind students they earn XP for following rules and reporting issues.`,
        temperature: 0.6,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "The Housing Core is currently undergoing a scheduled sync. Please try again in 60 seconds.";
  }
};

export const analyzeMaintenanceImage = async (base64Image: string, mimeType: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { data: base64Image, mimeType } },
          { text: "Analyze this image of a maintenance issue. Identify the problem, estimate the severity (1-10), and suggest a priority level (Low, Medium, High). Format as JSON." }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            problem: { type: Type.STRING },
            severity: { type: Type.NUMBER },
            priority: { type: Type.STRING },
            estimatedCost: { type: Type.STRING }
          },
          required: ["problem", "severity", "priority"]
        }
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Multimodal Analysis Error:", error);
    return null;
  }
};

export const getCompatibilityScore = async (user1: any, user2: any) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Perform deep-layer compatibility analysis for the UDMS platform:
      Resident A: ${JSON.stringify(user1.preferences)}
      Resident B: ${JSON.stringify(user2.preferences)}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            summary: { type: Type.STRING },
            pros: { type: Type.ARRAY, items: { type: Type.STRING } },
            cons: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["score", "summary", "pros", "cons"]
        }
      }
    });
    return JSON.parse(response.text || JSON.stringify(defaultCompatibility));
  } catch (error) {
    return defaultCompatibility;
  }
};

export const analyzeSentiment = async (text: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze sentiment of feedback: "${text}". Response: POSITIVE, NEUTRAL, or NEGATIVE.`,
    });
    return response.text?.trim().toUpperCase();
  } catch {
    return "NEUTRAL";
  }
};