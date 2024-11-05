/**
 * @module UsuarioRoutes
 * @file usuario-routes.js
 * @author Denilson Santos
 * @description Define as rotas relacionadas à gestão dos usuários cadastrados no banco de dados.
 * Este módulo lida com o cadastro, autenticação, alteração e consulta destes dados.
 * Cada operação requerida por meio da requisição precisa ser autorizada antes de ser realizada.
 * Para isto, o navegador deve enviar seu token de acesso no cabeçalho de cada requisição.
 * É responsabilidade desta API verificar se o token é confiável.
 * Ela faz isso por analisar a assinatura do token e verificar se o "segredo" armazenado na assinatura do token bate com o "segredo" armazenado no lado do servidor.
 * Como as requisições recebidas contém o token de acesso no cabeçalho (que contém o ID do usuário), o ID não precisa ser informado na URl ou como um parâmetro da requisição.
 * Se a requisição não incluir o token, ela será tratada como vinda de um usuário que não está logado.
 */

// ------------------------------------------------------------------ //
//                 IMPORTAÇÕES DE RECURSOS NECESSÁRIOS
// ------------------------------------------------------------------ //

const Controller = require('../controllers/usuario-controller')
const ChecagemMid = require('../middlewares/usuarios/checagem-middlewares')
const TratamentoMid = require('../middlewares/usuarios/tratamento-middlewares')

// ------------------------------------------------------------------ //
//                    ROTAS (COM DOCUMENTAÇÃO SWAGGER)
// ------------------------------------------------------------------ //

const router = require('express').Router()

/**
 * @swagger
 * /autenticar:
 *   post:
 *     summary: Verifica se as credenciais passadas batem com algum registro no banco de dados.
 *     responses:
 *      200:
 *         description: OK, se credenciais forem válidas.
 *                      Um token de acesso será anexado no cabeçalho da resposta para identificar o usuário.
 *                      Este token precisa ficar armazenado no navegador do cliente,
 *                      para que ele possa ser reenviado junto com as próximas requisições.
 *                      Dessa forma, a API conseguirá reconhecer o usuário e realizar a operaçõo correta.
 *      400: 
 *          description: Bad Request, se nem todas as informações requeridas forem enviadas na requisição ou se ela estiver "mal-formada" (contiver erros de sintaxe JSON).
 *      401:
 *          description: Acesso negado, se as credenciais passadas forem inválidas.
 *      403:
 *          description: Acesso rejeitado, se a API detectar que o token foi manipulado ou adulterado.
 *      500:
 *          description: Aviso de erro interno do lado do servidor, caso ocorra algum erro inesperado durante o processamento da requisição.
 */
router.post('/autenticar', ChecagemMid.checarCredenciais, TratamentoMid.tratarDadosDeAutenticacao, Controller.autenticar)

// ------------------------------------------------------------------ //
//                             ROTAS
// ------------------------------------------------------------------ //








/**
 * @route POST /autenticar
 * @description Rota para verificar se as credenciais passadas batem com algum registro no banco de dados.
 * @returns {Object} JSON contendo o código HTTP, a mensagem de retorno e o token de acesso (se ação bem-sucedida).
 */


/**
 * @route POST /cadastrar
 * @description Rota para cadastrar um novo usuário no banco de dados usando as informações passadas por meio da requisição.
 * @returns {Object} JSON contendo o código HTTP, a mensagem de retorno e o token de acesso (se ação bem-sucedida).
 */
router.post('/perfil', ChecagemMid.checarDadosDeCadastro, TratamentoMid.tratarDadosDeCadastro, Controller.cadastrar)

/**
 * @route GET /perfil
 * @description Rota para obter todas as informações do usuário a partir do banco de dados.
 * @returns {Object} JSON contendo o código HTTP, a mensagem de retorno e as informações do usuário (se ação bem-sucedida).
 */
router.get('/perfil', ChecagemMid.checarAutenticacao, Controller.consultar)

/**
 * @route PUT /perfil
 * @description Rota para atualizar as informações do usuário armazenadas no banco de dados.
 * @returns {Object} JSON contendo o código HTTP e a mensagem de retorno.
 */
router.put('/perfil', ChecagemMid.checarAutenticacao, ChecagemMid.checarAlteracoesSolicitadas, TratamentoMid.tratarDadosDeAlteracao, Controller.alterar)

module.exports = router;