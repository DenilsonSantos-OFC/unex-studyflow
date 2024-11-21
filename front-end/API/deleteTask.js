async function deletTask(button) {
    console.log(button);
    try {
        const tarefaId = button.getAttribute('data-id'); // Pega o ID do data-id do botão

        const response = await fetch(`https://unex-studyflow.onrender.com/tarefa/${tarefaId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': getCookie('auth')
            },
        });

        if (response.ok) {
            Swal.fire({
                position: "center",
                icon: "success",
                title: "Cadastro bem-sucedido!",
                showConfirmButton: false,
                timer: 1500
              }).then((result) => {
                location.reload(true)
                // Remove a tarefa do DOM
                button.closest('.task').remove();             
            });
            

        } else {
            const errorData = await response.json(); // Captura a resposta de erro
            alert(`Erro: ${errorData.mensagem || 'Erro ao Deletar.'}`); // Exibe a mensagem de erro
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
    }
}

