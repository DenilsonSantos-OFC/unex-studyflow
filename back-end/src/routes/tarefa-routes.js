/**
 * @module TarefaRoutes
 * @file tarefa-routes.js
 * @author Luan Vinicius
 * @description Define as rotas relacionadas à gestão das tarefas de um usuário.
 * Este módulo lida com as operações de busca, cadastro, atualização e exclusão de tarefas.
 * Cada operação requer que o usuário esteja autenticado, sendo verificado através do token de acesso.
 * Caso o token não seja fornecido ou seja inválido, a operação será negada.
 */

// ------------------------------------------------------------------ //
//                 IMPORTAÇÕES DE RECURSOS NECESSÁRIOS
// ------------------------------------------------------------------ //

const Middlewares = require('../middlewares/tarefas/checagem-middlewares')
const Controller = require('../controllers/tarefa-controller')

// ------------------------------------------------------------------ //
//                    ROTAS (COM DOCUMENTAÇÃO SWAGGER)
// ------------------------------------------------------------------ //

const router = require('express').Router()

/**
 * @swagger
 * tags:
 *   - name: Tarefas
 *     description: Endpoints para criar, atualizar, listar, consultar e remover tarefas associadas aos usuários. 
 *                  Permite o gerenciamento completo de tarefas individuais, com funcionalidades para organizar e priorizar as atividades dos usuários.
 */

/**
 * @swagger
 * /tarefas:
 *   get:
 *     summary: Retorna todas as tarefas do usuário autenticado. Esta rota é útil para visualizar o panorama geral das tarefas do usuário, incluindo detalhes como título, descrição, prioridade, categoria, data de criação e, caso aplicável, data de conclusão.
 *     responses:
 *       200:
 *         description: OK, se a consulta for bem-sucedida, retorna uma lista de todas as tarefas do usuário.
 *         content:
 *           application/json:
 *             example:
 *               - id: 1
 *                 titulo: "Estudar Assunto X"
 *                 descricao: "Ler documentação"
 *                 prioridade: "2"
 *                 categoria: "1"
 *                 dataCriacao: "2024-01-01"
 *                 dataConclusao: null
 *       401:
 *         description: Acesso negado, se o token de autenticação não for fornecido ou for inválido.
 *       500:
 *         description: Erro interno do servidor.
 */
router.get('/tarefas/', Middlewares.verificarAutenticacao, Controller.buscarTarefas)

/**
 * @swagger
 * /tarefa/{id}:
 *   get:
 *     summary: Retorna uma tarefa específica a partir do ID fornecido. Essa rota é utilizada quando o usuário precisa visualizar detalhes de uma tarefa específica sem precisar filtrar ou buscar em todas as tarefas.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID da tarefa a ser consultada.
 *     responses:
 *       200:
 *         description: OK, se a tarefa for encontrada.
 *         content:
 *           application/json:
 *             example:
 *               id: 1
 *               titulo: "Estudar Aula 1"
 *               descricao: "Ler a página X"
 *               prioridade: "1"
 *               categoria: "2"
 *               dataCriacao: "2024-01-01"
 *               dataConclusao: null
 *       401:
 *         description: Acesso negado, se o token de autenticação não for fornecido ou for inválido.
 *       404:
 *         description: Não encontrada, se a tarefa com o ID fornecido não existir.
 *       500:
 *         description: Erro interno do servidor.
 */
router.get('/tarefa/:id', Middlewares.verificarAutenticacao, Middlewares.validarIdTarefa, Controller.buscarTarefa)

/**
 * @swagger
 * /tarefas/filtro:
 *   get:
 *     summary: Retorna tarefas com base em um filtro de palavra-chave no título ou descrição. Essa rota permite ao usuário encontrar rapidamente tarefas que correspondam a um tema ou categoria desejada.
 *     parameters:
 *       - name: keyword
 *         in: query
 *         required: true
 *         description: Palavra-chave para filtrar as tarefas.
 *     responses:
 *       200:
 *         description: OK, se a consulta com filtro for bem-sucedida.
 *         content:
 *           application/json:
 *             example:
 *               - id: 2
 *                 titulo: "Realizar Atividade Y"
 *                 descricao: "Entregar até amanhã"
 *                 prioridade: "2"
 *                 categoria: "3"
 *                 dataCriacao: "2024-01-02"
 *                 dataConclusao: null
 *       401:
 *         description: Acesso negado, se o token de autenticação não for fornecido ou for inválido.
 *       500:
 *         description: Erro interno do servidor.
 */
router.get('/tarefas/filtro', Middlewares.verificarAutenticacao, Controller.buscarTarefasFiltro)

/**
 * @swagger
 * /tarefa:
 *   post:
 *     summary:  Cria uma nova tarefa associada ao usuário autenticado. O usuário precisa fornecer informações como título, descrição, prioridade e categoria. A rota garante que o usuário consiga organizar novas atividades de maneira fácil e rápida.
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
 *             prioridade: "2"
 *             categoria: "2"
 *     responses:
 *       201:
 *         description: OK, se a tarefa for cadastrada com sucesso.
 *       400:
 *         description: Bad Request, se os dados da tarefa estiverem incompletos ou inválidos.
 *       401:
 *         description: Acesso negado, se o token de autenticação não for fornecido ou for inválido.
 *       500:
 *         description: Erro interno do servidor.
 */
router.post('/tarefa', Middlewares.verificarAutenticacao, Middlewares.validarNovosDadosDaTarefa, Controller.cadastrar)

/**
 * @swagger
 * /tarefa/{id}:
 *   put:
 *     summary: Atualiza uma tarefa específica a partir do ID fornecido.  Essa rota permite ao usuário modificar informações da tarefa, como título, descrição, prioridade e categoria. É útil para quando o usuário precisa atualizar o status ou detalhes de uma tarefa.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID da tarefa a ser atualizada.
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
 *             prioridade: "0"
 *             categoria: "2"
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
router.put('/tarefa/:id', Middlewares.verificarAutenticacao, Middlewares.validarIdTarefa, Middlewares.validarDadosAtualizadosDeTarefa, Controller.alterar)

/**
 * @swagger
 * /tarefa/{id}:
 *   delete:
 *     summary: Exclui uma tarefa específica a partir do ID fornecido.  Permite que o usuário remova tarefas que já não são mais relevantes, garantindo que o painel de tarefas fique atualizado e sem informações desnecessárias.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID da tarefa a ser excluída.
 *     responses:
 *       200:
 *         description: OK, se a tarefa for excluída com sucesso.
 *       401:
 *         description: Acesso negado, se o token de autenticação não for fornecido ou for inválido.
 *       404:
 *         description: Não encontrada, se a tarefa com o ID fornecido não existir.
 *       500:
 *         description: Erro interno do servidor.
 */
router.delete('/tarefa/:id', Middlewares.verificarAutenticacao, Middlewares.validarIdTarefa, Controller.excluir)

module.exports = router
