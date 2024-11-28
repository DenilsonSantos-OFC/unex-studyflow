async function EditUser(e) {
    e.preventDefault(); 

    try {
        // Preencher os inputs com os dados do perfil
        const nome = document.getElementById('nome').value ;
        const email = document.getElementById('email').value ;
        const dataDeNascimento = document.getElementById('birthDate').value;
        const senha = document.getElementById('password').value;
        const genero = document.getElementById('genderSelect').value;
        const profileImage = document.querySelector('.perfil-img').src;
        const profileImage2 = document.querySelector('.perfil-img2').src;
        
        const response = await fetch('https://unex-studyflow.onrender.com/perfil', {
            method: 'PUT', 
            headers: {
                'Content-Type': 'application/json',
                'Authorization': getCookie('auth') 
            },
            body: JSON.stringify({ nome, genero, email, senha, dataDeNascimento })
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Usuário Editado:', data);
            Swal.fire({
                position: "center",
                icon: "success",
                title: "Editado com sucesso!",
                showConfirmButton: false,
                timer: 1500
              }).then((result) => {          
                location.reload(true)           
            });

        }else{
            const errorData = await response.json(); // Captura a resposta de erro
            Swal.fire({
                position: "center",
                icon: "error",
                title: errorData.mensagem || 'Erro ao Editar.',
                showConfirmButton: false,
                timer: 1500
              }).then((result) => {
                location.reload(true)           
            });         }

      
    } catch (error) {
        console.error('Erro na requisição:', error);
    }    
    
}