const db = require('../database/connection'); 
const { gerarUrl } = require('../utils/gerarUrl');
const objetos = require('./objetos');

module.exports = {
async listarCategorias(request, response) {
    try {

        const sql = `
            SELECT 
                categ_id, 
                categ_nome, 
                categ_icone
            FROM categorias;
        `;

        const [rows] = await db.query(sql);
        const nItens = rows.length;

        const dados = rows.map(categoria => ({
            ...categoria,
            categ_icone: gerarUrl(categoria.categ_icone, 'categorias', 'sem.jpg')
        }));

        return response.status(200).json({
            sucesso: true,
            mensagem: 'Lista de Categorias',
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
    async cadastrarCategorias(request, response) {
        try {

            const { categ_nome, categ_icone} = request.body;

            const sql = `
                INSERT INTO categorias 
                    ( categ_nome, categ_icone) 
                VALUES
                (?,?);
            `;

            const values = [ categ_nome, categ_icone];

            const [result] = await db.query(sql, values);

            const dados = {
                categ_id: result.insertId,
                categ_nome, 
                categ_icone,
            };
           
            return response.status(200).json({
                sucesso: true, 
                mensagem: 'Cadastro de Categorias', 
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
    async editarCategorias(request, response) {
        try {

            const {categ_nome, categ_icone} = request.body;
            const {categ_id} = request.params;
            const sql = `
                 UPDATE categorias SET
                    categ_nome=? , categ_icone=? 
                WHERE
                categ_id= ?;
            `;

            const values= [ categ_nome, categ_icone, categ_id];

            const [result] = await db.query(sql, values);

            if (result.affectedRows === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: `Categorias ${categ_id} não encontrado`,
                    dados: null
                });    
            }
            const dados = {
                categ_id,
                categ_nome, 
                categ_icone
            };
            return response.status(200).json({
                sucesso: true, 
                mensagem: `Categoria ${categ_id} atualizado com sucesso!`, 
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
    async apagarCategorias(request, response) {
        try {

            const {categ_id} = request.params;

            const sql= `DELETE FROM categorias WHERE categ_id=?`;

            const values = [categ_id];

            const [result] = await db.query(sql, values);

            if (result.affectedRows ===0) {
                return response.status(404). json({
                    sucesso: false,
                    mensagem: `Categoria ${categ_id} não encontrado`,
                    dados: null
                });
            }
            return response.status(200).json({
                sucesso: true, 
                mensagem: `Categoria ${categ_id} excluido com sucesso`, 
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