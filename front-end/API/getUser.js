async function fetchUserProfile(event) {
    event.preventDefault(); // Impede o comportamento padrão do botão
        
    try {
        const response = await fetch('https://unex-studyflow.onrender.com/perfil', {
            method: 'GET', 
            headers: {
                'Content-Type': 'application/json',
            }
        });


        console.log({
            method: 'GET', 
            headers: {
                'Content-Type': 'application/json',

            }
        })
        console.log(response.ok);
        
        if (response.ok) {
            const data = await response.json();
            console.log('Dados do perfil:', data);

            // Armazenar os dados em uma lista
            const userProfile = [
                data.registro.nome,
                data.registro.email,
                data.registro.dataDeNascimento,
                data.avatar
            ];

            console.log('Perfil do usuário:', userProfile);
        } else {
            console.error('Erro ao acessar dados do perfil.');
            const data = await response.json();
            console.log('Dados do perfil:', data);
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
    }
}


