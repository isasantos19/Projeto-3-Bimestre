const { query } = require('../database');
const path = require('path');

exports.abrirCrudFornecedor = (req, res) => {
    res.sendFile(
        path.join(__dirname, '../../frontend/Fornecedores/fornecedor.html')
    );
};

exports.listarFornecedores = async (req, res) => {
    try {
        const result = await query(
            'SELECT * FROM FORNECEDORES ORDER BY id_fornecedor'
        );

        res.json({
            sucesso: true,
            fornecedores: result.rows
        });

    } catch (error) {
        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro interno do servidor'
        });
    }
};

exports.criarFornecedor = async (req, res) => {
    try {
        const {
            id_fornecedor,
            nome_fornecedor,
            cnpj_fornecedor,
            telefone_fornecedor,
            email_fornecedor
        } = req.body;

        if (id_fornecedor === undefined || id_fornecedor === '') {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'O ID do fornecedor é obrigatório'
            });
        }

        if (nome_fornecedor === undefined || nome_fornecedor.trim() === '') {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'O nome do fornecedor é obrigatório'
            });
        }

        if (cnpj_fornecedor === undefined || cnpj_fornecedor === '') {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'O CNPJ é obrigatório'
            });
        }

        if (telefone_fornecedor === undefined || telefone_fornecedor === '') {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'O telefone é obrigatório'
            });
        }

        if (email_fornecedor === undefined || email_fornecedor === '') {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'O e-mail é obrigatório'
            });
        }

        const result = await query(
            `INSERT INTO FORNECEDORES
            (id_fornecedor, nome_fornecedor, cnpj_fornecedor, telefone_fornecedor, email_fornecedor)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *`,
            [
                id_fornecedor,
                nome_fornecedor,
                cnpj_fornecedor,
                telefone_fornecedor,
                email_fornecedor
            ]
        );

        res.status(201).json({
            sucesso: true,
            fornecedor: result.rows[0]
        });

    } catch (error) {
        if (error.code === '23505') {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'Já existe um fornecedor com este ID'
            });
        }

        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro interno do servidor'
        });
    }
};

exports.obterFornecedor = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'ID deve ser um número válido'
            });
        }

        const result = await query(
            'SELECT * FROM FORNECEDORES WHERE id_fornecedor = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                sucesso: false,
                mensagem: 'Fornecedor não encontrado'
            });
        }

        res.json({
            sucesso: true,
            fornecedor: result.rows[0]
        });

    } catch (error) {
        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro interno do servidor'
        });
    }
};

exports.atualizarFornecedor = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'ID deve ser um número válido'
            });
        }

        const {
            nome_fornecedor,
            cnpj_fornecedor,
            telefone_fornecedor,
            email_fornecedor
        } = req.body;

        if (nome_fornecedor === undefined || nome_fornecedor.trim() === '') {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'O nome do fornecedor é obrigatório'
            });
        }

        if (cnpj_fornecedor === undefined || cnpj_fornecedor === '') {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'O CNPJ é obrigatório'
            });
        }

        if (telefone_fornecedor === undefined || telefone_fornecedor === '') {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'O telefone é obrigatório'
            });
        }

        if (email_fornecedor === undefined || email_fornecedor === '') {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'O e-mail é obrigatório'
            });
        }

        const fornecedorExistente = await query(
            'SELECT * FROM FORNECEDORES WHERE id_fornecedor = $1',
            [id]
        );

        if (fornecedorExistente.rows.length === 0) {
            return res.status(404).json({
                sucesso: false,
                mensagem: 'Fornecedor não encontrado'
            });
        }

        const result = await query(
            `UPDATE FORNECEDORES
            SET nome_fornecedor = $1,
                cnpj_fornecedor = $2,
                telefone_fornecedor = $3,
                email_fornecedor = $4
            WHERE id_fornecedor = $5
            RETURNING *`,
            [
                nome_fornecedor,
                cnpj_fornecedor,
                telefone_fornecedor,
                email_fornecedor,
                id
            ]
        );

        res.json({
            sucesso: true,
            fornecedor: result.rows[0]
        });

    } catch (error) {
        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro interno do servidor'
        });
    }
};

exports.deletarFornecedor = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'ID deve ser um número válido'
            });
        }

        const fornecedorExistente = await query(
            'SELECT * FROM FORNECEDORES WHERE id_fornecedor = $1',
            [id]
        );

        if (fornecedorExistente.rows.length === 0) {
            return res.status(404).json({
                sucesso: false,
                mensagem: 'Fornecedor não encontrado'
            });
        }

        await query(
            'DELETE FROM FORNECEDORES WHERE id_fornecedor = $1',
            [id]
        );

        res.json({
            sucesso: true,
            mensagem: 'Fornecedor excluído com sucesso'
        });

    } catch (error) {
        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro interno do servidor'
        });
    }
};