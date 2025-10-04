import type { DevsAssistentResponse } from '../types';

// Lazily check for API key to prevent crash on load
function getApiKey(): string {
    const API_KEY = process.env.OPENAI_API_KEY;

    if (!API_KEY) {
        throw new Error("La variable de entorno OPENAI_API_KEY no está configurada. Por favor, asegúrate de que tu API_KEY de OpenAI esté configurada correctamente en tu entorno.");
    }
    return API_KEY;
}

export const getOpenAICompletion = async (query: string): Promise<DevsAssistentResponse> => {
  const apiKey = getApiKey(); // This will throw if API_KEY is missing

  const systemInstruction = `Eres "Devs-Assistent", un asistente de programación experto en IA.
    Tu tarea es proporcionar respuestas completas, precisas y enfocadas en desarrolladores, basadas en un sistema RAG simulado.
    Para la consulta dada, genera una respuesta que incluya:
    1.  Una explicación clara y detallada del concepto técnico, escrita en Markdown.
    2.  Si corresponde, un fragmento de código listo para usar con el identificador de lenguaje correcto. Si no hay código relevante, establece la propiedad codeSnippet como nula.
    3.  Una lista de 2-3 fuentes simuladas y plausibles de documentación oficial, Stack Overflow o repositorios de GitHub. Las URLs deben parecer auténticas pero no tienen que ser reales.

    La respuesta completa debe ser un único objeto JSON válido. No agregues ningún texto, explicación o markdown fuera del objeto JSON. El JSON debe tener la siguiente estructura:
    {
      "explanation": "string (markdown)",
      "codeSnippet": { "code": "string", "language": "string" } | null,
      "sources": [{ "title": "string", "url": "string", "type": "'documentation' | 'stackoverflow' | 'github'" }]
    }`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: "gpt-4-turbo",
            messages: [
                { role: "system", content: systemInstruction },
                { role: "user", content: query }
            ],
            response_format: { type: "json_object" },
            temperature: 0.2,
        })
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error("OpenAI API Error:", errorData);
        throw new Error(`Error de la API de OpenAI: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    const jsonText = data.choices[0].message.content;
    const parsedResponse = JSON.parse(jsonText);
    
    // Ensure the response structure matches DevsAssistentResponse
    return {
        explanation: parsedResponse.explanation || "No se proporcionó explicación.",
        codeSnippet: parsedResponse.codeSnippet || null,
        sources: parsedResponse.sources || []
    };

  } catch (error) {
    console.error("Error in getOpenAICompletion:", error);
    // Re-throw the error so it can be caught by the handleSend function in App.tsx
    // which will then display it in the chat UI.
    throw error;
  }
};