// -- LÓGICA LOGIN OTIMIZADA --
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const matriculaInput = document.getElementById('user-matricula').value.trim();
    if (!matriculaInput) return;

    // Busca os dados na nuvem SOMENTE agora
    const colab = await fetchColaborador(matriculaInput);

    // Verifica se a busca retornou null (não encontrado ou erro) ou se o objeto está vazio
    if (!colab) {
        const errorBox = document.getElementById('login-error');
        if (errorBox.innerHTML === "") errorBox.innerText = "Matrícula não encontrada.";
        errorBox.style.display = 'block';
        return;
    }

    // Mapeamento
    const nome = findVal(colab, ['colaborador', 'nome', 'nome completo']);
    const cargo = findVal(colab, ['descrição cargo', 'descricao cargo', 'descrição do cargo', 'cargo']);
    const local = findVal(colab, ['descrição local', 'descricao local', 'descrição do local', 'setor']);
    const diretoria = findVal(colab, ['diretoria', 'diretoria regional']);
    const unidade = findVal(colab, ['unidade', 'filial', 'local']);

    const dataAdmissaoRaw = findVal(colab, ['admissao', 'admissão', 'data admissao', 'dt_adm']);
    let tempoMeses = 0;

    if (dataAdmissaoRaw) {
        let dataAdm;
        if (typeof dataAdmissaoRaw === 'number') {
            dataAdm = new Date(Math.round((dataAdmissaoRaw - 25569) * 86400 * 1000));
        } else {
            const partes = String(dataAdmissaoRaw).split('/');
            if (partes.length === 3) {
                dataAdm = new Date(partes[2], partes[1] - 1, partes[0]);
            } else {
                dataAdm = new Date(dataAdmissaoRaw);
            }
        }

        if (dataAdm && !isNaN(dataAdm.getTime())) {
            const hoje = new Date();
            const diffTime = Math.abs(hoje - dataAdm);
            tempoMeses = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30.44));
        }
    }

    if (tempoMeses < 3) {
        alert(`Requisito de 3 meses não atingido. (Tempo calculado: ${tempoMeses} meses).`);
        return;
    }

    // Verifica se achou os dados críticos
    if (!cargo || !local) {
        console.warn("Dados incompletos:", colab);
        // Opcional: Avisar o usuário ou deixar passar
    }

    localStorage.setItem('currentUser', JSON.stringify(colab));
    document.getElementById('display-user').innerText = nome || 'Colaborador';

    document.getElementById('conf-nome').innerText = nome || '-';
    document.getElementById('conf-cargo').innerText = cargo || '-';
    document.getElementById('conf-local').innerText = local || '-';
    document.getElementById('conf-diretoria').innerText = diretoria || '-';
    document.getElementById('conf-unidade').innerText = unidade || '-';
    document.getElementById('conf-tempo').innerText = `${tempoMeses} meses`;

    document.getElementById('user-phone').value = '';

    showSection('view-form');
});
