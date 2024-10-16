// Função para criar a tela de carregamento
export function createLoadingScreen() {
    // Criar o elemento da tela de carregamento
    const loadingScreen = document.createElement('div');
    loadingScreen.id = 'loading-screen';
    loadingScreen.style.position = 'fixed';
    loadingScreen.style.top = '0';
    loadingScreen.style.left = '0';
    loadingScreen.style.width = '100%';
    loadingScreen.style.height = '100%';
    loadingScreen.style.backgroundColor = 'rgba(0, 0, 255, 0.8)'; // Azul com transparência
    loadingScreen.style.color = 'white';
    loadingScreen.style.display = 'flex';
    loadingScreen.style.flexDirection = 'column';
    loadingScreen.style.justifyContent = 'center';
    loadingScreen.style.alignItems = 'center';
    loadingScreen.style.zIndex = '1000';

    // Criar o elemento do spinner
    const spinner = document.createElement('div');
    spinner.style.border = '8px solid rgba(255, 255, 255, 0.2)';
    spinner.style.borderTop = '8px solid white';
    spinner.style.borderRadius = '50%';
    spinner.style.width = '50px';
    spinner.style.height = '50px';
    spinner.style.animation = 'spin 1s linear infinite'; // Animação de rotação

    // Adicionar o spinner à tela de carregamento
    loadingScreen.appendChild(spinner);

    // Criar o texto "Carregando..."
    const loadingText = document.createElement('p');
    loadingText.innerText = 'Carregando...';
    loadingScreen.appendChild(loadingText);

    // Adicionar a tela de carregamento ao corpo do documento
    document.body.appendChild(loadingScreen);
}

// Função para mostrar a tela de carregamento
export function showLoading() {
    document.getElementById('loading-screen').style.display = 'flex';
}

// Função para ocultar a tela de carregamento
export function hideLoading() {
    document.getElementById('loading-screen').style.display = 'none';
}

// Adicionar a animação de rotação
const style = document.createElement('style');
style.innerHTML = `
@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
`;
document.head.appendChild(style);

// Criar a tela de carregamento ao carregar a página
createLoadingScreen();
hideLoading(); // Inicialmente escondido
