import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, FileSearch, Building2, BrainCircuit, MessageSquare, Zap } from 'lucide-react';
import { Link } from "react-router-dom";

const FeatureCard = ({ icon: Icon, title, description }) => (
    <motion.div
        whileHover={{ y: -10 }}
        className="glass p-7 flex flex-col gap-4 group transition-all hover:shadow-2xl hover:shadow-primary/10"
    >
        <div className="w-12 h-12 rounded-xl bg-secondary/35 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
            <Icon className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-extrabold text-ink">{title}</h3>
        <p className="text-muted leading-relaxed text-sm">{description}</p>
    </motion.div>
);

const Home = () => {
    const features = [
        {
            icon: ShieldAlert,
            title: "Fraud Detection",
            description: "AI-powered analysis to identify fake job postings with high accuracy using NLP and pattern matching."
        },
        {
            icon: FileSearch,
            title: "ATS Optimizer",
            description: "Analyze your resume against job descriptions to optimize keywords and improve your hiring chances."
        },
        {
            icon: Building2,
            title: "Company Analytics",
            description: "Deep dive into company reputation, work culture, and credibility scores before you apply."
        },
        {
            icon: BrainCircuit,
            title: "Skill Gap Analysis",
            description: "Identify missing skills and get personalized course recommendations to bridge the gap."
        },
        {
            icon: MessageSquare,
            title: "Mock Interviews",
            description: "Practice with our AI interview assistant tailored to regular job roles and real-world scenarios."
        },
        {
            icon: Zap,
            title: "Real-time Alerts",
            description: "Get instant notifications about potential scams and industry-specific fraud trends."
        }
    ];

    return (
        <div className="pt-24 min-h-screen text-ink">
            {/* Hero Section */}
            <section className="px-6 py-16 md:py-20 max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="flex flex-col items-start text-left">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6 text-sm font-semibold text-muted"
                >
                    <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
                    Trusted job safety checks, in minutes
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-5xl md:text-6xl font-black mb-5 leading-[1.05] tracking-tight"
                >
                    Protect your career from scams.
                    <br />
                    <span className="gradient-text">Verify jobs instantly.</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-muted text-lg md:text-xl max-w-xl mb-8"
                >
                    A clean, easy-to-use toolkit that helps you detect fraud, optimize your resume, and prepare for interviews — with clarity and confidence.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-wrap gap-4"
                >
                    <Link to="/detect" className="px-7 py-4 bg-primary text-white rounded-2xl font-extrabold shadow-xl shadow-primary/15 hover:scale-[1.02] transition-all">
                        Check a Job Posting
                    </Link>
                    <Link to="/ats" className="px-7 py-4 glass rounded-2xl font-extrabold hover:bg-white/70 transition-all border border-primary/10">
                        Improve My Resume (ATS)
                    </Link>
                </motion.div>

                        <div className="mt-8 flex flex-wrap gap-3">
                            {["OCR scan for posters", "PDF resume analysis", "Company credibility check"].map((t) => (
                                <span key={t} className="text-xs font-extrabold tracking-wide text-primary bg-secondary/35 border border-primary/10 px-3 py-2 rounded-full">
                                    {t}
                                </span>
                            ))}
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="glass rounded-3xl border border-primary/10 overflow-hidden"
                    >
                        <img
                            src="/hero-illustration.svg"
                            alt="SafeJob AI dashboard preview"
                            className="w-full h-auto block"
                            loading="eager"
                        />
                    </motion.div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="px-6 py-20">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-black mb-4">Everything you need to stay <span className="text-primary">safe</span></h2>
                        <p className="text-muted max-w-2xl mx-auto">Simple tools, clear results — designed to help job seekers make confident decisions.</p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, idx) => (
                            <FeatureCard key={idx} {...feature} />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
