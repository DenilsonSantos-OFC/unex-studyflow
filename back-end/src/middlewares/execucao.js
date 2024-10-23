const RespostaHTTP = require('../models/resposta-http')

function mostrarErroInternoSeOcorrer(erro, req, res, next) {
    const respostaHTTP = new RespostaHTTP(res)
    console.error(erro)
    respostaHTTP.erroInterno()
}

module.exports = mostrarErroInternoSeOcorrer