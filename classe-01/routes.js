const express = require('express');
const { listarPokemons, obterPokemon, cadastrarPokemon, atualizarPokemon, deletarPokemon } = require('./controllers/pokemons');
const { cadastrarUsuario, loginUsuario } = require('./controllers/usuarios');

const routes = express();

//usuarios
routes.post('/usuario/cadastrar', cadastrarUsuario);
routes.post('/usuario/login', loginUsuario);

//pokemons
routes.get('/pokemon', listarPokemons);
routes.get('/pokemon/:id', obterPokemon);
routes.post('/pokemon', cadastrarPokemon);
routes.put('/pokemon/:id', atualizarPokemon);
routes.delete('/pokemon/:id', deletarPokemon);

module.exports = routes;