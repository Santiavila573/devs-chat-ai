import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { CheckIcon, CopyIcon } from './IconComponents';

interface CodeBlockProps {
  code: string;
  language: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, language }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  return (
    <div className="relative group text-sm">
      <div className="absolute top-2 right-2">
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 bg-gray-700/50 text-gray-300 hover:bg-gray-600/70 hover:text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
        >
          {isCopied ? <CheckIcon /> : <CopyIcon />}
          <span>{isCopied ? '¡Copiado!' : 'Copiar'}</span>
        </button>
      </div>
      <SyntaxHighlighter language={language} style={vscDarkPlus} customStyle={{ margin: 0, borderRadius: '0.5rem', padding: '1rem' }}>
        {code}
      </SyntaxHighlighter>
    </div>
  );
};