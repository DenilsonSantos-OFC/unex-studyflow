const Middlewares = require('../middlewares/tarefas/checagem-middlewares')
const Controller = require('../controllers/tarefa-controller');

const router = require('express').Router();

// Rota para buscar todas as tarefas
router.get('/tarefas/', Middlewares.verificarAutenticacao, Controller.buscarTarefas);

// Rota para buscar uma tarefa específica
router.get('/tarefa/:id', Middlewares.verificarAutenticacao, Middlewares.validarIdTarefa, Controller.buscarTarefa);

// Rota para buscar tarefas com uma palavra-chave no título ou na descrição
router.get('/tarefas/filtro', Middlewares.verificarAutenticacao, Controller.buscarTarefasFiltro);

// Rota para cadastrar uma nova tarefa
router.post('/tarefa', Middlewares.verificarAutenticacao, Middlewares.validarNovosDadosDaTarefa, Controller.cadastrar);

// Rota para atualizar uma tarefa específica
router.put('/tarefa/:id', Middlewares.verificarAutenticacao, Middlewares.validarIdTarefa, Middlewares.validarDadosAtualizadosDeTarefa, Controller.alterar);

// Rota para excluir uma tarefa específica
router.delete('/tarefa/:id', Middlewares.verificarAutenticacao, Middlewares.validarIdTarefa, Controller.excluir);

module.exports = router;
