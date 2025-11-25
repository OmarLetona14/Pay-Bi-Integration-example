const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// 1. Ruta para servir la interfaz visual (HTML)
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Tester API Pay Bi</title>
        <style>
            body { font-family: sans-serif; max-width: 800px; margin: 2rem auto; padding: 0 1rem; background: #f4f4f9; }
            .container { background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            h2 { color: #0056b3; border-bottom: 2px solid #eee; padding-bottom: 10px; }
            .form-group { margin-bottom: 15px; }
            label { display: block; margin-bottom: 5px; font-weight: bold; }
            input, select, textarea { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; }
            textarea { height: 150px; font-family: monospace; }
            button { background: #0056b3; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; font-size: 16px; }
            button:hover { background: #004494; }
            #response { background: #2d2d2d; color: #50fa7b; padding: 15px; border-radius: 4px; overflow-x: auto; margin-top: 20px; white-space: pre-wrap; display: none; }
            .note { font-size: 0.85em; color: #666; margin-top: 5px; }
        </style>
    </head>
    <body>
        <div class="container">
            <h2>🧪 Tester de Integración Pay Bi</h2>
            
            <div class="form-group">
                <label>Usuario (API User)</label>
                <input type="text" id="username" placeholder="Ej: tu_usuario_api">
            </div>
            <div class="form-group">
                <label>Contraseña (API Password)</label>
                <input type="password" id="password" placeholder="Ej: tu_contraseña_api">
            </div>

            <hr>

            <div class="form-group">
                <label>Método HTTP</label>
                <select id="method">
                    <option value="GET">GET (Consultas)</option>
                    <option value="POST" selected>POST (Transacciones/Tokens)</option>
                    <option value="PUT">PUT</option>
                </select>
            </div>
            
            <div class="form-group">
                <label>Endpoint URL (Completa)</label>
                <input type="text" id="url" placeholder="https://app.ebi.com.gt/api/..." value="https://faq.ebi.com.gt/api/endpoint-de-prueba">
                <p class="note">Revisa la documentación para obtener la URL exacta del entorno de pruebas o producción.</p>
            </div>

            <div class="form-group">
                <label>Cuerpo del JSON (Body)</label>
                <textarea id="body" placeholder='{ "monto": 100, "moneda": "GTQ" }'></textarea>
            </div>

            <button onclick="sendRequest()">Enviar Petición</button>

            <h3>Respuesta del Servidor:</h3>
            <pre id="response">Esperando petición...</pre>
        </div>

        <script>
            async function sendRequest() {
                const username = document.getElementById('username').value;
                const password = document.getElementById('password').value;
                const url = document.getElementById('url').value;
                const method = document.getElementById('method').value;
                let bodyData = document.getElementById('body').value;

                const responseEl = document.getElementById('response');
                responseEl.style.display = 'block';
                responseEl.textContent = 'Cargando...';

                // Validación básica de JSON
                let parsedBody = {};
                if (method !== 'GET' && bodyData.trim() !== '') {
                    try {
                        parsedBody = JSON.parse(bodyData);
                    } catch (e) {
                        responseEl.textContent = 'Error: El cuerpo de la petición no es un JSON válido.';
                        return;
                    }
                }

                try {
                    // Llamada a nuestro propio servidor Node (Proxy)
                    const res = await fetch('/api/proxy', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            targetUrl: url,
                            method: method,
                            username: username,
                            password: password,
                            data: parsedBody
                        })
                    });

                    const data = await res.json();
                    responseEl.textContent = JSON.stringify(data, null, 2);
                } catch (error) {
                    responseEl.textContent = 'Error de conexión con el servidor local.';
                }
            }
        </script>
    </body>
    </html>
    `);
});

// 2. Endpoint Proxy: Recibe tus datos y hace la llamada real a Pay Bi
app.post('/api/proxy', async (req, res) => {
    const { targetUrl, method, username, password, data } = req.body;

    if (!targetUrl || !username || !password) {
        return res.status(400).json({ error: "Faltan datos (URL, Usuario o Contraseña)" });
    }

    try {
        // Configuración de la llamada a Pay Bi
        const axiosConfig = {
            method: method,
            url: targetUrl,
            // Autenticación Basic Auth (Estándar en muchas APIs bancarias)
            auth: {
                username: username,
                password: password
            },
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            data: (method === 'GET') ? undefined : data
        };

        console.log(`📡 Conectando a: ${targetUrl} con método ${method}`);

        // Ejecutar la llamada real
        const response = await axios(axiosConfig);

        // Devolver la respuesta de Pay Bi al frontend
        res.json({
            status: response.status,
            statusText: response.statusText,
            data: response.data
        });

    } catch (error) {
        console.error("❌ Error en la petición:", error.message);
        // Manejo de errores detallado
        if (error.response) {
            // El servidor respondió con un código de estado fuera del rango 2xx
            res.status(error.response.status).json({
                error: true,
                status: error.response.status,
                message: error.response.statusText,
                details: error.response.data
            });
        } else {
            // Error de red o configuración
            res.status(500).json({ error: error.message });
        }
    }
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log("`✅ Servidor de pruebas corriendo en http://localhost:\${PORT}\`");
});