import React from 'react';
import { HistoryIcon, MoonIcon, SunIcon, TrashIcon, BotIcon } from './IconComponents';

interface SidebarProps {
  history: string[];
  onHistorySelect: (query: string) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  clearHistory: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ history, onHistorySelect, theme, toggleTheme, clearHistory }) => {
  return (
    <aside className="hidden md:flex flex-col w-64 lg:w-72 bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg border-r border-gray-200/50 dark:border-gray-700/50 h-screen">
      <div className="p-4 border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg">
                <BotIcon className="text-white"/>
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Devs-Assistent</h1>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        <h2 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-2">
          <HistoryIcon />
          <span>Historial de Búsqueda</span>
        </h2>
        <ul className="space-y-1">
          {history.map((item, index) => (
            <li key={index}>
              <button
                onClick={() => onHistorySelect(item)}
                className="w-full text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200/50 dark:hover:bg-gray-700/50 p-2 rounded-md truncate"
              >
                {item}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="p-4 border-t border-gray-200/50 dark:border-gray-700/50 space-y-2">
        <button
            onClick={clearHistory}
            className="w-full flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-200/50 dark:hover:bg-gray-700/50 p-2 rounded-md"
        >
          <TrashIcon />
          <span>Limpiar Historial</span>
        </button>
        <div className="flex items-center justify-between bg-gray-200/50 dark:bg-gray-700/50 p-1 rounded-full">
          <button onClick={toggleTheme} className={`flex-1 flex justify-center p-1.5 rounded-full ${theme === 'light' ? 'bg-white' : ''}`}>
            <SunIcon />
          </button>
          <button onClick={toggleTheme} className={`flex-1 flex justify-center p-1.5 rounded-full ${theme === 'dark' ? 'bg-gray-800' : ''}`}>
            <MoonIcon />
          </button>
        </div>
      </div>
    </aside>
  );
};