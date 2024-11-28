document.getElementById('searchButton').addEventListener('click', async function() {
    const keyword = document.getElementById('searchInput').value;

    try {
        const response = await fetch(`https://unex-studyflow.onrender.com/tarefas/filtro?keyword=${encodeURIComponent(keyword)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': getCookie('auth')
            }
        });

        if (response.ok) {
            const data = await response.json();
            displayFilteredTasks(data); // Chama a função para exibir as tarefas filtradas
        } else {
            const errorData = await response.json();
            Swal.fire({
                position: "center",
                icon: "error",
                title: errorData.mensagem || 'Erro ao buscar tarefas.',
                showConfirmButton: false,
                timer: 1500
              }).then((result) => {
                location.reload(true)           
            }); 
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
    }
});

function displayFilteredTasks(tarefas) {
    const taskList = document.getElementById('taskList'); // Supondo que você tenha um elemento com esse ID para exibir as tarefas
    taskList.innerHTML = ''; // Limpa a lista de tarefas existente

    if (tarefas.length === 0) {
        taskList.innerHTML = '<p>Nenhuma tarefa encontrada.</p>';
        return;
    }

    tarefas.forEach(task => {
        const taskContainer = document.createElement('div');
        taskContainer.className = 'task';
        taskContainer.innerHTML = `
            <h3>${task.titulo} (${task.prioridadeNv})</h3>
            <p>${task.descricao}</p>
            <button class="btn-edit" onclick="window.location.href='../views/editarTarefa.html?id=${task.id}'">Editar</button>
            <button class="btn-delete" data-id="${task.id}" onclick="deletTask(this)">Deletar</button>
        `;
        taskList.appendChild(taskContainer);
    });
}
