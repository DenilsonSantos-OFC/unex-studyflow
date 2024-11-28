document.addEventListener('DOMContentLoaded', function(e) {
    getAllTasks()
});



async function getAllTasks() {
    try {
        const response = await fetch('https://unex-studyflow.onrender.com/tarefas', {
            method: 'GET', 
            headers: {
                'Content-Type': 'application/json',
                'Authorization': getCookie('auth') 
            }
        });
          if (response.ok) {
              const data = await response.json();
              
              // Acessa o array de tarefas dentro do objeto
              const tarefas = data.objeto; // Acessa o array de tarefas
      
              // Verifica se tarefas é um array antes de iterar
              if (Array.isArray(tarefas)) {
                  // Classifica as tarefas nas listas apropriadas
                  tarefas.forEach(task => {
                      // Aqui você pode definir a lógica para classificar as tarefas
                      // Chama a função create para adicionar a tarefa na tela
                        let prioridade;
                        if (task.prioridadeNv === 3) {
                            prioridade = "Alta"
                        } else if(task.prioridadeNv === 2) {
                            prioridade = "Media"
                        } else {
                            prioridade = "Baixa"
                        }

                      // Adiciona o ID da tarefa ao criar
                      create(task.categoriaNv, prioridade, task.titulo, task.descricao, task.id);
                  });
              } else {
                  console.error('Os dados recebidos não são um array:', tarefas);
              }
      
          }else{
            console.error('Erro ao acessar as tarefas.');
            const errorData = await response.json(); // Captura a resposta de erro
            Swal.fire({
                position: "center",
                icon: "error",
                title: errorData.mensagem || 'Erro ao pegar tarefas.',
                showConfirmButton: false,
                timer: 1500
              }).then((result) => {
                location.reload(true)           
            }); 
          }

    } catch (error) {
        console.error('Erro ao buscar tarefas:', error);
        Swal.fire({
            icon: "error",
            title: error.response?.data?.mensagem || error.message || 'Erro ao pegar tarefas.',
        }).then((result) => {
            window.location.href = '../';
        });

    
    }
}