async function login(event) {
    event.preventDefault(); // Impede o comportamento padrão do botão
  
    const email = document.getElementById('Email').value;
    const password = document.getElementById('Password').value;

    try {
        const response = await fetch('https://unex-studyflow.onrender.com/autenticar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, senha: password }), // Ajuste para "senha" no corpo
        });

        if (response.ok) {
            const data = await response.json();
            const token = data.objeto.token; // Acessa o token corretamente
            sessionStorage.setItem('auth_token', token); // Armazena o token no sessionStorage
            console.log('Login bem-sucedido e token armazenado no sessionStorage');

            // Redireciona o usuário para a página inicial
            window.location.href = './views/home.html';
        } else {
            const errorData = await response.json(); // Captura a resposta de erro
            alert(`Erro: ${errorData.mensagem}`); // Exibe a mensagem de erro
        }
    } catch (error) {
        console.error('Erro:', error);
    }
}
  

  
  function logout() {
    sessionStorage.removeItem('auth_token');
    console.log('Logout realizado e token removido do sessionStorage');
  }

  
