import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  User,
  Sprout,
  HelpCircle,
  Lightbulb,
  CornerDownLeft,
  Trash2,
  ShieldCheck,
  Zap,
  ArrowRight
} from 'lucide-react';
import api from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

interface Message {
  id: string;
  sender: 'USER' | 'BOT';
  text: string;
  topic?: string;
  suggestedFollowUps?: string[];
  timestamp: string;
}

const SUGGESTED_QUESTIONS = [
  'How to identify and control rice leaf blast?',
  'Best fertilizer NPK dosage for hybrid tomato tillering stage',
  'What documents are needed for PM-Kisan and PMFBY insurance?',
  'How to correct acidic soil pH (< 6.0) using agricultural lime?',
  'What are today\'s prevailing market rates for paddy and turmeric?'
];

const SUGGESTED_QUESTIONS_TA = [
  'நெல் குலை நோயை (பிளாஸ்ட்) எவ்வாறு கட்டுப்படுத்துவது?',
  'தக்காளி சாகுபடிக்கு உகந்த உர மேலாண்மை என்ன?',
  'பிரதம மந்திரி கிசான் திட்டத்திற்கு தேவையான ஆவணங்கள் என்ன?',
  'அமில நிலத்திற்கு சுண்ணாம்பு எவ்வாறு இட வேண்டும்?',
  'இன்றைய நெல் மற்றும் மஞ்சள் சந்தை விலை என்ன?'
];

export const AgriBotPage: React.FC = () => {
  const { language, t } = useLanguage();
  const { user } = useAuth();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      sender: 'BOT',
      text:
        language === 'ta'
          ? 'வணக்கம்! நான் உங்கள் அக்ரிபோட் (AgriBot) வேளாண் செயற்கை நுண்ணறிவு உதவியாளர். பயிர் பாதுகாப்பு, மண் நலம், அரசு மானியங்கள் அல்லது சந்தை விலைகள் குறித்து என்னிடம் கேளுங்கள்.'
          : 'Welcome! I am AgriBot, your specialized Agronomy AI Assistant for AgriOne. Ask me anything about crop diseases, balanced NPK fertilization, soil pH amendments, mandi rates, or government subsidies.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || loading) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'USER',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      const res = await api.post('/chat/message', {
        message: text,
        language,
      });

      if (res.data.success) {
        const botData = res.data.data;
        const botMsg: Message = {
          id: botData.botMessage.id,
          sender: 'BOT',
          text: botData.botMessage.message,
          topic: botData.topic,
          suggestedFollowUps: botData.suggestedFollowUps,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages(prev => [...prev, botMsg]);
      }
    } catch (err) {
      const errorMsg: Message = {
        id: `err-${Date.now()}`,
        sender: 'BOT',
        text: 'Sorry, I encountered an issue connecting to the agronomy knowledge engine. Please try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'BOT',
        text:
          language === 'ta'
            ? 'உரையாடல் மீட்டமைக்கப்பட்டது. உங்கள் புதிய வேளாண் கேள்வியைக் கேளுங்கள்.'
            : 'Conversation reset. Ask any new agricultural inquiry.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 h-[calc(100vh-4.5rem)] flex flex-col">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2.5">
              <h1 className="font-extrabold text-lg sm:text-xl text-slate-900 tracking-tight leading-tight">
                {t('navAgriBot')}
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Agronomy Neural Model
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {language === 'ta'
                ? 'தமிழ் மற்றும் ஆங்கிலத்தில் 24/7 பயிர் பாதுகாப்பு, உர ஆலோசனை மற்றும் அரசு திட்ட வழிகாட்டி'
                : 'Bilingual AI Agronomy Assistant trained on Indian agronomy standards and TNAU advisories'}
            </p>
          </div>
        </div>

        <button
          onClick={handleClearChat}
          className="p-2.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 transition-colors"
          title="Reset conversation"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Suggested Quick Inquiries Ribbon */}
      <div className="py-3 overflow-x-auto flex items-center space-x-2 shrink-0 scrollbar-none border-b border-slate-100">
        <span className="text-[11px] font-bold text-slate-400 shrink-0 flex items-center space-x-1 pl-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Quick Prompts:</span>
        </span>
        {(language === 'ta' ? SUGGESTED_QUESTIONS_TA : SUGGESTED_QUESTIONS).map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(q)}
            className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white border border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-emerald-800 hover:bg-emerald-50/50 whitespace-nowrap transition-all shadow-2xs shrink-0 active:scale-95"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Messages Thread Container */}
      <div className="grow overflow-y-auto py-5 space-y-4 pr-1 scrollbar-thin">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${
              msg.sender === 'USER' ? 'flex-row-reverse' : ''
            }`}
          >
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold shadow-xs ${
                msg.sender === 'USER'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-amber-400 text-slate-900 font-extrabold'
              }`}
            >
              {msg.sender === 'USER' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`max-w-2xl rounded-2xl p-4 sm:p-5 text-xs sm:text-sm leading-relaxed ${
                msg.sender === 'USER'
                  ? 'bg-emerald-600 text-white rounded-tr-none shadow-sm'
                  : 'bg-white border border-slate-200/90 text-slate-800 rounded-tl-none space-y-3 shadow-2xs'
              }`}
            >
              {msg.topic && (
                <div className="flex items-center gap-1.5">
                  <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {msg.topic}
                  </span>
                </div>
              )}
              <p className="whitespace-pre-wrap leading-relaxed font-normal">{msg.text}</p>
              
              <div className="flex items-center justify-between pt-1 text-[10px] opacity-60">
                <span className="font-mono">{msg.timestamp}</span>
                {msg.sender === 'BOT' && (
                  <span className="font-medium text-[10px]">Verified Agronomy Reference</span>
                )}
              </div>

              {/* Follow-up suggestions */}
              {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Recommended Follow-ups:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {msg.suggestedFollowUps.map((fu, i) => (
                      <button
                        key={i}
                        onClick={() => handleSendMessage(fu)}
                        className="text-[11px] px-3 py-1 rounded-lg bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 text-slate-700 hover:text-emerald-800 font-semibold transition-colors flex items-center gap-1"
                      >
                        <ArrowRight className="w-3 h-3 text-emerald-600" />
                        <span>{fu}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-900 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none p-4 shadow-2xs flex items-center space-x-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.4s]" />
              </div>
              <span className="text-xs text-slate-500 font-medium">
                AgriBot formulating agronomy recommendation...
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input Dock */}
      <div className="pt-3 border-t border-slate-200 shrink-0">
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="relative flex items-center"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={e => setInputMessage(e.target.value)}
            placeholder={
              language === 'ta'
                ? 'பயிர், பூச்சி தாக்குதல், உரம் அல்லது அரசு திட்டம் பற்றி கேளுங்கள்...'
                : 'Ask AgriBot about crop diseases, pest remedies, NPK ratios, soil pH, or government schemes...'
            }
            className="w-full text-xs sm:text-sm pl-4 pr-12 py-3.5 rounded-2xl border border-slate-300 bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || loading}
            className="absolute right-2 p-2.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 disabled:bg-slate-300 transition-colors shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1.5 px-2">
          <span>Press Enter to send inquiry</span>
          <span>Bilingual English & தமிழ் NLP</span>
        </div>
      </div>
    </div>
  );
};
