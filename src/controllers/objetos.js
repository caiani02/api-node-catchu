const db = require('../database/connection');
const { gerarUrl } = require('../utils/gerarUrl');
const path = require('path');

module.exports = {
    async listarObjetos(request, response) {
        const {
            obj_id,
            obj_descricao,
            obj_local_encontrado,
            obj_encontrado,
            obj_status, 
            categ_nome, 
            page = 1,
            limit = 5
        } = request.query; 

        const offset = (parseInt(page) - 1) * parseInt(limit);

        try {
            // 🔹 Base SQL com aliases (nomes de campos tratados)
            // let sql = `
            //     SELECT 
            //         obj_id AS id,
            //         categ_id AS categoria_id,
            //         usu_id AS usuario_id,
            //         obj_descricao AS descricao,
            //         obj_foto AS foto,
            //         obj_local_encontrado AS local_encontrado,
            //         DATE_FORMAT(obj_data_publicacao, '%d/%m/%Y') AS data_publicacao,
            //         obj_status AS status,
            //         obj_encontrado = 1 AS encontrado
            //     FROM objetos
            //     WHERE 1=1
            // `;
                        let sql = `
                SELECT 
                    o.obj_id,
                    o.categ_id,
                    o.usu_id,
                    o.obj_descricao,
                    o.obj_foto,
                    o.obj_local_encontrado, 
                    c.categ_nome, 
                    DATE_FORMAT(o.obj_data_publicacao, '%d/%m/%Y') AS obj_data_publicacao,
                    o.obj_status,
                    o.obj_encontrado = 1 AS obj_encontrado
                FROM objetos o 
                INNER JOIN categorias c ON c.categ_id = o.categ_id  
                WHERE 1=1
            `;

            const params = [];

            // 🔹 Pesquisa com múltiplos parâmetros
            if (obj_id) {
                sql += ' AND o.obj_id = ?';
                params.push(obj_id);
            }

            if (obj_descricao) {
                sql += ' AND o.obj_descricao LIKE ?';
                params.push(`%${obj_descricao}%`);
            }

            if (obj_local_encontrado) {
                sql += ' AND o.obj_local_encontrado LIKE ?';
                params.push(`%${obj_local_encontrado}%`);
            }

            if (obj_status) {
                sql += ' AND o.obj_status = ?';
                params.push(obj_status);
            }

            if (obj_encontrado) {
                sql += ' AND o.obj_encontrado = ?';
                params.push(obj_encontrado);
            }

            if (categ_nome) {
                sql += ' AND c.categ_nome = ?';
                params.push(categ_nome);
            }

            // 🔹 Paginação
            //sql += ' LIMIT ?, ?';
            //params.push(offset, parseInt(limit));

            // 🔹 Execução da query
            const [rows] = await db.query(sql, params);
            const nItens = rows.length;


            const dados = rows.map(objetos => ({

                ...objetos,
                foto: gerarUrl(objetos.obj_foto, 'Objetos', 'sem.png')

            }));


            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de objetos retornada com sucesso!',
                nItens,
                dados,
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

            const { categ_id, usu_id, obj_descricao, obj_local_encontrado, obj_data_publicacao, obj_status } = request.body;
            const obj_encontrado = 0;
            const imagem = request.file;

            const sql = `
                INSERT INTO objetos
                    (categ_id, usu_id, obj_descricao, obj_foto, obj_local_encontrado, obj_data_publicacao, obj_status, obj_encontrado)
                VALUES
                    (?,?,?,?,?,?,?,?)
            `;

            // Armazena apenas o nome do arquivo no banco (ex: 'celular1.png')
            const filename = imagem ? imagem.filename : null;
            const values = [categ_id, usu_id, obj_descricao, filename, obj_local_encontrado, obj_data_publicacao, obj_status, obj_encontrado]
            const [result] = await db.query(sql, values)
            // Retorna a URL completa da imagem em vez do objeto do multer
            const dados = {
                obj_id: result.insertId,
                categ_id,
                usu_id,
                obj_descricao,
                // gera uma URL pública mesmo que o arquivo não exista (usa padrão sem.png)
                foto: gerarUrl(filename, 'Objetos', 'sem.png'),
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

            // Normaliza obj_foto: se for uma URL, extrai apenas o basename (nome.png)
            const fotoNome = obj_foto ? path.basename(obj_foto) : obj_foto;
            const values = [categ_id, usu_id, obj_descricao, fotoNome, obj_local_encontrado, obj_data_publicacao, obj_status, obj_encontrado, obj_id];
            const [result] = await db.query(sql, values);

            if (result.affectedRows === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: `Obejto ${obj_id} não encontrado`,
                    dados: null
                });
            }

            const dados = {
                obj_id,
                categ_id,
                usu_id,
                obj_descricao,
                // garante que o frontend receba a URL completa da imagem (usa o nome normalizado)
                foto: gerarUrl(fotoNome, 'Objetos', 'sem.png'),
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

        // 🔥 1) Apagar reservas associadas
        const sqlReservas = `DELETE FROM reservas WHERE obj_id = ?`;
        await db.query(sqlReservas, [obj_id]);

        // 🔥 2) Agora sim apagar o objeto
        const sqlObjeto = `DELETE FROM objetos WHERE obj_id = ?`;
        const [result] = await db.query(sqlObjeto, [obj_id]);

        if (result.affectedRows === 0) {
            return response.status(404).json({
                sucesso: false,
                mensagem: `Objeto ${obj_id} não encontrado!`
            });
        }

        return response.status(200).json({
            sucesso: true,
            mensagem: "Objeto apagado com sucesso!"
        });

    } catch (error) {
        console.error("🔥 ERRO AO APAGAR OBJETO:", error);
        return response.status(500).json({
            sucesso: false,
            mensagem: "Erro na requisição.",
            dados: error.message
        });
    }
}}