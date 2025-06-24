const db = require('../database/connection');

module.exports = {
    async listarFeedbacks(request, response) {
        try {
            const sql = `
                SELECT fbck_id, usu_id, fbck_mensagem, fbck_data_envio,
                fbck_avaliacao FROM feedbacks;
                `;

            const [rows] = await db.query(sql);

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Listar os Feedbacks',
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
    async cadastrarFeedbackss(request, response) {
        try {

            const { usu_id, fbck_mensagem, fbck_data_envio, fbck_avaliacao } = request.body;


            const sql = `
           INSERT INTO feedbacks ( usu_id, fbck_mensagem, 
           fbck_data_envio, fbck_avaliacao) 
           VALUES 
           (?,?,?,?);
           
           `;

            const values = [usu_id, fbck_mensagem, fbck_data_envio, fbck_avaliacao];

            const [result] = await db.query(sql, values);

            const dados = {
                fbck_id: result.insertId,
                usu_id,
                fbck_mensagem,
                fbck_data_envio,
                fbck_avaliacao

            }



            return response.status(200).json({
                sucesso: true,
                mensagem: 'Cadastro de Feedbacks',
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
    async editarFeedbacks(request, response) {
        try {
            const { usu_id, fbck_mensagem, fbck_data_envio, fbck_avaliacao } = request.body;
            const { fbck_id } = request.params;
            const sql = `
              UPDATE feedbacks SET
             fbck_mensagem = ?, 
           fbck_data_envio = ?, fbck_avaliacao = ?
           WHERE
         fbck_id = ?
           
            `;

            const values = [fbck_mensagem, fbck_data_envio, fbck_avaliacao, fbck_id];

            const [result] = await db.query(sql, values);

            if (result.affectedRows === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: `Feedbacks ${fbck_id} não encontrado!`,
                    dados: null

                });
            }

            const dados = {
                fbck_id,
                usu_id,
                fbck_mensagem,
                fbck_data_envio,
                fbck_avaliacao


            };

            return response.status(200).json({
                sucesso: true,
                mensagem: `Feedback ${fbck_id} atualizado com sucesso`,
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
    async apagarFeedbacks(request, response) {
        try {

            const { fbck_id } = request.params;

            const sql = `DELETE FROM feedbacks WHERE fbck_id=?`;

            const values = [fbck_id];

            const [result] = await db.query(sql, values);

            if (result.affectedRows === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: `Feedback ${fbck_id} não encontrado`,
                    dados: null
                });
            }
            return response.status(200).json({
                sucesso: true,
                mensagem: `Feedback032 ${fbck_id} excluido com sucesso`,
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