CREATE DATABASE IF NOT EXISTS achados_perdidos;
USE achados_perdidos;

-- Tabela de Usuarios
CREATE TABLE Usuarios (
    usu_id INT AUTO_INCREMENT PRIMARY KEY,
    usu_nome VARCHAR(80) NOT NULL,
    usu_email VARCHAR(50) UNIQUE NOT NULL,
    usu_senha VARCHAR(8) NOT NULL,
    usu_data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Categorias
CREATE TABLE Categorias (
    categ_id INT AUTO_INCREMENT PRIMARY KEY,
    categ_nome VARCHAR(80) NOT NULL,
    categ_icone VARCHAR(80) NOT NULL
);

-- Tabela de Objetos
CREATE TABLE Objetos (
    obj_id INT AUTO_INCREMENT PRIMARY KEY,
    categ_id INT NOT NULL,
    usu_id INT NOT NULL,
    obj_descricao TINYTEXT NOT NULL,
    obj_foto VARCHAR(255),
    obj_local_encontrado VARCHAR(100) NOT NULL,
    obj_data_publicacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    obj_status ENUM('Achado', 'Reservado', 'Perdido') NOT NULL,
    obj_encontrado BIT NOT NULL DEFAULT 0,
    FOREIGN KEY (categ_id) REFERENCES Categorias(categ_id),
    FOREIGN KEY (usu_id) REFERENCES Usuarios(usu_id)
);

-- Tabela de Reservas
CREATE TABLE Reservas (
    res_id INT AUTO_INCREMENT PRIMARY KEY,
    obj_id INT NOT NULL,
    usu_id INT NOT NULL,
    res_data TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    res_status ENUM('Pendente', 'Retirado') NOT NULL,
    FOREIGN KEY (obj_id) REFERENCES Objetos(obj_id),
    FOREIGN KEY (usu_id) REFERENCES Usuarios(usu_id)
);

-- Tabela de Feedbacks
CREATE TABLE Feedbacks (
    fbck_id INT AUTO_INCREMENT PRIMARY KEY,
    usu_id INT NOT NULL,
    fbck_mensagem VARCHAR(300) NOT NULL,
    fbck_data_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fbck_avaliacao INT CHECK (fbck_avaliacao BETWEEN 1 AND 5),
    FOREIGN KEY (usu_id) REFERENCES Usuarios(usu_id)
);
