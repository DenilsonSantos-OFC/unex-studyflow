/**
 * @module TarefaRoutes
 * @file tarefa-routes.js
 * @author Luan Vinicius
 * @description Este módulo define as rotas relacionadas ao gerenciamento de tarefas de um usuário.
 * O gerenciamento de tarefas inclui operações como buscar, cadastrar, alterar, excluir e filtrar tarefas.
 * As rotas exigem que o usuário esteja autenticado, garantindo a segurança e a privacidade dos dados.
 * Cada rota está protegida por autenticação e permite manipulações específicas das tarefas.
 */

/**
 * @swagger
 * tags:
 *   - name: Tarefa
 *     description: Rotas para o envio de requisições relacionadas ao gerenciamento de tarefas do usuário.
 */

// ------------------------------------------------------------------ //
//                 IMPORTAÇÕES DE RECURSOS NECESSÁRIOS
// ------------------------------------------------------------------ //

const Middlewares = require('../middlewares/tarefas/checagem-middlewares')
const ChecagemMid = require('../middlewares/usuarios/checagem-middlewares')
const Controller = require('../controllers/tarefa-controller')

// ------------------------------------------------------------------ //
//                    ROTAS (COM DOCUMENTAÇÃO SWAGGER)
// ------------------------------------------------------------------ //

const router = require('express').Router()

/**
 * @swagger
 * /tarefas:
 *   get:
 *     tags:
 *       - Tarefa
 *     summary: Retorna todas as tarefas do usuário autenticado.
 *     description: Esta rota retorna uma lista de todas as tarefas associadas ao usuário autenticado. 
 *       Ela permite que o usuário visualize as tarefas cadastradas, com detalhes como título, descrição, 
 *       prioridade, categoria e data de conclusão, se disponível. A autenticação do usuário é necessária para 
 *       garantir a privacidade dos dados.
 *     security:
 *       - bearerAuth: []  # Requer que o usuário esteja autenticado.
 *     responses:
 *       200:
 *         description: OK, se a consulta for bem-sucedida, retorna uma lista de todas as tarefas do usuário.
 *         content:
 *           application/json:
 *             example:
 *               - id: 1
 *                 titulo: "Estudar Assunto X"
 *                 descricao: "Ler documentação"
 *                 prioridade: 2
 *                 categoria: 1
 *                 dataCriacao: "2024-01-01"
 *                 dataConclusao: null
 *       401:
 *         description: Acesso negado, se o token de autenticação não for fornecido ou for inválido.
 *       500:
 *         description: Erro interno do servidor.
 */
router.get('/tarefas/', ChecagemMid.checarAutenticacao, Controller.buscarTarefas)

/**
 * @swagger
 * /tarefa/{id}:
 *   get:
 *     tags:
 *       - Tarefa
 *     summary: Retorna uma tarefa específica a partir do ID fornecido.
 *     description: Essa rota permite consultar uma tarefa específica usando seu ID. O usuário poderá visualizar 
 *       os detalhes dessa tarefa, incluindo título, descrição, prioridade, categoria e datas associadas.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID da tarefa a ser consultada.
 *     security:
 *       - bearerAuth: []  # Requer que o usuário esteja autenticado.
 *     responses:
 *       200:
 *         description: OK, se a tarefa for encontrada.
 *         content:
 *           application/json:
 *             example:
 *               id: 1
 *               titulo: "Estudar Aula 1"
 *               descricao: "Ler a página X"
 *               prioridade: 1
 *               categoria: 2
 *               dataCriacao: "2024-01-01"
 *               dataConclusao: null
 *       401:
 *         description: Acesso negado, se o token de autenticação não for fornecido ou for inválido.
 *       404:
 *         description: Não encontrada, se a tarefa com o ID fornecido não existir.
 *       500:
 *         description: Erro interno do servidor.
 */
router.get('/tarefa/:id', ChecagemMid.checarAutenticacao, Middlewares.validarIdTarefa, Controller.buscarTarefa)

/**
 * @swagger
 * /tarefas/filtro:
 *   get:
 *     tags:
 *       - Tarefa
 *     summary: Retorna tarefas filtradas por palavra-chave no título ou descrição.
 *     description: A rota permite que o usuário busque por tarefas que correspondam a uma palavra-chave no título 
 *       ou na descrição, facilitando a localização de tarefas específicas entre muitas.
 *     parameters:
 *       - name: keyword
 *         in: query
 *         required: true
 *         description: Palavra-chave para filtrar as tarefas.
 *     security:
 *       - bearerAuth: []  # Requer que o usuário esteja autenticado.
 *     responses:
 *       200:
 *         description: OK, se a consulta com filtro for bem-sucedida.
 *         content:
 *           application/json:
 *             example:
 *               - id: 2
 *                 titulo: "Realizar Atividade Y"
 *                 descricao: "Entregar até amanhã"
 *                 prioridade: 2
 *                 categoria: 3
 *                 dataCriacao: "2024-01-02"
 *                 dataConclusao: null
 *       401:
 *         description: Acesso negado, se o token de autenticação não for fornecido ou for inválido.
 *       500:
 *         description: Erro interno do servidor.
 */
