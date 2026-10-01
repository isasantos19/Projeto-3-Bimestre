const express = require('express');
const router = express.Router();
const fornecedorController = require('../controllers/fornecedoresController');

// CRUD de Fornecedores
router.get('/abrirCrudFornecedor', fornecedorController.abrirCrudFornecedor);
router.get('/listar', fornecedorController.listarFornecedores);
router.get('/:id', fornecedorController.obterFornecedor);
router.post('/', fornecedorController.criarFornecedor);
router.put('/:id', fornecedorController.atualizarFornecedor);
router.delete('/:id', fornecedorController.deletarFornecedor);

module.exports = router;