document.getElementById("consultarBtn").addEventListener("click", async function () {
    const cnpjInput = document.getElementById("cnpjInput").value.trim();
    const resultadoDiv = document.getElementById("resultado");

    function validarCNPJ(cnpj) {
        return /^[0-9]{14}$/.test(cnpj);
    }

    resultadoDiv.innerHTML = "";

    if (!validarCNPJ(cnpjInput)) {
        resultadoDiv.innerHTML = `<p class="erro">CNPJ inválido! Digite 14 números sem pontos ou traços.</p>`;
        return;
    }

    resultadoDiv.innerHTML = `<p class="carregando">Consultando...</p>`;

   
    const url = `https://cors-anywhere.herokuapp.com/https://receitaws.com.br/v1/cnpj/${cnpjInput}`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw response;
        }

        const data = await response.json();

        if (data.status === "ERROR") {
            resultadoDiv.innerHTML = `<p class="erro">Erro: ${data.message}</p>`;
            return;
        }

        resultadoDiv.innerHTML = `
            <p><strong>Nome:</strong> ${data.nome}</p>
            <p><strong>Fantasia:</strong> ${data.fantasia}</p>
            <p><strong>Situação:</strong> ${data.situacao}</p>
            <p><strong>Abertura:</strong> ${data.abertura}</p>
            <p><strong>UF:</strong> ${data.uf}</p>
        `;

    } catch (error) {
        if (error.status) {
            switch (error.status) {
                case 400:
                    resultadoDiv.innerHTML = `<p class="erro">CNPJ inválido! Verifique e tente novamente.</p>`;
                    break;
                case 404:
                    resultadoDiv.innerHTML = `<p class="erro">CNPJ não encontrado na base de dados.</p>`;
                    break;
                case 429:
                    resultadoDiv.innerHTML = `<p class="erro">Muitas requisições! Aguarde um momento antes de tentar novamente.</p>`;
                    break;
                case 500:
                case 504:
                    resultadoDiv.innerHTML = `<p class="erro">Erro no servidor da API. Tentando novamente...</p>`;
                    setTimeout(() => document.getElementById("consultarBtn").click(), 5000);
                    break;
                default:
                    resultadoDiv.innerHTML = `<p class="erro">Erro inesperado! Tente novamente mais tarde.</p>`;
            }
        } else {
            resultadoDiv.innerHTML = `<p class="erro">Erro ao conectar com a API. Verifique sua conexão.</p>`;
        }
    }
});


