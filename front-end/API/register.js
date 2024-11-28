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
            Swal.fire({
                position: "center",
                icon: "error",
                title: "Este email já está cadastrado. Tente outro.",
                showConfirmButton: false,
                timer: 1500
              }).then((result) => {
                return; // Interrompe a função de cadastro
            });
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

            Swal.fire({
                position: "center",
                icon: "success",
                title: "Editado com sucesso!",
                showConfirmButton: false,
                timer: 1500
              }).then((result) => {          
                loginAfterRegister(email, senha)
            });
            
        } else {
            const errorData = await response.json(); // Captura a resposta de erro
            Swal.fire({
                position: "center",
                icon: "error",
                title: errorData.mensagem || 'Erro ao Cadastrar.',
                showConfirmButton: false,
                timer: 1500
              }).then((result) => {
                location.reload(true)           
            });

        }
    } catch (error) {
        console.error('Erro:', error);
        Swal.fire({
            position: "center",
            icon: "error",
            title: "Erro ao fazer a requisição. Tente novamente.",
            showConfirmButton: false,
          }).then((result) => {
            location.reload(true)           
        });
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