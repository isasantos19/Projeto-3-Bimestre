DROP TABLE IF EXISTS ESTOQUE, PRODUTOS, CATEGORIAS, FORNECEDORES, CLIENTES;

CREATE TABLE CATEGORIAS (
    id_categoria INTEGER,
    nome_categoria VARCHAR(100),
    descricao_categoria TEXT,
    tipo_categoria VARCHAR(50),

    PRIMARY KEY (id_categoria)
);

CREATE TABLE PRODUTOS (
    id_produto INTEGER,
    nome_produto VARCHAR(50),
    preco_produto DECIMAL(10,2),
    marca_produto VARCHAR(50),
    imagem_produto VARCHAR(100),
    id_categoria INTEGER,

    PRIMARY KEY (id_produto),
    FOREIGN KEY (id_categoria) REFERENCES CATEGORIAS (id_categoria)
);

CREATE TABLE ESTOQUE (
    id_estoque INTEGER,
    quantidade INTEGER,
    estoque_minimo INTEGER,
    data_atualizacao DATE,
    id_produto INTEGER,

    PRIMARY KEY (id_estoque),
    FOREIGN KEY (id_produto) REFERENCES PRODUTOS (id_produto),
    UNIQUE (id_produto)
);

CREATE TABLE FORNECEDORES (
    id_fornecedor INTEGER,
    nome_fornecedor VARCHAR(100),
    cnpj_fornecedor VARCHAR(18),
    telefone_fornecedor VARCHAR(20),
    email_fornecedor VARCHAR(100),

    PRIMARY KEY (id_fornecedor)
);

CREATE TABLE CLIENTES (
    id_cliente INTEGER,
    nome_cliente VARCHAR(100),
    cpf_cliente VARCHAR(11),
    telefone_cliente VARCHAR(20),
    email_cliente VARCHAR(100),
    numero_cartao VARCHAR(20),

    PRIMARY KEY (id_cliente)
);

--------------------------- INSERÇÃO DE DADOS -------------------------------------------


-- INSERÇÃO DE DADOS - CATEGORIAS


INSERT INTO CATEGORIAS
(id_categoria, nome_categoria, descricao_categoria, tipo_categoria)
VALUES
(1, 'Bebidas', 'Bebidas em geral', 'Alimentação'),
(2, 'Frutas', 'Frutas frescas e selecionadas', 'Alimentação'),
(3, 'Verduras', 'Verduras e hortaliças', 'Alimentação'),
(4, 'Laticínios', 'Leites, queijos e derivados', 'Alimentação'),
(5, 'Doces', 'Doces, chocolates e guloseimas', 'Alimentação'),
(6, 'Higiene', 'Produtos de higiene pessoal', 'Higiene'),
(7, 'Limpeza', 'Produtos para limpeza doméstica', 'Limpeza'),
(8, 'Massas', 'Massas e produtos derivados', 'Alimentação'),
(9, 'Enlatados', 'Produtos enlatados e conservas', 'Alimentação'),
(10, 'Padaria', 'Pães e produtos de padaria', 'Alimentação');


-- INSERÇÃO DE DADOS - PRODUTOS


INSERT INTO PRODUTOS
(id_produto, nome_produto, preco_produto, marca_produto, imagem_produto, id_categoria)
VALUES
(1, 'Refrigerante Cola', 7.50, 'Coca-Cola', 'refrigerante_cola.png', 1),
(2, 'Suco de Laranja', 6.90, 'Del Valle', 'suco_laranja.png', 1),
(3, 'Banana Prata', 5.99, 'Natural', 'banana_prata.png', 2),
(4, 'Maca Fuji', 8.49, 'Natural', 'maca_fuji.png', 2),
(5, 'Leite Integral', 5.79, 'Piracanjuba', 'leite_integral.png', 4),
(6, 'Chocolate ao Leite', 6.50, 'Nestle', 'chocolate_leite.png', 5),
(7, 'Sabonete', 3.99, 'Nivea', 'sabonete.png', 6),
(8, 'Detergente Liquido', 2.89, 'Ype', 'detergente.png', 7),
(9, 'Macarrao Espaguete', 4.79, 'Renata', 'macarrao.png', 8),
(10, 'Pao Frances', 12.00, 'Tangerinas Felizes', 'pao_frances.png', 10);


-- INSERÇÃO DE DADOS - ESTOQUE


INSERT INTO ESTOQUE
(id_estoque, quantidade, estoque_minimo, data_atualizacao, id_produto)
VALUES
(1, 50, 10, '2026-09-21', 1),
(2, 35, 8, '2026-09-21', 2),
(3, 80, 20, '2026-09-21', 3),
(4, 45, 10, '2026-09-21', 4),
(5, 60, 15, '2026-09-21', 5),
(6, 40, 10, '2026-09-21', 6),
(7, 70, 20, '2026-09-21', 7),
(8, 55, 15, '2026-09-21', 8),
(9, 65, 15, '2026-09-21', 9),
(10, 30, 10, '2026-09-21', 10);


-- INSERÇÃO DE DADOS - FORNECEDORES


INSERT INTO FORNECEDORES
(id_fornecedor, nome_fornecedor, cnpj_fornecedor, telefone_fornecedor, email_fornecedor)
VALUES
(1, 'Distribuidora Parana', '12345678000101', '44999990001', 'contato@distribuidorapr.com'),
(2, 'Alimentos Brasil', '23456789000102', '44999990002', 'contato@alimentosbrasil.com'),
(3, 'Bebidas Campo Mourao', '34567890000103', '44999990003', 'vendas@bebidascm.com'),
(4, 'Frutas do Parana', '45678901000104', '44999990004', 'contato@frutaspr.com'),
(5, 'Laticinios Central', '56789012000105', '44999990005', 'vendas@laticinioscentral.com'),
(6, 'Higiene Total', '67890123000106', '44999990006', 'contato@higienetotal.com'),
(7, 'Limpeza Facil', '78901234000107', '44999990007', 'vendas@limpezafacil.com'),
(8, 'Massas Parana', '89012345000108', '44999990008', 'contato@massaspr.com'),
(9, 'Doces Brasil', '90123456000109', '44999990009', 'vendas@docesbrasil.com'),
(10, 'Padaria Central', '01234567000110', '44999990010', 'contato@padariacentral.com');


-- INSERÇÃO DE DADOS - CLIENTES
 

INSERT INTO CLIENTES
(id_cliente, nome_cliente, cpf_cliente, telefone_cliente, email_cliente, numero_cartao)
VALUES
(1, 'Ana Souza', '12345678901', '44988880001', 'ana@email.com', '100001'),
(2, 'Bruno Oliveira', '23456789012', '44988880002', 'bruno@email.com', '100002'),
(3, 'Camila Santos', '34567890123', '44988880003', 'camila@email.com', '100003'),
(4, 'Daniel Ferreira', '45678901234', '44988880004', 'daniel@email.com', '100004'),
(5, 'Eduarda Lima', '56789012345', '44988880005', 'eduarda@email.com', '100005'),
(6, 'Felipe Martins', '67890123456', '44988880006', 'felipe@email.com', '100006'),
(7, 'Gabriela Costa', '78901234567', '44988880007', 'gabriela@email.com', '100007'),
(8, 'Henrique Alves', '89012345678', '44988880008', 'henrique@email.com', '100008'),
(9, 'Isabela Rocha', '90123456789', '44988880009', 'isabela@email.com', '100009'),
(10, 'Joao Pereira', '01234567890', '44988880010', 'joao@email.com', '100010');