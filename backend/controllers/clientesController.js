const { query } = require('../database');
const path = require('path');

exports.abrirCrudCliente = (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/cliente/cliente.html'));
};

exports.listarClientes = async (req, res) => {
    try {
        const result = await query(
            'SELECT * FROM CLIENTES ORDER BY id_cliente'
        );

        res.json({
            sucesso: true,
            clientes: result.rows
        });

    } catch (error) {
        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro interno do servidor'
        });
    }
};

exports.criarCliente = async (req, res) => {
    try {
        const {
            id_cliente,
            nome_cliente,
            cpf_cliente,
            telefone_cliente,
            email_cliente,
            numero_cartao
        } = req.body;

        if (!nome_cliente) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'O nome do cliente é obrigatório'
            });
        }

        const result = await query(
            `INSERT INTO CLIENTES
            (id_cliente, nome_cliente, cpf_cliente, telefone_cliente, email_cliente, numero_cartao)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *`,
            [
                id_cliente,
                nome_cliente,
                cpf_cliente,
                telefone_cliente,
                email_cliente,
                numero_cartao
            ]
        );

        res.status(201).json({
            sucesso: true,
            cliente: result.rows[0]
        });

    } catch (error) {
        if (error.code === '23505') {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'Já existe um cliente com este ID'
            });
        }

        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro interno do servidor'
        });
    }
};

exports.obterCliente = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'ID deve ser um número válido'
            });
        }

        const result = await query(
            'SELECT * FROM CLIENTES WHERE id_cliente = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                sucesso: false,
                mensagem: 'Cliente não encontrado'
            });
        }

        res.json({
            sucesso: true,
            cliente: result.rows[0]
        });

    } catch (error) {
        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro interno do servidor'
        });
    }
};

exports.atualizarCliente = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        const {
            nome_cliente,
            cpf_cliente,
            telefone_cliente,
            email_cliente,
            numero_cartao
        } = req.body;

        const clienteExistente = await query(
            'SELECT * FROM CLIENTES WHERE id_cliente = $1',
            [id]
        );

        if (clienteExistente.rows.length === 0) {
            return res.status(404).json({
                sucesso: false,
                mensagem: 'Cliente não encontrado'
            });
        }

        const result = await query(
            `UPDATE CLIENTES
            SET nome_cliente = $1,
                cpf_cliente = $2,
                telefone_cliente = $3,
                email_cliente = $4,
                numero_cartao = $5
            WHERE id_cliente = $6
            RETURNING *`,
            [
                nome_cliente,
                cpf_cliente,
                telefone_cliente,
                email_cliente,
                numero_cartao,
                id
            ]
        );

        res.json({
            sucesso: true,
            cliente: result.rows[0]
        });

    } catch (error) {
        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro interno do servidor'
        });
    }
};

exports.deletarCliente = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        const clienteExistente = await query(
            'SELECT * FROM CLIENTES WHERE id_cliente = $1',
            [id]
        );

        if (clienteExistente.rows.length === 0) {
            return res.status(404).json({
                sucesso: false,
                mensagem: 'Cliente não encontrado'
            });
        }

        await query(
            'DELETE FROM CLIENTES WHERE id_cliente = $1',
            [id]
        );

        res.json({
            sucesso: true,
            mensagem: 'Cliente excluído com sucesso'
        });

    } catch (error) {
        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro interno do servidor'
        });
    }
};