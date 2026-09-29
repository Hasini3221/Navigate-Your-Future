import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  RotateCcw,
  Copy,
  Check,
  Minimize2,
  Maximize2,
  ChevronDown,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { StudentProfile } from '../types';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

interface ChatbotWidgetProps {
  profile: StudentProfile;
}

const WEBHOOK_URL =
  'https://hasinikolluru.app.n8n.cloud/webhook/2b75a722-c52d-4e3c-ab3d-bd631baddff0/chat';

export const ChatbotWidget: React.FC<ChatbotWidgetProps> = ({ profile }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string>(() => {
    const saved = localStorage.getItem('nyf_chat_session_id');
    if (saved) return saved;
    const generated = `session-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem('nyf_chat_session_id', generated);
    return generated;
  });

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('nyf_chat_messages');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return [
      {
        id: 'msg-welcome',
        sender: 'assistant',
        text: `Hello ${profile.name}! 👋 I am your **AI Career & Learning Advisor** for **Navigate Your Future**.\n\nI can help you audit your technical skills, optimize your resume, decide what to study next for **${profile.goal}**, or navigate your **${profile.branch}** coursework.\n\nHow can I help you today?`,
        timestamp: 'Just now',
      },
    ];
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync messages to localStorage
  useEffect(() => {
    localStorage.setItem('nyf_chat_messages', JSON.stringify(messages));
  }, [messages]);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || isLoading) return;

    setErrorMsg(null);
    setInputMessage('');

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatInput: query,
          sessionId: sessionId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const data = await response.json();
      
      // Parse n8n response format
      let botResponse = '';
      if (typeof data === 'string') {
        botResponse = data;
      } else if (data && typeof data.output === 'string') {
        botResponse = data.output;
      } else if (data && typeof data.text === 'string') {
        botResponse = data.text;
      } else if (data && typeof data.message === 'string') {
        botResponse = data.message;
      } else if (Array.isArray(data) && data.length > 0 && data[0].output) {
        botResponse = data[0].output;
      } else {
        botResponse = JSON.stringify(data);
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: botResponse || "I didn't receive a response from the career advisor. Please try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: unknown) {
      const errString = err instanceof Error ? err.message : 'Network error';
      setErrorMsg(`Failed to connect to the advisor: ${errString}. Please verify the webhook.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    const newSession = `session-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    setSessionId(newSession);
    localStorage.setItem('nyf_chat_session_id', newSession);

    const initial: ChatMessage[] = [
      {
        id: `welcome-${Date.now()}`,
        sender: 'assistant',
        text: `Chat reset. Hello ${profile.name}! I am ready to guide you on **${profile.goal}**, skill gaps, and roadmap milestones.`,
        timestamp: 'Just now',
      },
    ];
    setMessages(initial);
    localStorage.setItem('nyf_chat_messages', JSON.stringify(initial));
    setErrorMsg(null);
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const quickPrompts = [
    `What should I learn after ${profile.branch} 2nd year?`,
    `How do I prepare for ${profile.goal} placements?`,
    'Suggest a beginner project for my portfolio',
    'What are the core DSA topics for interviews?',
  ];

  // Helper to format basic markdown (bold, lists, code, headers)
  const renderFormattedText = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      // Header 3
      if (line.startsWith('### ')) {
        return (
          <h4 key={idx} className="font-bold text-slate-900 mt-2 mb-1 text-xs sm:text-sm">
            {line.replace('### ', '')}
          </h4>
        );
      }
      // Header 2
      if (line.startsWith('## ')) {
        return (
          <h3 key={idx} className="font-bold text-slate-900 mt-2 mb-1 text-sm sm:text-base border-b border-slate-200 pb-0.5">
            {line.replace('## ', '')}
          </h3>
        );
      }
      // Bullet items
      if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
        const content = line.trim().replace(/^[\*\-]\s+/, '');
        return (
          <li key={idx} className="ml-4 list-disc text-xs text-slate-700 my-0.5 leading-relaxed">
            <span dangerouslySetInnerHTML={{ __html: formatInline(content) }} />
          </li>
        );
      }
      // Numbered list
      const numMatch = line.trim().match(/^(\d+)\.\s+(.*)/);
      if (numMatch) {
        return (
          <div key={idx} className="ml-2 text-xs text-slate-700 my-0.5 flex items-start gap-1.5 leading-relaxed">
            <span className="font-semibold font-mono text-indigo-600">{numMatch[1]}.</span>
            <span dangerouslySetInnerHTML={{ __html: formatInline(numMatch[2]) }} />
          </div>
        );
      }
      // Horizontal rule
      if (line.trim() === '---') {
        return <hr key={idx} className="my-2 border-slate-200" />;
      }
      // Empty line
      if (!line.trim()) {
        return <div key={idx} className="h-1.5" />;
      }
      // Standard paragraph
      return (
        <p key={idx} className="text-xs text-slate-700 my-0.5 leading-relaxed">
          <span dangerouslySetInnerHTML={{ __html: formatInline(line) }} />
        </p>
      );
    });
  };

  const formatInline = (str: string) => {
    // Bold: **text**
    let formatted = str.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Italic: *text*
    formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
    // Inline code: `code`
    formatted = formatted.replace(
      /`([^`]+)`/g,
      '<code class="bg-slate-100 text-indigo-600 px-1 py-0.5 rounded font-mono text-[11px]">$1</code>'
    );
    return formatted;
  };

  return (
    <>
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl p-3.5 shadow-xl hover:shadow-2xl transition-all duration-200 flex items-center gap-2.5 group border border-indigo-500/30"
          aria-label="Open AI Career Chatbot"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-white" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-indigo-600 animate-pulse" />
          </div>
          <span className="text-xs font-semibold pr-1 tracking-tight hidden sm:inline">
            Chat with AI Advisor
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`fixed z-50 bg-white shadow-2xl border border-slate-200 rounded-2xl flex flex-col transition-all duration-200 overflow-hidden ${
            isExpanded
              ? 'inset-4 sm:inset-10'
              : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[calc(100vw-2rem)] sm:w-[420px] h-[580px] max-h-[85vh]'
          }`}
        >
          {/* Header */}
          <div className="bg-slate-900 text-white p-3.5 sm:p-4 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-xs">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-xs sm:text-sm text-white leading-tight">
                    AI Career & Learning Agent
                  </h3>
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                </div>
                <div className="text-[11px] text-slate-400">
                  {profile.branch.split(' ')[0]} · {profile.year}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleResetChat}
                title="Restart Conversation"
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? 'Collapse' : 'Expand'}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors hidden sm:block"
              >
                {isExpanded ? (
                  <Minimize2 className="w-4 h-4" />
                ) : (
                  <Maximize2 className="w-4 h-4" />
                )}
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Close"
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Context Banner */}
          <div className="bg-indigo-50/80 px-3.5 py-1.5 border-b border-indigo-100 flex items-center justify-between text-[11px] text-indigo-900">
            <span className="truncate">
              Target Track: <strong className="text-indigo-950">{profile.goal}</strong>
            </span>
            <span className="text-indigo-600 font-medium shrink-0 ml-2">Live AI Advisor</span>
          </div>

          {/* Message History */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs shadow-xs relative group ${
                      isUser
                        ? 'bg-indigo-600 text-white rounded-br-xs'
                        : 'bg-white text-slate-800 border border-slate-200/90 rounded-bl-xs'
                    }`}
                  >
                    {isUser ? (
                      <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                    ) : (
                      <div>
                        {renderFormattedText(msg.text)}
                        <div className="flex items-center justify-end mt-1.5 pt-1 border-t border-slate-100">
                          <button
                            type="button"
                            onClick={() => handleCopyText(msg.id, msg.text)}
                            className="text-slate-400 hover:text-slate-600 p-0.5 rounded transition-colors inline-flex items-center gap-1 text-[10px]"
                            title="Copy response"
                          >
                            {copiedId === msg.id ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-600" />
                                <span className="text-emerald-600 font-semibold">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 px-1">
                    {msg.timestamp}
                  </span>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-start gap-2">
                <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-xs px-3.5 py-2.5 text-xs shadow-xs flex items-center gap-2 text-slate-600">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                  <span>AI Advisor is reasoning...</span>
                </div>
              </div>
            )}

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold">Connection Notice</p>
                  <p className="text-[11px] mt-0.5 text-rose-700">{errorMsg}</p>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Starter Chips (shown when few messages) */}
          {messages.length <= 2 && !isLoading && (
            <div className="px-3.5 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto text-[11px]">
              <span className="text-slate-400 shrink-0 font-medium">Try asking:</span>
              {quickPrompts.slice(0, 2).map((prompt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendMessage(prompt)}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 rounded-lg whitespace-nowrap transition-colors border border-slate-200/80 text-[11px]"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask anything about skills, resume, or roadmaps..."
              className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !inputMessage.trim()}
              className="p-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white rounded-xl transition-colors shadow-xs shrink-0"
              title="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
