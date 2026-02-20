// Função OTIMIZADA: Busca apenas a matrícula específica
async function fetchColaborador(matricula) {
    const loader = document.getElementById('loading');
    const errorBox = document.getElementById('login-error');

    errorBox.style.display = 'none';
    errorBox.innerText = "";
    loader.classList.add('active'); // Mostra loader

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

        // Envia a matrícula como parâmetro na URL
        const url = `${GOOGLE_API_URL}?matricula=${encodeURIComponent(matricula)}&no-cache=${Date.now()}`;

        console.log("Buscando usuário:", matricula);

        const response = await fetch(url, {
            method: 'GET',
            redirect: 'follow',
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (!response.ok) throw new Error("Erro de conexão com o servidor.");

        const result = await response.json();

        // Se a API retornar um erro (ex: não encontrado)
        if (result.error) {
            throw new Error(result.error);
        }

        // Se retornou um objeto vazio ou null
        if (!result || Object.keys(result).length === 0) {
            return null; // Não encontrou
        }

        return result;

    } catch (error) {
        console.error("Erro no fetch:", error);
        if (error.name === 'AbortError') {
            errorBox.innerHTML = "Tempo limite excedido. A conexão está lenta.";
        } else {
            errorBox.innerHTML = error.message;
        }
        errorBox.style.display = 'block';
        return null;
    } finally {
        loader.classList.remove('active');
    }
}
