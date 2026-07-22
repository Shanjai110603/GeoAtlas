'use client';

import React, { useState } from 'react';
import { generateSpatialAiResponse, SpatialAiResponse } from '@geoatlas/core';
import { SpatialQueryCards } from './SpatialQueryCards';
import { Sparkles, Send, Bot, User, Compass, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text?: string;
  aiResponse?: SpatialAiResponse;
}

const SAMPLE_PROMPTS = [
  'Hospitals within 15 km of Chennai',
  'How big is Greenland vs Africa in True Size?',
  'Compare area of India and Brazil',
  'What state is Munich in?',
];

export const AiAssistantDrawer: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm0',
      sender: 'ai',
      text: 'Hello! I am your GeoAtlas AI Spatial Assistant. Ask me any natural language geographic query, proximity search, or Mercator true size comparison!',
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendPrompt = (promptText: string) => {
    if (!promptText.trim()) return;

    const userMsg: ChatMessage = {
      id: `u_${Date.now()}`,
      sender: 'user',
      text: promptText,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setLoading(true);

    setTimeout(() => {
      const aiResult = generateSpatialAiResponse(promptText);
      const aiMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        aiResponse: aiResult,
      };
      setMessages((prev) => [...prev, aiMsg]);
      setLoading(false);
    }, 400);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col gap-4 text-slate-100 shadow-2xl min-h-[600px]">
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <Sparkles className="text-cyan-400 w-5 h-5 animate-pulse" />
        <h3 className="font-bold text-base text-slate-100">AI Spatial Intelligence Assistant</h3>
      </div>

      {/* Suggested Prompts Chips */}
      <div className="flex flex-col gap-1.5">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
          <HelpCircle className="w-3.5 h-3.5 text-amber-400" /> Suggested Prompts
        </span>
        <div className="flex flex-wrap gap-1.5">
          {SAMPLE_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              onClick={() => handleSendPrompt(prompt)}
              className="px-2.5 py-1 rounded-lg text-[11px] bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 transition"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Message History */}
      <div className="flex-1 max-h-[420px] overflow-y-auto flex flex-col gap-3.5 pr-1">
        {messages.map((msg) => (
          <div key={msg.id} className="flex gap-3">
            <div
              className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div className="flex-1">
              {msg.text && (
                <div className="p-3.5 bg-slate-950 border border-slate-800/80 rounded-xl text-xs text-slate-200 leading-relaxed">
                  {msg.text}
                </div>
              )}
              {msg.aiResponse && <SpatialQueryCards response={msg.aiResponse} />}
            </div>
          </div>
        ))}
        {loading && (
          <div className="text-xs text-slate-400 italic flex items-center gap-2 pl-10">
            <Sparkles className="w-3.5 h-3.5 animate-spin text-cyan-400" /> Analyzing spatial query with PostGIS Knowledge Graph...
          </div>
        )}
      </div>

      {/* Input Field */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendPrompt(inputQuery);
        }}
        className="flex gap-2 pt-2 border-t border-slate-800"
      >
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder="Ask any geographic or spatial query (e.g. Hospitals within 10 km)..."
          className="flex-1 bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-cyan-500"
        />
        <Button type="submit" variant="primary" className="flex items-center gap-1.5">
          <Send className="w-3.5 h-3.5" /> Ask AI
        </Button>
      </form>
    </div>
  );
};
