document.addEventListener('DOMContentLoaded', () => {
    const donateBtn = document.getElementById('donate-btn');
    const modal = document.getElementById('donation-modal');
    const closeModal = document.querySelector('.close-modal');
    const amountBtns = document.querySelectorAll('.amount-btn');
    const confirmBtn = document.querySelector('.confirm-donation-btn');
    let selectedAmount = null;

    // Open Modal
    donateBtn.addEventListener('click', () => {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    });

    // Close Modal
    closeModal.addEventListener('click', () => {
        closeModalFunc();
    });

    // Close on click outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModalFunc();
        }
    });

    function closeModalFunc() {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }

    // Select Amount
    amountBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove selected class from all
            amountBtns.forEach(b => b.classList.remove('selected'));
            // Add to clicked
            btn.classList.add('selected');
            selectedAmount = btn.dataset.amount;
        });
    });

    // Confirm Donation
    confirmBtn.addEventListener('click', async () => {
        if (selectedAmount) {
            confirmBtn.textContent = 'Procesando...';
            confirmBtn.disabled = true;

            try {
                const response = await fetch('/api/create-payment', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ amount: selectedAmount })
                });

                const data = await response.json();

                if (response.ok && data.link) {
                    window.location.href = data.link;
                } else {
                    alert('Hubo un error al procesar tu solicitud. Por favor intenta de nuevo.');
                    console.error('Payment creation failed:', data);
                    confirmBtn.textContent = 'Continuar';
                    confirmBtn.disabled = false;
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error de conexión. Por favor verifica tu internet.');
                confirmBtn.textContent = 'Continuar';
                confirmBtn.disabled = false;
            }
        } else {
            alert('Por favor selecciona un monto.');
        }
    });

    // Check for payment result in URL
    const urlParams = new URLSearchParams(window.location.search);
    const result = urlParams.get('result') || urlParams.get('status');

    if (result) {
        const resultModal = document.getElementById('result-modal');
        const resultTitle = document.getElementById('result-title');
        const resultMessage = document.getElementById('result-message');
        const resultIcon = document.getElementById('result-icon');

        if (result === 'success' || result === 'approved' || result === '1') {
            const amount = urlParams.get('amount');
            const reference = urlParams.get('reference');
            const authorization = urlParams.get('authorization');
            const audit = urlParams.get('audit');

            resultTitle.textContent = '¡Gracias por tu donación!';

            // Build message with transaction details
            let message = 'Tu aporte ha sido procesado exitosamente.';
            if (amount) message += `\n\nMonto: Q${amount}`;
            if (authorization) message += `\nAutorización: ${authorization}`;
            if (reference) message += `\nReferencia: ${reference}`;
            if (audit) message += `\nAuditoría: ${audit}`;

            resultMessage.textContent = message;
            resultMessage.style.whiteSpace = 'pre-line';
            resultIcon.className = 'success-icon';
        } else {
            const code = urlParams.get('code');
            const amount = urlParams.get('amount');
            const reference = urlParams.get('reference');
            const audit = urlParams.get('audit');

            resultTitle.textContent = 'Transacción Fallida';

            let message = 'Hubo un problema con tu pago. Por favor intenta de nuevo.';
            if (code) message += `\n\nCódigo de error: ${code}`;
            if (amount) message += `\nMonto: Q${amount}`;
            if (reference) message += `\nReferencia: ${reference}`;
            if (audit) message += `\nAuditoría: ${audit}`;

            resultMessage.textContent = message;
            resultMessage.style.whiteSpace = 'pre-line';
            resultIcon.className = 'error-icon';
        }

        resultModal.classList.add('show');
    }

    // Close Result Modal
    const closeResultBtn = document.getElementById('close-result');
    const resultBtn = document.getElementById('result-btn');

    function closeResult() {
        document.getElementById('result-modal').classList.remove('show');
        window.history.replaceState({}, document.title, "/");
    }

    if (closeResultBtn) closeResultBtn.addEventListener('click', closeResult);
    if (resultBtn) resultBtn.addEventListener('click', closeResult);

    // Smooth Scroll for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});
