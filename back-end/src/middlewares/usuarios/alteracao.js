const { MulterError } = require('multer')
const UsuarioServices = require('../../services/usuario-services')
const RespostaHTTP = require('../../models/resposta-http')

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
    const respostaHTTP = new RespostaHTTP(res)
    upload(req, res, (erro) => {
        const arquivoNaoRecebido = (!req.files.imagem)
        const alteracoesRestantes = Object.keys(req.body).length
        if (erro instanceof MulterError) {
            console.error(erro)
            return respostaHTTP.erro(400, "Erro durante upload.")
        }
        if (erro) {
            console.error(erro)
            return respostaHTTP.erroInterno()
        }
        if (alteracoesRestantes > 0) {
            return next()
        }
        if (arquivoNaoRecebido) {
            return respostaHTTP.sucesso("Nenhum campo foi alterado, mas OK.")
        }
        return respostaHTTP.sucesso("Imagem de perfil alterada com sucesso.")
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