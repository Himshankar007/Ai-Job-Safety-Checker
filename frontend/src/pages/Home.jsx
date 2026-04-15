import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, FileSearch, Building2, BrainCircuit, MessageSquare, Zap } from 'lucide-react';
import { Link } from "react-router-dom";

const StatCard = ({ title, value, delta, deltaPositive }) => (
    <motion.div
        whileHover={{ y: -6 }}
        className="glass p-6 border border-stroke rounded-2xl"
    >
        <div className="text-xs uppercase tracking-[0.18em] text-muted font-semibold">{title}</div>
        <div className="mt-2 flex items-end justify-between">
            <div className="text-3xl font-black text-ink">{value}</div>
            <div className={`text-sm font-extrabold ${deltaPositive ? "text-accent" : "text-secondary"}`}>{delta}</div>
        </div>
    </motion.div>
);

const ToolCard = ({ icon: Icon, title, description, to, cta }) => (
    <motion.div whileHover={{ y: -6 }} className="glass p-6 border border-stroke rounded-2xl">
        <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/15 border border-primary/25 flex items-center justify-center text-primary">
                <Icon className="w-6 h-6" />
            </div>
            <div className="flex-1">
                <div className="text-lg font-black text-ink">{title}</div>
                <div className="text-sm text-muted mt-1 leading-relaxed">{description}</div>
                <div className="mt-4">
                    <Link to={to} className="inline-flex items-center gap-2 text-sm font-extrabold text-primary hover:text-secondary transition">
                        {cta} <span aria-hidden>→</span>
                    </Link>
                </div>
            </div>
        </div>
    </motion.div>
);

const Home = () => {
    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex items-start justify-between gap-6 flex-wrap">
                <div>
                    <div className="text-sm text-muted font-semibold">Dashboard</div>
                    <h1 className="text-3xl md:text-4xl font-black mt-1">
                        Welcome back, <span className="gradient-text">job seeker</span>
                    </h1>
                    <p className="text-muted mt-2 max-w-2xl">
                        Verify job posts, improve your resume, and research companies — all in one place.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Link to="/detect" className="px-5 py-3 rounded-2xl bg-primary text-white font-extrabold shadow-lg shadow-primary/20 hover:opacity-95 transition">
                        New Job Check
                    </Link>
                    <Link to="/ats" className="px-5 py-3 rounded-2xl bg-white/5 border border-stroke text-ink font-extrabold hover:bg-white/10 transition">
                        Resume ATS
                    </Link>
                </div>
            </div>

            {/* Stat row (Corona-like) */}
            <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Potential Risk Reduced" value="28%" delta="+3.5%" deltaPositive />
                <StatCard title="Checks This Week" value="17" delta="+11%" deltaPositive />
                <StatCard title="Resume Match Avg." value="72%" delta="-2.4%" />
                <StatCard title="Skill Gaps Found" value="31" delta="+3.5%" deltaPositive />
            </div>

            {/* Main grid */}
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="glass border border-stroke rounded-2xl overflow-hidden">
                        <div className="px-6 py-5 border-b border-stroke flex items-center justify-between">
                            <div>
                                <div className="text-lg font-black">Quick Start</div>
                                <div className="text-sm text-muted">Pick a tool and get results in minutes.</div>
                            </div>
                            <div className="text-xs uppercase tracking-[0.2em] text-muted font-semibold">SafeJob AI</div>
                        </div>
                        <div className="p-6 grid md:grid-cols-2 gap-4">
                            <ToolCard
                                icon={ShieldAlert}
                                title="Fraud Detection"
                                description="Paste a job description or upload a poster. Get a risk level and red flags."
                                to="/detect"
                                cta="Analyze a job"
                            />
                            <ToolCard
                                icon={FileSearch}
                                title="Resume ATS"
                                description="Upload your resume and compare it with a job description for an ATS score."
                                to="/ats"
                                cta="Improve my resume"
                            />
                            <ToolCard
                                icon={Building2}
                                title="Company Analysis"
                                description="Check credibility, culture and salary insight before applying."
                                to="/company"
                                cta="Analyze a company"
                            />
                            <ToolCard
                                icon={BrainCircuit}
                                title="Skill Gap"
                                description="Find missing skills and get recommendations to close the gap faster."
                                to="/skills"
                                cta="Find skill gaps"
                            />
                        </div>
                    </div>

                    <div className="glass border border-stroke rounded-2xl overflow-hidden">
                        <div className="px-6 py-5 border-b border-stroke">
                            <div className="text-lg font-black">Recent Activity</div>
                            <div className="text-sm text-muted">A simple history of your latest checks.</div>
                        </div>
                        <div className="p-6">
                            <div className="space-y-3">
                                {[
                                    { t: "Fraud Detection", d: "Scanned job poster (OCR)", when: "15 minutes ago", tag: "High risk", color: "text-secondary" },
                                    { t: "Resume ATS", d: "Matched resume to JD", when: "1 hour ago", tag: "72% match", color: "text-accent" },
                                    { t: "Company Analysis", d: "Checked company credibility", when: "4 hours ago", tag: "Recommended", color: "text-primary" },
                                ].map((row, i) => (
                                    <div key={i} className="flex items-center justify-between gap-4 bg-white/5 border border-stroke rounded-2xl p-4">
                                        <div>
                                            <div className="font-extrabold">{row.t}</div>
                                            <div className="text-sm text-muted">{row.d}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className={`text-sm font-extrabold ${row.color}`}>{row.tag}</div>
                                            <div className="text-xs text-muted">{row.when}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="glass border border-stroke rounded-2xl overflow-hidden">
                        <div className="px-6 py-5 border-b border-stroke">
                            <div className="text-lg font-black">Interview AI</div>
                            <div className="text-sm text-muted">Practice live with AI questions.</div>
                        </div>
                        <div className="p-6">
                            <p className="text-sm text-muted leading-relaxed">
                                Pick a role and start a mock interview. If your backend maintenance mode is enabled, you may see a maintenance notice.
                            </p>
                            <Link to="/interview" className="mt-4 inline-flex w-full justify-center px-5 py-3 rounded-2xl bg-secondary text-white font-extrabold hover:opacity-95 transition">
                                Start Interview
                            </Link>
                        </div>
                    </div>

                    <div className="glass border border-stroke rounded-2xl overflow-hidden">
                        <div className="px-6 py-5 border-b border-stroke">
                            <div className="text-lg font-black">Safety Tips</div>
                            <div className="text-sm text-muted">Quick reminders to avoid scams.</div>
                        </div>
                        <div className="p-6 space-y-3 text-sm text-muted">
                            <div className="flex gap-3">
                                <div className="w-2 h-2 rounded-full bg-accent mt-2" />
                                Never pay “registration fees” for a job.
                            </div>
                            <div className="flex gap-3">
                                <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                                Prefer official company email domains.
                            </div>
                            <div className="flex gap-3">
                                <div className="w-2 h-2 rounded-full bg-secondary mt-2" />
                                If it sounds too good to be true, verify first.
                            </div>
                        </div>
                    </div>

                    <div className="text-center text-[11px] uppercase tracking-[0.22em] text-muted">
                        © 2026 SafeJob AI
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
