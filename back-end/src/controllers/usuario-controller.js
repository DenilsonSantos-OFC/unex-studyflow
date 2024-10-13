const Usuario = require('../models/usuario')
const RespostaHTTP = require('../models/resposta-http')
const UsuarioServices = require('../services/usuario-services')

/**
 * @class UsuarioController
 * @file usuario-controller.js
 * @classdesc Esta classe é um controlador especializado para o gerenciamento de requisições envolvendo o usuário da plataforma StudyFlow. Não pode ser instanciado.
 * @description
 * Os métodos desta classe devem ser aplicados somente após passar por todos os middlewares, o que envolve passar nas checagens, validações e tratamentos de dados dentro da requição.
 * Ela determina como os dados recebidos na requisição serão processados por meio do banco de dados.
 * Como é o modelo "Usuário" que interage diretamente com o banco de dados, esta classe tem como responsabilidade ditar qual ação o modelo executará no banco de dados.
 * Também, ela define qual resposta será enviada para quem enviou a requisição, o que inclui o código HTTP, uma mensagem de retorno, e adicionalmente, um objeto de retorno.
 * Por isso, é crucial interpretar os retornos obtidos a partir do banco de dados e também tratar erros que possam vir a acontecer durante a operação.
 * O que os métodos aqui têm em comum?
 * Todos eles trabalham com par de parâmetros "req" e "res", "requisição" e "resposta", respectivamente.
 * @author Denilson Santos
 */

class UsuarioController {

    /**
     * @function autenticar
     * @static @async
     * @description
     * Gerencia a requisição de autenticação, chamando a ação interna que é responsável por realizar a operação no banco de dados.
     * @param {Request} req - Objeto da requisição.
     * @param {Response} res - Objeto da resposta.
     * @returns {RespostaHTTP} O resultado da autenticação, contendo um código HTTP e uma mensagem de retorno.
     * - Se o usuário foi autenticado por meio do método chamado, um token de autorização é incluído no cabeçalho.
     *   O token guarda o id do usuário de forma criptografada, para que ele possa ser reconhecido em qualquer requisição posterior.
     * - Se o usuário não for autenticado com sucesso, a resposta retornará o código HTTP 403, de acesso proibido.
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
     * Gerencia a requisição de consulta de informações, chamando a ação interna que é responsável por realizar a operação no banco de dados.
     * Só é possível o usuário consultar suas próprias informações.
     * Por isso, este método só pode ser executado após a validação do usuário.
     * Para isto, é necessário verificar antecipadamente se ele forneceu um token no cabeçalho da requisição, se este token é valido e se o ID do usuário está acessível nele.
     * Em resumo, a consulta dos dados é feita utilizando o token.
     * @param {Request} req - Objeto da requisição.
     * @param {Response} res - Objeto da resposta.
     * @returns {RespostaHTTP} O resultado da consulta, contendo um código HTTP, uma mensagem de retorno e um objeto que contém o avatar e o registro do usuário.
     * 
     */
    static async consultar (req, res) {
        const respostaHTTP = new RespostaHTTP(res)
        try {
            const idDoUsuario = UsuarioServices.obterToken(req).id
            const refDaImgDoPerfil = `${process.env.IMG_PROFILES}/${idDoUsuario}.${process.env.IMG_EXT}`
            const registroDoUsuario = await Usuario.consultar(idDoUsuario)
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
     * @param {Request} req - Objeto da requisição.
     * @param {Response} res - Objeto da resposta.
     */

    static async cadastrar(req, res) {
        try {
            const { nome, email, senha } = req.body
            const usuarioFoiCadastrado = await Usuario.cadastrar(nome, email, senha)
            const usuarioNaoFoiCadastrado = (!usuarioFoiCadastrado)
            const respostaHTTP = new RespostaHTTP(res)
            if (usuarioNaoFoiCadastrado) {
                return respostaHTTP.erroInterno("Usuário não foi cadastrado corretamente no banco de dados. Tente de novo.")
            }
            return respostaHTTP.sucesso(201, "Cadastro realizado com sucesso.")
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
     * @param {Request} req - Objeto da requisição.
     * @param {Response} res - Objeto da resposta.
     */
    static async alterar(req, res) {
        try {
            const { nome, genero, email, senha, dataDeNascimento } = req.body
            const id = UsuarioServices.obterToken(req).id
            const dadosForamAlterados = await Usuario.alterar(id, nome, genero, email, senha, dataDeNascimento)
            const dadosNaoForamAlterados = (!dadosForamAlterados)
            const respostaHTTP = new RespostaHTTP(res)
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