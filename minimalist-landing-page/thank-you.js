document.addEventListener('DOMContentLoaded', () => {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);

    // Extract transaction details
    const amount = urlParams.get('amount');
    const authorization = urlParams.get('authorization');
    const reference = urlParams.get('reference');
    const audit = urlParams.get('audit');
    const linkCode = urlParams.get('link_code');

    // Update the page with transaction details
    if (amount) {
        document.getElementById('amount').textContent = `Q${amount}`;
    }

    if (authorization) {
        document.getElementById('authorization').textContent = authorization;
    }

    if (reference) {
        document.getElementById('reference').textContent = reference;
    }

    if (audit) {
        document.getElementById('audit').textContent = audit;
    }

    if (linkCode) {
        document.getElementById('link_code').textContent = linkCode;
    }

    // If no data is present, redirect to home
    if (!amount && !authorization && !reference) {
        console.warn('No transaction data found, redirecting to home');
        setTimeout(() => {
            window.location.href = '/';
        }, 3000);
    }
});
