function populateProfile(data) {
    // Preencher os inputs com os dados do perfil
    document.getElementById('nome').value = data.objeto.registro.nome;
    document.getElementById('email').value = data.objeto.registro.email;
    document.getElementById('birthDate').value = new Date(data.objeto.registro.dataDeNascimento).toISOString().split("T")[0];
    document.getElementById('password').value = data.objeto.registro.hash;

    // Preencher o campo de gênero, se necessário
    const genderSelect = document.getElementById('genderSelect');
    genderSelect.value = data.objeto.registro.genero;

    const profileImage = document.querySelector('.perfil-img');
    const profileImage2 = document.querySelector('.perfil-img2');

    // profileImage.src = data.objeto.avatar; 
    // profileImage2.src = data.objeto.avatar; 
    profileImage.src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrZx34TJ3OIdLFtbEvpG86yEer0OvKYJCB9w&s";
    profileImage2.src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrZx34TJ3OIdLFtbEvpG86yEer0OvKYJCB9w&s";

} 