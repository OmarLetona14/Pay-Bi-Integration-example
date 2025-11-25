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

}
