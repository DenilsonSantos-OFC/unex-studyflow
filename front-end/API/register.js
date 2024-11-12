// Função de Cadastro
async function register() {
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
  
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log('Usuário cadastrado:', data);
        alert('Cadastro bem-sucedido!');
      } else {
        alert('Erro ao fazer cadastro.');
      }
    } catch (error) {
      console.error('Erro:', error);
    }
}