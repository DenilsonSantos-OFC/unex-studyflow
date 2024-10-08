/**
 * @file usuario-routes.js
 * @description Define as rotas relacionadas à gestão dos usuários cadastrados no banco de dados.
 * Este módulo lida com o cadastro, autenticação, alteração e consulta destes dados.
 * Cada operação requerida por meio da requisição precisa ser autorizada antes de ser realizada.
 * Para isto, o navegador deve enviar seu token de acesso no cabeçalho de cada requisição.
 * É responsabilidade desta API verificar se o token é confiável.
 * Ela faz isso por analisar a assinatura do token e verificar se o "segredo" armazenado na assinatura do token bate com o "segredo" armazenado no lado do servidor.
 * Como as requisições recebidas contém o token de acesso no cabeçalho (que contém o ID do usuário), o ID não precisa ser informado na URl ou como um parâmetro da requisição.
 * Se a requisição não incluir o token, ela será tratada como vinda de um usuário que não está logado.
 * @author Denilson Santos
 */

// ------------------------------------------------------------------ //
//                 IMPORTAÇÕES DE RECURSOS NECESSÁRIOS
// ------------------------------------------------------------------ //

const express = require('express')
const router = express.Router()
const Controller = require('../controllers/usuario-controller')

// ------------------------------------------------------------------ //
//                             ROTAS
// ------------------------------------------------------------------ //

/**
 * @route POST /autenticar
 * @description Rota para verificar se as credenciais passadas batem com algum registro no banco de dados.
 * @returns {Object} JSON contendo o código HTTP, a mensagem de retorno e o token de acesso (se ação bem-sucedida).
 */
router.post('/autenticar', Controller.autenticar)

/**
 * @route POST /cadastrar
 * @description Rota para cadastrar um novo usuário no banco de dados usando as informações passadas por meio da requisição.
 * @returns {Object} JSON contendo o código HTTP, a mensagem de retorno e o token de acesso (se ação bem-sucedida).
 */
router.post('/cadastrar', Controller.cadastrar)

/**
 * @route GET /perfil
 * @description Rota para obter todas as informações do usuário a partir do banco de dados.
 * @returns {Object} JSON contendo o código HTTP, a mensagem de retorno e as informações do usuário (se ação bem-sucedida).
 */
router.get('/perfil', Controller.consultar)

/**
 * @route PUT /perfil
 * @description Rota para atualizar as informações do usuário armazenadas no banco de dados.
 * @returns {Object} JSON contendo o código HTTP e a mensagem de retorno.
 */
router.put('/perfil', Controller.alterar)