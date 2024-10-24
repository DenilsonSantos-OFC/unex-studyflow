
const cadastrar = document.querySelector(".btn-login");
const logar = document.querySelector(".btn-cadastro");

var telaLogin = document.querySelector(".login");
var telaCadastro = document.querySelector(".cadastro");

const form = document.getElementById("forms");

cadastrar.addEventListener("click", function(){
    form.reset();
    telaLogin.style.opacity = "0"; // Transição suave para opacidade 0
        setTimeout(function() { // Aguarda a opacidade zerar
            telaLogin.style.display = "none"; // Oculta a tela após a transição
            telaCadastro.style.display = "flex"; // Exibe a tela de cadastro
            setTimeout(function() {
                telaCadastro.style.opacity = "1"; // Transição suave para opacidade 1
            }, 50); // Pequeño atraso para garantir a exibição da tela
        }, 500); // Tempo de transição igual ao definido no CSS (0.5s)
})

logar.addEventListener("click", function() {
    form.reset();
    telaCadastro.style.opacity = "0"; // Transição suave para opacidade 0
    setTimeout(function() {
        telaCadastro.style.display = "none"; // Oculta a tela de cadastro
        telaLogin.style.display = "flex"; // Exibe a tela de login
        setTimeout(function() {
            telaLogin.style.opacity = "1"; // Transição suave para opacidade 1
        }, 50); // Atraso para garantir a exibição correta
    }, 500); // Tempo de transição de 0.5s

});

document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Impede o envio padrão do formulário

    const email = document.getElementById('Email').value;
    const password = document.getElementById('Password').value;


    fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        alert(data.message);
        hideLoading(); // Oculta a tela de carregamento após a resposta
    })
    .catch(error => {
        console.error('Erro:', error);
        hideLoading(); // Oculta a tela de carregamento em caso de erro
    });
});

document.getElementById('register-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Impede o envio padrão do formulário

    const nome = document.getElementById('Nome').value;
    const email = document.getElementById('Email').value;
    const password = document.getElementById('Password').value;

    showLoading(); // Exibe a tela de carregamento

    fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nome, email, password })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        alert(data.message);
        hideLoading(); // Oculta a tela de carregamento após a resposta
    })
    .catch(error => {
        console.error('Erro:', error);
        hideLoading(); // Oculta a tela de carregamento em caso de erro
    });
});

