require('dotenv').config();
const mysql = require('mysql2/promise');

// Configuração da conexão
const config = {
    host: process.env.BD_SERVIDOR,
    port: process.env.BD_PORTA || 3306,
    user: process.env.BD_USUARIO,
    password: process.env.BD_SENHA,
    database: process.env.BD_BANCO,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 60000,        // 60 segundos
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
};

// Pool de conexões
let pool;

// Função para testar a conexão
const testConnection = async (connection) => {
    try {
        await connection.query('SELECT 1');
        return true;
    } catch (error) {
        return false;
    }
};

// Função principal de inicialização do banco
const initializeDatabase = async (retries = 5) => {
    try {
        console.log('\n🔄 Tentando conectar ao banco de dados...');
        console.log(`📍 Servidor: ${process.env.BD_SERVIDOR}`);
        console.log(`🚪 Porta: ${process.env.BD_PORTA}`);
        
        pool = mysql.createPool(config);
        
        const connection = await pool.getConnection();
        
        if (await testConnection(connection)) {
            console.log('✅ Conexão MySQL estabelecida com sucesso!');
            connection.release();
            return pool;
        }
        
        throw new Error('Falha no teste de conexão');
        
    } catch (error) {
        console.error(`\n❌ Erro ao conectar ao banco de dados: ${error.message}`);
        
        if (error.code === 'ETIMEDOUT') {
            console.error('\n⚠️ Verifique:');
            console.error('1. Se o IP do servidor está correto');
            console.error('2. Se você está na mesma rede/VPN');
            console.error('3. Se o firewall não está bloqueando');
            console.error('4. Se o servidor MySQL está online\n');
        }
        
        if (retries > 0) {
            console.log(`\n🔄 Tentando reconectar... (${retries} tentativas restantes)`);
            await new Promise(resolve => setTimeout(resolve, 5000));
            return initializeDatabase(retries - 1);
        }
        
        console.error('\n❌ Não foi possível estabelecer conexão após várias tentativas');
        process.exit(1);
    }
};

// Tratamento de encerramento
process.on('SIGINT', async () => {
    if (pool) {
        await pool.end();
        console.log('\n📝 Conexões com o banco encerradas');
    }
    process.exit();
});

// Inicia a conexão
initializeDatabase();

module.exports = pool;