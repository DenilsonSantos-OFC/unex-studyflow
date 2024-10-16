const Usuario = require('../models/usuario')
const RespostaHTTP = require('../models/resposta-http')
const UsuarioServices = require('../services/usuario-services')

/**
 * @class UsuarioController
 * @file usuario-controller.js
 * @classdesc Esta classe é um controlador especializado para o gerenciamento de requisições envolvendo o usuário da plataforma StudyFlow. Não pode ser instanciado.
 * @description
 * Os métodos desta classe devem ser aplicados somente após passar por todos os middlewares, o que envolve passar nas checagens, validações e tratamentos de dados dentro da requição.
 * Isto quer dizer que se a requisição chegou com sucesso a este controlador, é porque todas as informações estão ok e é possível prosseguir para a operação no banco de dados.
 * Portanto, todas as informações na requisição devem ser revisadas e tratadas de forma prévia antes de chegar aqui.
 * Como é o modelo "Usuário" que interage diretamente com o banco de dados, esta classe tem como responsabilidade ditar qual ação o modelo executará no banco de dados.
 * Também, ela define qual resposta será enviada para quem enviou a requisição, o que inclui o código HTTP, uma mensagem de retorno, e adicionalmente, um objeto de retorno.
 * Por isso, é crucial interpretar os retornos obtidos a partir do banco de dados e também tratar erros que possam vir a acontecer durante a operação no banco de dados.
 * O que os métodos aqui têm em comum?
 * Todos eles trabalham com o par de parâmetros "req" e "res", "requisição" e "resposta", respectivamente.
 * @author Denilson Santos
 */

class UsuarioController {

    /**
     * @function autenticar
     * @static @async
     * @description
     * Lida com requisições de autenticação, chamando o recurso interno correto, específico para realizar esta operação no banco de dados.
     * @param {Request} req - Objeto de requisição, contendo os dados necessários.
     *      @param {string} req.body.email - Email do usuário.
     *      @param {string} req.body.senha - Senha do usuário.
     * @param {Response} res - Objeto da resposta, que será manipulada pelo controlador.
     * @returns {RespostaHTTP} O resultado da autenticação. Retorna um modelo próprio que acopla o objeto "res" nativo, definindo as seguintes informações...
     * - Código HTTP (res.statusCode): 200 (se OK), 403 (se credenciais invalidadas) ou 500 (se erro no servidor);
     * - Mensagem HTTP (res.mensagem): Mensagem sobre o resultado da requisição;
     * - Autorização (res.headers["authorization"]): Se o usuário foi autenticado com sucesso, um token de autorização é incluído no cabeçalho. O token guarda o id do usuário de forma criptografada, para que ele possa ser reconhecido em qualquer requisição posterior.
     */
    static async autenticar (req, res) {
        const { email, senha } = req.body
        const respostaHTTP = new RespostaHTTP(res)
        try {
            const idDoUsuarioAutenticado = await Usuario.autenticar(email, senha)
            const usuarioAutenticado = (idDoUsuarioAutenticado)
            const token = usuarioAutenticado? UsuarioServices.gerarToken(idDoUsuarioAutenticado) : undefined
            if (usuarioAutenticado) {
                respostaHTTP.atribuirToken(token)
                return respostaHTTP.sucesso("Usuário autenticado com sucesso.")
            }
            return respostaHTTP.erro(403, "Credenciais inválidas.")
        } catch (erro) {
            console.error(erro)
            return respostaHTTP.erroInterno()
        }
    }

