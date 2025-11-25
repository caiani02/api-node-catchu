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
      const { usu_nome, usu_email, usu_senha } = request.body;
      console.log('[POST /usuarios] body:', request.body);

      // Validações básicas
      if (!usu_nome || !usu_nome.trim()) {
        return response.status(400).json({ sucesso: false, mensagem: 'Campo usu_nome é obrigatório.', dados: null });
      }
      if (!usu_email || !usu_email.trim()) {
        return response.status(400).json({ sucesso: false, mensagem: 'Campo usu_email é obrigatório.', dados: null });
      }
      if (!usu_senha) {
        return response.status(400).json({ sucesso: false, mensagem: 'Campo usu_senha é obrigatório.', dados: null });
      }

      // Verifica se email já existe
      const [existing] = await db.query('SELECT usu_id FROM usuarios WHERE usu_email = ?', [usu_email]);
      if (existing && existing.length > 0) {
        return response.status(409).json({ sucesso: false, mensagem: 'E-mail já cadastrado.', dados: null });
      }

      // se não for informado, define um tipo padrão
      const usu_tipo = request.body.usu_tipo || 2;

      // NOVO INSERT — sem usu_data_cadastro
      const sql = `
        INSERT INTO usuarios
          (usu_nome, usu_email, usu_senha, usu_tipo)
        VALUES
          (?,?,?,?);
      `;

      const values = [usu_nome, usu_email, usu_senha, usu_tipo];

      const [result] = await db.query(sql, values);

      // Pega usuário recém-criado
      const [newRows] = await db.query(
        'SELECT usu_id, usu_nome, usu_email, usu_tipo, usu_data_cadastro FROM usuarios WHERE usu_id = ?',
        [result.insertId]
      );

      const dados = newRows && newRows[0] ? newRows[0] : null;

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
      const { usu_nome, usu_email, usu_senha } = request.body;
      const { usu_id } = request.params;

      const sql = `
        UPDATE usuarios SET
          usu_nome = ?, usu_email = ?, usu_senha = ?
        WHERE
          usu_id = ?;
      `;

      const values = [usu_nome, usu_email, usu_senha, usu_id];

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
        usu_email
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

  async editarSenha(request, response) {
  try {
    const { usu_id } = request.params;
    const { senha_antiga, nova_senha } = request.body;

    // 1. Buscar usuário
    const [user] = await db.query("SELECT usu_senha FROM usuarios WHERE usu_id = ?", [usu_id]);

    if (user.length === 0) {
      return response.status(404).json({
        sucesso: false,
        mensagem: "Usuário não encontrado."
      });
    }

    // 2. Validar se a senha antiga confere
    if (user[0].usu_senha !== senha_antiga) {
      return response.status(400).json({
        sucesso: false,
        mensagem: "Senha antiga incorreta."
      });
    }

    // 3. Atualizar senha
    await db.query("UPDATE usuarios SET usu_senha = ? WHERE usu_id = ?", [nova_senha, usu_id]);

    return response.status(200).json({
      sucesso: true,
      mensagem: "Senha atualizada com sucesso!"
    });

  } catch (error) {
    return response.status(500).json({
      sucesso: false,
      mensagem: "Erro no servidor.",
      dados: error.message
    });
  }
},


 async apagarUsuarios(request, response) {
  try {
    const { usu_id } = request.params;
    console.log("Tentando excluir usuário ID:", usu_id);

    // Use transaction to remove dependent records safely
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // 1) Remover reservas relacionadas a objetos deste usuário
      await connection.query(
        'DELETE r FROM Reservas r JOIN Objetos o ON r.obj_id = o.obj_id WHERE o.usu_id = ?',
        [usu_id]
      );

      // 2) Remover reservas feitas pelo próprio usuário
      await connection.query('DELETE FROM Reservas WHERE usu_id = ?', [usu_id]);

      // 3) Remover feedbacks do usuário
      await connection.query('DELETE FROM Feedbacks WHERE usu_id = ?', [usu_id]);

      // 4) Remover objetos deste usuário
      await connection.query('DELETE FROM Objetos WHERE usu_id = ?', [usu_id]);

      // 5) Finalmente remover o usuário
      const [result] = await connection.query('DELETE FROM usuarios WHERE usu_id = ?', [usu_id]);

      if (result.affectedRows === 0) {
        await connection.rollback();
        connection.release();
        return response.status(404).json({ sucesso: false, mensagem: `Usuário ${usu_id} não encontrado!` });
      }

      await connection.commit();
      connection.release();

      return response.status(200).json({ sucesso: true, mensagem: `Usuário ${usu_id} excluído com sucesso!`, dados: null });
    } catch (txErr) {
      await connection.rollback();
      connection.release();
      console.error('Erro ao excluir usuário (transaction):', txErr);
      return response.status(500).json({ sucesso: false, mensagem: 'Erro ao excluir usuário.', dados: txErr.message });
    }

  } catch (error) {
    console.log("ERRO REAL:", error);
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
        usu_id, usu_nome, usu_tipo, usu_email, usu_senha
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
