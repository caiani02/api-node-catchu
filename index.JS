require('dotenv').config();
const express = require('express');
const cors = require('cors');
const router = require('./src/routes/routes');

const app = express();

// Middleware de logs
app.use((req, res, next) => {
    console.log(`📡 ${req.method} ${req.url}`);
    next();
});

// Configuração do CORS
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Accept'],
    credentials: true
}));

// Middlewares padrão
app.use(express.json());
app.use(router);
app.use('/public', express.static('public'));

// Middleware para rotas não encontradas
app.use((req, res) => {
    res.status(404).json({
        sucesso: false,
        mensagem: 'Rota não encontrada'
    });
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
    console.error('❌ Erro:', err);
    res.status(500).json({
        sucesso: false,
        mensagem: 'Erro interno do servidor',
        erro: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Tratamento de erros não capturados
process.on('uncaughtException', (err) => {
    console.error('❌ Erro não capturado:', err);
});

process.on('unhandledRejection', (err) => {
    console.error('❌ Promise rejeitada não tratada:', err);
});

const porta = process.env.PORT || 3333;

// Inicia o servidor
app.listen(porta, () => {
    console.log('🚀 Servidor iniciado em:', `http://localhost:${porta}`);
    console.log('📝 Modo:', process.env.NODE_ENV || 'development');
});