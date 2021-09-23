const connection = require('../connection');
const securePassword = require("secure-password");
const jwt = require("jsonwebtoken");
const jwtSecret = require("../jwt_secret");

const pwd = securePassword();

const cadastrarUsuario = async (req, res) => {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) return res.status(400).json({ mensagem: 'Todos os campos devem ser preenchidos' });

    try {
        const query = 'select * from usuarios where email = $1';
        const usuario = await connection.query(query, [email]);

        if (usuario.rowCount > 0) {
            return res.status(400).json("Este email já foi cadastrado.");
        }
    } catch (error) {
        return res.status(400).json(error.message);
    }

    try {
        const hash = (await pwd.hash(Buffer.from(senha))).toString("hex");
        const query = 'insert into usuarios (nome, email, senha) values ($1, $2, $3)';
        const usuario = await connection.query(query, [nome, email, hash]);

        if (usuario.rowCount === 0) {
            return res.status(400).json({ mensagem: 'Não foi possivel cadastrar o usuário' });
        }

        return res.status(200).json({ mensagem: 'Usuário cadastrado com sucesso.' });
    } catch (error) {
        return res.status(400).json(error.message);
    }
};

const loginUsuario = async (req, res) => {
    const { email, senha } = req.body;

    try {
        if (!email || !senha) return res.status(400).json({ mensagem: 'Todos os campos devem ser preenchidos' });

        const query = 'select * from usuarios where email = $1';
        const usuarios = await connection.query(query, [email]);

        if (usuarios.rowCount == 0) return res.status(400).json({ mensagem: "Email ou senha incorretos." });

        const usuario = usuarios.rows[0];

        const result = await pwd.verify(Buffer.from(senha), Buffer.from(usuario.senha, "hex"));

        switch (result) {
            case securePassword.INVALID_UNRECOGNIZED_HASH:
            case securePassword.INVALID:
                return res.status(400).json({ mensagem: "Email ou senha incorretos." });
            case securePassword.VALID:
                break;
            case securePassword.VALID_NEEDS_REHASH:
                try {
                    const hash = (await pwd.hash(Buffer.from(senha))).toString("hex");
                    const query = 'update usuarios set senha = $1 where email = $2';
                    await connection.query(query, [hash, email]);
                } catch {
                }
                break;
        }

        const token = jwt.sign({
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email
        }, jwtSecret);

        return res.send(token);
    } catch (error) {
        return res.status(400).json(error.message);
    }
};

module.exports = {
    cadastrarUsuario,
    loginUsuario
};