async function editTask() {

    try {
        const tarefaId = document.getElementById('tarefaId').value;
        const titulo = document.getElementById('titulo').value;
        const descricao = document.getElementById('descricao').value;
        const prioridadeNv = document.querySelector('input[name="prioridade"]:checked').value;
        const categoriaNv = document.querySelector('input[name="categoria"]:checked').value;
    
        const response = await fetch(`https://unex-studyflow.onrender.com/tarefa/${tarefaId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': getCookie('auth')
            },
            body: JSON.stringify({
                titulo,
                descricao,
                prioridadeNv,
                categoriaNv
            })
        }) 

     

        if (response.ok) {
            const data = await response.json();
            console.log('Tarefa Editada:', data);

            Swal.fire({
                position: "center",
                icon: "success",
                title: "Editado com sucesso!",
                showConfirmButton: false,
                timer: 1500
              }).then((result) => {          
                window.location.href = './home.html';
            });
        }else{
            const errorData = await response.json(); // Captura a resposta de erro

            Swal.fire({
                position: "center",
                icon: "error",
                title: errorData.mensagem || 'Erro ao Editar.',
                showConfirmButton: false,
                timer: 1500
              }).then((result) => {
                location.reload(true)           
            });        
        }
      
    } catch (error) {
        console.error('Erro na requisição:', error);
    }    
    
}

document.querySelector('.btn-primary').addEventListener('click', function() {editTask()})
