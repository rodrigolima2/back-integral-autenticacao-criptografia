CREATE DATABASE catalogo_pokemons;

DROP TABLE IF EXISTS usuarios;

CREATE TABLE usuarios(
  id serial PRIMARY KEY,
  nome varchar(100) NOT NULL,
  email varchar(50) UNIQUE NOT NULL,
  senha text NOT NULL
);

DROP TABLE IF EXISTS pokemons;

CREATE TABLE pokemons(
  id serial PRIMARY KEY,
  usuario_id int NOT NULL,
  nome varchar(100) NOT NULL,
  habilidades text NOT NULL,
  imagem text,
  apelido varchar(50),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);