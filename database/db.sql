CREATE DATABASE db_bingo;

USE db_bingo;

--tabla de usuarios para acceder al sistema
CREATE TABLE usuarios(
    id INT PRIMARY KEY AUTO_INCREMENT, 
    username VARCHAR(50) NOT NULL UNIQUE, 
    password VARCHAR(255) NOT NULL,
    nombre VARCHAR(100) NOT NULL
);

--tabla de partidas
CREATE TABLE partidas(
    id INT PRIMARY KEY AUTO_INCREMENT,
    estado ENUM('esperando','activo', 'finalizado') NOT NULL,
    ganador_id INT,
    balotasLanzadas JSON NOT NULL DEFAULT '[]',
    FOREIGN KEY (ganador_id) REFERENCES usuarios(id)
);

--tabla de tarjetones
CREATE TABLE tarjetas(
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    partida_id INT NOT NULL,
    numeros JSON NOT NULL,
    estado ENUM('activo', 'descalificado', 'completado') NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);
