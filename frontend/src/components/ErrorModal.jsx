import React from 'react';

export default function ErrorModal({ isOpen, onClose, errorData }) {
    if (!isOpen) return null;

    const { code, amount, reference, audit } = errorData || {};

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="glass-effect rounded-2xl p-8 max-w-md w-full space-y-6 animate-scale-in"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex flex-col items-center space-y-4">
                    <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center">
                        <span className="text-4xl text-red-500">✕</span>
                    </div>

                    <h3 className="text-2xl font-semibold">Transacción Fallida</h3>

                    <p className="text-secondary text-center">
                        Hubo un problema con tu pago. Por favor intenta de nuevo.
                    </p>
                </div>

                {(code || amount || reference || audit) && (
                    <div className="space-y-3 pt-4 border-t border-glass-border">
                        <p className="text-sm text-secondary">Detalles de la transacción:</p>
                        {code && (
                            <div className="flex justify-between text-sm">
                                <span className="text-secondary">Código de error:</span>
                                <span className="font-semibold">{code}</span>
                            </div>
                        )}
                        {amount && (
                            <div className="flex justify-between text-sm">
                                <span className="text-secondary">Monto:</span>
                                <span className="font-semibold">Q{amount}</span>
                            </div>
                        )}
                        {reference && (
                            <div className="flex justify-between text-sm">
                                <span className="text-secondary">Referencia:</span>
                                <span className="font-semibold">{reference}</span>
                            </div>
                        )}
                        {audit && (
                            <div className="flex justify-between text-sm">
                                <span className="text-secondary">Auditoría:</span>
                                <span className="font-semibold">{audit}</span>
                            </div>
                        )}
                    </div>
                )}

                <button
                    onClick={onClose}
                    className="btn-primary w-full"
                >
                    Cerrar
                </button>
            </div>
        </div>
    );
}
