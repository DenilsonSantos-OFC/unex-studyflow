async function fetchData() {
    const token = sessionStorage.getItem('auth_token');

    const response = await fetch('https://api.example.com/protected-data', {
        method: 'GET',
        headers: {
        'Authorization': `Bearer ${token}`, // Adiciona o token ao cabeçalho
        },
    });

    if (response.ok) {
        const data = await response.json();
        console.log('Dados protegidos:', data);
    } else {
        console.error('Erro ao acessar dados protegidos.');
    }
}
