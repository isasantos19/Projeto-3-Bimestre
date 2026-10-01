const express = require('express');
const multer = require('multer');

const router = express.Router();
const produtoController = require('../controllers/produtosController');

const armazenamento = multer.diskStorage({
    destination: '../imagens/',
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({
    storage: armazenamento
});

// Rotas do CRUD de Produtos

router.get('/listar', produtoController.listarProdutos);
router.get('/:id', produtoController.obterProduto);
router.post('/imagem', upload.single('imagem'), produtoController.enviarImagem);
router.post('/', produtoController.criarProduto);
router.put('/:id', produtoController.atualizarProduto);
router.delete('/:id', produtoController.deletarProduto);

module.exports = router;