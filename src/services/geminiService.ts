import { GoogleGenAI, Type } from "@google/genai";
import type { DevsAssistentResponse } from '../../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        explanation: {
            type: Type.STRING,
            description: "Una explicación técnica y detallada del concepto o solución. Debe estar formateada en Markdown.",
        },
        codeSnippet: {
            type: Type.OBJECT,
            // FIX: Removed non-standard 'nullable' property. The description and optional nature in 'required' array handles this.
            description: "Un fragmento de código listo para usar con identificador de lenguaje. Nulo si no hay código relevante.",
            properties: {
                code: { type: Type.STRING, description: "El código fuente." },
                language: { type: Type.STRING, description: "El lenguaje de programación (ej: 'python', 'javascript')." },
            },
        },
        sources: {
            type: Type.ARRAY,
            description: "Un array de objetos de fuente utilizados para generar la respuesta.",
            items: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING, description: "El título de la fuente (ej: 'FastAPI Docs: CORS', 'Stack Overflow #12345')." },
                    url: { type: Type.STRING, description: "La URL de la fuente." },
                    type: { type: Type.STRING, description: "El tipo de fuente: 'documentation', 'stackoverflow', o 'github'." },
                },
            },
        },
    },
    required: ["explanation", "sources"],
};

export const getGeminiCompletion = async (query: string): Promise<DevsAssistentResponse> => {
  const systemInstruction = `Eres "Devs-Assistent", un asistente de programación experto en IA.
    Tu tarea es proporcionar respuestas completas, precisas y enfocadas en desarrolladores, basadas en un sistema RAG simulado.
    Para la consulta dada, genera una respuesta que incluya:
    1.  Una explicación clara y detallada del concepto técnico, escrita en Markdown.
    2.  Si corresponde, un fragmento de código listo para usar con el identificador de lenguaje correcto. Si no hay código relevante, establece la propiedad codeSnippet como nula.
    3.  Una lista de 2-3 fuentes simuladas y plausibles de documentación oficial, Stack Overflow o repositorios de GitHub. Las URLs deben parecer auténticas pero no tienen que ser reales.

    La respuesta completa debe ser un único objeto JSON válido que se ajuste al esquema proporcionado. No agregues ningún texto fuera del objeto JSON.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      // FIX: Simplified 'contents' for a single text query as per SDK guidelines.
      contents: query,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema,
        temperature: 0.2,
      },
    });

    const jsonText = response.text.trim();
    const parsedResponse = JSON.parse(jsonText);
    
    // Ensure the response structure matches DevsAssistentResponse
    return {
        explanation: parsedResponse.explanation || "No explanation provided.",
        codeSnippet: parsedResponse.codeSnippet || null,
        sources: parsedResponse.sources || []
    };

  } catch (error) {
    console.error("Error in getGeminiCompletion:", error);
    throw new Error("No se pudo obtener una respuesta válida del modelo de IA.");
  }
};
