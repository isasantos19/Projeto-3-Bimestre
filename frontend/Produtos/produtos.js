const URL_API = 'http://localhost:3001';

let oQueEstaFazendo = '';
let produto = null;
let imagemSelecionada = null;

bloquearAtributos(true);

async function inicializar() {
    await carregarCategorias();
    await listar();
}

async function carregarCategorias() {
    try {
        const resposta = await fetch(`${URL_API}/categorias/listar`);
        const data = await resposta.json();
        const select = document.getElementById("inputId_categoria");

        select.innerHTML = '<option value="">Selecione uma categoria</option>';

        if (data.sucesso) {
            for (let categoria of data.categorias) {
                const option = document.createElement("option");
                option.value = categoria.id_categoria;
                option.textContent =
                    `${categoria.id_categoria} - ${categoria.nome_categoria}`;
                select.appendChild(option);
            }
        }
    } catch (erro) {
        document.getElementById("inputId_categoria").innerHTML =
            '<option value="">Erro ao carregar categorias</option>';
    }
}

async function procurePorChavePrimaria(chave) {
    try {
        const resposta = await fetch(`${URL_API}/produtos/${chave}`);
        const data = await resposta.json();

        return data.sucesso ? data.produto : null;
    } catch (erro) {
        return null;
    }
}

async function procure() {
    const id_produto =
        document.getElementById("inputId_produto").value;

    if (
        id_produto === "" ||
        isNaN(id_produto) ||
        !Number.isInteger(Number(id_produto))
    ) {
        mostrarAviso("O ID precisa ser um número inteiro");
        return;
    }

    produto = await procurePorChavePrimaria(id_produto);
    oQueEstaFazendo = '';

    if (produto) {
        mostrarDadosproduto(produto);

        visibilidadeDosBotoes(
            'inline',
            'none',
            'inline',
            'inline',
            'none'
        );

        mostrarAviso("Achou no banco, pode alterar ou excluir");
    } else {
        limparAtributos();

        document.getElementById("inputId_produto").value =
            id_produto;

        visibilidadeDosBotoes(
            'inline',
            'inline',
            'none',
            'none',
            'none'
        );

        mostrarAviso("Não achou no banco, pode inserir");
    }
}

function inserir() {
    bloquearAtributos(false);

    visibilidadeDosBotoes(
        'none',
        'none',
        'none',
        'none',
        'inline'
    );

    oQueEstaFazendo = 'inserindo';

    mostrarAviso(
        "INSERINDO - Digite os atributos e clique em salvar"
    );
}

function alterar() {
    bloquearAtributos(false);

    visibilidadeDosBotoes(
        'none',
        'none',
        'none',
        'none',
        'inline'
    );

    oQueEstaFazendo = 'alterando';

    mostrarAviso(
        "ALTERANDO - Modifique os atributos e clique em salvar"
    );
}

function excluir() {
    bloquearAtributos(true);

    visibilidadeDosBotoes(
        'none',
        'none',
        'none',
        'none',
        'inline'
    );

    oQueEstaFazendo = 'excluindo';

    mostrarAviso(
        "EXCLUINDO - Clique em salvar para confirmar a exclusão"
    );
}

async function enviarImagem() {
    if (!imagemSelecionada) {
        return "";
    }

    const formulario = new FormData();
    formulario.append("imagem", imagemSelecionada);

    const resposta = await fetch(`${URL_API}/produtos/imagem`, {
        method: 'POST',
        body: formulario
    });

    const data = await resposta.json();

    if (data.sucesso) {
        return data.nomeImagem;
    }

    mostrarAviso(data.mensagem);
    return "";
}

async function salvar() {

    const id_produto = document.getElementById("inputId_produto").value;
    const nome_produto = document.getElementById("inputnome_produto").value;
    const preco_produto = document.getElementById("inputpreco_produto").value;
    const marca_produto = document.getElementById("inputmarca_produto").value;
    const id_categoria = document.getElementById("inputId_categoria").value;

    // VALIDAÇÃO DO ID

if (
    id_produto === "" ||
    isNaN(id_produto) ||
    !Number.isInteger(Number(id_produto))
) {
    mostrarAviso("O ID precisa ser um número inteiro");
    return;
}

// VALIDAÇÃO DO NOME

if (nome_produto.trim() === "") {
    mostrarAviso("O nome do produto é obrigatório");
    return;
}

// VALIDAÇÃO DO PREÇO

if (preco_produto === "" || isNaN(preco_produto)) {
    mostrarAviso("O preço deve ser informado");
    return;
}

if (Number(preco_produto) <= 0) {
    mostrarAviso("O preço deve ser maior que zero");
    return;
}

// VALIDAÇÃO DA MARCA

if (marca_produto.trim() === "") {
    mostrarAviso("A marca do produto é obrigatória");
    return;
}

// VALIDAÇÃO DA CATEGORIA

if (id_categoria === "") {
    mostrarAviso("A categoria do produto é obrigatória");
    return;
}

    // A categoria não será validada aqui.
    // Ela é carregada diretamente do banco
    // e possui chave estrangeira em PRODUTOS.

    let nomeImagem = produto
        ? produto.imagem_produto
        : "";

    if (imagemSelecionada) {
        nomeImagem = await enviarImagem();

        if (nomeImagem === "") {
            return;
        }
    }

    const dadosproduto = {
        id_produto,
        nome_produto,
        preco_produto,
        marca_produto,
        id_categoria,
        imagem_produto: nomeImagem
    };

    try {
        if (oQueEstaFazendo === 'inserindo') {
            const resposta = await fetch(`${URL_API}/produtos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dadosproduto)
            });

            const data = await resposta.json();

            if (data.sucesso) {
                mostrarAviso(
                    "Inserido no Banco de Dados com sucesso!"
                );
            } else {
                mostrarAviso(data.mensagem);
                return;
            }

        } else if (oQueEstaFazendo === 'alterando') {
            const resposta = await fetch(
                `${URL_API}/produtos/${id_produto}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(dadosproduto)
                }
            );

            const data = await resposta.json();

            if (data.sucesso) {
                mostrarAviso(
                    "Alterado no Banco de Dados com sucesso!"
                );
            } else {
                mostrarAviso(data.mensagem);
                return;
            }

        } else if (oQueEstaFazendo === 'excluindo') {
            const resposta = await fetch(
                `${URL_API}/produtos/${id_produto}`,
                {
                    method: 'DELETE'
                }
            );

            const data = await resposta.json();

            if (data.sucesso) {
                mostrarAviso(
                    "Excluído do Banco de Dados!"
                );
            } else {
                mostrarAviso(data.mensagem);
                return;
            }
        }

        visibilidadeDosBotoes(
            'inline',
            'none',
            'none',
            'none',
            'none'
        );

        limparAtributos();

        document.getElementById("inputId_produto").value = "";

        await listar();

    } catch (erro) {
        mostrarAviso(
            "Erro ao efetuar operação no servidor."
        );
    }
}

