const RespostaHTTP = require('../../models/resposta-http')
const UsuarioServices = require('../../services/usuario-services')

class ChecagemMiddlewares {

    static checarAlteracoesSolicitadas(req, res, next) {
        const respostaHTTP = new RespostaHTTP(res)
        const { nome, genero, email, senha, dataDeNascimento } = req.body
        const novosValores = Object.values({ nome, genero, email, senha, dataDeNascimento })
        let precisaMexerNoBD
        novosValores.forEach(valor => {
            if (valor)
                precisaMexerNoBD = true})
        if (!precisaMexerNoBD)
            return respostaHTTP.enviarErro(400, "Nenhuma alteração válida foi recebida.")
        next()
    }
    
    static checarAutenticacao(req, res, next) {
        const token = UsuarioServices.obterToken(req)
        const respostaHTTP = new RespostaHTTP(res)
        if (token === undefined)
            return respostaHTTP.enviarNegacao("Login não detectado. Necessário passar pela etapa de login novamente.")
        if (token === null)
            return respostaHTTP.enviarProibicao("Token manipulado. Autenticação rejeitada!")
        next()
    }

    static checarCredenciais(req, res, next) {
        const { email, senha } = req.body
        const respostaHTTP = new RespostaHTTP(res)
        if (!email)
            return respostaHTTP.enviarErroDeCampoAusente("email")
        if (!senha)
            return respostaHTTP.enviarErroDeCampoAusente("senha")
        next()
    }

    static checarDadosDeCadastro(req, res, next) {
        const { nome, email, senha } = req.body
        const respostaHTTP = new RespostaHTTP(res)
        if (!nome)
            return respostaHTTP.enviarErroDeCampoAusente("nome")
        if (!email)
            return respostaHTTP.enviarErroDeCampoAusente("email")
        if (!senha)
            return respostaHTTP.enviarErroDeCampoAusente("senha")
        next()
    }

} module.exports = ChecagemMiddlewares
