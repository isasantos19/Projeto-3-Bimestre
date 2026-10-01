const URL_API = 'http://localhost:3001';

let oQueEstaFazendo = '';
let fornecedor = null;

bloquearAtributos(true);

async function inicializar() {
    await listar();
}

async function procurePorChavePrimaria(chave) {
    try {
        const resposta = await fetch(`${URL_API}/fornecedores/${chave}`);
        const data = await resposta.json();

        return data.sucesso ? data.fornecedor : null;

    } catch (erro) {
        return null;
    }
}

async function procure() {
    const id_fornecedor = document.getElementById("inputId_fornecedor").value;

    if (id_fornecedor === "" || isNaN(id_fornecedor) || !Number.isInteger(Number(id_fornecedor))) {
        mostrarAviso("O ID precisa ser um número inteiro");
        return;
    }

    fornecedor = await procurePorChavePrimaria(id_fornecedor);
    oQueEstaFazendo = '';

    if (fornecedor) {

        mostrarDadosfornecedor(fornecedor);
        visibilidadeDosBotoes('inline', 'none', 'inline', 'inline', 'none');
        mostrarAviso("Achou no banco, pode alterar ou excluir");

    } else {

        limparAtributos();
        document.getElementById("inputId_fornecedor").value = id_fornecedor;
        visibilidadeDosBotoes('inline', 'inline', 'none', 'none', 'none');
        mostrarAviso("Não achou no banco, pode inserir");
    }
}

function inserir() {

    bloquearAtributos(false);
    visibilidadeDosBotoes('none', 'none', 'none', 'none', 'inline');
    oQueEstaFazendo = 'inserindo';
    mostrarAviso("INSERINDO - Digite os dados e clique em salvar");
}

function alterar() {
    
    bloquearAtributos(false);
    visibilidadeDosBotoes('none', 'none', 'none', 'none', 'inline');
    oQueEstaFazendo = 'alterando';
    mostrarAviso("ALTERANDO - Modifique os dados e clique em salvar");
}

function excluir() {

    bloquearAtributos(true);
    visibilidadeDosBotoes('none', 'none', 'none', 'none', 'inline');
    oQueEstaFazendo = 'excluindo';
    mostrarAviso("EXCLUINDO - Clique em salvar para confirmar a exclusão");
}

