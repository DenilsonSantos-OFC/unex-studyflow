// script.js
const hamburger = document.querySelector('.hamburger');
const extraMenu = document.getElementById('extra-menu');

hamburger.addEventListener('click', () => {
  extraMenu.classList.toggle('active'); // Adiciona ou remove a classe 'active'
});
