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

/**
 * @swagger
 * tags:
 *   - name: Usuário
 *     description: Rotas para o envio de requisições relacionadas ao gerenciamento dos dados do usuário StudyFlow.
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
 *     tags:
 *     - Usuário
 *     summary: Verifica se as credenciais passadas batem com algum registro no banco de dados.
 *     description: Realiza a autenticação do usuário verificando as credenciais. Retorna um token de acesso caso a autenticação seja bem-sucedida.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - senha
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: O email do usuário.
 *                 example: "usuario@exemplo.com"
 *               senha:
 *                 type: string
 *                 format: email
 *                 description: A senha do usuário.
 *                 example: "senhaSegura123"
 *     responses:
 *       200:
 *         description: |
 *                      OK, se as credenciais forem confirmadas. Um token de acesso será anexado no cabeçalho da resposta para identificar o usuário.
 *                      Este token precisa ficar armazenado no navegador do cliente, para que ele possa ser reenviado junto com as próximas requisições.
 *                      Dessa forma, a API conseguirá reconhecer o usuário e realizar a operaçõo correta.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   description: Mensagem de retorno para o usuário.
 *                   example: "Usuário autenticado com sucesso."
 *                 objeto:
 *                   type: object
 *                   description: Um objeto de retorno para o usuário.
 *                   example:
 *                     token: "Bearer oiuyhsapda8907213hpoi..."
 *       400:
 *         description: Indica que há algo errado com a requisição recebida, seja por não ter enviado uma informação obrigatória ou ter enviado uma requisição com erros de sintaxe JSON.
 *       401:
 *         description: Indica que as credenciais passadas são inválidas. Portanto, acesso negado!
 *       403:
 *         description: Indica que a API detectou que o token passado foi manipulado ou adulterado. Portanto, acesso rejeitado!
 *       500:
 *         description: Indica que um erro inesperado ocorreu no lado do servidor.
 */
router.post('/autenticar', ChecagemMid.checarCredenciais, TratamentoMid.tratarDadosDeAutenticacao, Controller.autenticar)

/**
 * @swagger
 * /perfil:
 *   put:
 *     tags:
 *     - Usuário
 *     summary: Atualiza as informações do usuário armazenadas no banco de dados.
 *     description: |
 *        Permite que o usuário altere informações de seu perfil, como nome, gênero, email, senha e data de nascimento.
 *        A rota exige que o usuário esteja autenticado e possua um token de acesso válido.
 *        Os dados recebidos passam por validação e tratamento para garantir o formato adequado.
 *        Passe somente os dados que deseja alterar.
 *        Também é permitido atribuir null a alguma informação para removê-la do banco de dados.
 *        Contudo, é importante lembrar que alguns dados são obrigatórios e por isso não podem ser removidos, como:
 *        nome, email e senha.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 description: O novo nome do usuário.
 *                 example: "Nome Atualizado da Silva"
 *               genero:
 *                 type: string
 *                 nullable: true
 *                 description: O gênero do usuário, informado pelo primeiro caracter.
 *                 example: "m"
 *               email:
 *                 type: string
 *                 description: O novo email do usuário.
 *                 format: email
 *                 example: "novo-email@exemplo.com"
 *               senha:
 *                 type: string
 *                 description: A nova senha do usuário.
 *                 format: password
 *                 example: "novaSenha123"
*               dataDeNascimento:
 *                 type: string
 *                 description: A data de nascimento do usuário.
 *                 format: date
 *                 example: "1999-12-31"
 *     responses:
 *       200:
 *         description: Indica que a alteração dos dados do usuário foi realizada com sucesso no banco de dados, ou seja, OK!
 *       400:
 *         description: Indica que há algo errado com a requisição recebida, seja por não ter enviado uma informação obrigatória ou ter enviado uma requisição com erros de sintaxe JSON.
 *       401:
 *         description: Indica que o usuário não pôde ser identificado por meio da requisição, faltou enviar o token de acesso.
 *       403:
 *         description: Indica que a API detectou que o token passado foi manipulado ou adulterado. Portanto, solicitação rejeitada!
 *       500:
 *         description: Indica que um erro inesperado ocorreu no lado do servidor.
 */
