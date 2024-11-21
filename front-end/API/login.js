async function login(event) {
    event.preventDefault(); // Impede o comportamento padrão do botão
  
    const email = document.getElementById('Email').value;
    const password = document.getElementById('Password').value;

    try {
        const response = await fetch('https://unex-studyflow.onrender.com/autenticar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, senha: password }), // Ajuste para "senha" no corpo
        });

        if (response.ok) {
            const data = await response.json();
            const token = data.objeto.token; 
            console.log(token);
            await salvarAuth(token);
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
    const nome = 'auth';
    document.cookie = `${nome}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    console.log('Logout realizado e token removido do sessionStorage');
}


async function salvarAuth(token) {
    const nome = 'auth';
    const ttl = 604800000;
    // const dominio = 'unex-studyflow.onrender.com';
    document.cookie = `${nome}=${token}; expires=${new Date(Date.now() + ttl).toUTCString()}; path=/; sameSite=None; secure=true;`
}



  
