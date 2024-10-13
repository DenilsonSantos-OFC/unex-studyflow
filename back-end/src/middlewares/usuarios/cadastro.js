const UsuarioServices = require('../../services/usuario-services')

function checarDadosDeCadastro(req, res, next) {
    const { nome, email, senha } = req.body
    if (!nome)
        return res.status(400).json({mensagem: `Campo "nome" não foi recebido`})
    if (!email)
        return res.status(400).json({mensagem: `Campo "email" não foi recebido`})
    if (!senha)
        return res.status(400).json({mensagem: `Campo "senha" não foi recebido`})
    next()
}

function tratarNovosDados(req, res, next) {
    const { nome, email } = req.body
    req.body.nome = UsuarioServices.adequarNome(nome)
    req.body.email = UsuarioServices.adequarEmail(email)
    next()
}

module.exports = {
    checarDadosDeCadastro,
    tratarNovosDados
}