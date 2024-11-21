// Importa a função populateProfile
// (Se você estiver usando módulos, caso contrário, apenas certifique-se de que o arquivo esteja incluído no HTML)

document.addEventListener('DOMContentLoaded', function(e) {
    fetchUserProfile(e)
});

async function fetchUserProfile(event) {
    event.preventDefault(); // Impede o comportamento padrão do botão
        
    try {
        const response = await fetch('https://unex-studyflow.onrender.com/perfil', {
            method: 'GET', 
            headers: {
                'Content-Type': 'application/json',
                'Authorization': getCookie('auth') 
            }
        });

        if (response.ok) {
            const data = await response.json();
            // Chama a função populateProfile para preencher os inputs
            populateProfile(data);
        } else {
            console.error('Erro ao acessar dados do perfil.');
            Swal.fire({
                icon: "error",
                title: error.response?.data?.mensagem || error.message || 'Erro ao pegar Usuario.',
            }).then((result) => {
                window.location.href = '../';
            });
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
    }
}

