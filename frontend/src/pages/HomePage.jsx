import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import DonationModal from '../components/DonationModal';
import ErrorModal from '../components/ErrorModal';
import Footer from '../components/Footer';

export default function HomePage() {
    const [showDonationModal, setShowDonationModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorData, setErrorData] = useState(null);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const error = urlParams.get('error');

        if (error) {
            setErrorData({
                code: urlParams.get('code'),
                amount: urlParams.get('amount'),
                reference: urlParams.get('reference'),
                audit: urlParams.get('audit'),
            });
            setShowErrorModal(true);
            window.history.replaceState({}, document.title, '/');
        }
    }, []);

    const handleCloseErrorModal = () => {
        setShowErrorModal(false);
        setErrorData(null);
    };

    return (
        <div className="min-h-screen">
            <Navbar />
            <Hero onDonateClick={() => setShowDonationModal(true)} />
            <Footer />

            <DonationModal
                isOpen={showDonationModal}
                onClose={() => setShowDonationModal(false)}
            />

            <ErrorModal
                isOpen={showErrorModal}
                onClose={handleCloseErrorModal}
                errorData={errorData}
            />
        </div>
    );
}
