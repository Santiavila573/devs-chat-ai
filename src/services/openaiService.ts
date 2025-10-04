import OpenAI from 'openai';
import type { DevsAssistentResponse } from '../../types';

const API_KEY = process.env.OPENAI_API_KEY;

if (!API_KEY) {
  throw new Error("OPENAI_API_KEY environment variable not set");
}

const client = new OpenAI({ apiKey: API_KEY });

const responseSchema = {
  type: "object",
  properties: {
    explanation: {
      type: "string",
      description: "Una explicación técnica y detallada del concepto o solución. Debe estar formateada en Markdown.",
    },
    codeSnippet: {
      type: "object",
      description: "Un fragmento de código listo para usar con identificador de lenguaje. Nulo si no hay código relevante.",
      properties: {
        code: { type: "string", description: "El código fuente." },
        language: { type: "string", description: "El lenguaje de programación (ej: 'python', 'javascript')." },
      },
    },
    sources: {
      type: "array",
      description: "Un array de objetos de fuente utilizados para generar la respuesta.",
      items: {
        type: "object",
        properties: {
          title: { type: "string", description: "El título de la fuente (ej: 'FastAPI Docs: CORS', 'Stack Overflow #12345')." },
          url: { type: "string", description: "La URL de la fuente." },
          type: { type: "string", description: "El tipo de fuente: 'documentation', 'stackoverflow', o 'github'." },
        },
      },
    },
  },
  required: ["explanation", "sources"],
};

export const getOpenAICompletion = async (query: string): Promise<DevsAssistentResponse> => {
  console.log("getOpenAICompletion called from src/services");
  const systemInstruction = `Eres "Devs-Assistent", un asistente de programación experto en IA.
    Tu tarea es proporcionar respuestas completas, precisas y enfocadas en desarrolladores, basadas en un sistema RAG simulado.
    Para la consulta dada, genera una respuesta que incluya:
    1.  Una explicación clara y detallada del concepto técnico, escrita en Markdown.
    2.  Si corresponde, un fragmento de código listo para usar con el identificador de lenguaje correcto. Si no hay código relevante, establece la propiedad codeSnippet como nula.
    3.  Una lista de 2-3 fuentes simuladas y plausibles de documentación oficial, Stack Overflow o repositorios de GitHub. Las URLs deben parecer auténticas pero no tienen que ser reales.

    La respuesta completa debe ser un único objeto JSON válido que se ajuste al esquema proporcionado. No agregues ningún texto fuera del objeto JSON.`;

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemInstruction },
        { role: "user", content: query }
      ],
      response_format: { type: "json_schema", json_schema: { name: "devs_response", schema: responseSchema } },
      temperature: 0.2,
    });

    const jsonText = response.choices[0].message.content;
    if (!jsonText) throw new Error("No content");
    const parsedResponse = JSON.parse(jsonText);
    
    // Ensure the response structure matches DevsAssistentResponse
    return {
        explanation: parsedResponse.explanation || "No explanation provided.",
        codeSnippet: parsedResponse.codeSnippet || null,
        sources: parsedResponse.sources || []
    };

  } catch (error) {
    console.error("Error in getOpenAICompletion:", error);
    throw new Error("No se pudo obtener una respuesta válida del modelo de IA.");
  }
};