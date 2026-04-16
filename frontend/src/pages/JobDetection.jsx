import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Search, ShieldAlert, CheckCircle, AlertTriangle, Loader2, BrainCircuit } from 'lucide-react';
import { api, getApiErrorMessage } from "../lib/api";

const JobDetection = () => {
    const [description, setDescription] = useState('');
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");

    const handleAnalyze = async () => {
        setLoading(true);
        setResult(null);
        setError("");

        const formData = new FormData();
        if (description) formData.append('description', description);
        if (file) formData.append('file', file);

        try {
            const response = await api.post("/api/fraud/analyze", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setResult(response.data);
        } catch (error) {
            console.error("Analysis failed", error);
            setError(getApiErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <div className="text-sm text-muted font-semibold">Fraud Detection</div>
                <h1 className="text-3xl md:text-4xl font-black mt-1">Job Fraud <span className="gradient-text">Analysis</span></h1>
                <p className="text-muted mt-2">Paste a job description or upload an image/PDF. Get a risk level and flags.</p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Input area */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-col gap-6"
                >
                    <div className="glass p-6">
                        <label className="block text-sm font-semibold mb-2 text-muted">Job description</label>
                        <textarea
                            className="w-full h-64 bg-black/30 border border-black/ rounded-xl p-4 focus:ring-2 focus:ring-primary outline-none text-sm transition-all"
                            placeholder="Paste the job description or details here..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        ></textarea>
                    </div>

                    <div className="glass p-6">
                        <label className="block text-sm font-semibold mb-4 text-muted">Upload image / PDF (OCR)</label>
                        <div className="border-2 border-dashed border-black/ rounded-xl p-8 flex flex-col items-center justify-center gap-4 hover:border-primary/50 transition-colors cursor-pointer group">
                            <Upload className="w-10 h-10 text-gray-500 group-hover:text-primary" />
                            <p className="text-sm text-gray-600">Click to browse or drag & drop files</p>
                            <input type="file" className="hidden" onChange={(e) => setFile(e.target.files[0])} />
                        </div>
                        {file && <p className="mt-2 text-xs text-primary font-mono">{file.name} selected</p>}
                    </div>

                    {error && (
                        <div className="glass p-4 border border-red-500/30 bg-red-500/5 text-red-200 text-sm rounded-xl">
                            {error}
                        </div>
                    )}

                    <button
                        disabled={(!description && !file) || loading}
                        onClick={handleAnalyze}
                        className="w-full py-4 bg-primary hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl font-extrabold flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <Search className="w-5 h-5" />}
                        {loading ? "Analyzing Patterns..." : "Verify Job Authenticity"}
                    </button>
                </motion.div>

                {/* Results area */}
                <div className="flex flex-col gap-6">
                    <AnimatePresence mode="wait">
                        {!result && !loading && (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="glass p-10 flex flex-col items-center justify-center text-center gap-4 h-full"
                            >
                                <div className="w-16 h-16 rounded-full bg-black/ flex items-center justify-center mb-2">
                                    <ShieldAlert className="w-8 h-8 text-gray-500" />
                                </div>
                                <h3 className="font-bold text-xl">System Standby</h3>
                                <p className="text-gray-600 text-sm">Waiting for input to start fraud analysis. Our AI will check for common scam patterns, suspicious language, and recruiter reputation.</p>
                            </motion.div>
                        )}

                        {loading && (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="glass p-10 flex flex-col items-center justify-center gap-6 h-full"
                            >
                                <div className="relative">
                                    <div className="w-24 h-24 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
                                    <ShieldAlert className="absolute inset-0 m-auto w-8 h-8 text-primary" />
                                </div>
                                <div className="text-center">
                                    <h3 className="font-bold text-xl mb-2">Analyzing Patterns</h3>
                                    <p className="text-gray-600 text-sm">Running NLP sentiment analysis and cross-referencing known fraud triggers...</p>
                                </div>
                            </motion.div>
                        )}

                        {result && (
                            <motion.div
                                key="result"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col gap-6 h-full"
                            >
                                <div className={`glass p-8 border-l-8 ${result.level === 'High' ? 'border-red-500' : result.level === 'Medium' ? 'border-yellow-500' : 'border-green-500'}`}>
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <h3 className="text-2xl font-bold">{result.level} Risk Level</h3>
                                            <p className="text-gray-600 text-sm">Fraud Probability: {result.score}%</p>
                                        </div>
                                        {result.level === 'High' ? <AlertTriangle className="text-red-500 w-10 h-10" /> : <CheckCircle className="text-green-500 w-10 h-10" />}
                                    </div>

                                    <div className="w-full bg-black/ h-3 rounded-full overflow-hidden mb-8">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${result.score}%` }}
                                            className={`h-full ${result.level === 'High' ? 'bg-red-500' : result.level === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'}`}
                                        />
                                    </div>

                                    <h4 className="font-bold mb-3 flex items-center gap-2">
                                        <BrainCircuit className="w-4 h-4 text-primary" />
                                        AI Reasoning
                                    </h4>
                                    <ul className="space-y-3">
                                        {result.explanation.map((exp, i) => (
                                            <li key={i} className="text-sm text-gray-600 flex items-start gap-3 bg-black/ p-3 rounded-lg">
                                                <span className="text-primary mt-1">•</span>
                                                {exp}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="glass p-6 bg-gradient-to-br from-primary/10 to-transparent">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="font-bold">Trust Score</h4>
                                            <p className="text-xs text-gray-600">Based on historical data</p>
                                        </div>
                                        <div className="text-3xl font-black text-primary">{result.trust_score}/100</div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default JobDetection;
