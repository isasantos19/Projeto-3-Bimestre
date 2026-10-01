const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');

// Rotas do Menu

router.get('/abrirMenu', menuController.abrirMenu);

module.exports = router;