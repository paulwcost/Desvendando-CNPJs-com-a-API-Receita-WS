document.getElementById('consultarBtn').addEventListener('click', function() {
    const cnpj = document.getElementById('cnpjInput').value.trim();
    const resultadoDiv = document.getElementById('resultado');

    if (!cnpj || !/^\d{14}$/.test(cnpj)) {
        resultadoDiv.innerHTML = '<p>Por favor, digite um CNPJ válido (somente números).</p>';
        return;
    }

    // Usando o proxy AllOrigins para evitar bloqueio CORS
    const url = `https://api.allorigins.win/get?url=https://receitaws.com.br/v1/cnpj/${cnpj}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao consultar CNPJ.');
            }
            return response.json();
        })
        .then(data => {
            const parsedData = JSON.parse(data.contents); // Decodifica a resposta JSON dentro do AllOrigins

            if (parsedData.status === 'OK') {
                resultadoDiv.innerHTML = `
                    <p><strong>Nome:</strong> ${parsedData.nome}</p>
                    <p><strong>Situação:</strong> ${parsedData.situacao}</p>
                    <p><strong>Atividade Principal:</strong> ${parsedData.atividade_principal[0].text}</p>
                `;
            } else {
                resultadoDiv.innerHTML = `<p>${parsedData.mensagem || 'CNPJ não encontrado.'}</p>`;
            }
        })
        .catch(error => {
            resultadoDiv.innerHTML = `<p>Erro: ${error.message}</p>`;
        });
});
