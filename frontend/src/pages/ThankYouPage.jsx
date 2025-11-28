import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function ThankYouPage() {
    const navigate = useNavigate();
    const [transactionData, setTransactionData] = useState({});

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);

        const data = {
            amount: urlParams.get('amount'),
            authorization: urlParams.get('authorization'),
            reference: urlParams.get('reference'),
            audit: urlParams.get('audit'),
            linkCode: urlParams.get('link_code'),
        };

        setTransactionData(data);

        // If no data, redirect to home after 3 seconds
        if (!data.amount && !data.authorization && !data.reference) {
            setTimeout(() => navigate('/'), 3000);
        }
    }, [navigate]);

    const handlePrint = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/generate-receipt', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: transactionData.amount,
                    authorization: transactionData.authorization,
                    reference: transactionData.reference,
                    audit: transactionData.audit,
                    linkCode: transactionData.linkCode
                }),
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);

                // Create a temporary link to trigger download
                const a = document.createElement('a');
                a.href = url;
                a.download = `recibo-${transactionData.authorization || 'donacion'}.pdf`;
                document.body.appendChild(a);
                a.click();

                // Cleanup
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            } else {
                console.error('Failed to generate receipt');
                alert('No se pudo generar el recibo. Por favor intente de nuevo.');
            }
        } catch (error) {
            console.error('Error generating receipt:', error);
            alert('Ocurrió un error al generar el recibo.');
        }
    };

    return (
        <div className="min-h-screen">
            <Navbar />

            <div className="min-h-screen flex items-center justify-center px-6 pt-20 pb-20">
                <div className="glass-effect rounded-2xl p-8 md:p-12 max-w-2xl w-full space-y-8 animate-scale-in">
                    {/* Success Icon */}
                    <div className="flex justify-center">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center animate-scale-in shadow-lg shadow-green-500/30">
                            <span className="text-5xl text-white">✓</span>
                        </div>
                    </div>

                    {/* Title */}
                    <div className="text-center space-y-2">
                        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                            ¡Gracias por tu Generosidad!
                        </h1>
                        <p className="text-xl text-secondary">
                            Tu donación ha sido procesada exitosamente.
                        </p>
                    </div>

                    {/* Transaction Details */}
                    <div className="space-y-4 pt-6">
                        <h2 className="text-xl font-semibold text-center border-b border-glass-border pb-3">
                            Detalles de la Transacción
                        </h2>

                        <div className="space-y-3">
                            {transactionData.amount && (
                                <div className="flex justify-between py-3 border-b border-glass-border/50">
                                    <span className="text-secondary">Monto:</span>
                                    <span className="font-semibold text-lg">Q{transactionData.amount}</span>
                                </div>
                            )}

                            {transactionData.authorization && (
                                <div className="flex justify-between py-3 border-b border-glass-border/50">
                                    <span className="text-secondary">Número de Autorización:</span>
                                    <span className="font-semibold">{transactionData.authorization}</span>
                                </div>
                            )}

                            {transactionData.reference && (
                                <div className="flex justify-between py-3 border-b border-glass-border/50">
                                    <span className="text-secondary">Referencia:</span>
                                    <span className="font-semibold">{transactionData.reference}</span>
                                </div>
                            )}

                            {transactionData.audit && (
                                <div className="flex justify-between py-3 border-b border-glass-border/50">
                                    <span className="text-secondary">Auditoría:</span>
                                    <span className="font-semibold">{transactionData.audit}</span>
                                </div>
                            )}

                            {transactionData.linkCode && (
                                <div className="flex justify-between py-3">
                                    <span className="text-secondary">Código de Link:</span>
                                    <span className="font-semibold">{transactionData.linkCode}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Message */}
                    <div className="bg-white/5 border-l-4 border-green-500 p-4 rounded-lg">
                        <p className="text-secondary leading-relaxed">
                            Tu aporte hace la diferencia. Gracias por creer en nuestra misión y ayudarnos a construir un mejor futuro.
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-6 w-full">
                        <button
                            onClick={() => navigate('/')}
                            className="btn-primary flex-1 w-full flex items-center justify-center text-center"
                        >
                            Volver al Inicio
                        </button>
                        <button
                            onClick={handlePrint}
                            className="btn-secondary flex-1 w-full flex items-center justify-center text-center"
                        >
                            Imprimir Recibo
                        </button>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