    /**
     * @function consultar
     * @static @async
     * @description
     * Lida com requisições de consulta de dados, chamando o recurso interno correto, específico para realizar esta operação no banco de dados.
     * Só é possível o usuário consultar suas próprias informações. Por isso, este método só pode ser executado após a validação do usuário.
     * @param {Request} req - Requisição GET recebida.
     * @param {Response} res - Objeto da resposta, que será manipulado pelo controlador.
     * @returns {RespostaHTTP} O resultado da consulta. Retorna um modelo próprio que acopla o objeto "res" nativo, definindo as seguintes informações...
     * - Código HTTP (res.statusCode): 200 (se OK) ou 500 (se erro no servidor).
     *      Se o usuário não for encontrado, algo estranho aconteceu, porque o token fornecido armazena o ID de um registro já armazenado no banco de dados. Então um erro será disparado.
     * - Mensagem HTTP (res.mensagem): Mensagem sobre o resultado da consulta;
     * - Objeto de retorno: Retornará um objeto com dois campos: "avatar" (contendo a imagem de perfil do usuário salva no computador) e o "registro" (contém as informações do usuário encontrado). Se o usuário não tiver nenhuma imagem de perfil salva, o campo "avatar" será enviado com null.
     */
    static async consultar (req, res) {
        const respostaHTTP = new RespostaHTTP(res)
        try {
            const idDoUsuario = UsuarioServices.obterToken(req).id
            const refDaImgDoPerfil = UsuarioServices.obterRefDeImagem(idDoUsuario)
            const registroDoUsuario = await Usuario.consultar(idDoUsuario)
            (registroDoUsuario instanceof Usuario)
            const usuarioNaoEncontrado = (!registroDoUsuario)
            if (usuarioNaoEncontrado) {
                throw Error("Usuário não encontrado. Isto não deveria acontecer!")
            }
            return respostaHTTP.sucesso("Usuário encontrado", {avatar: refDaImgDoPerfil, registro: registroDoUsuario})
        } catch (erro) {
            console.error(erro)
            return respostaHTTP.erroInterno()
        }
    }

    /**
     * @function cadastrar
     * @static @async
     * @description
     * Gerencia a requisição de cadastro do usuário, chamando a ação interna que é responsável por realizar a operação no banco de dados.
     * Cadastrará um novo usuário no banco de dados utilizando as informações passadas.
     * @param {Request} req - Requisição contendo os valores para nome, email e senha.
     * @param {Response} res - Objeto da resposta, que será manipulado pelo controlador.
     * @returns {RespostaHTTP} O resultado do cadastro, contendo um código HTTP e uma mensagem de retorno.
     * - Se o cadastro foi feito com sucesso, o código retornado será o 201 (Created).
     * - Qualquer outro caso retornará o código 500 (Internal Server Error).
     */

    static async cadastrar(req, res) {
        const { nome, email, senha } = req.body
        const respostaHTTP = new RespostaHTTP(res)
        try {
            const usuarioFoiCadastrado = await Usuario.cadastrar(nome, email, senha)
            const usuarioNaoFoiCadastrado = (!usuarioFoiCadastrado)
            if (usuarioNaoFoiCadastrado) {
                return respostaHTTP.erroInterno("Usuário não foi cadastrado corretamente no banco de dados. Tente de novo.")
            }
            return respostaHTTP.cadastroOk()
        } catch (erro) {
            console.error(erro)
            return respostaHTTP.erroInterno()
        }
    }

    /**
     * @function alterar
     * @static @async
     * @description
     * Gerencia a requisição de alteração dos dados do usuário, chamando a ação interna que é responsável por realizar a operação no banco de dados.
     * Altera as informações do usuário cadastradas no banco de dados utilizando as informações passadas.
     * Só é possível realizar o processo de alteração se for possível identificar o usuário que a está solicitando.
     * Por isso, este método só pode ser executado após a validação do usuário.
     * Além disso, é necessário verificar antecipadamente se ele forneceu um token no cabeçalho da requisição, se este token é valido e se o ID do usuário está acessível nele.
     * @param {Request} req - Requisição contendo os campos que serão alterados e seus novos valores.
     * @param {Response} res - Objeto da resposta, que será manipulado pelo controlador.
     * @returns {RespostaHTTP} O resultado da alteração, contendo um código HTTP e uma mensagem de retorno.
     * - Se a alteração foi feita com sucesso, o código retornado será o 200 (OK).
     * - Qualquer outro caso retornará o código 500 (Internal Server Error).
     */
    static async alterar(req, res) {
        const { nome, genero, email, senha, dataDeNascimento } = req.body
        const respostaHTTP = new RespostaHTTP(res)
        try {
            const id = UsuarioServices.obterToken(req).id
            const dadosForamAlterados = await Usuario.alterar(id, nome, genero, email, senha, dataDeNascimento)
            const dadosNaoForamAlterados = (!dadosForamAlterados)
            if (dadosNaoForamAlterados) {
                return respostaHTTP.erroInterno("A alteração das informações não foram feitas corretamente no banco de dados. Tente de novo.")
            }
            return respostaHTTP.sucesso("Alteração realizada com sucesso.")
        } catch (erro) {
            console.error(erro)
            return respostaHTTP.erroInterno()
        }
    }
    
} module.exports = UsuarioController