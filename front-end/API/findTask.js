async function search() {
    const keyword1 = document.getElementById('searchInput').value;
    const keyword2 = document.getElementById('searchInput2').value; // Obtém o valor de searchInput2
    const taskList = document.getElementById('taskList');
    const taskBody = document.querySelector('.taskBody'); // Referência ao taskBody

    // Verifica se keyword1 ou keyword2 estão vazias
    if (!keyword1 && !keyword2) {
        taskList.style.display = 'none'; // Oculta o taskList se ambas as keywords estiverem vazias
        taskBody.style.display = 'none'; // Oculta o taskBody
        Swal.fire({
            position: "center",
            icon: "warning",
            title: 'Por favor, insira uma palavra-chave.',
            showConfirmButton: true,
        });
        return; // Interrompe a execução se ambas as keywords estiverem vazias
    }

    // Use uma das keywords para a pesquisa, por exemplo, keyword1
    const keyword = keyword1 || keyword2; // Usa keyword1 se disponível, caso contrário, usa keyword2

    try {
        const response = await fetch(`https://unex-studyflow.onrender.com/tarefas/filtro?keyword=${keyword}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': getCookie('auth')
            }
        });

        if (response.ok) {
            const data = await response.json();
            displayFilteredTasks(data.objeto); // Chama a função para exibir as tarefas filtradas
            taskList.style.display = 'block'; // Mostra o taskList quando há resultados
            taskBody.style.display = 'block'; // Mostra o taskBody quando há resultados
        } else {
            const errorData = await response.json();
            Swal.fire({
                position: "center",
                icon: "error",
                title: errorData.mensagem || 'Erro ao buscar tarefas.',
                showConfirmButton: false,
                timer: 1500
            });
            taskList.style.display = 'none'; // Oculta o taskList em caso de erro
            taskBody.style.display = 'none'; // Oculta o taskBody em caso de erro
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
        Swal.fire({
            position: "center",
            icon: "error",
            title: 'Erro na requisição: ' + error,
            showConfirmButton: false,
        }).then((result) => {
            location.reload(true);
        });
        taskList.style.display = 'none'; // Oculta o taskList em caso de erro
        taskBody.style.display = 'none'; // Oculta o taskBody em caso de erro
    }
}

// Adiciona um evento de clique para o botão associado a searchInput2
document.getElementById('searchButton2').addEventListener('click', function() {
    search(); // Chama a função search ao clicar no botão
});

// Adiciona um evento de clique fora do taskList
document.addEventListener('click', function(event) {
    const taskList = document.getElementById('taskList');
    const searchInput = document.getElementById('searchInput');
    const searchInput2 = document.getElementById('searchInput2');
    const taskBody = document.querySelector('.taskBody'); // Referência ao taskBody

    // Verifica se o clique foi fora do taskList e dos campos de pesquisa
    if (!taskList.contains(event.target) && !searchInput.contains(event.target) && !searchInput2.contains(event.target)) {
        taskList.style.display = 'none'; // Oculta o taskList
        taskBody.style.display = 'none'; // Oculta o taskBody
    }
});

function displayFilteredTasks(tarefas) {
    const taskList = document.getElementById('taskList');
    if (!taskList) {
        console.error('Elemento taskList não encontrado.');
        return; // Interrompe a execução se o elemento não for encontrado
    }
    taskList.innerHTML = ''; // Limpa a lista de tarefas existente

    if (tarefas.length === 0) {
        taskList.innerHTML = '<p>Nenhuma tarefa encontrada.</p>';

        return;
    }

    tarefas.forEach(task => {
        const { id, titulo, descricao: texto, prioridadeNv: nivel } = task; // Desestruturação do objeto
        let cor = ""; // Inicializa a cor

        // Define a cor de acordo com o nível
        switch (nivel) {
            case 1: // Alta
                cor = "vermelho"; 
                break;
            case 2: // Média
                cor = "amarelo"; 
                break;
            case 3: // Baixa
                cor = "verde"; 
                break;
            default:
                cor = "cinza"; // Cor padrão
                break;
        }

        // Adicionando a estrutura interna da tarefa
        const tarefa = document.createElement('div');
        tarefa.className = 'tarefas';
        tarefa.innerHTML = `
            <div class="nav-tarefas"> 
                
            <div class="titulo">
                <h3>${titulo}</h3>
            </div>
            <div class="texto">
                <p>${texto}</p>
            </div>
            </div>
        `;
        taskList.appendChild(tarefa); // Adiciona a tarefa ao taskList
    });
}
