const db = require('../database/connection');

module.exports = {
  async listarUsuarios(request, response) {
    try {
      const sql = `
        SELECT 
          usu_id, usu_nome, usu_email, usu_senha, usu_tipo, usu_data_cadastro 
        FROM usuarios;
      `;

      const [rows] = await db.query(sql);

      return response.status(200).json({
        sucesso: true,
        mensagem: 'Lista de usuários',
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
      const { usu_id } = request.params;
      const sql = 'DELETE FROM usuarios WHERE usu_id = ?';
      const values = [usu_id];
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

  async login(request, response) {
    try {
      const { email, senha } = request.query;

      const sql = `
        SELECT
          usu_id, usu_nome, usu_tipo
        FROM
          usuarios
        WHERE
          usu_email = ? AND usu_senha = ?;
      `;

      const values = [email, senha];

      const [rows] = await db.query(sql, values);
      const nItens = rows.length;

      if (nItens < 1) {
        return response.status(403).json({
          sucesso: false,
          mensagem: 'Login e/ou senha inválido.',
          dados: null,
        });
      }

      return response.status(200).json({
        sucesso: true,
        mensagem: 'Login efetuado com sucesso',
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
};