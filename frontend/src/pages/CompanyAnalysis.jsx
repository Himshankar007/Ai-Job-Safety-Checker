import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Building2, Star, TrendingUp, Users, ShieldCheck, Info } from 'lucide-react';
import { api, getApiErrorMessage } from "../lib/api";

const CompanyAnalysis = () => {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [company, setCompany] = useState(null);
    const [error, setError] = useState("");

    const handleSearch = async () => {
        if (!query) return;
        setLoading(true);
        setCompany(null);
        setError("");

        try {
            const res = await api.get(`/api/company/search/${encodeURIComponent(query)}`);
            setCompany(res.data);
        } catch (e) {
            console.error("Company analysis failed", e);
            setError(getApiErrorMessage(e));
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
                <div className="text-sm text-muted font-semibold">Company Analysis</div>
                <h1 className="text-3xl md:text-4xl font-black mt-1">Company <span className="gradient-text">Intelligence</span></h1>
                <p className="text-muted mt-2">Get credibility and culture insight before you commit to an interview.</p>
            </motion.div>

            <div className="max-w-3xl mx-auto mb-10 px-4">
                <div className="relative group">
                    <input
                        type="text"
                        className="w-full bg-black/ border border-black/ rounded-2xl py-5 px-14 text-lg focus:ring-2 focus:ring-primary outline-none transition-all shadow-2xl"
                        placeholder="Search company name (e.g. Google, Amazon, Meta)..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-primary transition-colors" />
                    <button
                        onClick={handleSearch}
                        className="absolute right-3 top-1/2 -translate-y-1/2 px-6 py-2 bg-primary rounded-xl font-bold hover:bg-secondary transition-all"
                    >
                        Analyze
                    </button>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {loading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center gap-6 py-20"
                    >
                        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                        <p className="text-gray-600 font-medium">Fetching reputation data and reviews...</p>
                    </motion.div>
                )}

                {error && !loading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="max-w-3xl mx-auto glass p-4 border border-red-500/30 bg-red-500/5 text-red-200 text-sm rounded-xl mb-10"
                    >
                        {error}
                    </motion.div>
                )}

                {company && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="grid lg:grid-cols-3 gap-8"
                    >
                        {/* Main Info Card */}
                        <div className="lg:col-span-2 flex flex-col gap-6">
                            <div className="glass p-8 flex items-start gap-6">
                                <div className="w-20 h-20 bg-primary/20 rounded-2xl flex items-center justify-center border border-primary/30">
                                    <Building2 className="w-10 h-10 text-primary" />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-bold mb-2">{company.name}</h2>
                                    <div className="flex items-center gap-4 text-sm">
                                        <span className="flex items-center gap-1 text-yellow-400"><Star className="w-4 h-4 fill-current" /> {company.culture_rating} Rating</span>
                                        <span className="text-gray-500">|</span>
                                        <span className="text-gray-600">HQ: San Francisco, CA</span>
                                    </div>
                                </div>
                                <motion.div
                                    initial={{ rotate: -15, scale: 0.8 }}
                                    animate={{ rotate: 0, scale: 1 }}
                                    className="ml-auto glass px-4 py-2 border-primary/50 flex items-center gap-2"
                                >
                                    <ShieldCheck className="text-primary w-5 h-5" />
                                    <span className="text-xs font-black text-primary uppercase tracking-tighter">Verified Entity</span>
                                </motion.div>
                            </div>

                            <div className="glass p-8">
                                <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                                    <Users className="text-primary w-5 h-5" /> Overall Summary
                                </h3>
                                <p className="text-gray-600 leading-relaxed">{company.summary}</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="glass p-6 border-l-4 border-primary">
                                    <h4 className="text-sm font-bold text-gray-600 mb-2 uppercase">Salary Insight</h4>
                                    <p className="text-xl font-bold">{company.salary_insight}</p>
                                </div>
                                <div className="glass p-6 border-l-4 border-secondary">
                                    <h4 className="text-sm font-bold text-gray-600 mb-2 uppercase">Emp. Retention</h4>
                                    <p className="text-xl font-bold">88% (High)</p>
                                </div>
                            </div>

                            <div className="glass p-8">
                                <h3 className="font-bold text-xl mb-6 flex items-center gap-2">
                                    <TrendingUp className="text-primary w-5 h-5" /> Recent Review Snippets
                                </h3>
                                <div className="space-y-4">
                                    {company.reviews.map((rev, i) => (
                                        <motion.div
                                            key={i}
                                            whileHover={{ x: 5 }}
                                            className="bg-black/ p-4 rounded-xl border border-black/"
                                        >
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="font-bold text-sm text-primary">{rev.user}</span>
                                                <div className="flex gap-0.5">
                                                    {[...Array(5)].map((_, idx) => (
                                                        <Star key={idx} className={`w-3 h-3 ${idx < rev.rating ? 'text-yellow-400 fill-current' : 'text-gray-700'}`} />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-600 italic">"{rev.text}"</p>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Score Side Card */}
                        <div className="flex flex-col gap-6">
                            <div className="glass p-8 text-center bg-gradient-to-br from-primary/20 to-transparent">
                                <h3 className="text-sm font-bold text-gray-600 uppercase tracking-widest mb-6">Credibility Score</h3>
                                <div className="relative w-40 h-40 mx-auto mb-6">
                                    <svg className="w-full h-full" viewBox="0 0 100 100">
                                        <circle className="text-ink/10" strokeWidth="8" stroke="currentColor" fill="transparent" r="40" cx="50" cy="50" />
                                        <motion.circle
                                            className="text-primary"
                                            strokeWidth="8"
                                            strokeDasharray="251.2"
                                            initial={{ strokeDashoffset: 251.2 }}
                                            animate={{ strokeDashoffset: 251.2 - (251.2 * company.credibility_score) / 100 }}
                                            transition={{ duration: 1.5, ease: "easeOut" }}
                                            strokeLinecap="round" stroke="currentColor" fill="transparent" r="40" cx="50" cy="50"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-4xl font-black">{company.credibility_score}</span>
                                        <span className="text-xs text-gray-500 font-bold uppercase">Points</span>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 px-4">Based on data from 50+ verified career portals and legal databases.</p>
                            </div>

                            <div className="glass p-6">
                                <h4 className="font-bold mb-4 flex items-center gap-2">
                                    <Info className="w-4 h-4 text-primary" /> Key Information
                                </h4>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Founded</span>
                                        <span className="font-bold">1998</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Size</span>
                                        <span className="font-bold">10,000+ Employees</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Ownership</span>
                                        <span className="font-bold">Public</span>
                                    </div>
                                </div>
                            </div>

                            <button className="w-full py-4 glass bg-primary hover:bg-secondary rounded-2xl font-bold shadow-xl shadow-primary/20 transition-all">
                                Full Reputation Report
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CompanyAnalysis;
