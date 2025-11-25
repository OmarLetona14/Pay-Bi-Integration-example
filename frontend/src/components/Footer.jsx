import React from 'react';

export default function Footer() {
    return (
        <footer className="glass-effect border-t border-white/5 py-12 mt-20 relative z-10">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-center md:text-left">
                        <h4 className="text-2xl font-display font-bold tracking-wider mb-2">FUTURO</h4>
                        <p className="text-secondary text-sm">© 2025 Fundación Futuro. Todos los derechos reservados.</p>
                    </div>
                    <div className="flex gap-8 text-sm text-secondary">
                        <a href="#" className="hover:text-white transition-colors">Términos</a>
                        <a href="#" className="hover:text-white transition-colors">Privacidad</a>
                        <a href="#" className="hover:text-white transition-colors">Contacto</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
