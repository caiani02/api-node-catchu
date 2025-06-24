const db = require('../database/connection');

module.exports = {
    async listarUsuarios(request, response) {
        try {
            const sql = `
                SELECT 
                usu_id, usu_nome, usu_email, usu_senha, usu_data_cadastro 
                FROM usuarios;
        `;

            const [rows] = await db.query(sql);


            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de usuários',
                itens: rows.lenght,
                dados: rows
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });
        }
    },
    async cadastrarUsuarios(request, response) {
        try {


            const { usu_nome, usu_email, usu_senha, usu_data_cadastro } = request.body;

            const sql = `
            INSERT INTO usuarios
             (usu_nome, usu_email, usu_senha, usu_data_cadastro) 
            VALUES
            (?,?,?,?);
            `;

            const values = [usu_nome, usu_email, usu_senha, usu_data_cadastro];

            const [result] = await db.query(sql, values);

            const dados = {
                usu_id: result.insertId,
                usu_nome,
                usu_email,
                usu_senha,
                usu_data_cadastro
            };

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Cadastro de usuários',
                dados: dados
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });
        }
    },
    async editarUsuarios(request, response) {
        try {
            const { usu_nome, usu_email, usu_senha, usu_data_cadastro } = request.body;

            const { usu_id } = request.params;

            const sql = `
            UPDATE usuarios SET
                usu_nome = ?, usu_email = ?, usu_senha = ?, usu_data_cadastro = ?
            WHERE
                usu_id = ?;
                `;

            const values = [usu_nome, usu_email, usu_senha, usu_data_cadastro, usu_id];

            const [result] = await db.query(sql, values);

            if (result.affectedRows === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: `Usuario ${usu_id} nao encontrado!`,
                    dados: null
                });
            }

            const dados = {
                usu_id,
                usu_nome,
                usu_email,
                usu_data_cadastro
            };

            return response.status(200).json({
                sucesso: true,
                mensagem: `Usuario ${usu_id} atualizado com sucesso!`,
                dados
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });
        }
    },
    async apagarUsuarios(request, response) {
        try {
            // parÂrametro passado via url na chamada da api pelo front-end
            const { usu_id } = request.params;
            // comando de exclusão 
            const sql = 'DELETE FROM usuarios WHERE usu_id = ?';
            // array com parÂrametros da exclusão
            const values = [usu_id];
            // executa instrução no banco de dados
            const [result] = await db.query(sql, values);

            if (result.affectedRows === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: `Usuário ${usu_id} não encontrado!`,
                });
            }

            return response.status(200).json({
                sucesso: true,
                mensagem: `Usuário ${usu_id} excluido com sucesso!`,
                dados: null
            });

        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });
        }
    },
}