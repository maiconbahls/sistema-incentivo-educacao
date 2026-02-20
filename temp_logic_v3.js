// -- INTEGRAÇÃO COM EXCEL (OTIMIZADA V3) --
/*
   Nova lógica: Não carrega nada no início.
   Só busca quando o usuário clica em "Acessar".
   Isso evita o timeout inicial e erros de conexão.
*/

let excelData = []; // Mantido vazio por compatibilidade
let currentStep = 1;

const GOOGLE_API_URL = "https://script.google.com/macros/s/AKfycbxy86uki6EAbqjEao1q-qyv-cftT15uccQ115ZcvHTLq3Zv-odPCZbC2ZyGJRqvjtJuEg/exec";

// --- NOVA FUNÇÃO DE BUSCA ---
async function fetchColaborador(matricula) {
    const loader = document.getElementById('loading');
    const errorBox = document.getElementById('login-error');

    errorBox.style.display = 'none';
    errorBox.innerText = "";
    loader.classList.add('active');

    try {
        // Timeout aumentado para 20s para garantir conexão lenta
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 20000);

        const url = `${GOOGLE_API_URL}?matricula=${encodeURIComponent(matricula)}&no-cache=${Date.now()}`;

        console.log("Conectando API:", url);

        const response = await fetch(url, {
            method: 'GET',
            redirect: 'follow',
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (!response.ok) throw new Error("Erro HTTP " + response.status);

        const result = await response.json();

        if (result.error) throw new Error(result.error);
        if (!result || Object.keys(result).length === 0) return null; // Não achou

        return result;

    } catch (error) {
        console.error("Erro Fetch:", error);

        let msg = "Erro desconhecido ao conectar.";
        if (error.name === 'AbortError') msg = "A conexão demorou muito e foi cancelada (Timeout).";
        else if (error.message) msg = error.message;

        errorBox.innerHTML = `⚠️ <b>Erro de Conexão</b><br>${msg}<br><button class='btn btn-sm btn-secondary mt-2' onclick='location.reload()'>Recarregar Página</button>`;
        errorBox.style.display = 'block';
        return null;
    } finally {
        loader.classList.remove('active');
    }
}

function toBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

// Função auxiliar robusta para achar colunas
function findVal(obj, variations) {
    if (!obj) return null;
    const keys = Object.keys(obj);
    const normalize = (str) => String(str).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "").trim();

    for (let v of variations) {
        const target = normalize(v);
        for (let k of keys) {
            const key = normalize(k);
            // Match exato
            if (key === target) return obj[k];
            // Match parcial seguro
            if (key.includes(target) && target.length > 3) return obj[k];
        }
    }
    return null;
}

// REMOVIDO initExcel no start.
// document.addEventListener('DOMContentLoaded', initExcel); => NÃO EXISTE MAIS
