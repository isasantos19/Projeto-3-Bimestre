const URL_API = 'http://localhost:3001';

let oQueEstaFazendo = '';
let estoque = null;

bloquearAtributos(true);

async function inicializar() {
    await definirDataAtual();
    await listarProdutos();
    await listar();
}

function definirDataAtual() {
    const dataHoje = new Date();
    const ano = dataHoje.getFullYear();
    const mes = String(dataHoje.getMonth() + 1).padStart(2, '0');
    const dia = String(dataHoje.getDate()).padStart(2, '0');

    const dataAtual = `${ano}-${mes}-${dia}`;

    document.getElementById("inputdata_atualizacao").value = dataAtual;
    document.getElementById("inputdata_atualizacao").min = dataAtual;
    document.getElementById("inputdata_atualizacao").max = dataAtual;
}

function formatarData(data) {
    const partes = data.split('T')[0].split('-');

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

async function listarProdutos() {
    try {
        const resposta = await fetch(`${URL_API}/produtos/listar`);
        const data = await resposta.json();

        const select = document.getElementById("inputId_produto");

        if (data.sucesso) {
            select.innerHTML = '<option value="">Selecione um produto</option>';

            for (let produto of data.produtos) {
                select.innerHTML += `
                    <option value="${produto.id_produto}">
                        ${produto.id_produto} - ${produto.nome_produto}
                    </option>
                `;
            }
        } else {
            select.innerHTML = '<option value="">Erro ao carregar produtos</option>';
        }

    } catch (erro) {
        document.getElementById("inputId_produto").innerHTML =
            '<option value="">Servidor offline</option>';
    }
}

async function procurePorChavePrimaria(chave) {
    try {
        const resposta = await fetch(`${URL_API}/estoque/${chave}`);
        const data = await resposta.json();

        return data.sucesso ? data.estoque : null;

    } catch (erro) {
        return null;
    }
}

async function procure() {
    const id_estoque = document.getElementById("inputId_estoque").value;

    if (id_estoque === "" || isNaN(id_estoque) || !Number.isInteger(Number(id_estoque))) {
        mostrarAviso("Precisa ser um número inteiro");
        return;
    }

    estoque = await procurePorChavePrimaria(id_estoque);
    oQueEstaFazendo = '';

    if (estoque) {
        mostrarDadosestoque(estoque);
        visibilidadeDosBotoes('inline', 'none', 'inline', 'inline', 'none');
        mostrarAviso("Achou no banco, pode alterar ou excluir");

    } else {
        limparAtributos();

        document.getElementById("inputId_estoque").value = id_estoque;

        definirDataAtual();

        visibilidadeDosBotoes('inline', 'inline', 'none', 'none', 'none');

        mostrarAviso("Não achou no banco, pode inserir");
    }
}

function inserir() {
    bloquearAtributos(false);

    definirDataAtual();

    visibilidadeDosBotoes('none', 'none', 'none', 'none', 'inline');

    oQueEstaFazendo = 'inserindo';

    mostrarAviso("INSERINDO - Digite os atributos e clique em salvar");
}

function alterar() {
    bloquearAtributos(false);

    definirDataAtual();

    visibilidadeDosBotoes('none', 'none', 'none', 'none', 'inline');

    oQueEstaFazendo = 'alterando';

    mostrarAviso("ALTERANDO - Modifique os atributos e clique em salvar");
}

function excluir() {
    bloquearAtributos(true);

    visibilidadeDosBotoes('none', 'none', 'none', 'none', 'inline');

    oQueEstaFazendo = 'excluindo';

    mostrarAviso("EXCLUINDO - Clique em salvar para confirmar a exclusão");
}

async function salvar() {
    const id_estoque = document.getElementById("inputId_estoque").value;
    const quantidade = document.getElementById("inputquantidade_estoque").value;
    const estoque_minimo = document.getElementById("inputestoque_minimo").value;
    const data_atualizacao = document.getElementById("inputdata_atualizacao").value;
    const id_produto = document.getElementById("inputId_produto").value;

    if (quantidade === "" || isNaN(quantidade) || !Number.isInteger(Number(quantidade))) {
        mostrarAviso("A quantidade deve ser um número inteiro");
        return;
    }

    if (estoque_minimo === "" || isNaN(estoque_minimo) || !Number.isInteger(Number(estoque_minimo))) {
        mostrarAviso("O estoque mínimo deve ser um número inteiro");
        return;
    }

    if (data_atualizacao === "") {
        mostrarAviso("A data de atualização é obrigatória");
        return;
    }

    const dataHoje = new Date();
    const ano = dataHoje.getFullYear();
    const mes = String(dataHoje.getMonth() + 1).padStart(2, '0');
    const dia = String(dataHoje.getDate()).padStart(2, '0');

    const dataAtual = `${ano}-${mes}-${dia}`;

    if (data_atualizacao !== dataAtual) {
        mostrarAviso("A data de atualização deve ser a data de hoje");
        return;
    }

    if (id_produto === "") {
        mostrarAviso("Selecione um produto");
        return;
    }

    const dadosestoque = {
        id_estoque,
        quantidade,
        estoque_minimo,
        data_atualizacao,
        id_produto
    };

    try {
        if (oQueEstaFazendo === 'inserindo') {
            const resposta = await fetch(`${URL_API}/estoque`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dadosestoque)
            });

            const data = await resposta.json();

            if (data.sucesso) {
                mostrarAviso("Inserido no Banco de Dados com sucesso!");
            } else {
                mostrarAviso(data.mensagem);
                return;
            }

        } else if (oQueEstaFazendo === 'alterando') {
            const resposta = await fetch(`${URL_API}/estoque/${id_estoque}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dadosestoque)
            });

            const data = await resposta.json();

            if (data.sucesso) {
                mostrarAviso("Alterado no Banco de Dados com sucesso!");
            } else {
                mostrarAviso(data.mensagem);
                return;
            }

        } else if (oQueEstaFazendo === 'excluindo') {
            const resposta = await fetch(`${URL_API}/estoque/${id_estoque}`, {
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

        document.getElementById("inputId_estoque").value = "";

        definirDataAtual();

        await listar();

    } catch (erro) {
        mostrarAviso("Erro ao efetuar operação no servidor.");
    }
}

async function listar() {
    try {
        const resposta = await fetch(`${URL_API}/estoque/listar`);
        const data = await resposta.json();

        if (data.sucesso) {
            let texto = "";

            for (let linha of data.estoques) {
                texto += `
                    <div class="estoque-cadastrado">
                        <strong>ID:</strong> ${linha.id_estoque}<br>
                        <strong>Quantidade:</strong> ${linha.quantidade}<br>
                        <strong>Estoque Mínimo:</strong> ${linha.estoque_minimo}<br>
                        <strong>Data de Atualização:</strong> ${formatarData(linha.data_atualizacao)}<br>
                        <strong>ID do Produto:</strong> ${linha.id_produto}<br>
                    </div>
                    <hr>
                `;
            }

            document.getElementById("outputSaida").innerHTML =
                texto || "Nenhum estoque cadastrado.";

        } else {
            document.getElementById("outputSaida").innerHTML =
                "Erro ao listar estoques.";
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

    definirDataAtual();

    mostrarAviso("Cancelou a operação");
}

function mostrarAviso(mensagem) {
    document.getElementById("divAviso").innerHTML = mensagem;
}

function mostrarDadosestoque(p) {
    document.getElementById("inputId_estoque").value = p.id_estoque;
    document.getElementById("inputquantidade_estoque").value = p.quantidade;
    document.getElementById("inputestoque_minimo").value = p.estoque_minimo || "";
    document.getElementById("inputdata_atualizacao").value = p.data_atualizacao || "";
    document.getElementById("inputId_produto").value = p.id_produto || "";

    bloquearAtributos(true);
}

function limparAtributos() {
    estoque = null;
    oQueEstaFazendo = '';

    document.getElementById("inputquantidade_estoque").value = "";
    document.getElementById("inputestoque_minimo").value = "";
    document.getElementById("inputdata_atualizacao").value = "";
    document.getElementById("inputId_produto").value = "";

    bloquearAtributos(true);
}

function bloquearAtributos(soLeitura) {
    document.getElementById("inputId_estoque").readOnly = !soLeitura;
    document.getElementById("inputquantidade_estoque").readOnly = soLeitura;
    document.getElementById("inputestoque_minimo").readOnly = soLeitura;
    document.getElementById("inputdata_atualizacao").readOnly = soLeitura;
    document.getElementById("inputId_produto").disabled = soLeitura;
}

function visibilidadeDosBotoes(btP, btI, btA, btE, btS) {
    document.getElementById("btProcure").style.display = btP;
    document.getElementById("btInserir").style.display = btI;
    document.getElementById("btAlterar").style.display = btA;
    document.getElementById("btExcluir").style.display = btE;
    document.getElementById("btSalvar").style.display = btS;
    document.getElementById("btCancelar").style.display = btS;
}