const { query } = require('../database');

const path = require('path');

// Funções do controller

exports.abrirCrudProduto = (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/produtos/produtos.html'));
};

exports.listarProdutos = async (req, res) => {
    try {
        const result = await query(
            'SELECT * FROM PRODUTOS ORDER BY id_produto'
        );

        res.json({
            sucesso: true,
            produtos: result.rows
        });

    } catch (error) {
        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro interno do servidor'
        });
    }
};

exports.criarProduto = async (req, res) => {
    try {
        const {
            id_produto,
            nome_produto,
            preco_produto,
            marca_produto,
            imagem_produto,
            id_categoria
        } = req.body;

        if (!nome_produto) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'O nome do produto é obrigatório'
            });
        }

        const result = await query(
            `INSERT INTO PRODUTOS
            (id_produto, nome_produto, preco_produto, marca_produto, imagem_produto, id_categoria)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *`,
            [
                id_produto,
                nome_produto,
                preco_produto,
                marca_produto,
                imagem_produto,
                id_categoria
            ]
        );

        res.status(201).json({
            sucesso: true,
            produto: result.rows[0]
        });

    } catch (error) {
        if (error.code === '23503') {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'A categoria informada não existe'
            });
        }

        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro interno do servidor'
        });
    }
};

exports.obterProduto = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'ID deve ser um número válido'
            });
        }

        const result = await query(
            'SELECT * FROM PRODUTOS WHERE id_produto = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                sucesso: false,
                mensagem: 'Produto não encontrado'
            });
        }

        res.json({
            sucesso: true,
            produto: result.rows[0]
        });

    } catch (error) {
        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro interno do servidor'
        });
    }
};

exports.atualizarProduto = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        const {
            nome_produto,
            preco_produto,
            marca_produto,
            imagem_produto,
            id_categoria
        } = req.body;

        const produtoExistente = await query(
            'SELECT * FROM PRODUTOS WHERE id_produto = $1',
            [id]
        );

        if (produtoExistente.rows.length === 0) {
            return res.status(404).json({
                sucesso: false,
                mensagem: 'Produto não encontrado'
            });
        }

        const result = await query(
            `UPDATE PRODUTOS
            SET nome_produto = $1,
                preco_produto = $2,
                marca_produto = $3,
                imagem_produto = $4,
                id_categoria = $5
            WHERE id_produto = $6
            RETURNING *`,
            [
                nome_produto,
                preco_produto,
                marca_produto,
                imagem_produto,
                id_categoria,
                id
            ]
        );

        res.json({
            sucesso: true,
            produto: result.rows[0]
        });

    } catch (error) {
        if (error.code === '23503') {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'A categoria informada não existe'
            });
        }

        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro interno do servidor'
        });
    }
};

exports.deletarProduto = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        const produtoExistente = await query(
            'SELECT * FROM PRODUTOS WHERE id_produto = $1',
            [id]
        );

        if (produtoExistente.rows.length === 0) {
            return res.status(404).json({
                sucesso: false,
                mensagem: 'Produto não encontrado'
            });
        }

        await query(
            'DELETE FROM PRODUTOS WHERE id_produto = $1',
            [id]
        );

        res.json({
            sucesso: true,
            mensagem: 'Produto excluído com sucesso'
        });

    } catch (error) {
        if (error.code === '23503') {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'Não é possível excluir um produto que possui estoque associado'
            });
        }

        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro interno do servidor'
        });
    }
};

exports.enviarImagem = (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'Nenhuma imagem foi enviada'
            });
        }

        res.json({
            sucesso: true,
            nomeImagem: req.file.originalname
        });

    } catch (error) {
        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao enviar imagem'
        });
    }
};