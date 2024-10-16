const router = require('express').Router();
const Controller = require('../controllers/tarefa-controller');

router.get('/tarefas', Controller.buscarTarefas);
router.get('/tarefa/:id', Controller.buscarTarefa);
router.post('/tarefa', Controller.cadastrar);
router.put('/tarefa/:id', Controller.alterar);
router.delete('/tarefa/:id', Controller.excluir);

module.exports = router;