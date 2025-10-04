import React from 'react';
import { BotIcon } from './IconComponents';

interface WelcomeScreenProps {
  onExampleClick: (query: string) => void;
}

const exampleQueries = [
  "¿Cómo configurar CORS en FastAPI?",
  "Explica el patrón Repository en Django con un ejemplo.",
  "¿Cómo conectar React a una API de FastAPI usando axios?",
  "¿Cuál es la diferencia entre @staticmethod y @classmethod en Python?",
];

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onExampleClick }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <div className="bg-indigo-600 p-4 rounded-2xl mb-4">
        <BotIcon className="w-12 h-12 text-white" />
      </div>
      <h1 className="text-4xl font-bold text-gray-800 dark:text-white">Bienvenido a Devs-Assistent</h1>
      <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Tu asistente de documentación técnica impulsado por IA.</p>
      
      <div className="mt-12 w-full max-w-3xl">
        <p className="text-gray-500 dark:text-gray-400 mb-4">Prueba uno de estos ejemplos:</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {exampleQueries.map((query, i) => (
            <button
              key={i}
              onClick={() => onExampleClick(query)}
              className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-left hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              {query}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};