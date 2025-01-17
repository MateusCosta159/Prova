let registros = [];
let exibirLimite = 6;
let ordenacaoCrescente = true;
let registroSelecionado = null;

document.getElementById("meuForm").addEventListener("submit", (e) => {
    e.preventDefault();

    let nome = document.getElementById("nome").value;
    let endereco = document.getElementById("endereco").value;
    let cep = document.getElementById("cep").value;
    let telefone = document.getElementById("telefone").value;
    let foto = document.getElementById("foto").value;

    let erroNome = document.getElementById("erroNome");
    let erroFoto = document.getElementById("erroFoto");

    erroNome.textContent = validaNome(nome);
    erroFoto.textContent = validaURL(foto);

    if (erroNome.textContent !== "" || erroFoto.textContent !== "") return;

    let novoRegistro = { nome, endereco, cep, telefone, foto };
    registros.push(novoRegistro);

    document.getElementById("meuForm").reset();
    exibirGrid();
    mostrarToast();
});

// Validação do nome
function validaNome(valor) {
    for (let i = 0; i < valor.length; i++) {
        if (valor[i] >= "0" && valor[i] <= "9") {
            return "Você não pode ter número no seu nome";
        }
    }
    return "";
}

function validaURL(url) {
   
    if (!(url.startsWith("http://") || url.startsWith("https://"))) {
        return "URL inválida. Deve começar com http:// ou https://";
    }

    let partes = url.split("://");
    if (partes.length < 2 || partes[1].trim() === "") {
        return "URL inválida. O domínio está ausente.";
    }

  
    if (!partes[1].includes(".")) {
        return "URL inválida. O domínio deve conter um ponto.";
    }

    return "";
}

document.getElementById("nome").addEventListener("blur", () => {
    let campoNome = document.getElementById("nome").value;
    let erroNome = document.getElementById("erroNome");
    erroNome.textContent = validaNome(campoNome);
});

document.getElementById("foto").addEventListener("blur", () => {
    let campoFoto = document.getElementById("foto").value;
    let erroFoto = document.getElementById("erroFoto");
    erroFoto.textContent = validaURL(campoFoto);
});


// Formatação do campo CEP
document.getElementById("cep").addEventListener("input", () => {
    let campoCep = document.getElementById("cep");
    let valorCep = campoCep.value;
    let novoValor = "";

    for (let i = 0; i < valorCep.length; i++) {
        let char = valorCep[i];
        if (char >= "0" && char <= "9") {
            novoValor += char;
        }
    }

    if (novoValor.length > 5) {
        novoValor = novoValor.slice(0, 5) + "-" + novoValor.slice(5, 8);
    }

    campoCep.value = novoValor;
});

// Formatação do campo telefone
document.getElementById("telefone").addEventListener("input", () => {
    let campoTelefone = document.getElementById("telefone");
    let valorTelefone = campoTelefone.value;
    let novoValor = "";
    let numeros = "";

    // Apenas números
    for (let i = 0; i < valorTelefone.length; i++) {
        if (valorTelefone[i] >= "0" && valorTelefone[i] <= "9") {
            numeros += valorTelefone[i];
        }
    }

    if (numeros.length > 0) {
        novoValor += "(" + numeros.slice(0, 2) + ") ";
    }
    if (numeros.length > 2) {
        novoValor += numeros.slice(2, Math.min(6, numeros.length));
    }
    if (numeros.length > 6) {
        novoValor += "-" + numeros.slice(6, 10);
    }

    campoTelefone.value = novoValor;
});

