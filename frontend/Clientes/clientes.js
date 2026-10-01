const URL_API = 'http://localhost:3001';

let oQueEstaFazendo = '';
let cliente = null;

bloquearAtributos(true);

async function inicializar() {
    await listar();
}

async function procurePorChavePrimaria(chave) {
    try {
        const resposta = await fetch(`${URL_API}/clientes/${chave}`);
        const data = await resposta.json();
        return data.sucesso ? data.cliente : null;
    } catch (erro) {
        return null;
    }
}

async function procure() {
    const id_cliente = document.getElementById("inputId_cliente").value.trim();

    if (id_cliente === "") {
        mostrarAviso("Informe o ID do cliente.");
        return;
    }

    if (isNaN(id_cliente) || !Number.isInteger(Number(id_cliente))) {
        mostrarAviso("O ID deve ser um número inteiro.");
        return;
    }

    cliente = await procurePorChavePrimaria(id_cliente);
    oQueEstaFazendo = '';

    if (cliente) {
        mostrarDadoscliente(cliente);
        visibilidadeDosBotoes('inline', 'none', 'inline', 'inline', 'none');
        mostrarAviso("Achou no banco, pode alterar ou excluir.");
    } else {
        limparAtributos();
        document.getElementById("inputId_cliente").value = id_cliente;
        visibilidadeDosBotoes('inline', 'inline', 'none', 'none', 'none');
        mostrarAviso("Não achou no banco, pode inserir.");
    }
}

function inserir() {
    bloquearAtributos(false);
    visibilidadeDosBotoes('none', 'none', 'none', 'none', 'inline');
    oQueEstaFazendo = 'inserindo';
    mostrarAviso("INSERINDO - Preencha os dados e clique em salvar.");
}

function alterar() {
    bloquearAtributos(false);
    visibilidadeDosBotoes('none', 'none', 'none', 'none', 'inline');
    oQueEstaFazendo = 'alterando';
    mostrarAviso("ALTERANDO - Modifique os dados e clique em salvar.");
}

function excluir() {
    bloquearAtributos(true);
    visibilidadeDosBotoes('none', 'none', 'none', 'none', 'inline');
    oQueEstaFazendo = 'excluindo';
    mostrarAviso("EXCLUINDO - Clique em salvar para confirmar.");
}

function validarDados() {
    const id_cliente = document.getElementById("inputId_cliente").value.trim();
    const nome_cliente = document.getElementById("inputnome_cliente").value.trim();
    const cpf_cliente = document.getElementById("inputcpf_cliente").value.trim();
    const telefone_cliente = document.getElementById("inputtelefone_cliente").value.trim();
    const email_cliente = document.getElementById("inputemail_cliente").value.trim();
    const numero_cartao = document.getElementById("inputnum_cartao").value.trim();

    // VALIDAÇÃO DO ID
    if (id_cliente === "") {
        mostrarAviso("Informe o ID do cliente.");
        return false;
    }

    if (isNaN(id_cliente) || !Number.isInteger(Number(id_cliente))) {
        mostrarAviso("O ID deve ser um número inteiro.");
        return false;
    }

    // VALIDAÇÃO DO NOME
    if (nome_cliente === "") {
        mostrarAviso("Informe o nome do cliente.");
        return false;
    }

    for (let i = 0; i < nome_cliente.length; i++) {
        let caractere = nome_cliente[i];

        if (caractere !== " " && caractere.toUpperCase() === caractere.toLowerCase()) {
            mostrarAviso("O nome deve conter somente letras.");
            return false;
        }
    }

    // VALIDAÇÃO DO CPF
    if (cpf_cliente === "") {
        mostrarAviso("Informe o CPF do cliente.");
        return false;
    }

    let cpf = "";

    for (let i = 0; i < cpf_cliente.length; i++) {
        if (!isNaN(cpf_cliente[i]) && cpf_cliente[i] !== " ") {
            cpf += cpf_cliente[i];
        } else {
            mostrarAviso("O CPF deve conter somente números.");
            return false;
        }
    }

    if (cpf.length !== 11) {
        mostrarAviso("O CPF deve possuir exatamente 11 números.");
        return false;
    }

    // VALIDAÇÃO DO TELEFONE
    if (telefone_cliente === "") {
        mostrarAviso("Informe o telefone do cliente.");
        return false;
    }

    let telefone = "";

    for (let i = 0; i < telefone_cliente.length; i++) {
        if (!isNaN(telefone_cliente[i]) && telefone_cliente[i] !== " ") {
            telefone += telefone_cliente[i];
        } else {
            mostrarAviso("O telefone deve conter somente números.");
            return false;
        }
    }

    if (telefone.length !== 11) {
        mostrarAviso("O telefone deve possuir exatamente 11 números.");
        return false;
    }

    // VALIDAÇÃO DO E-MAIL
    if (email_cliente === "") {
        mostrarAviso("Informe o e-mail do cliente.");
        return false;
    }

    let possuiArroba = false;

    for (let i = 0; i < email_cliente.length; i++) {
        if (email_cliente[i] === "@") {
            possuiArroba = true;
        }
    }

    if (!possuiArroba) {
        mostrarAviso("O e-mail deve possuir @.");
        return false;
    }

    // VALIDAÇÃO DO CARTÃO
    if (numero_cartao === "") {
        mostrarAviso("Informe o número do cartão.");
        return false;
    }

    if (isNaN(numero_cartao)) {
        mostrarAviso("O número do cartão deve conter somente números.");
        return false;
    }

    return true;
}

