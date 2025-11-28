import React, { useState } from 'react';
import { createPayment } from '../services/api';

export default function DonationModal({ isOpen, onClose }) {
    const [selectedAmount, setSelectedAmount] = useState(null);
    const [customAmount, setCustomAmount] = useState('');
    const [isCustom, setIsCustom] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const amounts = [10, 25, 50, 100];

    const handleAmountSelect = (amount) => {
        setSelectedAmount(amount);
        setIsCustom(false);
        setCustomAmount('');
        setError(null);
    };

    const handleCustomClick = () => {
        setIsCustom(true);
        setSelectedAmount(null);
        setError(null);
    };

    const handleCustomChange = (e) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        setCustomAmount(value);
        if (value && parseInt(value) > 0) {
            setSelectedAmount(parseInt(value));
        } else {
            setSelectedAmount(null);
        }
    };

    const handleConfirm = async () => {
        if (!selectedAmount) {
            setError('Por favor selecciona o ingresa un monto válido');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await createPayment(selectedAmount);
            if (response.link) {
                window.location.href = response.link;
            } else {
                setError('No se pudo generar el link de pago');
            }
        } catch (err) {
            setError(err.message || 'Error al procesar tu solicitud');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
            <div className="glass-panel w-full max-w-md p-8 relative z-10 animate-scale-in">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <h2 className="text-3xl font-bold text-center mb-2">Tu Donación</h2>
                <p className="text-center text-gray-400 mb-8">Elige el monto que deseas aportar</p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    {amounts.map((amount) => (
                        <button
                            key={amount}
                            onClick={() => handleAmountSelect(amount)}
                            className={`py-4 rounded-xl font-semibold text-lg transition-all duration-300 border ${selectedAmount === amount && !isCustom
                                ? 'bg-white text-black border-white scale-105 shadow-lg'
                                : 'bg-transparent text-white border-white/10 hover:border-white/30 hover:bg-white/5'
                                }`}
                        >
                            Q{amount}
                        </button>
                    ))}
                </div>

                <div className="mb-8">
                    <button
                        onClick={handleCustomClick}
                        className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 border mb-4 ${isCustom
                            ? 'bg-white/10 text-white border-white/50'
                            : 'bg-transparent text-gray-400 border-white/10 hover:border-white/30 hover:bg-white/5'
                            }`}
                    >
                        Otro Monto
                    </button>

                    {isCustom && (
                        <div className="relative animate-fade-in-up">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-gray-400">Q</span>
                            <input
                                type="text"
                                value={customAmount}
                                onChange={handleCustomChange}
                                placeholder="0"
                                className="w-full bg-black/30 border border-white/20 rounded-xl py-4 pl-10 pr-4 text-xl text-white placeholder-gray-600 focus:outline-none focus:border-white/50 transition-colors"
                                autoFocus
                            />
                        </div>
                    )}
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm text-center">
                        {error}
                    </div>
                )}

                <button
                    onClick={handleConfirm}
                    disabled={loading || !selectedAmount}
                    className={`w-full py-4 rounded-full font-bold text-lg transition-all duration-300 flex items-center justify-center ${loading || !selectedAmount
                        ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                        : 'bg-white text-black hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]'
                        }`}
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Procesando...
                        </span>
                    ) : (
                        'Continuar'
                    )}
                </button>
            </div>
        </div>
    );
}
