/**
 * @class UsuarioController
 * @file usuario-controller.js
 * @author Denilson Santos
 * @classdesc Esta classe é um controlador especializado para o gerenciamento de requisições envolvendo o usuário da plataforma StudyFlow. Não pode ser instanciado.
 * @description
 * Os métodos desta classe devem ser aplicados somente após passar por todos os middlewares, o que envolve passar nas checagens, validações e tratamentos de dados dentro da requisição.
 * Isto quer dizer que se a requisição chegou com sucesso a este controlador, é porque todas as informações estão ok e é possível prosseguir para a operação no banco de dados.
 * Portanto, todas as informações na requisição devem ser revisadas e tratadas de forma prévia antes de chegar aqui.
 * Como é o modelo "Usuário" que interage diretamente com o banco de dados, esta classe tem como responsabilidade ditar qual ação o modelo executará no banco de dados.
 * Também, ela define qual resposta será enviada para quem enviou a requisição, o que inclui o código HTTP, uma mensagem de retorno, e adicionalmente, um objeto de retorno.
 * Por isso, é crucial interpretar os retornos obtidos a partir do banco de dados e também tratar erros que possam vir a acontecer durante a operação.
 * O que os métodos aqui têm em comum?
 * Todos eles trabalham com o par de parâmetros "req" e "res", "requisição" e "resposta", respectivamente.
 */

const RespostaHTTP = require('../models/resposta-http')
const Usuario = require('../models/usuario')
const UsuarioServices = require('../services/usuario-services')

class UsuarioController {

    static async autenticar(req, res) {
        const respostaHTTP = new RespostaHTTP(res)
        const msgOk = 'Usuário autenticado com sucesso.'
        const msgFalha = 'Credenciais inválidas.'
        const { email, senha } = req.body
        let idDoUsuario
        try {
            idDoUsuario = await Usuario.autenticar(email, senha)
        } catch (erro) {
            return respostaHTTP.enviarErroInternoPraDebug(erro)
        }
        if (!idDoUsuario)
            return respostaHTTP.enviarProibicao(msgFalha)
        respostaHTTP.enviarCookieDeAuth(UsuarioServices.gerarToken(idDoUsuario))
        return respostaHTTP.enviarOk(msgOk)
    }

    static async consultar(req, res) {
        const respostaHTTP = new RespostaHTTP(res)
        const msgOk = 'Usuário encontrado.'
        const msgErro = 'Usuário não localizado. Isto não deveria acontecer!'
        const idDoUsuario = UsuarioServices.obterToken(req).id
        const refDoAvatarDoPerfil = UsuarioServices.obterRefDeAvatar(idDoUsuario)
        let registroDoUsuario
        try {
            registroDoUsuario = await Usuario.consultar(idDoUsuario)
        } catch (error) {
            return respostaHTTP.enviarErroInternoPraDebug(erro)
        }
        if (!registroDoUsuario) {
            return respostaHTTP.enviar (`ID ${idDoUsuario}: ${msgErro}`, msgErro)
        }
        return respostaHTTP.enviarOk(msgOk, {avatar: refDoAvatarDoPerfil, registro: registroDoUsuario})
    }

    static async cadastrar(req, res) {
        const respostaHTTP = new RespostaHTTP(res)
        const msgFalha = 'Usuário não foi cadastrado corretamente no banco de dados. Tente de novo.'
        const { nome, email, senha } = req.body
        let usuarioFoiCadastrado
        try {
            usuarioFoiCadastrado = await Usuario.cadastrar(nome, email, senha, teste)
        } catch (erro) {
            return respostaHTTP.enviarErroInternoPraDebug(erro)
        }
        if (!usuarioFoiCadastrado)
            return respostaHTTP.enviarErroInterno(msgFalha)
        return respostaHTTP.enviarOkPraCadastro('Usuário cadastrado com sucesso.')
    }

    static async alterar(req, res) {
        const respostaHTTP = new RespostaHTTP(res)
        const msgOk = 'Alteração realizada com sucesso.'
        const msgFalha = 'A alteração das informações não foram feitas corretamente no banco de dados. Tente de novo.'
        const { nome, genero, email, senha, dataDeNascimento } = req.body
        const idDoUsuario = UsuarioServices.obterToken(req).id
        let dadosForamAlterados
        try {
            dadosForamAlterados = await Usuario.alterar(idDoUsuario, nome, genero, email, senha, dataDeNascimento)
        } catch (erro) {
            return respostaHTTP.enviarErroInternoPraDebug(erro)
        }
        if (!dadosForamAlterados)
            return respostaHTTP.enviarErroInterno(msgFalha)
        return respostaHTTP.enviarOk(msgOk)
    }

} module.exports = UsuarioController