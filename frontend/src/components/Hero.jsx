import React from 'react';

export default function Hero({ onDonateClick }) {
    return (
        <div className="min-h-screen flex items-center justify-center px-6 pt-20 relative z-10">
            <div className="text-center max-w-5xl mx-auto space-y-8">
                <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter animate-fade-in-up leading-tight">
                    Construyendo el
                    <br />
                    <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400">
                        Futuro Juntos
                    </span>
                </h1>

                <p className="text-xl md:text-2xl text-secondary max-w-2xl mx-auto leading-relaxed font-light animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    Tu aporte hace la diferencia. Únete a nuestra misión de crear un mejor mañana para todos.
                </p>

                <div className="pt-8">
                    <button
                        onClick={onDonateClick}
                        className="btn-primary relative z-50 pointer-events-auto text-lg md:text-xl px-12 py-5 shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(255,255,255,0.4)]"
                    >
                        Hacer una Donación
                    </button>
                </div>
            </div>
        </div>
    );
}
