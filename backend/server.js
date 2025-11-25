const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
const FormData = require('form-data');
const crypto = require('crypto');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
app.use(cors({
    origin: FRONTEND_URL,
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // To parse form data from Pay Bi
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Pay Bi Configuration
const PAYBI_API_URL = 'https://admlink.ebi.com.gt/api';
const PAYBI_LLAVE = '24dd6249787d91870bf89b36fae4307bcbd21226'; // From Postman
const PAYBI_USER = process.env.PAYBI_USER;
const PAYBI_PASSWORD = process.env.PAYBI_PASSWORD;
const PAYBI_IV = process.env.PAYBI_IV;
const PAYBI_CST = process.env.PAYBI_CST;

// Iterative counter for unique link IDs
let linkCounter = 1;

function getNextLinkId() {
    const id = `DON${String(linkCounter).padStart(6, '0')}`;
    linkCounter++;
    return id;
}

// Helper to create FormData headers
function getFormDataConfig(formData) {
    return {
        headers: {
            ...formData.getHeaders()
        }
    };
}

// Decrypt Pay Bi response
function decryptPayBiData(encryptedData) {
    try {
        if (!encryptedData) return null;

        const iv = Buffer.from(PAYBI_IV, 'base64');

        // CST as UTF-8 string buffer (like PHP does)
        let keyBuffer = Buffer.from(PAYBI_CST, 'utf8');

        // AES-256-CBC requires exactly 32 bytes (256 bits)
        // If the key is shorter, pad it. If longer, truncate it.
        if (keyBuffer.length < 32) {
            const paddedKey = Buffer.alloc(32);
            keyBuffer.copy(paddedKey);
            keyBuffer = paddedKey;
        } else if (keyBuffer.length > 32) {
            keyBuffer = keyBuffer.slice(0, 32);
        }

        console.log('Key length:', keyBuffer.length, 'IV length:', iv.length);

        const decipher = crypto.createDecipheriv('aes-256-cbc', keyBuffer, iv);
        decipher.setAutoPadding(true);

        let decrypted = decipher.update(encryptedData, 'base64', 'utf8');
        decrypted += decipher.final('utf8');

        return decrypted;
    } catch (error) {
        console.error('Decryption error:', error.message);
        console.error('Encrypted data that failed:', encryptedData);
        return null;
    }
}

// 1. Login
async function getPayBiToken() {
    try {
        const data = new FormData();
        data.append('llave', PAYBI_LLAVE);
        data.append('usuario', PAYBI_USER);
        data.append('clave', PAYBI_PASSWORD);

        const response = await axios.post(`${PAYBI_API_URL}/login`, data, getFormDataConfig(data));

        if (response.data.result === 'success') {
            return response.data.data.token;
        } else {
            throw new Error(response.data.message || 'Login failed');
        }
    } catch (error) {
        console.error('Error getting Pay Bi token:', error.response ? error.response.data : error.message);
        throw error;
    }
}

// 2. Get Networks (Redes)
async function getNetworks(token) {
    try {
        const data = new FormData();
        data.append('llave', PAYBI_LLAVE);
        data.append('token', token);

        const response = await axios.post(`${PAYBI_API_URL}/network/all`, data, getFormDataConfig(data));
        console.log('Networks response:', JSON.stringify(response.data, null, 2));

        if (response.data.result === 'success' && response.data.data.length > 0) {
            // Find the network named "API" or "Botón de Pago"
            const apiNetwork = response.data.data.find(n => n.nombre === 'API');
            if (apiNetwork) return apiNetwork.codigo;

            // Fallback to the first one
            return response.data.data[0].codigo;
        } else {
            console.warn('No networks found or error:', response.data);
            return null;
        }
    } catch (error) {
        console.error('Error getting networks:', error.response ? error.response.data : error.message);
        return null;
    }
}

// 3. Create Link
app.post('/api/create-payment', async (req, res) => {
    const { amount } = req.body;

    if (!amount) {
        return res.status(400).json({ error: 'Amount is required' });
    }

    try {
        // Step 1: Login
        const token = await getPayBiToken();
        console.log('Token obtained');

        // Step 2: Get Network ID
        const networkId = await getNetworks(token);
        console.log('Network ID:', networkId);

        if (!networkId) {
            return res.status(500).json({ error: 'No payment network available' });
        }

        // Step 3: Create Link
        const uniqueId = getNextLinkId(); // Iterative unique ID
        const data = new FormData();
        data.append('llave', PAYBI_LLAVE);
        data.append('token', token);
        data.append('nombre_interno', `Donación ${uniqueId}`);
        data.append('codigo_interno', uniqueId);
        data.append('titulo', `Donación a Futuro - Q${amount}`);
        data.append('descripcion', `Gracias por su donación de Q${amount}`);
        data.append('monto', amount.toString());
        data.append('estado', '1');
        data.append('cuotas', 'VC00');
        data.append('redes_sociales', networkId);
        data.append('zigi', '0'); // Disable Zigi for now to be safe
        // data.append('titulo_zigi', 'Pago');

        const response = await axios.post(`${PAYBI_API_URL}/link/maintenance`, data, getFormDataConfig(data));

        console.log('Link creation response:', response.data);

        if (response.data.result === 'success') {
            // The response structure for success usually contains the link.
            // Based on docs: "Devuelve un link de pago por cada una de las redes..."
            // Let's inspect the data. It might be in response.data.data[0].link or similar.
            // We will return the whole data to the frontend to inspect or handle.

            // Assuming the first link is what we want.
            // We need to find the URL in the response.
            // If we can't parse it blindly, we send the raw response and let frontend log it (or we log it here).

            // Let's try to find a URL in the response data
            const responseData = response.data.data;
            let paymentUrl = null;

            if (Array.isArray(responseData)) {
                paymentUrl = responseData[0].url || responseData[0].link;
            } else if (responseData) {
                paymentUrl = responseData.url || responseData.link;
            }

            if (paymentUrl) {
                res.json({ link: paymentUrl });
            } else {
                console.error('Link not found in response:', response.data);
                res.status(500).json({ error: 'Link generated but URL not found', raw: response.data });
            }

        } else {
            res.status(500).json({ error: 'Failed to create payment link', message: response.data.message });
        }

    } catch (error) {
        console.error('Error creating payment link:', error.message);
        res.status(500).json({ error: 'Failed to create payment link', details: error.message });
    }
});

// Serve index.html for the root route
app.get('/', (req, res) => {
    res.json({ message: 'Pay Bi API Backend', status: 'running' });
});

// Handle payment result redirection
app.post('/payment-result', (req, res) => {
    console.log('Payment result received:', req.body);

    try {
        // Pay Bi sends encrypted data via POST
        const {
            token,
            reference,
            audit,
            code,
            amount,
            authorization,
            link_code,
            link_name,
            link_token
        } = req.body;

        // Decrypt the response
        const decryptedData = {
            token: token, // Token is not encrypted
            reference: decryptPayBiData(reference),
            audit: decryptPayBiData(audit),
            code: code, // Code is not encrypted (plain "00" for success)
            amount: decryptPayBiData(amount),
            authorization: decryptPayBiData(authorization),
            link_code: decryptPayBiData(link_code),
            link_name: decryptPayBiData(link_name),
            link_token: decryptPayBiData(link_token)
        };

        console.log('Decrypted payment data:', decryptedData);

        // Check if payment was successful
        // Code "00" means success
        if (code === '00') {
            // Build URL with decrypted data for thank you page
            const params = new URLSearchParams({
                amount: decryptedData.amount || '',
                reference: decryptedData.reference || '',
                authorization: decryptedData.authorization || '',
                audit: decryptedData.audit || '',
                link_code: decryptedData.link_code || ''
            });
            res.redirect(`${FRONTEND_URL}/thank-you?${params.toString()}`);
        } else {
            // Redirect to error page with transaction details
            const params = new URLSearchParams({
                error: 'payment_failed',
                code: code || '',
                amount: decryptedData.amount || '',
                reference: decryptedData.reference || '',
                audit: decryptedData.audit || ''
            });
            res.redirect(`${FRONTEND_URL}/?${params.toString()}`);
        }
    } catch (error) {
        console.error('Error processing payment result:', error);
        res.redirect(`${FRONTEND_URL}/?error=system_error`);
    }
});

// Also handle GET for manual testing
app.get('/payment-result', (req, res) => {
    res.json({ message: 'Payment result endpoint - use POST' });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
