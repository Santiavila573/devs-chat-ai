import { useState, useEffect, useRef } from 'react';

// FIX: Add minimal type definitions for the Web Speech API to satisfy TypeScript.
interface ISpeechRecognitionEvent {
  results: {
    isFinal: boolean;
    [key: number]: { transcript: string };
  }[];
  resultIndex: number;
}

interface ISpeechRecognitionErrorEvent {
  error: string;
}

interface ISpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: (event: ISpeechRecognitionEvent) => void;
  onerror: (event: ISpeechRecognitionErrorEvent) => void;
  onend: () => void;
  start: () => void;
  stop: () => void;
}

// Check if SpeechRecognition is available in the browser
// FIX: Cast window to `any` to access non-standard browser APIs without TypeScript errors.
const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
const isSpeechRecognitionSupported = !!SpeechRecognition;

export const useVoiceRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  // FIX: Use the defined interface for the recognition object reference to avoid type/value name collision.
  const recognitionRef = useRef<ISpeechRecognition | null>(null);

  useEffect(() => {
    if (!isSpeechRecognitionSupported) {
      console.warn("El reconocimiento de voz no es compatible con este navegador.");
      return;
    }

    const recognition: ISpeechRecognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'es-ES';

    recognition.onresult = (event) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      setTranscript(prev => prev + finalTranscript);
    };

    recognition.onerror = (event) => {
  console.error('Error en el reconocimiento de voz', event.error);
  setIsListening(false);

  if (event.error === 'network') {
    // Manejar el error de red aquí
    console.error('Error de red en el reconocimiento de voz');
  }
};

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setTranscript('');
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  return { isListening, transcript, startListening, stopListening, isSpeechRecognitionSupported };
};