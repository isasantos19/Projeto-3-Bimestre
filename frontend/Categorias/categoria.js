const URL_API = 'http://localhost:3001';

let oQueEstaFazendo = '';
let categoria = null;

bloquearAtributos(true);

async function inicializar() {
    await listar();
}

async function procurePorChavePrimaria(chave) {
    try {
        const resposta = await fetch(`${URL_API}/categorias/${chave}`);
        const data = await resposta.json();
        return data.sucesso ? data.categoria : null;
    } catch (erro) {
        return null;
    }
}

async function procure() {
    const id_categoria = document.getElementById("inputId_categoria").value;

    if (id_categoria === "" || isNaN(id_categoria) || !Number.isInteger(Number(id_categoria))) {
        mostrarAviso("Precisa ser um número inteiro");
        return;
    }

    categoria = await procurePorChavePrimaria(id_categoria);
    oQueEstaFazendo = '';

    if (categoria) {
        mostrarDadoscategoria(categoria);
        visibilidadeDosBotoes('inline', 'none', 'inline', 'inline', 'none');
        mostrarAviso("Achou no banco, pode alterar ou excluir");
    } else {
        limparAtributos();
        document.getElementById("inputId_categoria").value = id_categoria;
        visibilidadeDosBotoes('inline', 'inline', 'none', 'none', 'none');
        mostrarAviso("Não achou no banco, pode inserir");
    }
}

function inserir() {
    bloquearAtributos(false);
    visibilidadeDosBotoes('none', 'none', 'none', 'none', 'inline');
    oQueEstaFazendo = 'inserindo';
    mostrarAviso("INSERINDO - Digite os atributos e clique em salvar");
}

function alterar() {
    bloquearAtributos(false);
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
    const id_categoria = document.getElementById("inputId_categoria").value;
    const nome_categoria = document.getElementById("inputnome_categoria").value;
    const descricao_categoria = document.getElementById("inputdescricao_categoria").value;
    const tipo_categoria = document.getElementById("inputtipo_categoria").value;

    if (nome_categoria === "") {
        mostrarAviso("O nome da categoria é obrigatório");
        return;
    }

    if (descricao_categoria === "") {
        mostrarAviso("A descrição da categoria é obrigatória");
        return;
    }

    if (tipo_categoria === "") {
        mostrarAviso("O tipo da categoria é obrigatório");
        return;
    }

    const dadoscategoria = {
        id_categoria,
        nome_categoria,
        descricao_categoria,
        tipo_categoria
    };

    try {
        if (oQueEstaFazendo === 'inserindo') {
            const resposta = await fetch(`${URL_API}/categorias`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dadoscategoria)
            });

            const data = await resposta.json();

            if (data.sucesso) {
                mostrarAviso("Inserido no Banco de Dados com sucesso!");
            } else {
                mostrarAviso(data.mensagem);
                return;
            }

        } else if (oQueEstaFazendo === 'alterando') {
            const resposta = await fetch(`${URL_API}/categorias/${id_categoria}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dadoscategoria)
            });

            const data = await resposta.json();

            if (data.sucesso) {
                mostrarAviso("Alterado no Banco de Dados com sucesso!");
            } else {
                mostrarAviso(data.mensagem);
                return;
            }

        } else if (oQueEstaFazendo === 'excluindo') {
            const resposta = await fetch(`${URL_API}/categorias/${id_categoria}`, {
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
        document.getElementById("inputId_categoria").value = "";
        await listar();

    } catch (erro) {
        mostrarAviso("Erro ao efetuar operação no servidor.");
    }
}

async function listar() {
    try {
        const resposta = await fetch(`${URL_API}/categorias/listar`);
        const data = await resposta.json();

        if (data.sucesso) {
            let texto = "";

            for (let linha of data.categorias) {
                texto += `
                    <div class="categoria-cadastrada">
                        <strong>ID:</strong> ${linha.id_categoria}<br>
                        <strong>Nome:</strong> ${linha.nome_categoria}<br>
                        <strong>Tipo:</strong> ${linha.tipo_categoria}<br>
                    </div>
                    <hr>
                `;
            }

            document.getElementById("outputSaida").innerHTML =
                texto || "Nenhuma categoria cadastrada.";
        } else {
            document.getElementById("outputSaida").innerHTML =
                "Erro ao listar categorias.";
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

function mostrarDadoscategoria(p) {
    document.getElementById("inputId_categoria").value = p.id_categoria;
    document.getElementById("inputnome_categoria").value = p.nome_categoria;
    document.getElementById("inputdescricao_categoria").value = p.descricao_categoria || "";
    document.getElementById("inputtipo_categoria").value = p.tipo_categoria || "";
    bloquearAtributos(true);
}

function limparAtributos() {
    categoria = null;
    oQueEstaFazendo = '';
    document.getElementById("inputnome_categoria").value = "";
    document.getElementById("inputdescricao_categoria").value = "";
    document.getElementById("inputtipo_categoria").value = "";
    bloquearAtributos(true);
}

function bloquearAtributos(soLeitura) {
    document.getElementById("inputId_categoria").readOnly = !soLeitura;
    document.getElementById("inputnome_categoria").readOnly = soLeitura;
    document.getElementById("inputdescricao_categoria").readOnly = soLeitura;
    document.getElementById("inputtipo_categoria").readOnly = soLeitura;
}

function visibilidadeDosBotoes(btP, btI, btA, btE, btS) {
    document.getElementById("btProcure").style.display = btP;
    document.getElementById("btInserir").style.display = btI;
    document.getElementById("btAlterar").style.display = btA;
    document.getElementById("btExcluir").style.display = btE;
    document.getElementById("btSalvar").style.display = btS;
    document.getElementById("btCancelar").style.display = btS;
}