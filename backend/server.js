const express = require('express');
const cors = require('cors');
const path = require('path');

require('dotenv').config();

const { query } = require('./database');

const produtosRoutes = require('./routes/produtosRoutes');
const categoriasRoutes = require('./routes/categoriasRoutes');
const fornecedoresRoutes = require('./routes/fornecedoresRoutes');
const clientesRoutes = require('./routes/clientesRoutes');
const estoqueRoutes = require('./routes/estoqueRoutes');
const menuRoutes = require('./routes/menuRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/imagens', express.static(path.join(__dirname, '../imagens')));
app.use('/frontend', express.static(path.join(__dirname, '../frontend')));

app.use('/menu', menuRoutes);
app.use('/produtos', produtosRoutes);
app.use('/categorias', categoriasRoutes);
app.use('/fornecedores', fornecedoresRoutes);
app.use('/clientes', clientesRoutes);
app.use('/estoque', estoqueRoutes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, async () => {

    console.log(`\n=================================`);
    console.log(`Servidor executando na porta ${PORT}`);

    try {

        await query('SELECT 1');

        console.log(`Banco de Dados ${process.env.DB_NAME} conectado com sucesso!`);

    } catch (error) {

        console.error(`FALHA NA CONEXÃO COM O BANCO DE DADOS:`);
        console.error(`Motivo: ${error.message}`);
        console.error(`Ajuste o arquivo .env com a senha correta do seu PostgreSQL.`);

    }

    console.log(`=================================\n`);

});