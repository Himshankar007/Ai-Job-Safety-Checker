import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, CheckCircle2, XCircle, Brain, Plus, Trash2, ArrowRight, Zap } from 'lucide-react';
import { api, getApiErrorMessage } from "../lib/api";

const SkillGap = () => {
    const [userSkills, setUserSkills] = useState([]);
    const [newSkill, setNewSkill] = useState('');
    const [jobDesc, setJobDesc] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");

    const addSkill = () => {
        if (newSkill && !userSkills.includes(newSkill)) {
            setUserSkills([...userSkills, newSkill]);
            setNewSkill('');
        }
    };

    const removeSkill = (skill) => {
        setUserSkills(userSkills.filter(s => s !== skill));
    };

    const handleAnalyze = async () => {
        setLoading(true);
        setResult(null);
        setError("");

        try {
            const res = await api.post("/api/skills/analyze", {
                user_skills: userSkills,
                job_description: jobDesc,
            });
            setResult(res.data);
        } catch (e) {
            console.error("Skill gap analysis failed", e);
            setError(getApiErrorMessage(e));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pt-32 pb-20 px-6 max-w-6xl mx-auto min-h-screen text-white">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4">Skill Gap <span className="text-primary">Analyzer</span></h1>
                <p className="text-gray-400">Bridge the gap between your expertise and your dream job requirements.</p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-10">
                <div className="flex flex-col gap-6">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass p-8">
                        <h3 className="font-bold mb-6 flex items-center gap-2 italic text-gray-300 uppercase tracking-widest text-sm">
                            <Zap className="text-yellow-400 w-4 h-4" /> Step 1: Your Skill Set
                        </h3>
                        <div className="flex gap-2 mb-6">
                            <input
                                type="text"
                                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 outline-none focus:ring-1 focus:ring-primary transition-all"
                                placeholder="E.g. React, Python, UI Design..."
                                value={newSkill}
                                onChange={(e) => setNewSkill(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                            />
                            <button onClick={addSkill} className="p-3 bg-primary rounded-xl hover:bg-secondary transition-all">
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {userSkills.map(skill => (
                                <span key={skill} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-bold flex items-center gap-2 group">
                                    {skill}
                                    <button onClick={() => removeSkill(skill)} className="text-gray-500 hover:text-red-400">
                                        <Trash2 className="w-3 h-3" />
                                    </button>
                                </span>
                            ))}
                            {userSkills.length === 0 && <p className="text-gray-600 text-sm italic">Add at least 3-5 core skills...</p>}
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="glass p-8">
                        <h3 className="font-bold mb-6 flex items-center gap-2 italic text-gray-300 uppercase tracking-widest text-sm">
                            <BookOpen className="text-primary w-4 h-4" /> Step 2: Target Job Details
                        </h3>
                        <textarea
                            className="w-full h-40 bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:ring-1 focus:ring-primary transition-all text-sm"
                            placeholder="Paste the job description or requirements here..."
                            value={jobDesc}
                            onChange={(e) => setJobDesc(e.target.value)}
                        />
                    </motion.div>

                    <button
                        disabled={userSkills.length === 0 || !jobDesc || loading}
                        onClick={handleAnalyze}
                        className="w-full py-4 bg-primary hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl font-black text-lg shadow-2xl shadow-primary/20 transition-all border border-primary/50"
                    >
                        {loading ? "Thinking..." : "Find My Skill Gaps"}
                    </button>

                    {error && (
                        <div className="glass p-4 border border-red-500/30 bg-red-500/5 text-red-200 text-sm rounded-xl">
                            {error}
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-6">
                    <AnimatePresence mode="wait">
                        {!result && !loading && (
                            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass p-8 h-full flex flex-col items-center justify-center text-center">
                                <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center mb-6">
                                    <Brain className="w-10 h-10 text-gray-600" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Analysis Engine Ready</h3>
                                <p className="text-gray-500 text-sm">Input your data to reveal the competitive gap and learning path.</p>
                            </motion.div>
                        )}

                        {result && (
                            <motion.div key="result" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-6">
                                <div className="glass p-8 bg-gradient-to-br from-primary/10 to-transparent flex items-center justify-between">
                                    <div>
                                        <h3 className="text-sm font-bold text-primary uppercase tracking-widest mb-1">Match Potential</h3>
                                        <div className="text-5xl font-black">{result.match_percentage}%</div>
                                    </div>
                                    <div className="w-24 h-24 relative">
                                        <svg className="w-full h-full" viewBox="0 0 36 36">
                                            <path className="text-white/5" strokeDasharray="100, 100" strokeWidth="3" fill="none" stroke="currentColor" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                            <motion.path
                                                className="text-primary"
                                                strokeDasharray={`${result.match_percentage}, 100`}
                                                initial={{ strokeDasharray: "0, 100" }}
                                                animate={{ strokeDasharray: `${result.match_percentage}, 100` }}
                                                transition={{ duration: 1.5, ease: "easeOut" }}
                                                strokeWidth="3" fill="none" stroke="currentColor" strokeLinecap="round" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                            />
                                        </svg>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="glass p-6">
                                        <h4 className="flex items-center gap-2 text-green-400 font-bold text-sm mb-4"><CheckCircle2 className="w-4 h-4" /> Matched</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {result.matched.map(s => <span key={s} className="px-2 py-1 bg-green-500/5 text-green-400 border border-green-500/10 rounded text-[10px] uppercase font-bold">{s}</span>)}
                                        </div>
                                    </div>
                                    <div className="glass p-6">
                                        <h4 className="flex items-center gap-2 text-red-400 font-bold text-sm mb-4"><XCircle className="w-4 h-4" /> Missing</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {result.missing.map(s => <span key={s} className="px-2 py-1 bg-red-500/5 text-red-400 border border-red-500/10 rounded text-[10px] uppercase font-bold">{s}</span>)}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="font-bold flex items-center gap-2 px-2"><Brain className="w-5 h-5 text-primary" /> Personalized Learning Path</h4>
                                    {result.recommendations.map((rec, i) => (
                                        <motion.div key={i} whileHover={{ scale: 1.02 }} className="glass p-6 border-l-4 border-primary">
                                            <div className="flex justify-between items-start mb-4">
                                                <h5 className="font-black text-xl">{rec.skill}</h5>
                                                <span className="text-[10px] font-bold bg-primary px-2 py-0.5 rounded text-white uppercase">Critical</span>
                                            </div>
                                            <div className="space-y-3">
                                                {rec.courses.map((course, j) => (
                                                    <div key={j} className="flex items-center justify-between group cursor-pointer">
                                                        <div>
                                                            <p className="text-sm font-bold text-gray-200 group-hover:text-primary transition-colors">{course.name}</p>
                                                            <p className="text-[10px] text-gray-500">{course.platform}</p>
                                                        </div>
                                                        <ArrowRight className="w-4 h-4 text-gray-700 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                                    </div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default SkillGap;