router.get('/tarefas/filtro', ChecagemMid.checarAutenticacao, Controller.buscarTarefasFiltro)

/**
 * @swagger
 * /tarefa:
 *   post:
 *     tags:
 *       - Tarefa
 *     summary: Cadastra uma nova tarefa para o usuário autenticado.
 *     description: Esta rota permite que o usuário cadastre uma nova tarefa, fornecendo informações como título, descrição, 
 *       prioridade e categoria. A tarefa será associada ao usuário autenticado. A autenticação é necessária para 
 *       garantir que apenas usuários autorizados possam adicionar tarefas.
 *     security:
 *       - bearerAuth: []  # Requer que o usuário esteja autenticado.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *               descricao:
 *                 type: string
 *               prioridade:
 *                 type: integer
 *               categoria:
 *                 type: integer
 *           example:
 *             titulo: "Aprender fórmula de Bháskara"
 *             descricao: "Assistir a tutoriais"
 *             prioridade: 2
 *             categoria: 2
 *     responses:
 *       201:
 *         description: OK, se a tarefa for cadastrada com sucesso.
 *         content:
 *           application/json:
 *             example:
 *               id: 3
 *               titulo: "Aprender fórmula de Bháskara"
 *               descricao: "Assistir a tutoriais"
 *               prioridade: 2
 *               categoria: 2
 *       400:
 *         description: Bad Request, se os dados da tarefa estiverem incompletos ou inválidos.
 *       401:
 *         description: Acesso negado, se o token de autenticação não for fornecido ou for inválido.
 *       500:
 *         description: Erro interno do servidor.
 */
router.post('/tarefa', ChecagemMid.checarAutenticacao, Middlewares.validarNovosDadosDaTarefa, Controller.cadastrar)

/**
 * @swagger
 * /tarefa/{id}:
 *   put:
 *     tags:
 *       - Tarefa
 *     summary: Atualiza uma tarefa específica a partir do ID fornecido.
 *     description: Esta rota permite ao usuário atualizar os detalhes de uma tarefa existente, como título, descrição, 
 *       prioridade e categoria. A autenticação do usuário é obrigatória para garantir que apenas o dono da tarefa possa 
 *       modificá-la.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID da tarefa a ser atualizada.
 *     security:
 *       - bearerAuth: []  # Requer que o usuário esteja autenticado.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *               descricao:
 *                 type: string
 *               prioridade:
 *                 type: integer
 *               categoria:
 *                 type: integer
 *           example:
 *             titulo: "Atualizar artigo científico"
 *             descricao: "Melhorar a coesão textual"
 *             prioridade: 0
 *             categoria: 2
 *     responses:
 *       200:
 *         description: OK, se a tarefa for atualizada com sucesso.
 *       400:
 *         description: Bad Request, se os dados da tarefa estiverem inválidos.
 *       401:
 *         description: Acesso negado, se o token de autenticação não for fornecido ou for inválido.
 *       404:
 *         description: Não encontrada, se a tarefa com o ID fornecido não existir.
 *       500:
 *         description: Erro interno do servidor.
 */
router.put('/tarefa/:id', ChecagemMid.checarAutenticacao, Middlewares.validarIdTarefa, Middlewares.validarDadosAtualizadosDeTarefa, Controller.alterar)

/**
 * @swagger
 * /tarefa/{id}:
 *   delete:
 *     tags:
 *       - Tarefa
 *     summary: Exclui uma tarefa específica a partir do ID fornecido.
 *     description: Esta rota permite que o usuário exclua uma tarefa existente usando o ID da tarefa. 
 *       A exclusão só será permitida se o usuário estiver autenticado e se a tarefa pertencente ao ID informado 
 *       for válida. A autenticação do usuário é obrigatória para garantir que apenas o dono da tarefa possa excluí-la.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID da tarefa a ser excluída.
 *     security:
 *       - bearerAuth: []  # Requer que o usuário esteja autenticado.
 *     responses:
 *       200:
 *         description: OK, se a tarefa for excluída com sucesso.
 *         content:
 *           application/json:
 *             example:
 *               message: "Tarefa excluída com sucesso."
 *       400:
 *         description: Bad Request, se o ID da tarefa for inválido ou não puder ser processado.
 *       401:
 *         description: Acesso negado, se o token de autenticação não for fornecido ou for inválido.
 *       404:
 *         description: Não encontrada, se a tarefa com o ID fornecido não existir.
 *       500:
 *         description: Erro interno do servidor.
 */
router.delete('/tarefa/:id', ChecagemMid.checarAutenticacao, Middlewares.validarIdTarefa, Controller.excluir)

module.exports = router
