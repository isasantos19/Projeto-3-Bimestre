# Mercado

## Sobre o projeto

Este projeto foi desenvolvido para a disciplina de Desenvolvimento Web 1 (DW1), como atividade avaliativa do 3º bimestre de 2026.

O sistema simula o gerenciamento de um mercado, permitindo realizar operações de cadastro, consulta, alteração e exclusão de informações.

O projeto utiliza uma arquitetura Cliente/Servidor com o padrão MVC, utilizando HTML, CSS e JavaScript no Frontend, Node.js e Express no Backend e PostgreSQL como banco de dados.

## Funcionalidades

O sistema possui as seguintes funcionalidades:

- Cadastro, consulta, alteração e exclusão de Categorias;
- Cadastro, consulta, alteração e exclusão de Produtos;
- Cadastro, consulta, alteração e exclusão de Estoque;
- Cadastro, consulta, alteração e exclusão de Fornecedores;
- Cadastro, consulta, alteração e exclusão de Clientes;
- Cadastro e exibição de imagens dos produtos;
- Relacionamento entre Categorias e Produtos;
- Relacionamento entre Produtos e Estoque.

## Tecnologias utilizadas

- HTML5
- CSS3
- JavaScript
- Node.js
- Express
- PostgreSQL
- pg
- dotenv
- cors
- multer

## Estrutura do projeto

### Frontend

O Frontend é responsável pela interface do sistema e pela interação com o usuário.

- **Menu**
  - `menu.html`
  - `menu.css`

- **Categorias**
  - `categoria.html`
  - `categoria.css`
  - `categoria.js`

- **Produtos**
  - `produtos.html`
  - `produtos.css`
  - `produtos.js`

- **Estoque**
  - `estoque.html`
  - `estoque.css`
  - `estoque.js`

- **Fornecedores**
  - `fornecedor.html`
  - `fornecedores.css`
  - `fornecedores.js`

- **Clientes**
  - `clientes.html`
  - `clientes.css`
  - `clientes.js`

### Backend

O Backend é responsável pelo processamento das requisições, comunicação com o banco de dados e organização das rotas e controllers.

- `server.js` — inicializa o servidor e configura as rotas;
- `database.js` — realiza a conexão com o PostgreSQL;
- `routes/` — contém as rotas da aplicação;
- `controllers/` — contém as funções responsáveis pelas operações do sistema.

## Arquitetura

O sistema utiliza uma arquitetura Cliente/Servidor organizada com MVC.

O fluxo de funcionamento é:

Usuário → HTML/CSS/JavaScript → Fetch → Server → Routes → Controllers → database.js → PostgreSQL

Após a operação no banco de dados, o resultado retorna pelo mesmo caminho até chegar novamente ao Frontend.

## Banco de dados

O banco de dados foi desenvolvido utilizando PostgreSQL.

O sistema possui as seguintes tabelas:

- `CATEGORIAS`
- `PRODUTOS`
- `ESTOQUE`
- `FORNECEDORES`
- `CLIENTES`

### Relacionamentos

**CATEGORIAS → PRODUTOS**

Relacionamento 1:N.

Uma categoria pode possuir vários produtos, enquanto cada produto pertence a uma categoria.

**PRODUTOS → ESTOQUE**

Relacionamento 1:1.

Cada produto possui um registro de estoque, utilizando uma chave estrangeira com restrição `UNIQUE`.

**FORNECEDORES**

Tabela independente utilizada para armazenar os dados dos fornecedores.

**CLIENTES**

Tabela independente utilizada para armazenar os dados dos clientes e seus respectivos números de cartão.

## Documentação

A pasta `documentacao/` contém os arquivos utilizados para documentar o banco de dados:

- `mercado.sql` — script de criação das tabelas e inserção dos dados;
- `diagrama_banco.png` — diagrama do banco de dados.

## Como executar o projeto

### 1. Instalar as dependências

Abra o terminal na pasta do Backend e execute:

npm install

### 2. Configurar o arquivo .env

Crie um arquivo `.env` na pasta do Backend com as informações do PostgreSQL:

DB_HOST=localhost  
DB_PORT=5432  
DB_NAME=nome_do_banco  
DB_USER=postgres  
DB_PASSWORD=sua_senha  
PORT=3001

### 3. Criar o banco de dados

Abra o PostgreSQL utilizando o PGAdmin 4 e execute o arquivo:

`documentacao/mercado.sql`

O arquivo cria as tabelas e insere os dados iniciais do sistema.

### 4. Iniciar o servidor

No terminal, dentro da pasta do Backend, execute:

node server.js

O servidor será iniciado na porta:

http://localhost:3001

### 5. Abrir o sistema

Após iniciar o servidor, abra a página:

`frontend/Menu/menu.html`

A partir do Menu é possível acessar as diferentes funcionalidades do sistema.

## Rotas principais

O Backend possui rotas separadas para cada parte do sistema:

- `/produtos`
- `/categorias`
- `/estoque`
- `/fornecedores`
- `/clientes`
- `/menu`

Cada rota possui operações específicas para listar, cadastrar, consultar, atualizar e excluir registros.

## Imagens dos produtos

O sistema utiliza o `multer` para realizar o envio das imagens dos produtos.

As imagens são armazenadas na pasta `imagens/` e podem ser exibidas posteriormente no Frontend.

## Objetivo do projeto

O objetivo do projeto é aplicar os conhecimentos estudados em Desenvolvimento Web 1, principalmente:

- Arquitetura Cliente/Servidor;
- Padrão MVC;
- Criação de APIs;
- Rotas;
- Controllers;
- Comunicação entre Frontend e Backend;
- Operações CRUD;
- Conexão com PostgreSQL;
- Relacionamentos entre tabelas;
- Manipulação de imagens;
- Variáveis de ambiente.

## Desenvolvido por

**Isabela Maria Ferreira dos Santos**

Desenvolvimento Web 1 — 3º Bimestre — 2026
