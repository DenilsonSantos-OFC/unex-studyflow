function create(tipo, nivel, titulo, texto, id) {
    // Criando o elemento div que contém a nova tarefa
    const tarefa = document.createElement('div');

    // Define a cor de acordo com o nível
    let cor = "";
    switch (nivel) {
        case "Alta":
            cor = "v";
            break;
        case "Media":
            cor = "a";
            break;
        default:
            cor = "";
            break;
    }

    // Adicionando a estrutura interna da tarefa
    tarefa.innerHTML = `
       <div class="tarefas">
            <div class="nav-tarefas"> 
                <div class="tipo ${cor}">
                    <div class="circulo ${cor}"></div>
                    <p>${nivel}</p>
                </div>
                <div class="icones">
                    <button type="button" data-id="${id}" class="editar">
                        <img src="../src/img/editar-icon.png" alt="editar">
                    </button>
                    <button type="button"data-id="${id}" class="deletar" onclick="deletTask(this)">
                        <img src="../src/img/deletar-icon.png" alt="deletar">
                    </button>
                </div>
            </div>
            <div class="titulo">
                <h3>${titulo}</h3>
            </div>
            <div class="texto">
                <p>${texto}</p>
            </div>
        </div>
    `;

    const button = document.querySelectorAll('.add');

    let containerTarefas;
    let addButton;

    switch (tipo) {
        case 1:
            containerTarefas = document.querySelector('.fazer');
            addButton = button[0];
            break;
        case 2:
            containerTarefas = document.querySelector('.andamento');
            addButton = button[1];
            break;
        case 3:
            containerTarefas = document.querySelector('.concluida');
            addButton = button[2];
            break;
        default:
            break;
    }

    containerTarefas.insertBefore(tarefa, addButton);

    // Adiciona evento de deletar ao botão deletar
    tarefa.querySelector('.deletar').addEventListener('click', function() {
        deletTask();
    });

    // Adiciona evento de editar ao botão editar
    tarefa.querySelector('.editar').addEventListener('click', function() {
        // Redireciona para a página de edição
        window.location.href = `../views/editarTarefa.html?id=${id}`;
    });
}

