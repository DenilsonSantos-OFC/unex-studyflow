const router = require('express').Router();
const Controller = require('../controllers/tarefa-controller');
const AlteracaoMiddleware = require('../middlewares/tarefas/alteracao');
const AutenticacaoMiddleware = require('../middlewares/tarefas/autenticacao');
const CadastroMiddleware = require('../middlewares/tarefas/cadastro');

// Rota para buscar todas as tarefas
router.get('/tarefas/', AutenticacaoMiddleware.verificarAutenticacao, Controller.buscarTarefas);

// Rota para buscar uma tarefa específica
router.get('/tarefa/:id', AutenticacaoMiddleware.verificarAutenticacao, AlteracaoMiddleware.validarIdTarefa, Controller.buscarTarefa);

// Rota para cadastrar uma nova tarefa
router.post('/tarefa', AutenticacaoMiddleware.verificarAutenticacao, CadastroMiddleware.validarDadosTarefa, Controller.cadastrar);

// Rota para atualizar uma tarefa específica
router.put('/tarefa/:id', AutenticacaoMiddleware.verificarAutenticacao, AlteracaoMiddleware.validarIdTarefa, AlteracaoMiddleware.validarDadosTarefa, Controller.alterar);

// Rota para excluir uma tarefa específica
router.delete('/tarefa/:id', AutenticacaoMiddleware.verificarAutenticacao, AlteracaoMiddleware.validarIdTarefa, Controller.excluir);

module.exports = router;
