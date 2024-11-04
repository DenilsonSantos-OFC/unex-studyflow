const UsuarioServices = require('../../services/usuario-services')

class TratamentoMiddlewares {

    static tratarDadosDeAlteracao(req, res, next) {
        const { nome, genero, email, dataDeNascimento } = req.body
        if (nome)
            req.body.nome = UsuarioServices.adequarNomeCompleto(nome)
        if (genero)
            req.body.genero = UsuarioServices.adequarGenero(genero)
        if (email)
            req.body.email = UsuarioServices.adequarEmail(email)
        if (dataDeNascimento)
            req.body.dataDeNascimento = UsuarioServices.adequarData(dataDeNascimento)
        next()
    }

    static tratarDadosDeAutenticacao(req, res, next) {
        const { email } = req.body
        req.body.email = UsuarioServices.adequarEmail(email)
        next()
    }

    static tratarDadosDeCadastro(req, res, next) {
        const { nome, email } = req.body
        req.body.nome = UsuarioServices.adequarNomeCompleto(nome)
        req.body.email = UsuarioServices.adequarEmail(email)
        next()
    }
    
} module.exports = TratamentoMiddlewares