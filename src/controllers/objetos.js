const db = require('../database/connection'); 

module.exports = {
    async listarObjetos(request, response) {
        try {


            const sql = `
              SELECT obj_id, categ_id, usu_id, obj_descricao, obj_foto, obj_local_encontrado, obj_data_publicacao, obj_status, obj_encontrado = 1 AS obj_encontrado
              FROM objetos;  
            `;


            const [rows] = await db.query(sql);

           
        
            return response.status(200).json({
                sucesso: true, 
                mensagem: 'Lista de objetos', 
                itens: rows.lenght,
                dados: rows,
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false, 
                mensagem: 'Erro na requisição.', 
                dados: error.message
            });
        }
    }, 
    async cadastrarObjetos(request, response) {
        try {

            const {categ_id, usu_id, obj_descricao, obj_foto, obj_local_encontrado, obj_data_publicacao, obj_status} = request.body;
            const obj_encontrado = 0;
             
            const sql = `
                INSERT INTO objetos
                    (categ_id, usu_id, obj_descricao, obj_foto, obj_local_encontrado, obj_data_publicacao, obj_status, obj_encontrado)
                VALUES
                    (?,?,?,?,?,?,?,?)
            `;

            const values = [categ_id, usu_id, obj_descricao, obj_foto, obj_local_encontrado, obj_data_publicacao, obj_status, obj_encontrado]
            const [result] = await db.query(sql, values)
            const dados = {
                    obj_id: result.insertId,
                    categ_id,
                    usu_id,
                    obj_descricao, 
                    obj_foto,
                    obj_local_encontrado,
                    obj_data_publicacao,
                    obj_status,
                    obj_encontrado

            };

            return response.status(200).json({
                sucesso: true, 
                mensagem: 'Cadastro de objetos', 
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


    async editarObjetos(request, response) {
        try {

            const { categ_id, usu_id, obj_descricao, obj_foto, obj_local_encontrado, obj_data_publicacao, obj_status, obj_encontrado, } = request.body
            const { obj_id } = request.params;

            const sql = `
                UPDATE objetos SET 
                    categ_id = ?, usu_id = ?, obj_descricao = ?, obj_foto = ?, obj_local_encontrado = ?, obj_data_publicacao = ?, obj_status = ?, obj_encontrado = ?
                WHERE
                    obj_id = ?;
            `;

            const values = [categ_id, usu_id, obj_descricao, obj_foto, obj_local_encontrado, obj_data_publicacao, obj_status, obj_encontrado, obj_id];
            const [result] = await db.query(sql, values);

            if (result.affectedRows === 0 ) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: `Obejto ${obj_id} não encontrado`,
                    dados: null
                });
            }

            const dados = {
                obj_id, categ_id, usu_id, obj_descricao, obj_foto, obj_local_encontrado, obj_data_publicacao, obj_status, obj_encontrado
            };

            return response.status(200).json({
                sucesso: true, 
                mensagem: `Objeto ${obj_id} atualizado com sucesso`, 
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



    async apagarObjetos(request, response) {
        try {

            const { obj_id } = request.params;
            const sql = `DELETE FROM objetos WHERE obj_id = ?`
            const values = [obj_id]
            const [result] = await db.query(sql, values);

            if (result.affectedRows === 0){
                return response.status(404).json({
                    sucesso: false,
                    mensagem: `Objetos ${obj_id} não encontrado!`,
                    dados: null
                });
            }

            return response.status(200).json({
                sucesso: true, 
                mensagem: 'Exclusão de objetos', 
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