async function salvar() {
    if (oQueEstaFazendo !== 'excluindo') {
        if (!validarDados()) {
            return;
        }
    }

    const id_cliente = document.getElementById("inputId_cliente").value.trim();
    const nome_cliente = document.getElementById("inputnome_cliente").value.trim();
    const cpf_cliente = document.getElementById("inputcpf_cliente").value.trim();
    const telefone_cliente = document.getElementById("inputtelefone_cliente").value.trim();
    const email_cliente = document.getElementById("inputemail_cliente").value.trim();
    const numero_cartao = document.getElementById("inputnum_cartao").value.trim();

    // INSERIR
    if (oQueEstaFazendo === 'inserindo') {
        const resposta = await fetch(`${URL_API}/clientes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id_cliente: Number(id_cliente),
                nome_cliente: nome_cliente,
                cpf_cliente: cpf_cliente,
                telefone_cliente: telefone_cliente,
                email_cliente: email_cliente,
                numero_cartao: numero_cartao
            })
        });

        const data = await resposta.json();

        if (data.sucesso) {
            mostrarAviso("Cliente inserido com sucesso.");
            limparAtributos();
            bloquearAtributos(true);
            visibilidadeDosBotoes('inline', 'none', 'none', 'none', 'none');
            await listar();
        } else {
            mostrarAviso(data.mensagem);
        }
    }

    // ALTERAR
    else if (oQueEstaFazendo === 'alterando') {
        const resposta = await fetch(`${URL_API}/clientes/${id_cliente}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nome_cliente: nome_cliente,
                cpf_cliente: cpf_cliente,
                telefone_cliente: telefone_cliente,
                email_cliente: email_cliente,
                numero_cartao: numero_cartao
            })
        });

        const data = await resposta.json();

        if (data.sucesso) {
            mostrarAviso("Cliente alterado com sucesso.");
            limparAtributos();
            bloquearAtributos(true);
            visibilidadeDosBotoes('inline', 'none', 'none', 'none', 'none');
            await listar();
        } else {
            mostrarAviso(data.mensagem);
        }
    }

    // EXCLUIR
    else if (oQueEstaFazendo === 'excluindo') {
        const resposta = await fetch(`${URL_API}/clientes/${id_cliente}`, {
            method: 'DELETE'
        });

        const data = await resposta.json();

        if (data.sucesso) {
            mostrarAviso("Cliente excluído com sucesso.");
            limparAtributos();
            bloquearAtributos(true);
            visibilidadeDosBotoes('inline', 'none', 'none', 'none', 'none');
            await listar();
        } else {
            mostrarAviso(data.mensagem);
        }
    }
}

async function listar() {
    try {
        const resposta = await fetch(`${URL_API}/clientes/listar`);
        const data = await resposta.json();

        if (!data.sucesso) {
            document.getElementById("outputSaida").innerHTML = "Erro ao carregar clientes.";
            return;
        }

        let texto = "";

        for (let i = 0; i < data.clientes.length; i++) {
            const cliente = data.clientes[i];

            texto += `
                <div class="cliente-cadastrado">
                    <strong>ID:</strong> ${cliente.id_cliente}<br>
                    <strong>Nome:</strong> ${cliente.nome_cliente}<br>
                    <strong>CPF:</strong> ${cliente.cpf_cliente}<br>
                    <strong>Telefone:</strong> ${cliente.telefone_cliente}<br>
                    <strong>E-mail:</strong> ${cliente.email_cliente}<br>
                    <strong>Cartão:</strong> ${cliente.numero_cartao}
                </div>
            `;
        }

        document.getElementById("outputSaida").innerHTML = texto;

    } catch (erro) {
        document.getElementById("outputSaida").innerHTML = "Erro ao conectar com o servidor.";
    }
}

function mostrarDadoscliente(cliente) {
    document.getElementById("inputId_cliente").value = cliente.id_cliente;
    document.getElementById("inputnome_cliente").value = cliente.nome_cliente;
    document.getElementById("inputcpf_cliente").value = cliente.cpf_cliente;
    document.getElementById("inputtelefone_cliente").value = cliente.telefone_cliente;
    document.getElementById("inputemail_cliente").value = cliente.email_cliente;
    document.getElementById("inputnum_cartao").value = cliente.numero_cartao;
}

function limparAtributos() {
    document.getElementById("inputId_cliente").value = "";
    document.getElementById("inputnome_cliente").value = "";
    document.getElementById("inputcpf_cliente").value = "";
    document.getElementById("inputtelefone_cliente").value = "";
    document.getElementById("inputemail_cliente").value = "";
    document.getElementById("inputnum_cartao").value = "";
}

function bloquearAtributos(bloquear) {
    document.getElementById("inputnome_cliente").disabled = bloquear;
    document.getElementById("inputcpf_cliente").disabled = bloquear;
    document.getElementById("inputtelefone_cliente").disabled = bloquear;
    document.getElementById("inputemail_cliente").disabled = bloquear;
    document.getElementById("inputnum_cartao").disabled = bloquear;
}

function visibilidadeDosBotoes(procure, inserir, alterar, excluir, salvar) {
    document.getElementById("btProcure").style.display = procure;
    document.getElementById("btInserir").style.display = inserir;
    document.getElementById("btAlterar").style.display = alterar;
    document.getElementById("btExcluir").style.display = excluir;
    document.getElementById("btSalvar").style.display = salvar;
}

function mostrarAviso(mensagem) {
    document.getElementById("divAviso").innerHTML = mensagem;
}

function cancelarOperacao() {
    limparAtributos();
    bloquearAtributos(true);
    oQueEstaFazendo = '';
    visibilidadeDosBotoes('inline', 'none', 'none', 'none', 'none');
    mostrarAviso("Informe o ID e clique em Procure");
}