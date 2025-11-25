import React, { useState } from 'react';

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-white/5">
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    <a href="/" className="text-2xl font-display font-bold tracking-wider hover:scale-105 transition-transform bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                        FUTURO
                    </a>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-8">
                        <a href="#mission" className="text-sm font-medium text-secondary hover:text-white transition-colors uppercase tracking-widest">
                            Misión
                        </a>
                        <a href="#impact" className="text-sm font-medium text-secondary hover:text-white transition-colors uppercase tracking-widest">
                            Impacto
                        </a>
                        <a href="#donate" className="btn-primary px-6 py-2 text-sm">
                            Donar
                        </a>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-white p-2"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {isMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu Dropdown */}
                {isMenuOpen && (
                    <div className="md:hidden absolute top-full left-0 right-0 glass-effect border-t border-white/10 animate-fade-in-up">
                        <div className="flex flex-col p-6 space-y-4">
                            <a href="#mission" className="text-lg font-medium text-secondary hover:text-white transition-colors" onClick={() => setIsMenuOpen(false)}>
                                Misión
                            </a>
                            <a href="#impact" className="text-lg font-medium text-secondary hover:text-white transition-colors" onClick={() => setIsMenuOpen(false)}>
                                Impacto
                            </a>
                            <a href="#donate" className="btn-primary text-center py-3" onClick={() => setIsMenuOpen(false)}>
                                Donar
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