router.put('/perfil', ChecagemMid.checarAutenticacao, ChecagemMid.checarAlteracoesSolicitadas, TratamentoMid.tratarDadosDeAlteracao, Controller.alterar)

/**
 * @swagger
 * /perfil:
 *   post:
 *     tags:
 *     - Usuário
 *     summary: Cadastra um novo usuário no banco de dados.
 *     description: |
 *        Permite o cadastro de um novo usuário no banco de dados utilizando as informações passadas no corpo da requisição.
 *        Não é possível cadastrar o mesmo email para contas diferentes.
 *        Caso haja uma tentativa desse tipo, será retornada uma falha na operação.
 *        A requisição deve ser enviada com os campos de nome, email e senha, obrigatoriamente.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - email
 *               - senha
 *             properties:
 *               nome:
 *                 type: string
 *                 description: Nome do novo usuário.
 *                 example: "Nome Completo da Silva"        
 *               email:
 *                 type: string
 *                 description: Email do novo usuário.
 *                 format: email
 *                 example: "novo-usuario@exemplo.com"
 *               senha:
 *                 type: string
 *                 description: A nova senha do usuário.
 *                 format: password
 *                 example: "novaSenha123"
 *     responses:
 *       201:
 *         description: Indica que o usuário foi registrado com sucesso no banco de dados, ou seja, OK/Created!
 *       400:
 *         description: Indica que há algo errado com a requisição recebida, seja por não ter enviado uma informação obrigatória ou ter enviado uma requisição com erros de sintaxe JSON.
 *       500:
 *         description: Indica que um erro inesperado ocorreu no lado do servidor.
 */
router.post('/perfil', ChecagemMid.checarDadosDeCadastro, TratamentoMid.tratarDadosDeCadastro, Controller.cadastrar)

/**
 * @swagger
 * /perfil:
 *   get:
 *     tags:
 *     - Usuário
 *     summary: Obtém todas as informações do usuário a partir do banco de dados.
 *     description: |
 *        Permite que o usuário consulte suas informações de perfil, como nome, email, entre outros dados.
 *        Esta operação é feita mediante identificação do usuário, para que as informações retornadas sejam referentes ao próprio.
 *        A identificação ocorre por meio da obtenção do ID do usuário, que é extraída a partir do token JWT enviado na requisição.
 *        A consulta retorna os dados do usuário e, se disponível, a referência à imagem do avatar do usuário.
 *        Requer autenticação. O token deve ser anexado no campo "Authorization", no cabeçalho da requisição.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: |
 *            Indica que a consulta foi bem-sucedida e o perfil do usuário foi encontrado.
 *            A resposta inclui os dados do perfil do usuário e, se configurado, uma URL para o avatar do usuário.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 avatar:
 *                   type: string
 *                   description: |
 *                     A URL ou caminho para o avatar do usuário, caso tenha sido configurado.
 *                   example: "/uploads/profiles/imagens/1234567890.png"
 *                 registro:
 *                   type: object
 *                   description: Dados completos do perfil do usuário extraídos a partir do banco de dados.
 *                   example:
 *                     nome: "Nome Completo"
 *                     email: "usuario@exemplo.com"
 *                     dataDeNascimento: "1990-01-01"
 *       400:
 *         description: Indica que há algo errado com a requisição recebida, seja por não ter enviado uma informação obrigatória ou ter enviado uma requisição com erros de sintaxe JSON.
 *       500:
 *         description: Indica que um erro inesperado ocorreu no lado do servidor.
 */
router.get('/perfil', ChecagemMid.checarAutenticacao, Controller.consultar)

router.get('/cookie', (req, res) => {
    const RespostaHTTP = require('../models/resposta-http')
    const UsuarioServices = require('../services/usuario-services')
    const respostaHTTP = new RespostaHTTP(res)
    const token = UsuarioServices.obterToken(req)
    if (token) {
        return respostaHTTP.enviarErro(400, 'Cookie já presente!')
    }
    respostaHTTP.enviarCookieDeAuth(UsuarioServices.gerarToken(1))
    return respostaHTTP.enviarOk('Cookie-teste enviado!')
})

module.exports = router