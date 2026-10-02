Sobre o projeto

O Mercado é um sistema desenvolvido para a disciplina de Desenvolvimento Web 1 (DW1).

O objetivo do projeto é simular o gerenciamento de um mercado, permitindo o cadastro, consulta, alteração e exclusão de informações relacionadas aos produtos, categorias, estoque, fornecedores e clientes.

A aplicação foi desenvolvida utilizando HTML, CSS e JavaScript no frontend. O backend foi desenvolvido em Node.js utilizando o Express, seguindo uma organização baseada em rotas e controllers. Os dados ficam armazenados em um banco de dados PostgreSQL.

Como o projeto funciona

O sistema permite que o usuário acesse diferentes áreas do mercado e realize operações de cadastro e gerenciamento dos dados.

O usuário pode:

Cadastrar, consultar, alterar e excluir produtos;
Cadastrar, consultar, alterar e excluir categorias;
Cadastrar, consultar, alterar e excluir informações do estoque;
Cadastrar, consultar, alterar e excluir fornecedores;
Cadastrar, consultar, alterar e excluir clientes;
Cadastrar imagens para os produtos.

Quando o usuário realiza alguma ação, o JavaScript do frontend envia uma requisição para o servidor utilizando a API Fetch.

O servidor recebe a requisição e encaminha para a rota correspondente. A rota direciona a requisição para o Controller responsável pela operação.

O Controller realiza a operação necessária no banco de dados por meio do database.js, que utiliza o PostgreSQL.

Depois disso, o resultado retorna para o frontend em formato JSON, e o JavaScript utiliza essas informações para atualizar a página.

Tecnologias utilizadas
HTML5
CSS3
JavaScript
Node.js
Express
PostgreSQL
pg
dotenv
cors
multer
Estrutura do projeto
Frontend
Menu

menu.html

Contém a página inicial do sistema e os acessos para as diferentes áreas do mercado.

menu.css

Responsável pela estilização da página inicial.

Categorias

categoria.html

Contém a interface para gerenciamento das categorias.

categoria.css

Responsável pela estilização da página de categorias.

categoria.js

Realiza as requisições para o servidor e controla as operações de cadastro, consulta, alteração e exclusão de categorias.

Produtos

produtos.html

Contém a interface para gerenciamento dos produtos.

produtos.css

Responsável pela estilização da página de produtos.

produtos.js

Realiza as requisições para o servidor, controla o cadastro e gerenciamento dos produtos e também realiza o envio das imagens.

Estoque

estoque.html

Contém a interface para gerenciamento do estoque.

estoque.css

Responsável pela estilização da página de estoque.

estoque.js

Realiza as requisições para o servidor e controla as operações de cadastro, consulta, alteração e exclusão do estoque.

Fornecedores

fornecedor.html

Contém a interface para gerenciamento dos fornecedores.

fornecedores.css

Responsável pela estilização da página de fornecedores.

fornecedores.js

Realiza as requisições para o servidor e controla as operações de cadastro, consulta, alteração e exclusão dos fornecedores.

Clientes

clientes.html

Contém a interface para gerenciamento dos clientes.

clientes.css

Responsável pela estilização da página de clientes.

clientes.js

Realiza as requisições para o servidor e controla as operações de cadastro, consulta, alteração e exclusão dos clientes.

Backend
server.js

Responsável por iniciar o servidor, configurar o Express, permitir requisições do frontend, disponibilizar arquivos estáticos e registrar as rotas da aplicação.

database.js

Responsável pela conexão com o banco de dados PostgreSQL e pela execução das consultas SQL por meio do query.

Routes

As Routes definem os caminhos da API e direcionam cada requisição para o Controller correspondente.

O projeto possui Routes para:

Produtos;
Categorias;
Estoque;
Fornecedores;
Clientes;
Menu.
Controllers

Os Controllers são responsáveis por executar as operações solicitadas pelas Routes.

Eles realizam operações como:

Inserção de dados;
Consulta de dados;
Alteração de dados;
Exclusão de dados;
Tratamento das respostas e erros.
Banco de dados

O sistema utiliza o PostgreSQL para armazenar as informações.

O banco possui as seguintes tabelas:

CATEGORIAS
PRODUTOS
ESTOQUE
FORNECEDORES
CLIENTES
Relacionamentos

CATEGORIAS → PRODUTOS

Uma categoria pode possuir vários produtos, caracterizando uma relação 1:N.

PRODUTOS → ESTOQUE

Cada produto possui um registro correspondente no estoque, caracterizando uma relação 1:1.

FORNECEDORES e CLIENTES

São entidades independentes dentro do banco de dados.

O diagrama do banco de dados está disponível na pasta documentacao.

Arquivos de documentação

documentacao/mercado.sql

Contém os comandos SQL utilizados para criar as tabelas e inserir os registros iniciais no banco de dados.

documentacao/diagrama_banco.png

Contém o diagrama do banco de dados e seus relacionamentos.

Como executar o projeto
1. Instale as dependências

Abra o terminal na pasta backend e execute:

npm install

2. Configure o arquivo .env

Crie um arquivo chamado .env na pasta do backend com as informações de conexão do banco de dados.

Exemplo:

DB_HOST=localhost
DB_PORT=5432
DB_NAME=SeuBanco
DB_USER=postgres
DB_PASSWORD=SuaSenha
PORT=3001

3. Crie o banco de dados

Abra o PGAdmin 4 e execute o arquivo:

documentacao/mercado.sql

O arquivo contém a criação das tabelas e a inserção dos dados iniciais.

4. Inicie o servidor

Na pasta backend, execute:

node server.js

O servidor será iniciado em:

http://localhost:3001

5. Abra o sistema

Abra a página:

frontend/Menu/menu.html

no navegador.

Fluxo do projeto

O funcionamento do sistema acontece da seguinte forma:

Usuário → HTML + JavaScript → Fetch → Servidor Node.js → Routes → Controller → database.js → PostgreSQL

Depois que o banco realiza a operação, o resultado retorna pelo caminho inverso:

PostgreSQL → database.js → Controller → Routes → Servidor → JavaScript → Página HTML

Ou seja:

O usuário realiza uma ação na página.
O JavaScript pega e valida os dados.
O JavaScript envia uma requisição utilizando Fetch.
O servidor recebe a requisição.
A Route identifica o caminho e direciona para o Controller.
O Controller realiza a operação necessária.
O database.js executa a consulta no PostgreSQL.
O banco de dados retorna o resultado.
O Controller envia a resposta para o frontend.
O JavaScript recebe os dados e atualiza a página.
Organização da arquitetura

O projeto utiliza a seguinte organização:

Frontend

HTML + CSS + JavaScript

↓

Backend

Node.js + Express

↓

Routes

Definem os caminhos das requisições

↓

Controllers

Executam as operações

↓

database.js

Realiza o acesso ao banco

↓

PostgreSQL

Armazena os dados

Desenvolvido por

Isabela Maria Ferreira dos Santos

DW1 — 3º Bimestre — 2026
