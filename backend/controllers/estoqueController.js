const { query } = require('../database');

const path = require('path');

exports.abrirCrudEstoque = (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/estoque/estoque.html'));
};

exports.listarEstoques = async (req, res) => {
    try {
        const result = await query(
            'SELECT * FROM ESTOQUE ORDER BY id_estoque'
        );

        res.json({
            sucesso: true,
            estoques: result.rows
        });

    } catch (error) {
        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro interno do servidor'
        });
    }
};

exports.criarEstoque = async (req, res) => {
    try {
        const {
            id_estoque,
            quantidade,
            estoque_minimo,
            data_atualizacao,
            id_produto
        } = req.body;

        if (quantidade === undefined || id_produto === undefined) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'Quantidade e ID do produto são obrigatórios'
            });
        }

        const result = await query(
            `INSERT INTO ESTOQUE
            (id_estoque, quantidade, estoque_minimo, data_atualizacao, id_produto)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *`,
            [
                id_estoque,
                quantidade,
                estoque_minimo,
                data_atualizacao,
                id_produto
            ]
        );

        res.status(201).json({
            sucesso: true,
            estoque: result.rows[0]
        });

    } catch (error) {
        if (error.code === '23505') {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'Este produto já possui um estoque cadastrado'
            });
        }

        if (error.code === '23503') {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'O produto informado não existe'
            });
        }

        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro interno do servidor'
        });
    }
};

exports.obterEstoque = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'ID deve ser um número válido'
            });
        }

        const result = await query(
            'SELECT * FROM ESTOQUE WHERE id_estoque = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                sucesso: false,
                mensagem: 'Estoque não encontrado'
            });
        }

        res.json({
            sucesso: true,
            estoque: result.rows[0]
        });

    } catch (error) {
        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro interno do servidor'
        });
    }
};

exports.atualizarEstoque = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        const {
            quantidade,
            estoque_minimo,
            data_atualizacao,
            id_produto
        } = req.body;

        const estoqueExistente = await query(
            'SELECT * FROM ESTOQUE WHERE id_estoque = $1',
            [id]
        );

        if (estoqueExistente.rows.length === 0) {
            return res.status(404).json({
                sucesso: false,
                mensagem: 'Estoque não encontrado'
            });
        }

        const result = await query(
            `UPDATE ESTOQUE
            SET quantidade = $1,
                estoque_minimo = $2,
                data_atualizacao = $3,
                id_produto = $4
            WHERE id_estoque = $5
            RETURNING *`,
            [
                quantidade,
                estoque_minimo,
                data_atualizacao,
                id_produto,
                id
            ]
        );

        res.json({
            sucesso: true,
            estoque: result.rows[0]
        });

    } catch (error) {
        if (error.code === '23505') {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'Este produto já possui um estoque cadastrado'
            });
        }

        if (error.code === '23503') {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'O produto informado não existe'
            });
        }

        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro interno do servidor'
        });
    }
};

exports.deletarEstoque = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        const estoqueExistente = await query(
            'SELECT * FROM ESTOQUE WHERE id_estoque = $1',
            [id]
        );

        if (estoqueExistente.rows.length === 0) {
            return res.status(404).json({
                sucesso: false,
                mensagem: 'Estoque não encontrado'
            });
        }

        await query(
            'DELETE FROM ESTOQUE WHERE id_estoque = $1',
            [id]
        );

        res.json({
            sucesso: true,
            mensagem: 'Estoque excluído com sucesso'
        });

    } catch (error) {
        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro interno do servidor'
        });
    }
};