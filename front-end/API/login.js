async function login(event) {
    event.preventDefault(); // Impede o comportamento padrão do botão
  
    const email = document.getElementById('Email').value;
    const password = document.getElementById('Password').value;
    
console.log(email+" "+ password)

    console.log( {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    })
  
    try {
      const response = await fetch('https://unex-studyflow.onrender.com/autenticar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
        
      if (response.ok) {
        
        // const data = await response.json();
        // sessionStorage.setItem('auth_token', data.token);
        // console.log('Login bem-sucedido e token armazenado no sessionStorage');
        // window.location.href = '/front-end/views/home.html';
      } else {
        alert('Erro ao fazer login.');
      }
    } catch (error) {
      console.error('Erro:', error);
    }
  }
  

  
//   function logout() {
//     sessionStorage.removeItem('auth_token');
//     console.log('Logout realizado e token removido do sessionStorage');
//   }

  
//   async function fetchData() {
//     const token = sessionStorage.getItem('auth_token');
  
//     const response = await fetch('https://api.example.com/protected-data', {
//       method: 'GET',
//       headers: {
//         'Authorization': `Bearer ${token}`, // Adiciona o token ao cabeçalho
//       },
//     });
  
//     if (response.ok) {
//       const data = await response.json();
//       console.log('Dados protegidos:', data);
//     } else {
//       console.error('Erro ao acessar dados protegidos.');
//     }
//   }
  