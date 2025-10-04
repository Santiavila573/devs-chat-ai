import React from 'react';
import type { ChatMessage as ChatMessageType, DevsAssistentResponse, Source } from '../types';
import { MessageRole } from '../types';
import { CodeBlock } from './CodeBlock';
import { FileTextIcon, GithubIcon, HelpCircleIcon, ThumbsDownIcon, ThumbsUpIcon, DownloadIcon, UserIcon, BotIcon } from './IconComponents';

// A simple markdown parser
const parseMarkdown = (text: string) => {
    // Convert headers, bold, italics, and lists
    const html = text
        .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
        .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mt-6 mb-3">$1</h2>')
        .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-8 mb-4">$1</h1>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`([^`]+)`/g, '<code class="bg-gray-200 dark:bg-gray-700 rounded-md px-1.5 py-0.5 font-mono text-sm">$1</code>')
        .replace(/^\s*\n\*/gm, '<ul>\n*')
        .replace(/^(\*.+)\s*\n([^*])/gm, '$1\n</ul>\n\n$2')
        .replace(/^\* (.*)/gm, '<li>$1</li>');

    return <div dangerouslySetInnerHTML={{ __html: html.replace(/\n/g, '<br />') }} />;
};


const SourcePill: React.FC<{ source: Source }> = ({ source }) => {
    const Icon = source.type === 'github' ? GithubIcon : source.type === 'stackoverflow' ? HelpCircleIcon : FileTextIcon;
    return (
        <a href={source.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-3 py-1 rounded-full transition-colors">
            <Icon className="w-4 h-4" />
            <span>{source.title}</span>
        </a>
    )
}

const LoadingSpinner: React.FC = () => (
    <div className="flex items-center space-x-2">
        <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce"></div>
        <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{animationDelay: '0.2s'}}></div>
        <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{animationDelay: '0.4s'}}></div>
    </div>
);


export const ChatMessage: React.FC<{ message: ChatMessageType; isLoading?: boolean }> = ({ message, isLoading }) => {
  const isUser = message.role === MessageRole.USER;
  const content = message.content as DevsAssistentResponse | string;

  const handleExport = () => {
    if (typeof content !== 'string') {
        const markdown = `
# Respuesta de Devs-Assistent

## Explicación
${content.explanation}

${content.codeSnippet ? `
## Fragmento de Código
\`\`\`${content.codeSnippet.language}
${content.codeSnippet.code}
\`\`\`
` : ''}

## Fuentes
${content.sources.map(s => `- [${s.title}](${s.url})`).join('\n')}
        `;
        const blob = new Blob([markdown.trim()], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'respuesta-devs-assistent.md';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
  };

  if (isUser) {
    return (
      <div className="flex items-start gap-4 justify-end">
        <div className="bg-indigo-600 text-white p-4 rounded-xl max-w-2xl">
          <p>{content as string}</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
            <UserIcon/>
        </div>
      </div>
    );
  }

  // Assistant Message
  return (
    <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
            <BotIcon/>
        </div>
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-xl max-w-4xl w-full">
        {isLoading || !content ? (
            <LoadingSpinner/>
        ) : (
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <div className="leading-relaxed">{parseMarkdown((content as DevsAssistentResponse).explanation)}</div>

            {(content as DevsAssistentResponse).codeSnippet && (
              <div className="my-4">
                <CodeBlock
                  code={(content as DevsAssistentResponse).codeSnippet.code}
                  language={(content as DevsAssistentResponse).codeSnippet.language}
                />
              </div>
            )}
            
            {(content as DevsAssistentResponse).sources.length > 0 && (
              <div className="mt-6">
                <h4 className="font-semibold text-sm mb-2 text-gray-600 dark:text-gray-400">Fuentes</h4>
                <div className="flex flex-wrap gap-2">
                    {(content as DevsAssistentResponse).sources.map((source, i) => <SourcePill key={i} source={source} />)}
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button className="p-1.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"><ThumbsUpIcon/></button>
                <button className="p-1.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"><ThumbsDownIcon/></button>
                <button onClick={handleExport} className="p-1.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"><DownloadIcon/></button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};