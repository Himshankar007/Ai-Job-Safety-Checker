import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, Bot, Sparkles, Terminal, MessageCircle, RefreshCw } from 'lucide-react';
import { api, getApiErrorMessage } from "../lib/api";

const InterviewAI = () => {
    const [role, setRole] = useState('');
    const [chatMode, setChatMode] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const chatEndRef = useRef(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const startInterview = () => {
        if (!role) return;
        setChatMode(true);
        setError("");
        setMessages([
            { role: 'bot', text: `Hello! I'm your AI Interview Assistant. I've prepared some questions for the ${role} role. Shall we begin?` }
        ]);
    };

    const handleSend = async () => {
        if (!input) return;

        const userMsg = { role: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);
        setError("");

        try {
            const history = messages
                .filter(m => m.role === "user" || m.role === "bot")
                .slice(-6)
                .map(m => ({
                    role: m.role === "bot" ? "assistant" : "user",
                    content: m.text,
                }));

            const res = await api.post("/api/interview/chat", {
                message: input,
                role,
                history,
            });

            const botMsg = { role: "bot", text: res.data?.reply || "No reply." };
            setMessages(prev => [...prev, botMsg]);
        } catch (e) {
            console.error("Interview chat failed", e);
            setError(getApiErrorMessage(e));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto min-h-screen text-white">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
                <h1 className="text-4xl font-bold mb-4">AI Interview <span className="text-primary">Assistant</span></h1>
                <p className="text-gray-400">Master your technical interviews with our real-time AI simulator.</p>
            </motion.div>

            <AnimatePresence mode="wait">
                {!chatMode ? (
                    <motion.div
                        key="setup"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        className="glass p-10 flex flex-col items-center gap-8"
                    >
                        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                            <Terminal className="text-primary w-10 h-10" />
                        </div>
                        <div className="w-full max-w-md">
                            <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-tight">Select Job Role</label>
                            <select
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary transition-all text-white"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                            >
                                <option value="" disabled>Choose a role...</option>
                                <option value="Frontend Developer">Frontend Developer</option>
                                <option value="Backend Developer">Backend Developer</option>
                                <option value="FullStack Developer">FullStack Developer</option>
                                <option value="Data Scientist">Data Scientist</option>
                                <option value="DevOps Engineer">DevOps Engineer</option>
                            </select>
                        </div>
                        <button
                            onClick={startInterview}
                            disabled={!role}
                            className="px-10 py-4 bg-primary hover:bg-secondary disabled:opacity-50 rounded-2xl font-black text-lg transition-all shadow-xl shadow-primary/20"
                        >
                            Start Mock Interview
                        </button>
                    </motion.div>
                ) : (
                    <motion.div
                        key="chat"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass h-[600px] flex flex-col overflow-hidden border-primary/10"
                    >
                        {/* Chat Header */}
                        <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/5">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                                    <Bot className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold">{role} Interview</p>
                                    <p className="text-[10px] text-green-500 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> AI Online
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setChatMode(false)}
                                className="p-2 hover:bg-white/5 rounded-lg transition-colors text-gray-400 hover:text-white"
                            >
                                <RefreshCw className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {error && (
                                <div className="glass p-3 border border-red-500/30 bg-red-500/5 text-red-200 text-sm rounded-xl">
                                    {error}
                                </div>
                            )}
                            {messages.map((msg, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: msg.role === 'bot' ? -10 : 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={`flex ${msg.role === 'bot' ? 'justify-start' : 'justify-end'} items-start gap-4`}
                                >
                                    {msg.role === 'bot' && (
                                        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center shrink-0 mt-1">
                                            <Bot className="w-4 h-4 text-primary" />
                                        </div>
                                    )}
                                    <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'bot'
                                            ? 'bg-white/5 border border-white/10 rounded-tl-none text-gray-200'
                                            : 'bg-primary text-white rounded-tr-none shadow-lg shadow-primary/10 font-medium'
                                        }`}>
                                        {msg.text}
                                    </div>
                                    {msg.role === 'user' && (
                                        <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0 mt-1">
                                            <User className="w-4 h-4 text-gray-400" />
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                            {loading && (
                                <div className="flex justify-start items-center gap-2 text-gray-500 text-xs italic">
                                    <Bot className="w-3 h-3 animate-bounce" /> Assistant is typing...
                                </div>
                            )}
                            <div ref={chatEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-black/20 border-t border-white/5">
                            <div className="relative">
                                <input
                                    type="text"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-5 pr-14 outline-none focus:ring-1 focus:ring-primary transition-all text-sm"
                                    placeholder="Type your response here..."
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!input || loading}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary hover:bg-secondary rounded-lg transition-all disabled:opacity-50"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                            <p className="text-[10px] text-gray-600 mt-3 text-center flex items-center justify-center gap-1">
                                <Sparkles className="w-3 h-3 text-yellow-500" /> AI powered by Neural Career Engines
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default InterviewAI;
