async function register(e) {
    e.preventDefault(); // Impede o comportamento padrão do botão

    const nome = document.getElementById('CNome').value;
    const email = document.getElementById('CEmail').value;
    const senha = document.getElementById('CPassword').value;

    try {
        // Primeiro, tente autenticar o usuário com o email fornecido
        const loginResponse = await fetch('https://unex-studyflow.onrender.com/autenticar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, senha }), // Use uma senha qualquer para a verificação
        });

        if (loginResponse.ok) {
            // Se a autenticação for bem-sucedida, significa que o email já está cadastrado
            alert('Este email já está cadastrado. Tente outro.');
            return; // Interrompe a função de cadastro
        }

        // Se a autenticação falhar, significa que o email não está cadastrado
        const response = await fetch('https://unex-studyflow.onrender.com/perfil', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nome, email, senha }), // Enviando o JSON
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Usuário cadastrado:', data);
            alert('Cadastro bem-sucedido!');
            
            loginAfterRegister(email, senha)
            // Redirecionar ou limpar o formulário, se necessário
        } else {
            const errorData = await response.json(); // Captura a resposta de erro
            alert(`Erro: ${errorData.mensagem || 'Erro ao cadastrar.'}`); // Exibe a mensagem de erro

        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao fazer a requisição. Tente novamente.');
    }
}


async function loginAfterRegister(email, senha) {
    const event = new Event('submit'); // Cria um evento de submit
    const loginForm = document.getElementById('loginForm'); // Obtém o formulário de login

    // Preenche os campos de email e senha
    document.getElementById('Email').value = email;
    document.getElementById('Password').value = senha;

    // Chama a função login
    await login(event);
}