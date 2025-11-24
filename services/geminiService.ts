import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedContent, ImageRatio, ImageStyle } from "../types";

// Initialize the client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateRedBookText = async (
  topicContext: string,
  userNotes: string = ""
): Promise<GeneratedContent> => {
  const model = "gemini-2.5-flash";
  
  const systemInstruction = `
    You are an expert social media manager for 'Resume Growth Partner', a service helping college students optimize resumes.
    Create a viral Xiaohongshu (Little Red Book) post.
    
    Tone:
    - Friendly, encouraging, 'Senpai' (mentor) vibe.
    - Use many emojis (✨, 📝, 💼, 🚀, 💡).
    - Address pain points of job hunting students.
    
    Structure:
    1. A catchy 'Hook' title (max 20 chars).
    2. Engaging body text with bullet points.
    3. A subtle but clear Call to Action (CTA) for our Resume Modification service.
    4. 5-8 relevant hashtags.
    
    Output JSON format only.
  `;

  const prompt = `
    Topic: ${topicContext}
    Additional User Context: ${userNotes}
    
    Generate the content now.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            body: { type: Type.STRING },
            hashtags: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["title", "body", "hashtags"],
        },
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as GeneratedContent;
    }
    throw new Error("No text returned from API");
  } catch (error) {
    console.error("Text Generation Error:", error);
    throw error;
  }
};

export const generateRedBookCover = async (
  title: string,
  style: ImageStyle,
  ratio: ImageRatio
): Promise<string> => {
  const model = "gemini-2.5-flash-image";

  // Note: Text rendering on images is hit-or-miss. We focus on the visual background.
  const prompt = `
    Create a high-quality cover image for a social media post about career advice.
    
    Visual Style: ${style}
    
    Subject Matter:
    - Abstract representation of career growth, resumes, or success.
    - Clean composition, leaving negative space in the center or top for text overlay.
    - Appealing to Gen Z / University Students.
    - Bright, professional but not boring.
    - Do NOT include text.
    
    Context Title (for mood): "${title}"
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: {
          aspectRatio: ratio,
          // imageSize: "1K" // Only for Pro models
        }
      }
    });

    // Iterate to find the image part
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData && part.inlineData.data) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image generated");
  } catch (error) {
    console.error("Image Generation Error:", error);
    throw error;
  }
};