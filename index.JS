require('dotenv').config();

const express = require('express'); 
const cors = require('cors');

const router = require('./src/routes/routes'); 

const app = express(); 
// CORS explícito para facilitar debug (permite qualquer origem em dev)
app.use(cors({ origin: '*' }));
app.use(express.json()); 

// Log simples de requisições para diagnosticar problemas vindos do navegador
app.use((req, res, next) => {
    console.log(`[REQ] ${req.method} ${req.url} - Origin: ${req.headers.origin || '-'} - Content-Type: ${req.headers['content-type'] || '-'} `);
    next();
});
app.use(router);

app.use('/public' , express.static('public'));

const porta = process.env.PORT || 3333;

app.listen(porta, () => {
    console.log(`Servidor iniciado em http://localhost:${porta}`);
});

app.get('/', (request, response) => {
    response.send('Hello World!!!');
});

// rota de diagnóstico simples para testar conectividade a partir do browser
app.get('/ping', (request, response) => {
    return response.json({ ok: true, timestamp: new Date().toISOString() });
});

