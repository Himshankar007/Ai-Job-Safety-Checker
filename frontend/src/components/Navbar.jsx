import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
    const [isOpen, setIsOpen] = React.useState(false);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Job Check', path: '/detect' },
        { name: 'Resume ATS', path: '/ats' },
        { name: 'Company Analysis', path: '/company' },
        { name: 'Skill Gap', path: '/skills' },
        { name: 'Interview AI', path: '/interview' },
    ];

    return (
        <nav className="fixed top-0 w-full z-50 px-6 py-4">
            <div className="max-w-7xl mx-auto flex justify-between items-center glass px-6 py-3">
                <Link to="/" className="flex items-center gap-2 group">
                    <ShieldCheck className="w-8 h-8 text-primary group-hover:rotate-12 transition-transform" />
                    <span className="text-xl font-extrabold tracking-tight text-ink">SafeJob <span className="text-primary">AI</span></span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex gap-8 items-center">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className="text-sm font-semibold text-muted hover:text-ink transition-colors"
                        >
                            {link.name}
                        </Link>
                    ))}
                    <Link
                        to="/detect"
                        className="bg-primary hover:bg-accent text-white px-5 py-2 rounded-full text-sm font-bold transition-all shadow-lg shadow-primary/15 hover:scale-105 active:scale-95"
                    >
                        Start Free Check
                    </Link>
                    <Link
                        to="/ats"
                        className="px-5 py-2 rounded-full text-sm font-bold border border-primary/25 text-primary hover:bg-secondary/25 transition-all"
                    >
                        Optimize Resume
                    </Link>
                </div>

                {/* Mobile Toggle */}
                <button className="md:hidden text-ink" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="md:hidden mt-2 glass p-6 flex flex-col gap-4"
                >
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className="text-lg font-semibold text-muted hover:text-ink transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <div className="flex gap-3 pt-2">
                        <Link
                            to="/detect"
                            onClick={() => setIsOpen(false)}
                            className="flex-1 text-center bg-primary hover:bg-accent text-white px-5 py-3 rounded-xl text-sm font-extrabold transition-all"
                        >
                            Start Free Check
                        </Link>
                        <Link
                            to="/ats"
                            onClick={() => setIsOpen(false)}
                            className="flex-1 text-center px-5 py-3 rounded-xl text-sm font-extrabold border border-primary/25 text-primary hover:bg-secondary/25 transition-all"
                        >
                            Resume ATS
                        </Link>
                    </div>
                </motion.div>
            )}
        </nav>
    );
};

export default Navbar;
