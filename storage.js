/**
 * Sistema de Gerenciamento de Dados Local (Dashboard)
 */

const Storage = {
    KEYS: {
        SUBMISSIONS: 'edu_submissions'
    },

    // Salvar nova solicitação localmente
    saveSubmission(data) {
        try {
            const submissions = this.getAllSubmissions();
            const newSubmission = {
                id: Date.now(),
                ...data,
                status: 'Pendente',
                dataSubmissao: new Date().toLocaleDateString('pt-BR')
            };
            submissions.push(newSubmission);
            localStorage.setItem(this.KEYS.SUBMISSIONS, JSON.stringify(submissions));
            return newSubmission;
        } catch (e) {
            console.error("Erro ao salvar no Storage:", e);
            return null;
        }
    },

    // Recuperar todas as solicitações
    getAllSubmissions() {
        try {
            const data = localStorage.getItem(this.KEYS.SUBMISSIONS);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error("Erro ao ler do Storage:", e);
            return [];
        }
    },

    // Estatísticas para o Dashboard
    getStats() {
        const subs = this.getAllSubmissions();
        return {
            total: subs.length,
            pending: subs.filter(s => s.status === 'Pendente').length,
            approved: subs.filter(s => s.status === 'Aprovado').length
        };
    }
};

window.AppStorage = Storage;
// console.log("Storage Service pronto.");
