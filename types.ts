export enum MessageRole {
    USER = 'user',
    ASSISTANT = 'assistant'
}

export interface Source {
    title: string;
    url: string;
    type: 'documentation' | 'stackoverflow' | 'github';
}

export interface CodeSnippet {
    code: string;
    language: string;
}

export interface DevsAssistentResponse {
    explanation: string;
    codeSnippet: CodeSnippet | null;
    sources: Source[];
}

export interface ChatMessage {
    role: MessageRole;
    content: DevsAssistentResponse | string | null;
}