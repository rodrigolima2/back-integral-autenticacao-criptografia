const connection = require('../connection');
const jwt = require("jsonwebtoken");
const jwtSecret = require("../jwt_secret");

const listarPokemons = async (req, res) => {
    const { token } = req.body;

    if (!token) return res.status(400).json({ mensagem: 'Você deve informar o Token.' });

    try {
        const usuario = jwt.verify(token, jwtSecret);
    } catch (error) {
        return res.status(400).json({ mensagem: 'O Token fornecido é inválido.' });
    }

    try {
        const { rows: pokemons } = await connection.query(`
        select pokemons.id as id, usuarios.nome as usuario, pokemons.nome as nome, pokemons.apelido as apelido, pokemons.habilidades as habilidades, pokemons.imagem as imagem
        from pokemons
        join usuarios on usuario_id = usuarios.id
        `);

        for (pokemon of pokemons) {
            pokemon.habilidades = pokemon.habilidades.split(', ');
        }

        return res.status(200).json(pokemons);
    } catch (error) {
        return res.status(400).json(error.message);
    }
};

const obterPokemon = async (req, res) => {
    const { id } = req.params;
    const { token } = req.body;

    if (!token) return res.status(400).json({ mensagem: 'Você deve informar o Token.' });

    try {
        const usuario = jwt.verify(token, jwtSecret);
    } catch (error) {
        return res.status(400).json({ mensagem: 'O Token fornecido é inválido.' });
    }

    try {
        const { rows: pokemon, rowCount } = await connection.query(`
        select pokemons.id as id, usuarios.nome as usuario, pokemons.nome as nome, pokemons.apelido as apelido, pokemons.habilidades as habilidades, pokemons.imagem as imagem
        from pokemons
        join usuarios on usuario_id = usuarios.id
        where pokemons.id = $1
        `, [id]);

        if (rowCount === 0) return res.status(404).json({ mensagem: 'Pokemon não encontrado' });

        if (rowCount > 0) pokemon[0].habilidades = pokemon[0].habilidades.split(', ');

        return res.status(200).json(pokemon);
    } catch (error) {
        return res.status(400).json(error.message);
    }
};

const cadastrarPokemon = async (req, res) => {
    const { nome, habilidades, imagem, apelido, token } = req.body;
    const usuarioInfo = [];

    if (!token) return res.status(400).json({ mensagem: 'Você deve informar o Token.' });
    if (!nome || !habilidades) return res.status(400).json({ mensagem: 'Vocë deve informar ao menos os campos nome e habilidades' });

    try {
        const usuario = jwt.verify(token, jwtSecret);

        usuarioInfo.push(usuario);
    } catch (error) {
        return res.status(400).json({ mensagem: 'O Token fornecido é inválido.' });
    }

    try {
        const usuarioId = usuarioInfo[0].id;
        const query = `
        insert into pokemons(usuario_id, nome, habilidades, imagem, apelido)
        values
        ($1, $2, $3, $4, $5)
        `;
        const pokemon = await connection.query(query, [usuarioId, nome, habilidades, imagem, apelido]);

        if (pokemon.rowCount === 0) return res.status(400).json({ mensagem: 'Não foi possivel cadastrar o pokemon' });

        return res.status(200).json({ mensagem: 'Pokemon cadastrado com sucesso.' });
    } catch (error) {
        res.status(400).json({ mensagem: error });
    }
};

const atualizarPokemon = async (req, res) => {
    const { id } = req.params;
    const { apelido, token } = req.body;

    if (!token) return res.status(400).json({ mensagem: 'Você deve informar o Token.' });
    if (!apelido) return res.status(400).json({ mensagem: 'Vocë deve informar o novo apelido' });

    try {
        const usuario = jwt.verify(token, jwtSecret);
    } catch (error) {
        return res.status(400).json({ mensagem: 'O Token fornecido é inválido.' });
    }

    try {
        const query = 'update pokemons set apelido = $1 where id = $2';
        const pokemon = await connection.query(query, [apelido, id]);

        if (pokemon.rowCount === 0) return res.status(400).json({ mensagem: 'Não foi possivel atualizar o pokemon' });

        return res.status(200).json({ mensagem: 'Pokemon atualizado com sucesso.' });
    } catch (error) {
        res.status(400).json({ mensagem: error });
    }
};

const deletarPokemon = async (req, res) => {
    const { id } = req.params;
    const { token } = req.body;

    if (!token) return res.status(400).json({ mensagem: 'Você deve informar o Token.' });

    try {
        const usuario = jwt.verify(token, jwtSecret);
    } catch (error) {
        return res.status(400).json({ mensagem: 'O Token fornecido é inválido.' });
    }

    try {
        const query = 'delete from pokemons where id = $1';
        const pokemon = await connection.query(query, [id]);

        if (pokemon.rowCount === 0) return res.status(400).json({ mensagem: 'Não foi possivel deletar o pokemon' });

        return res.status(200).json({ mensagem: 'Pokemon deletado com sucesso.' });
    } catch (error) {
        res.status(400).json({ mensagem: error });
    }
};

module.exports = {
    listarPokemons,
    obterPokemon,
    cadastrarPokemon,
    atualizarPokemon,
    deletarPokemon
};