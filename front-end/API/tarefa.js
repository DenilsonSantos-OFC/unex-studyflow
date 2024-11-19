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
            const data = await response.json();
            console.log('Tarefa cadastrada:', data);
            alert('Cadastro bem-sucedido!');
            window.location.href = './home.html'; // Altere para a URL da sua página de edição

           
        } else {
            const errorData = await response.json(); // Captura a resposta de erro
            alert(`Erro: ${errorData.mensagem || 'Erro ao cadastrar.'}`); // Exibe a mensagem de erro
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao fazer a requisição. Tente novamente.');
    }
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}



