SELECT usu_id, usu_nome, usu_email, usu_senha, usu_data_cadastro FROM usuarios;
SELECT categ_id, categ_nome, categ_icone FROM categorias;
SELECT obj_id, categ_id, usu_id, obj_descricao, obj_foto, obj_local_encontrado, obj_data_publicacao, obj_status, obj_encontrado FROM objetos;
SELECT fbck_id, usu_id, fbck_mensagem, fbck_data_envio, fbck_avaliacao FROM feedbacks;
SELECT res_id, obj_id, usu_id, res_data, res_status FROM reservas;

DROP TABLE reservas;
DROP TABLE feedbacks;
DROP TABLE objetos;
DROP TABLE categorias;
DROP TABLE usuarios;


DESCRIBE usuarios;
DESCRIBE feedbacks;
DESCRIBE objetos;
DESCRIBE categorias;
DESCRIBE reservas;


