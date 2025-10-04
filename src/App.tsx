
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Sidebar } from '../components/Sidebar';
import { ChatInput } from '../components/ChatInput';
import { ChatMessage } from '../components/ChatMessage';
import { DevsAssistentResponse, ChatMessage as ChatMessageType, MessageRole } from '@/types';
import { getOpenAICompletion } from '../services/openaiService';
import { WelcomeScreen } from '../components/WelcomeScreen';

const App: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      setTheme('dark');
    } else {
      document.documentElement.classList.remove('dark');
      setTheme('light');
    }
    const storedHistory = localStorage.getItem('devassist_history');
    if (storedHistory) {
      setHistory(JSON.parse(storedHistory));
    }
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const addToHistory = (query: string) => {
    setHistory(prevHistory => {
      const newHistory = [...new Set([query, ...prevHistory])].slice(0, 50);
      localStorage.setItem('devassist_history', JSON.stringify(newHistory));
      return newHistory;
    });
  };

  const handleSend = useCallback(async (query: string) => {
    if (!query.trim() || isLoading) return;

    const userMessage: ChatMessageType = {
      role: MessageRole.USER,
      content: query,
    };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      addToHistory(query);
      const assistantResponse: DevsAssistentResponse = await getOpenAICompletion(query);
      
      const assistantMessage: ChatMessageType = {
        role: MessageRole.ASSISTANT,
        content: assistantResponse,
      };
      setMessages(prev => [...prev, assistantMessage]);

    } catch (error) {
      console.error("Error fetching response:", error);
      const errorMessage: ChatMessageType = {
        role: MessageRole.ASSISTANT,
        content: {
          explanation: "Sorry, I encountered an error. Please check the console for details or try again later.",
          codeSnippet: { code: `// Error: ${error instanceof Error ? error.message : String(error)}`, language: 'text' },
          sources: [],
        },
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  return (
    <div className="flex h-screen font-sans bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Sidebar
        history={history}
        onHistorySelect={handleSend}
        theme={theme}
        toggleTheme={toggleTheme}
        clearHistory={() => {
          setHistory([]);
          localStorage.removeItem('devassist_history');
        }}
      />
      <main className="flex flex-col flex-1 h-screen">
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {messages.length === 0 ? (
             <WelcomeScreen onExampleClick={handleSend} />
          ) : (
            messages.map((msg, index) => <ChatMessage key={index} message={msg} />)
          )}
          {isLoading && <ChatMessage message={{ role: MessageRole.ASSISTANT, content: null }} isLoading={true} />}
          <div ref={chatEndRef} />
        </div>
        <div className="p-4 md:p-6 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <ChatInput onSend={handleSend} isLoading={isLoading} />
        </div>
      </main>
    </div>
  );
};

export default App;
