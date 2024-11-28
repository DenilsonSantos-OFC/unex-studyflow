async function createTarefa(e) {
    e.preventDefault(); // Impede o comportamento padrão do botão

    const titulo = document.getElementById('titulo').value;
    const descricao = document.getElementById('descricao').value;
    const prioridadeNv = document.querySelector('input[name="prioridade"]:checked').value;
    const categoriaNv = document.querySelector('input[name="categoria"]:checked').value;


    try {
        const response = await fetch('https://unex-studyflow.onrender.com/tarefa', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': getCookie('auth') 
            },
            body: JSON.stringify({ titulo, descricao, prioridadeNv, categoriaNv }), 
        });


        if (response.ok) {
            
            Swal.fire({
                position: "center",
                icon: "success",
                title: "Cadastro bem-sucedido!",
                showConfirmButton: false,
                timer: 1500
              }).then((result) => {
                window.location.href = './home.html'; // Altere para a URL da sua página de edição
            });

           
        } else {
            const errorData = await response.json(); // Captura a resposta de erro
            
            Swal.fire({
                position: "center",
                icon: "error",
                title: errorData.mensagem || 'Erro ao Criar .',
                showConfirmButton: false,
                timer: 1500
              }).then((result) => {
                window.location.href = './home.html'; // Altere para a URL da sua página de edição
            });
        }
    } catch (error) {
        console.error('Erro:', error);
        Swal.fire({
            position: "center",
            icon: "error",
            title: 'Erro ao fazer a requisição. Tente novamente.',
            showConfirmButton: false,
            timer: 1500
          }).then((result) => {
            window.location.href = './home.html'; // Altere para a URL da sua página de edição
        });
    }
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}



