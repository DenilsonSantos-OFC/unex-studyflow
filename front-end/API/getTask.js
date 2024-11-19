
// Função para obter parâmetros da URL
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// Quando a página é carregada, busque a tarefa
window.onload = getTask();



async function getTask() {
    const tarefaId = getUrlParameter('id');
    
    if (tarefaId) {
        fetch(`https://unex-studyflow.onrender.com/tarefa/${tarefaId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': getCookie('auth')
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao buscar a tarefa');
            }
            return response.json();
        })
        .then(data => {
            let tarefa = data.objeto; // Supondo que a resposta tenha a estrutura correta
            tarefa = tarefa[0]

            // Preencher os inputs com os dados da tarefa
            document.getElementById('titulo').value = tarefa.titulo;
            document.getElementById('descricao').value = tarefa.descricao;

            // Atualiza o campo oculto com o ID da tarefa
            document.getElementById('tarefaId').value = tarefaId;

            // Se necessário, marque a prioridade e a categoria
            document.querySelector(`input[name="prioridade"][value="${tarefa.prioridadeNv}"]`).checked = true;
            document.querySelector(`input[name="categoria"][value="${tarefa.categoriaNv}"]`).checked = true;
        })
        .catch(error => {
            console.error('Erro ao buscar a tarefa:', error);
        });
    }
};

