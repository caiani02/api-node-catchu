const db = require("../database/connection");

module.exports = {
  async listarUsuarios(request, response) {
    try {
      const sql = `
        SELECT 
          usu_id, usu_nome, usu_email, usu_senha, usu_tipo, usu_data_cadastro 
        FROM usuarios;
      `;
      const [rows] = await db.query(sql);
      return response.status(200).json({ sucesso: true, mensagem: "Lista de usuários", itens: rows.length, dados: rows });
    } catch (error) {
      return response.status(500).json({ sucesso: false, mensagem: "Erro na requisição.", dados: error.message });
    }
  },

  async cadastrarUsuarios(request, response) {
    try {
      const { usu_nome, usu_email, usu_senha, usu_data_cadastro } = request.body;
      if (!usu_nome || !usu_email || !usu_senha) {
        return response.status(400).json({ sucesso: false, mensagem: "usu_nome, usu_email e usu_senha são obrigatórios.", dados: null });
      }

      const sql = `
        INSERT INTO usuarios (usu_nome, usu_email, usu_senha, usu_data_cadastro)
        VALUES (?,?,?,?);
      `;
      const values = [usu_nome, usu_email, usu_senha, usu_data_cadastro || new Date().toISOString()];
      const [result] = await db.query(sql, values);

      const dados = { usu_id: result.insertId, usu_nome, usu_email, usu_data_cadastro: values[3] };

      return response.status(200).json({ sucesso: true, mensagem: "Cadastro de usuários", dados });
    } catch (error) {
      return response.status(500).json({ sucesso: false, mensagem: "Erro na requisição.", dados: error.message });
    }
  },

  async editarUsuarios(request, response) {
    try {
      const { usu_nome, usu_email, usu_senha, usu_data_cadastro } = request.body;
      const { usu_id } = request.params;
      const sql = `
        UPDATE usuarios SET usu_nome = ?, usu_email = ?, usu_senha = ?, usu_data_cadastro = ?
        WHERE usu_id = ?;
      `;
      const values = [usu_nome, usu_email, usu_senha, usu_data_cadastro, usu_id];
      const [result] = await db.query(sql, values);
      if (result.affectedRows === 0) {
        return response.status(404).json({ sucesso: false, mensagem: `Usuario ${usu_id} nao encontrado!`, dados: null });
      }
      const dados = { usu_id, usu_nome, usu_email, usu_data_cadastro };
      return response.status(200).json({ sucesso: true, mensagem: `Usuario ${usu_id} atualizado com sucesso!`, dados });
    } catch (error) {
      return response.status(500).json({ sucesso: false, mensagem: "Erro na requisição.", dados: error.message });
    }
  },

  async apagarUsuarios(request, response) {
    try {
      const { usu_id } = request.params;
      const sql = "DELETE FROM usuarios WHERE usu_id = ?";
      const values = [usu_id];
      const [result] = await db.query(sql, values);
      if (result.affectedRows === 0) {
        return response.status(404).json({ sucesso: false, mensagem: `Usuário ${usu_id} não encontrado!` });
      }
      return response.status(200).json({ sucesso: true, mensagem: `Usuário ${usu_id} excluido com sucesso!`, dados: null });
    } catch (error) {
      return response.status(500).json({ sucesso: false, mensagem: "Erro na requisição.", dados: error.message });
    }
  },

  async login(request, response) {
    try {
      const { email, senha } = request.query;
      if (!email || !senha) {
        return response.status(400).json({ sucesso: false, mensagem: "Email e senha são obrigatórios", dados: null });
      }

      const sql = `
        SELECT usu_id, usu_nome, usu_tipo
        FROM usuarios
        WHERE usu_email = ? AND usu_senha = ?;
      `;
      const values = [email, senha];
      const [rows] = await db.query(sql, values);

      if (rows.length === 0) {
        return response.status(401).json({ sucesso: false, mensagem: "Email ou senha inválidos", dados: null });
      }

      // retorna objeto do usuário
      return response.status(200).json({ sucesso: true, mensagem: "Login realizado com sucesso", dados: rows[0] });
    } catch (error) {
      console.error("Erro no login:", error);
      return response.status(500).json({ sucesso: false, mensagem: "Erro interno do servidor", dados: null });
    }
  },
};