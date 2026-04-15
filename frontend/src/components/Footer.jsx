import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Github, Twitter, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="px-6 py-12 mt-20">
            <div className="max-w-7xl mx-auto glass border border-primary/10">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
                <div className="flex flex-col gap-4 col-span-1 md:col-span-1">
                    <Link to="/" className="flex items-center gap-2">
                        <ShieldCheck className="w-6 h-6 text-primary" />
                        <span className="text-xl font-extrabold tracking-tight text-ink">SafeJob <span className="text-primary">AI</span></span>
                    </Link>
                    <p className="text-muted text-sm leading-relaxed">
                        Protecting job seekers through advanced AI analytics. Detect fraud, optimize resumes, and master interviews in one secure platform.
                    </p>
                    <div className="flex gap-4 mt-2">
                        <Github className="w-5 h-5 text-muted hover:text-ink cursor-pointer transition-colors" />
                        <Twitter className="w-5 h-5 text-muted hover:text-ink cursor-pointer transition-colors" />
                        <Linkedin className="w-5 h-5 text-muted hover:text-ink cursor-pointer transition-colors" />
                    </div>
                </div>

                <div>
                    <h4 className="font-extrabold mb-6 text-sm uppercase tracking-widest text-ink">Platform</h4>
                    <ul className="space-y-4 text-sm text-muted">
                        <li><Link to="/detect" className="hover:text-primary transition-colors">Fraud Detection</Link></li>
                        <li><Link to="/ats" className="hover:text-primary transition-colors">ATS Optimizer</Link></li>
                        <li><Link to="/company" className="hover:text-primary transition-colors">Company Analyzer</Link></li>
                        <li><Link to="/skills" className="hover:text-primary transition-colors">Skill Gap Analyzer</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-extrabold mb-6 text-sm uppercase tracking-widest text-ink">Company</h4>
                    <ul className="space-y-4 text-sm text-muted">
                        <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
                        <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                        <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
                        <li><a href="#" className="hover:text-primary transition-colors">Fraud Reports</a></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-extrabold mb-6 text-sm uppercase tracking-widest text-ink">Newsletter</h4>
                    <p className="text-muted text-sm mb-4">Get the latest scam alerts and job market insights.</p>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Email address"
                            className="bg-white/70 border border-primary/15 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-secondary w-full"
                        />
                        <button className="p-2 bg-primary rounded-lg hover:bg-accent transition-all text-white">
                            <Mail className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
            <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-primary/10 text-center text-[10px] text-muted uppercase tracking-widest">
                © 2026 SafeJob AI. Built for job safety and career growth.
            </div>
            </div>
        </footer>
    );
};

export default Footer;
