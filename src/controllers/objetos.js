const db = require('../database/connection');
const { gerarUrl } = require('../utils/gerarUrl');

module.exports = {

    async listarObjetos(request, response) {
        const {
            obj_id,
            obj_descricao,
            obj_local_encontrado,
            obj_encontrado,
            obj_status,
            page = 1,
            limit = 5
        } = request.query;

        const offset = (parseInt(page) - 1) * parseInt(limit);

        try {
            let sql = `
                SELECT 
                    obj_id,
                    categ_id,
                    usu_id,
                    obj_descricao,
                    obj_foto,
                    obj_local_encontrado,
                    DATE_FORMAT(obj_data_publicacao, '%d/%m/%Y') AS obj_data_publicacao,
                    obj_status,
                    obj_encontrado
                FROM objetos
                WHERE 1=1
            `;

            const params = [];

            if (obj_id) {
                sql += ' AND obj_id = ?';
                params.push(obj_id);
            }

            if (obj_descricao) {
                sql += ' AND obj_descricao LIKE ?';
                params.push(`%${obj_descricao}%`);
            }

            if (obj_local_encontrado) {
                sql += ' AND obj_local_encontrado LIKE ?';
                params.push(`%${obj_local_encontrado}%`);
            }

            if (obj_status) {
                sql += ' AND obj_status = ?';
                params.push(obj_status);
            }

            if (obj_encontrado) {
                sql += ' AND obj_encontrado = ?';
                params.push(obj_encontrado);
            }

            sql += ' LIMIT ?, ?';
            params.push(offset, parseInt(limit));

            const [rows] = await db.query(sql, params);
            const nItens = rows.length;

            const dados = rows.map(obj => ({
                ...obj,
                foto: gerarUrl(obj.obj_foto, 'objetos', 'sem.png')
            }));

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de objetos retornada com sucesso!',
                nItens,
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

    async cadastrarObjetos(request, response) {
        try {
            const {
                categ_id,
                usu_id,
                obj_descricao,
                obj_local_encontrado,
                obj_data_publicacao,
                obj_status
            } = request.body;

            const obj_encontrado = 0;

            // AQUI funciona com multer
            const imagem = request.file;

            const filename = imagem ? imagem.filename : null;

            const sql = `
                INSERT INTO objetos
                (categ_id, usu_id, obj_descricao, obj_foto, obj_local_encontrado, obj_data_publicacao, obj_status, obj_encontrado)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;

            const values = [
                categ_id,
                usu_id,
                obj_descricao,
                filename,
                obj_local_encontrado,
                obj_data_publicacao,
                obj_status,
                obj_encontrado
            ];

            const [result] = await db.query(sql, values);

            const dados = {
                obj_id: result.insertId,
                categ_id,
                usu_id,
                obj_descricao,
                foto: gerarUrl(filename, 'objetos', 'sem.png'),
                obj_local_encontrado,
                obj_data_publicacao,
                obj_status,
                obj_encontrado
            };

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Objeto cadastrado com sucesso!',
                dados
            });

        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao cadastrar objeto',
                dados: error.message
            });
        }
    },

    async editarObjetos(request, response) {
        try {
            const {
                categ_id,
                usu_id,
                obj_descricao,
                obj_foto,
                obj_local_encontrado,
                obj_data_publicacao,
                obj_status,
                obj_encontrado
            } = request.body;

            const { obj_id } = request.params;

            const sql = `
                UPDATE objetos SET 
                    categ_id = ?, 
                    usu_id = ?, 
                    obj_descricao = ?, 
                    obj_foto = ?, 
                    obj_local_encontrado = ?, 
                    obj_data_publicacao = ?, 
                    obj_status = ?, 
                    obj_encontrado = ?
                WHERE obj_id = ?;
            `;

            const values = [
                categ_id,
                usu_id,
                obj_descricao,
                obj_foto,
                obj_local_encontrado,
                obj_data_publicacao,
                obj_status,
                obj_encontrado,
                obj_id
            ];

            const [result] = await db.query(sql, values);

            if (result.affectedRows === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: `Objeto ${obj_id} não encontrado`,
                    dados: null
                });
            }

            const dados = {
                obj_id,
                categ_id,
                usu_id,
                obj_descricao,
                foto: gerarUrl(obj_foto, 'objetos', 'sem.png'),
                obj_local_encontrado,
                obj_data_publicacao,
                obj_status,
                obj_encontrado
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

            const sql = `DELETE FROM objetos WHERE obj_id = ?`;
            const values = [obj_id];

            const [result] = await db.query(sql, values);

            if (result.affectedRows === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: `Objeto ${obj_id} não encontrado!`,
                    dados: null
                });
            }

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Objeto excluído com sucesso!',
                dados: null
            });

        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });
        }
    }
};
