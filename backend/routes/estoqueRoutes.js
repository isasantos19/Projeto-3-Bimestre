const express = require('express');
const router = express.Router();
const estoqueController = require('../controllers/estoqueController');

// CRUD de Estoque

router.get('/abrirCrudEstoque', estoqueController.abrirCrudEstoque);
router.get('/listar', estoqueController.listarEstoques);
router.post('/', estoqueController.criarEstoque);
router.get('/:id', estoqueController.obterEstoque);
router.put('/:id', estoqueController.atualizarEstoque);
router.delete('/:id', estoqueController.deletarEstoque);

module.exports = router;