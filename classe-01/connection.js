const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'catalogo_pokemons',
    password: 'asd',
    port: 5432
});

const query = (text, param) => pool.query(text, param);

module.exports = { query };