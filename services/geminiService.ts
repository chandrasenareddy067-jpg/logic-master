import { GoogleGenAI, Type } from "@google/genai";
import { SYSTEM_INSTRUCTION_APTITUDE, SYSTEM_INSTRUCTION_IQ } from '../constants';
import { Question, Riddle } from '../types';

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateAptitudeQuestions = async (topic: string, count: number = 3): Promise<Question[]> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate ${count} aptitude questions focusing on ${topic}. Make them challenging but solvable.`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_APTITUDE,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              text: { type: Type.STRING },
              options: { 
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              correctAnswerIndex: { type: Type.INTEGER },
              explanation: { type: Type.STRING }
            },
            required: ['id', 'text', 'options', 'correctAnswerIndex', 'explanation']
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as Question[];
    }
    return [];
  } catch (error) {
    console.error("Failed to generate questions:", error);
    return [];
  }
};

export const generateIQQuestions = async (count: number = 5): Promise<Question[]> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate ${count} IQ test questions involving number series, analogies, and logical deduction.`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_IQ,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              text: { type: Type.STRING },
              options: { 
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              correctAnswerIndex: { type: Type.INTEGER },
              explanation: { type: Type.STRING }
            },
            required: ['id', 'text', 'options', 'correctAnswerIndex', 'explanation']
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as Question[];
    }
    return [];
  } catch (error) {
    console.error("Failed to generate IQ questions:", error);
    return [];
  }
};

export const generateRiddle = async (): Promise<Riddle | null> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate one challenging logic puzzle or brain teaser suitable for a software engineering interview.
      Exclude simple math word problems. Focus on lateral thinking or logical deduction.
      `,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                question: { type: Type.STRING },
                answer: { type: Type.STRING },
                hint: { type: Type.STRING }
            },
            required: ['question', 'answer', 'hint']
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as Riddle;
    }
    return null;
  } catch (error) {
    console.error("Failed to generate riddle:", error);
    return null;
  }
};

export const analyzePrompt = async (userPrompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Analyze the following user prompt for effective AI communication. 
      User Prompt: "${userPrompt}"
      
      Provide a critique in markdown:
      1. Strengths
      2. Weaknesses
      3. An improved version of the prompt.
      Keep it concise.`,
    });
    return response.text || "Could not analyze prompt.";
  } catch (error) {
    console.error("Failed to analyze prompt:", error);
    return "Error analyzing prompt. Please check your API key.";
  }
};

export const runPromptSimulation = async (userPrompt: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: userPrompt,
        });
        return response.text || "No response generated.";
    } catch (error) {
        return "Error running prompt simulation.";
    }
}