class RespostaHTTP {

    constructor(res) {
        this.res = res
    }

    atribuirToken(token) {
        this.res.setHeader('Authorization', `Bearer ${token}`);
    }

    sucesso(mensagem=undefined, objeto=undefined) {
        mensagem = (mensagem === undefined)? "Operação realizada com sucesso." : mensagem
        this.res.status(200).json({mensagem: mensagem, objeto: objeto})
    }

    erro(codigoHTTP, mensagem, objeto=undefined) {
        this.res.status(codigoHTTP).json({mensagem: mensagem, objeto: objeto})
    }

    erroInterno(mensagem=undefined, objeto=undefined) {
        mensagem = (mensagem === undefined)? "Erro interno ocorrido durante o processamento da requisição. Entre em contato com o administrador ou tente novamente mais tarde." : mensagem
        this.res.status(500).json({mensagem: mensagem, objeto: objeto})
    }


} module.exports = RespostaHTTP