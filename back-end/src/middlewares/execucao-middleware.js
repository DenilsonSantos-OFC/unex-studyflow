const RespostaHTTP = require('../models/resposta-http')

class ExecucaoMiddleware {

    static depurarErroSeOcorrer(erro, req, res, next) {
        const respostaHTTP = new RespostaHTTP(res)
        const tipoDoErro = erro.type
        if (tipoDoErro === "entity.parse.failed")
            return respostaHTTP.enviarErro(400, 'Formato JSON inválido.')
        return respostaHTTP.enviarErroInternoPraDebug(erro)
    }

} module.exports = ExecucaoMiddleware