require('dotenv').config();

const express = require('express'); 
const cors = require('cors');
const router = require('./src/routes/routes'); 

const app = express(); 

// Configuração do CORS mais específica
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Accept'],
  credentials: true
})); 

app.use(express.json()); 
app.use(router);
app.use('/public', express.static('public'));

const porta = process.env.PORT || 3333;

app.listen(porta, () => {
    console.log(`Servidor iniciado em http://localhost:${porta}`);
});