async function salvar() {
    const id_fornecedor = document.getElementById("inputId_fornecedor").value;
    const nome_fornecedor = document.getElementById("inputnome_fornecedor").value;
    const cnpj_fornecedor = document.getElementById("inputcnpj_fornecedor").value;
    const telefone_fornecedor = document.getElementById("inputtelefone_fornecedor").value;
    const email_fornecedor = document.getElementById("inputemail_fornecedor").value;

    if (id_fornecedor === "" || isNaN(id_fornecedor) || !Number.isInteger(Number(id_fornecedor))) {
        mostrarAviso("O ID precisa ser um número inteiro");
        return;
    }

    if (nome_fornecedor.trim() === "") {
        mostrarAviso("O nome do fornecedor é obrigatório");
        return;
    }

    for (let i = 0; i < nome_fornecedor.length; i++) {
        const caractere = nome_fornecedor[i];

        if (!((caractere >= 'A' && caractere <= 'Z') ||
              (caractere >= 'a' && caractere <= 'z') ||
              caractere === ' ')) {
            mostrarAviso("O nome deve conter apenas letras e espaços");
            return;
        }
    }

    if (cnpj_fornecedor === "") {
        mostrarAviso("O CNPJ é obrigatório");
        return;
    }

    for (let i = 0; i < cnpj_fornecedor.length; i++) {
        if (isNaN(cnpj_fornecedor[i]) || cnpj_fornecedor[i] === ' ') {
            mostrarAviso("O CNPJ deve conter apenas números");
            return;
        }
    }

    if (cnpj_fornecedor.length !== 14) {
        mostrarAviso("O CNPJ deve possuir 14 números");
        return;
    }

    if (telefone_fornecedor === "") {
        mostrarAviso("O telefone é obrigatório");
        return;
    }

    for (let i = 0; i < telefone_fornecedor.length; i++) {
        if (isNaN(telefone_fornecedor[i]) || telefone_fornecedor[i] === ' ') {
            mostrarAviso("O telefone deve conter apenas números");
            return;
        }
    }

    if (telefone_fornecedor.length < 10 || telefone_fornecedor.length > 11) {
        mostrarAviso("O telefone deve possuir 10 ou 11 números");
        return;
    }

    if (email_fornecedor === "") {
        mostrarAviso("O e-mail é obrigatório");
        return;
    }

    if (!email_fornecedor.includes("@")) {
        mostrarAviso("Informe um e-mail válido");
        return;
    }

    const dadosfornecedor = {
        id_fornecedor,
        nome_fornecedor,
        cnpj_fornecedor,
        telefone_fornecedor,
        email_fornecedor
    };

    try {
        if (oQueEstaFazendo === 'inserindo') {
            const resposta = await fetch(`${URL_API}/fornecedores`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dadosfornecedor)
            });

            const data = await resposta.json();

            if (data.sucesso) {
                mostrarAviso("Inserido no Banco de Dados com sucesso!");
            } else {
                mostrarAviso(data.mensagem);
                return;
            }

        } else if (oQueEstaFazendo === 'alterando') {
            const resposta = await fetch(`${URL_API}/fornecedores/${id_fornecedor}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dadosfornecedor)
            });

            const data = await resposta.json();

            if (data.sucesso) {
                mostrarAviso("Alterado no Banco de Dados com sucesso!");
            } else {
                mostrarAviso(data.mensagem);
                return;
            }

        } else if (oQueEstaFazendo === 'excluindo') {
            const resposta = await fetch(`${URL_API}/fornecedores/${id_fornecedor}`, {
                method: 'DELETE'
            });

            const data = await resposta.json();

            if (data.sucesso) {
                mostrarAviso("Excluído do Banco de Dados!");
            } else {
                mostrarAviso(data.mensagem);
                return;
            }
        }

        visibilidadeDosBotoes('inline', 'none', 'none', 'none', 'none');

        limparAtributos();

        document.getElementById("inputId_fornecedor").value = "";

        await listar();

    } catch (erro) {
        mostrarAviso("Erro ao efetuar operação no servidor.");
    }
}

async function listar() {
    try {
        const resposta = await fetch(`${URL_API}/fornecedores/listar`);
        const data = await resposta.json();

        if (data.sucesso) {
            let texto = "";

            for (let linha of data.fornecedores) {
                texto += `
                    <div class="fornecedor-cadastrado">
                        <strong>ID:</strong> ${linha.id_fornecedor}<br>
                        <strong>Nome:</strong> ${linha.nome_fornecedor}<br>
                        <strong>CNPJ:</strong> ${linha.cnpj_fornecedor}<br>
                        <strong>Telefone:</strong> ${linha.telefone_fornecedor}<br>
                        <strong>E-mail:</strong> ${linha.email_fornecedor}<br>
                    </div>
                    <hr>
                `;
            }

            document.getElementById("outputSaida").innerHTML =
                texto || "Nenhum fornecedor cadastrado.";

        } else {
            document.getElementById("outputSaida").innerHTML =
                "Erro ao listar fornecedores.";
        }

    } catch (erro) {
        document.getElementById("outputSaida").innerHTML =
            "Servidor offline.";
    }
}

function cancelarOperacao() {
    limparAtributos();

    bloquearAtributos(true);

    visibilidadeDosBotoes('inline', 'none', 'none', 'none', 'none');

    mostrarAviso("Cancelou a operação");
}

function mostrarAviso(mensagem) {
    document.getElementById("divAviso").innerHTML = mensagem;
}

function mostrarDadosfornecedor(p) {
    document.getElementById("inputId_fornecedor").value = p.id_fornecedor;
    document.getElementById("inputnome_fornecedor").value = p.nome_fornecedor;
    document.getElementById("inputcnpj_fornecedor").value = p.cnpj_fornecedor || "";
    document.getElementById("inputtelefone_fornecedor").value = p.telefone_fornecedor || "";
    document.getElementById("inputemail_fornecedor").value = p.email_fornecedor || "";

    bloquearAtributos(true);
}

function limparAtributos() {
    fornecedor = null;
    oQueEstaFazendo = '';

    document.getElementById("inputnome_fornecedor").value = "";
    document.getElementById("inputcnpj_fornecedor").value = "";
    document.getElementById("inputtelefone_fornecedor").value = "";
    document.getElementById("inputemail_fornecedor").value = "";

    bloquearAtributos(true);
}

function bloquearAtributos(soLeitura) {
    document.getElementById("inputId_fornecedor").readOnly = !soLeitura;
    document.getElementById("inputnome_fornecedor").readOnly = soLeitura;
    document.getElementById("inputcnpj_fornecedor").readOnly = soLeitura;
    document.getElementById("inputtelefone_fornecedor").readOnly = soLeitura;
    document.getElementById("inputemail_fornecedor").readOnly = soLeitura;
}

function visibilidadeDosBotoes(btP, btI, btA, btE, btS) {
    document.getElementById("btProcure").style.display = btP;
    document.getElementById("btInserir").style.display = btI;
    document.getElementById("btAlterar").style.display = btA;
    document.getElementById("btExcluir").style.display = btE;
    document.getElementById("btSalvar").style.display = btS;
    document.getElementById("btCancelar").style.display = btS;
}