const { query } = require('../database');

const path = require('path');

exports.abrirCrudCategoria = (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/categorias/categoria.html'));
};

exports.listarCategorias = async (req, res) => {
    try {
        const result = await query(
            'SELECT * FROM CATEGORIAS ORDER BY id_categoria'
        );

        res.json({
            sucesso: true,
            categorias: result.rows
        });

    } catch (error) {
        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro interno do servidor'
        });
    }
};

exports.criarCategoria = async (req, res) => {
    try {
        const {
            id_categoria,
            nome_categoria,
            descricao_categoria,
            tipo_categoria
        } = req.body;

        if (!nome_categoria) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'O nome da categoria é obrigatório'
            });
        }

        const result = await query(
            `INSERT INTO CATEGORIAS
            (id_categoria, nome_categoria, descricao_categoria, tipo_categoria)
            VALUES ($1, $2, $3, $4)
            RETURNING *`,
            [
                id_categoria,
                nome_categoria,
                descricao_categoria,
                tipo_categoria
            ]
        );

        res.status(201).json({
            sucesso: true,
            categoria: result.rows[0]
        });

    } catch (error) {
        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro interno do servidor'
        });
    }
};

exports.obterCategoria = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'ID deve ser um número válido'
            });
        }

        const result = await query(
            'SELECT * FROM CATEGORIAS WHERE id_categoria = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                sucesso: false,
                mensagem: 'Categoria não encontrada'
            });
        }

        res.json({
            sucesso: true,
            categoria: result.rows[0]
        });

    } catch (error) {
        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro interno do servidor'
        });
    }
};

exports.atualizarCategoria = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        const {
            nome_categoria,
            descricao_categoria,
            tipo_categoria
        } = req.body;

        const categoriaExistente = await query(
            'SELECT * FROM CATEGORIAS WHERE id_categoria = $1',
            [id]
        );

        if (categoriaExistente.rows.length === 0) {
            return res.status(404).json({
                sucesso: false,
                mensagem: 'Categoria não encontrada'
            });
        }

        const result = await query(
            `UPDATE CATEGORIAS
            SET nome_categoria = $1,
                descricao_categoria = $2,
                tipo_categoria = $3
            WHERE id_categoria = $4
            RETURNING *`,
            [
                nome_categoria,
                descricao_categoria,
                tipo_categoria,
                id
            ]
        );

        res.json({
            sucesso: true,
            categoria: result.rows[0]
        });

    } catch (error) {
        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro interno do servidor'
        });
    }
};

exports.deletarCategoria = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        const categoriaExistente = await query(
            'SELECT * FROM CATEGORIAS WHERE id_categoria = $1',
            [id]
        );

        if (categoriaExistente.rows.length === 0) {
            return res.status(404).json({
                sucesso: false,
                mensagem: 'Categoria não encontrada'
            });
        }

        await query(
            'DELETE FROM CATEGORIAS WHERE id_categoria = $1',
            [id]
        );

        res.json({
            sucesso: true,
            mensagem: 'Categoria excluída com sucesso'
        });

    } catch (error) {
        if (error.code === '23503') {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'Não é possível excluir uma categoria que possui produtos associados'
            });
        }

        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro interno do servidor'
        });
    }
};