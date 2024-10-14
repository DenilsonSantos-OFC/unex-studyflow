const { MulterError } = require('multer')
const UsuarioServices = require('../../services/usuario-services')

function checarMudancasNoBD(req, res, next) {
    const numDeCamposPraEditar = Object.keys(req.body).length
    const precisaMexerNoBD = (numDeCamposPraEditar > 0)
    const naoPrecisaMexerNoBD = (!precisaMexerNoBD)
    if (naoPrecisaMexerNoBD)
        return res.status(200).json({mensagem: "Nenhum campo foi alterado, mas OK."})
    next()
}

function checarUpload(req, res, next) {
    const upload = UsuarioServices.obterUploaderDeImgDoUsuario(req)
    console.log(req.body)
    upload(req, res, (erro) => {
        const alteracoesRestantes = Object.keys(req.body).length
        if (erro instanceof MulterError) {
            console.error(erro)
            return res.status(400).json({mensagem: "Erro durante upload."})
        }
        if (erro) {
            console.error(erro)
            return res.status(500).json({mensagem: "Erro interno do servidor."})
        }
        if (alteracoesRestantes === 0)
            return res.status(200).json({mensagem: "Imagem de perfil alterada com sucesso."})
        next()
    })
}

function tratarNovosDados(req, res, next) {
    const { nome, genero, email, dataDeNascimento } = req.body
    if (nome)
        req.body.nome = UsuarioServices.adequarNome(nome)
    if (genero)
        req.body.genero = UsuarioServices.adequarGenero(genero)
    if (email)
        req.body.email = UsuarioServices.adequarEmail(email)
    if (dataDeNascimento)
        req.body.dataDeNascimento = UsuarioServices.adequarData(dataDeNascimento)
    next()
}

 module.exports = {
    checarMudancasNoBD,
    checarUpload,
    tratarNovosDados
}