// Exibição do grid
function exibirGrid() {
    let grid = document.getElementById("grid");
    grid.innerHTML = "";

    for (let i = 0; i < registros.length; i++) {
        let registro = registros[i];

        let divCol = document.createElement("div");
        divCol.classList.add("col-md-4");

        let divCard = document.createElement("div");
        divCard.classList.add("card", "mb-3");

        let img = document.createElement("img");
        img.src = registro.foto;
        img.classList.add("card-img-top");
        img.alt = "Foto";

        let divCardBody = document.createElement("div");
        divCardBody.classList.add("card-body");

        let h5 = document.createElement("h5");
        h5.classList.add("card-title");
        h5.textContent = registro.nome;

        let pEndereco = document.createElement("p");
        pEndereco.classList.add("card-text");
        pEndereco.textContent = `Endereço: ${registro.endereco}`;

        let pTelefone = document.createElement("p");
        pTelefone.classList.add("card-text");
        pTelefone.textContent = `Telefone: ${registro.telefone}`;

        let btnEditar = document.createElement("button");
        btnEditar.classList.add("btn", "btn-warning");
        btnEditar.textContent = "Editar";
        btnEditar.onclick = () => editarRegistro(i);

        let btnExcluir = document.createElement("button");
        btnExcluir.classList.add("btn", "btn-danger");
        btnExcluir.textContent = "Excluir";
        btnExcluir.onclick = () => excluirRegistro(i);

        divCardBody.appendChild(h5);
        divCardBody.appendChild(pEndereco);
        divCardBody.appendChild(pTelefone);
        divCardBody.appendChild(btnEditar);
        divCardBody.appendChild(btnExcluir);

        divCard.appendChild(img);
        divCard.appendChild(divCardBody);
        divCol.appendChild(divCard);

        grid.appendChild(divCol);
    }
}

function mostrarToast() {
    let toast = document.getElementById("toast");
    toast.classList.add("show"); 

    
    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}


function editarRegistro(index) {
    registroSelecionado = index;
    let registro = registros[index];
    
    document.getElementById("nomeEditar").value = registro.nome;
    document.getElementById("enderecoEditar").value = registro.endereco;
    document.getElementById("cepEditar").value = registro.cep;
    document.getElementById("telefoneEditar").value = registro.telefone;
    document.getElementById("foto").value = registro.foto;

    // Exibe o modal de edição
    document.getElementById("editarModal").style.display = "block";
}

function confirmarEdicao() {
    let nome = document.getElementById("nomeEditar").value;
    let endereco = document.getElementById("enderecoEditar").value;
    let cep = document.getElementById("cepEditar").value;
    let telefone = document.getElementById("telefoneEditar").value;
    let foto = document.getElementById("foto").value;

    let erroNome = validaNome(nome);
    let erroFoto = validaURL(foto);

    if (erroNome || erroFoto) {
        alert("Verifique os campos: " + erroNome + " " + erroFoto);
        return;
    }

    registros[registroSelecionado] = { nome, endereco, cep, telefone, foto };

    // Fecha o modal e atualiza o grid
    fecharModal('editarModal');
    exibirGrid();
    mostrarToast();
}

function excluirRegistro(index) {
    registroSelecionado = index;
    document.getElementById("excluirModal").style.display = "block";
}

function confirmarExclusao() {
    registros.splice(registroSelecionado, 1);

    // Fecha o modal e atualiza o grid
    fecharModal('excluirModal');
    exibirGrid();
    mostrarToast();
}

function fecharModal(idModal) {
    document.getElementById(idModal).style.display = "none";
}


function filtraGrid() {
    let filtro = document.getElementById("filtroNome").value.toLowerCase();
    registros = registros.filter(registro => registro.nome.toLowerCase().includes(filtro));
    exibirGrid();
}

function ordenarGrid() {
    registros.sort((a, b) => {
        return ordenacaoCrescente ? a.nome.localeCompare(b.nome) : b.nome.localeCompare(a.nome);
    });
    ordenacaoCrescente = !ordenacaoCrescente;
    exibirGrid();
}

function mostrarToast() {
    let toast = document.getElementById("toast");
    toast.style.display = "block";
    setTimeout(() => {
        toast.style.display = "none";
    }, 2000);
}