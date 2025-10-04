import React, { useState, useEffect } from 'react';
import { useVoiceRecognition } from '../hooks/useVoiceRecognition';
import { SendIcon, MicIcon, StopCircleIcon } from './IconComponents';

interface ChatInputProps {
  onSend: (text: string) => void;
  isLoading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, isLoading }) => {
  const [text, setText] = useState('');
  const { isListening, transcript, startListening, stopListening, isSpeechRecognitionSupported } = useVoiceRecognition();

  useEffect(() => {
    if (transcript) {
      setText(transcript);
    }
  }, [transcript]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && !isLoading) {
      onSend(text);
      setText('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit(e);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      setText('');
      startListening();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 md:gap-4 bg-gray-100/50 dark:bg-gray-800/50 p-2 rounded-xl border border-gray-200/80 dark:border-gray-700/80">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Pregunta algo... ej: '¿Cómo configurar CORS en FastAPI?'"
        className="flex-1 bg-transparent focus:outline-none resize-none p-2 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
        rows={1}
        disabled={isLoading}
      />
      {isSpeechRecognitionSupported && (
        <button
          type="button"
          onClick={toggleListening}
          className={`p-2 rounded-full transition-colors ${isListening ? 'text-red-500 bg-red-100 dark:bg-red-900/50' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
          disabled={isLoading}
        >
          {isListening ? <StopCircleIcon /> : <MicIcon />}
        </button>
      )}
      <button
        type="submit"
        className="bg-indigo-600 text-white p-2 rounded-lg disabled:bg-indigo-400 dark:disabled:bg-indigo-800 disabled:cursor-not-allowed hover:bg-indigo-700 transition-colors"
        disabled={isLoading || !text.trim()}
      >
        <SendIcon />
      </button>
    </form>
  );
};