async function listar() {
    try {
        const resposta =
            await fetch(`${URL_API}/produtos/listar`);

        const data = await resposta.json();

        if (data.sucesso) {
            let texto = "";

            for (let linha of data.produtos) {
                texto += `
                    <div class="produto-cadastrado">
                        <strong>ID:</strong> ${linha.id_produto}<br>
                        <strong>Nome:</strong> ${linha.nome_produto}<br>
                        <strong>Preço:</strong> R$ ${linha.preco_produto}<br>
                        <strong>Marca:</strong> ${linha.marca_produto}<br>
                        <strong>ID da Categoria:</strong> ${linha.id_categoria}<br>
                    </div>
                    <hr>
                `;
            }

            document.getElementById("outputSaida").innerHTML =
                texto || "Nenhum produto cadastrado.";

        } else {
            document.getElementById("outputSaida").innerHTML =
                "Erro ao listar produtos.";
        }

    } catch (erro) {
        document.getElementById("outputSaida").innerHTML =
            "Servidor offline.";
    }
}

function cancelarOperacao() {
    limparAtributos();
    bloquearAtributos(true);

    visibilidadeDosBotoes(
        'inline',
        'none',
        'none',
        'none',
        'none'
    );

    mostrarAviso("Cancelou a operação");
}

function mostrarAviso(mensagem) {
    document.getElementById("divAviso").innerHTML = mensagem;
}

function mostrarDadosproduto(p) {
    
    document.getElementById("inputId_produto").value = p.id_produto;
    document.getElementById("inputnome_produto").value = p.nome_produto;
    document.getElementById("inputpreco_produto").value = p.preco_produto || "";
    document.getElementById("inputmarca_produto").value = p.marca_produto || "";
    document.getElementById("inputId_categoria").value = p.id_categoria || "";

    imagemSelecionada = null;

    if (p.imagem_produto) {
        document.getElementById("imgproduto").src = `${URL_API}/imagens/${p.imagem_produto}`;
    } else {
        document.getElementById("imgproduto").src = `${URL_API}/imagens/silhueta.png`;
    }

    bloquearAtributos(true);
}

function limparAtributos() {
    produto = null;
    oQueEstaFazendo = '';
    imagemSelecionada = null;

    document.getElementById("inputnome_produto").value = "";
    document.getElementById("inputpreco_produto").value = "";
    document.getElementById("inputmarca_produto").value = "";
    document.getElementById("inputId_categoria").value = "";
    document.getElementById("inputImagem").value = "";

    document.getElementById("imgproduto").src =
        `${URL_API}/imagens/silhueta.png`;

    bloquearAtributos(true);
}

function bloquearAtributos(soLeitura) {
    
    document.getElementById("inputId_produto").readOnly = !soLeitura;
    document.getElementById("inputnome_produto").readOnly = soLeitura;
    document.getElementById("inputpreco_produto").readOnly = soLeitura;
    document.getElementById("inputmarca_produto").readOnly = soLeitura;
    document.getElementById("inputId_categoria").disabled = soLeitura;
}

function visibilidadeDosBotoes(
    btP,
    btI,
    btA,
    btE,
    btS
) {
    document.getElementById("btProcure").style.display = btP;
    document.getElementById("btInserir").style.display =btI;
    document.getElementById("btAlterar").style.display = btA;
    document.getElementById("btExcluir").style.display = btE;
    document.getElementById("btSalvar").style.display = btS;
    document.getElementById("btCancelar").style.display = btS;
}

function acionarUpload() {
    if (
        oQueEstaFazendo === 'inserindo' ||
        oQueEstaFazendo === 'alterando'
    ) {
        document.getElementById("inputImagem").click();
    }
}

function previewImagem() {
    const arquivo =
        document.getElementById("inputImagem").files[0];

    if (arquivo) {
        imagemSelecionada = arquivo;

        document.getElementById("imgproduto").src =
            URL.createObjectURL(arquivo);
    }
}