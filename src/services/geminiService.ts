import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function* generateStepOutputStreaming(prompt: string, input: string, previousOutput: string = "") {
  try {
    const fullPrompt = prompt
      .replace("{input}", input)
      .replace("{previousOutput}", previousOutput);

    const result = await ai.models.generateContentStream({
      model: "gemini-3-flash-preview",
      contents: fullPrompt,
      config: {
        systemInstruction: "You are the '10x Vibe Coder AI', a high-performance software architect. Your goal is to provide concise, punchy, and highly actionable advice. Use markdown. Focus on the 'vibe' and technical excellence. Always end with a short 'Actionable Next Step' summary.",
        temperature: 0.7,
      },
    });

    for await (const chunk of result) {
      if (chunk.text) {
        yield chunk.text;
      }
    }
  } catch (error) {
    console.error("AI Streaming Error:", error);
    yield "Error generating output. Please check your connection or API key.";
  }
}

export async function performVibeCheck(input: string, stepLabel: string) {
  try {
    const prompt = `Phase: ${stepLabel}\nInput: ${input}`;
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: `Analyze the user's input for a software architecture phase. 
        Determine if it's "High Frequency" (focused, ambitious, technically sharp) or "Low Frequency/Noise" (generic, vague, lazy).
        
        Return a JSON object:
        {
          "rating": number (1-10),
          "critique": "A brief, 10x-style punchy critique",
          "isVibeApproved": boolean
        }`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            rating: { type: Type.NUMBER },
            critique: { type: Type.STRING },
            isVibeApproved: { type: Type.BOOLEAN }
          },
          required: ["rating", "critique", "isVibeApproved"]
        }
      },
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Vibe Check Error:", error);
    return { rating: 5, critique: "Neural connection unstable. Vibration check inconclusive.", isVibeApproved: true };
  }
}

export async function generateStepOutput(prompt: string, input: string, previousOutput: string = "") {
  try {
    const fullPrompt = prompt
      .replace("{input}", input)
      .replace("{previousOutput}", previousOutput);

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: fullPrompt,
      config: {
        systemInstruction: "You are the '10x Vibe Coder AI', a high-performance software architect. Your goal is to provide concise, punchy, and highly actionable advice. Use markdown. Focus on the 'vibe' and technical excellence. Always end with a short 'Actionable Next Step' summary.",
        temperature: 0.7,
      },
    });

    return response.text || "No output generated.";
  } catch (error) {
    console.error("AI Generation Error:", error);
    return "Error generating output. Please check your connection or API key.";
  }
}

export async function generateFinalManifest(projectData: any) {
  try {
    const context = Object.values(projectData.steps).map((s: any, i) => `Step ${i+1}: ${s.aiOutput}`).join("\n\n");
    const prompt = `Context: All phases of the Vibe Coder workflow have been completed for project "${projectData.name}". 
    Data: ${context}
    
    Task: Synthesize this data into a final "10x Software Manifest". 
    Include:
    1. Executive Summary
    2. Final Architecture Tech Stack
    3. Critical Success Factors
    4. Implementation Checklist
    5. The "Vibe" definition for the final product.
    
    Make it look professional, clean, and highly actionable.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: "You are a Senior Technical Product Manager. Synthesize project data into a final PRD.",
        temperature: 0.5,
      },
    });

    return response.text;
  } catch (error) {
    return "Error generating manifest.";
  }
}

export async function generateInsights(aiOutput: string) {
  try {
    const prompt = `Analyze the following software architecture/planning output and identify exactly 3-4 key action items or critical potential issues. 
    Output them as a simple bulleted list of short, punchy sentences (max 10 words each). 
    No preamble or closing.

    Input: ${aiOutput}`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: "You are a critical software architect auditor. Be brief and blunt.",
        temperature: 0.3,
      },
    });

    const lines = response.text.split('\n')
      .map(line => line.replace(/^[-*]\s*/, '').trim())
      .filter(line => line.length > 0);
    
    return lines.slice(0, 4);
  } catch (error) {
    console.error("Insight Generation Error:", error);
    return [];
  }
}

export async function generateSummaryForNextStep(currentOutput: string, nextStepLabel: string) {
  try {
    const prompt = `Based on the following architecture output, provide a concise 1-2 sentence transition/summary that sets the stage for the next phase: "${nextStepLabel}". 
    Focus on the most important technical bridge between the two phases.
    
    Output: ${currentOutput}`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: "You are a lead architect. Provide a high-velocity, professional transition summary. Max 30 words.",
        temperature: 0.5,
      },
    });

    return response.text.trim();
  } catch (error) {
    console.error("Summary Generation Error:", error);
    return "Consolidating previous phase insights.";
  }
}
