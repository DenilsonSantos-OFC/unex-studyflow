const UsuarioServices = require('../../services/usuario-services')

function checarAutenticacao(req, res, next) {
    const token = UsuarioServices.obterToken(req)
    if (token === undefined)
        return res.status(401).json({mensagem: "Estado de login não detectado, um novo login deve ser feito."})
    if (token === null)
        return res.status(403).json({mensagem: "Token adulterado. Autenticação rejeitada!"})
    next()
}

function checarCredenciais(req, res, next) {
    const { email, senha } = req.body
    if (!email)
        return res.status(400).json({mensagem: `Campo "email" não foi recebido`})
    if (!senha)
        return res.status(400).json({mensagem: `Campo "senha" não foi recebido`})
    next()
}

function tratarNovosDados(req, res, next) {
    const { email } = req.body
    req.body.email = UsuarioServices.adequarEmail(email)
    next()
}

module.exports = {
    checarAutenticacao,
    checarCredenciais,
    tratarNovosDados
}