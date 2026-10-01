const path = require('path');

// Funções do controller

exports.abrirMenu = async (req, res) => {
    try {
        res.sendFile(
            path.join(__dirname, '../../frontend/Menu/menu.html')
        );

    } catch (error) {
        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro interno do servidor'
        });
    }
};