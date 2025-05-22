const db = require('../database/connection'); 

module.exports = {
    async listarReservas(request, response) {

            const sql = `
            SELECT res_id, obj_id, usu_id, res_data,
            res_status 
            FROM reservas;
            `;

        const [rows] = await db.query(sql);
        
        try {
            return response.status(200).json({
                sucesso: true, 
                mensagem: 'Lista de reservas', 
                itens: rows.length,
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
    async cadastrarReservas(request, response) {
        try {

            const {obj_id, usu_id, res_data, res_status} = request.body;

            const sql = `
            INSERT INTO reservas
             (obj_id, usu_id, res_data, res_status) 
            VALUES 
                (?,?,?,?)
            `;

            const values = [obj_id, usu_id, res_data, res_status];

            const [result] = await db.query(sql, values);

            const dados = {
                res_id: result.insertId,
                obj_id,
                usu_id,
                res_data,
                res_status
            }

            return response.status(200).json({
                sucesso: true, 
                mensagem: 'Cadastro de reservas', 
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
    async editarReservas(request, response) {
        try {

            const {obj_id, usu_id, res_data, res_status} = request.body;

            const {res_id} = request.params;

            const sql = `
            UPDATE reservas SET
                obj_id = ?, usu_id = ?, res_data = ?, res_status = ?
            WHERE
                res_id = ?;
            `;

            const values = [obj_id, usu_id, res_data, res_status, res_id];
            
            const [result] = await db.query(sql, values);

            if (result.affectedRows === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: `Reserva ${res_id} não encontrado!`,
                    dados:null
                });
            }

            const dados = {
                res_id,
                obj_id,
                usu_id,
                res_status
            };

            return response.status(200).json({
                sucesso: true, 
                mensagem: `Reserva ${res_id} atualizado com sucesso!`, 
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
    async apagarReservas(request, response) {
        try {

            const {res_id} = request.params;

            const sql = `DELETE FROM reservas WHERE res_id = ?`;

            const values = [res_id];

            const [result] = await db.query (sql, values);

            if (result.affectedRows === 0){
                return response.status (404).json ({
                    sucesso:false,
                    mensagem:`Reserva ${res_id} não encontrado!`,
                    dados: null
                });
            }

            return response.status(200).json({
                sucesso: true, 
                mensagem: `Reserva ${res_id} excluído com sucesso`, 
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
};  