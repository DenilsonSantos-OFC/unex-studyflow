
function create(tipo, nivel, titulo, texto){
// Criando o elemento div que contém a nova tarefa
const tarefa = document.createElement('div');

switch (nivel) {
    case "Alta":
        var cor = "v";
        break;
    case "Média":
        var cor = "a";
        break;
    default:
        var cor = " "
        break;
}


// Adicionando a estrutura interna da tarefa
tarefa.innerHTML = `
   <div class="tarefas">
        <div class="nav-tarefas"> 
            <div class="tipo `+cor+`">
                <div class="circulo `+cor+`"></div>
                <p>`+nivel+`</p>
            </div>
            <div class="icones">
                <button type="button" class="editar">
                    <img src="../src/img/editar-icon.png" alt="editar">
                </button>
                <button type="button" class="deletar">
                    <img src="../src/img/deletar-icon.png" alt="editar">
                </button>
            </div>
        </div>
        <div class="titulo">
            <h3>`+titulo+`</h3>
        </div>
        <div class="texto">
            <p>`+texto+`</p>
        </div>
    </div>
`;
const button = document.querySelectorAll('.add');

switch (tipo) {
    case 1:
        var containerTarefas = document.querySelector('.fazer');
        var addButton = button[0];
        break;
    case 2:
        var containerTarefas = document.querySelector('.andamento');
        var addButton = button[1];

        break;
    case 3:
        var containerTarefas = document.querySelector('.concluida');
        var addButton = button[2];

        break;
    default:
        break;
}

containerTarefas.insertBefore(tarefa, addButton);

}




document.querySelector('.add-tarefa.fazer').addEventListener('click', function() {
    create(1,"Baixa", "teste1", "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Consequatur aliquam sint dignissimos eos aut, consectetur mollitia aperiam maxime tempore inventore delectus tempora blanditiis explicabo voluptatem voluptatum molestias minima necessitatibus! Iste?");
});

document.querySelector('.add-tarefa.andamento').addEventListener('click', function() {
    create(2,"Média", "teste2", "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Consequatur aliquam sint dignissimos eos aut, consectetur mollitia aperiam maxime tempore inventore delectus tempora blanditiis explicabo voluptatem voluptatum molestias minima necessitatibus! Iste?");
});

document.querySelector('.add-tarefa.concluido').addEventListener('click', function() {
    create(3,"Alta", "teste3", "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Consequatur aliquam sint dignissimos eos aut, consectetur mollitia aperiam maxime tempore inventore delectus tempora blanditiis explicabo voluptatem voluptatum molestias minima necessitatibus! Iste?");
});


const editarButton = tarefa.querySelector('.editar');
const deletarButton = tarefa.querySelector('.deletar');

editarButton.addEventListener('click', function() {
    // Redireciona para a página de edição
    window.location.href = '../views/editarTarefa.html'; // Altere para a URL da sua página de edição
});

deletarButton.addEventListener('click', function() {
    // Redireciona para a página de confirmação de deleção
    window.location.href = '../views/editarTarefa.html'; // Altere para a URL da sua página de deleção
});
