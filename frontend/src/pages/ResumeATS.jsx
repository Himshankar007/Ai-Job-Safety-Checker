import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileUp, Target, ListChecks, ArrowRight, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { api, getApiErrorMessage } from "../lib/api";

const ResumeATS = () => {
    const [jobDesc, setJobDesc] = useState('');
    const [resume, setResume] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");

    const handleAnalyze = async () => {
        setLoading(true);
        setResult(null);
        setError("");

        try {
            const formData = new FormData();
            formData.append("job_description", jobDesc);
            formData.append("resume", resume);

            const res = await api.post("/api/resume/analyze", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setResult(res.data);
        } catch (e) {
            console.error("Resume ATS analysis failed", e);
            setError(getApiErrorMessage(e));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pt-32 pb-20 px-6 max-w-6xl mx-auto min-h-screen text-white">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
            >
                <h1 className="text-4xl font-bold mb-4">Resume <span className="text-primary">ATS Optimizer</span></h1>
                <p className="text-gray-400">Scan your resume against any job description to see how well you match.</p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-10">
                {/* Left Side: Inputs */}
                <div className="flex flex-col gap-6">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass p-6">
                        <h3 className="font-bold mb-4 flex items-center gap-2">
                            <Target className="text-primary w-5 h-5" /> Job Description
                        </h3>
                        <textarea
                            className="w-full h-48 bg-black/20 border border-white/10 rounded-xl p-4 focus:ring-2 focus:ring-primary outline-none transition-all"
                            placeholder="Paste the target job description here..."
                            value={jobDesc}
                            onChange={(e) => setJobDesc(e.target.value)}
                        />
                    </motion.div>

                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="glass p-6">
                        <h3 className="font-bold mb-4 flex items-center gap-2">
                            <FileUp className="text-primary w-5 h-5" /> Your Resume
                        </h3>
                        <div className="border-2 border-dashed border-white/10 rounded-xl p-10 flex flex-col items-center justify-center gap-4 hover:border-primary/50 transition-colors cursor-pointer relative">
                            <FileUp className="w-12 h-12 text-gray-500" />
                            <div className="text-center">
                                <p className="font-medium">Upload PDF or Doc</p>
                                <p className="text-sm text-gray-500">Max size 5MB</p>
                            </div>
                            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setResume(e.target.files[0])} />
                        </div>
                        {resume && <p className="mt-4 text-primary font-mono text-sm">Selected: {resume.name}</p>}
                    </motion.div>

                    <button
                        disabled={!jobDesc || !resume || loading}
                        onClick={handleAnalyze}
                        className="w-full py-4 bg-primary hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <Sparkles className="w-5 h-5" />}
                        {loading ? "Matching Skills..." : "Analyze Compatibility Score"}
                    </button>

                    {error && (
                        <div className="glass p-4 border border-red-500/30 bg-red-500/5 text-red-200 text-sm rounded-xl">
                            {error}
                        </div>
                    )}
                </div>

                {/* Right Side: Results */}
                <div className="flex flex-col gap-6 h-full">
                    <AnimatePresence mode="wait">
                        {!result && !loading && (
                            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass p-10 flex flex-col items-center justify-center text-center h-full">
                                <Target className="w-16 h-16 text-gray-600 mb-4" />
                                <h3 className="font-bold text-xl mb-2">Ready to Scan</h3>
                                <p className="text-gray-400 text-sm italic">"A tailored resume is 3x more likely to clear the ATS bottleneck."</p>
                            </motion.div>
                        )}

                        {loading && (
                            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass p-10 flex flex-col items-center justify-center h-full gap-6">
                                <div className="w-32 h-32 relative">
                                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} className="w-full h-full rounded-full border-4 border-primary/20 border-t-primary" />
                                    <div className="absolute inset-0 flex items-center justify-center font-bold text-primary">SCANNIG</div>
                                </div>
                                <div className="text-center">
                                    <h3 className="font-bold text-xl mb-2">Analyzing Semantics</h3>
                                    <p className="text-gray-400 text-sm">Cross-referencing resume keywords with job requirements...</p>
                                </div>
                            </motion.div>
                        )}

                        {result && (
                            <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col gap-6">
                                <div className="glass p-8 text-center relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                                    <h3 className="text-sm uppercase tracking-widest text-gray-400 font-bold mb-2">Compatibility Score</h3>
                                    <div className="text-7xl font-black gradient-text mb-4">{result.score}%</div>
                                    <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/5 text-sm font-medium">
                                        {result.score >= 80 ? 'Excellent Match' : result.score >= 60 ? 'Good Potential' : 'Needs Optimization'}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="glass p-6">
                                        <h4 className="font-bold mb-4 flex items-center gap-2 text-green-400">
                                            <ListChecks className="w-4 h-4" /> Matched
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {result.matched_skills.map((s, i) => (
                                                <span key={i} className="px-3 py-1 bg-green-500/10 text-green-400 rounded-lg text-xs font-bold border border-green-500/20">{s}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="glass p-6">
                                        <h4 className="font-bold mb-4 flex items-center gap-2 text-red-400">
                                            <AlertCircle className="w-4 h-4" /> Missing
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {result.missing_skills.map((s, i) => (
                                                <span key={i} className="px-3 py-1 bg-red-500/10 text-red-400 rounded-lg text-xs font-bold border border-red-500/20">{s}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="glass p-6">
                                    <h4 className="font-bold mb-4 flex items-center gap-2">
                                        <Sparkles className="w-4 h-4 text-yellow-400" /> Improvement Tips
                                    </h4>
                                    <ul className="space-y-3">
                                        {result.suggestions.map((s, i) => (
                                            <li key={i} className="text-sm text-gray-300 flex items-start gap-3">
                                                <ArrowRight className="w-4 h-4 text-primary mt-0.5" />
                                                {s}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default ResumeATS;
