/**
 * @class RespostaHTTP
 * @file resposta-http.js
 * @classdesc Esta classe representa a resposta HTTP a ser enviada para quem enviou a requisição.
 * @description
 * A função dela é padronizar as respostas HTTP enviadas para o cliente.
 * Por isso ela acopla métodos comumente utilizados para retorno.
 * A intenção é que toda resposta retornada para o cliente siga um padrão.
 * @author Denilson Santos
 */

class RespostaHTTP {

    /**
     * Construtor para criar um novo objeto padronizado de resposta HTTP.
     * Precisa receber o objeto de resposta nativo do Express.
     * Isso permitirá que a resposta enviada possa ser manipulada por um objeto desta classe. 
     * @constructor
     * @param {Response} res - Objeto de resposta.
     */
    constructor(res) {
        this.res = res
    }

    /**
     * Escreve o token enviado no cabeçalho da resposta que será enviada para o cliente.
     * @param {String} token - Token gerado pelo Jwt.
     */
    atribuirToken(token) {
        this.res.setHeader('Authorization', `Bearer ${token}`);
    }

    /**
     * Envia uma resposta de sucesso no cadastro para o cliente.
     * A mensagem será retornada com o código HTTP 201 (Created)
     * @param {String} mensagem - Permite o envio de uma mensagem HTTP customizada (opcional).
     * @param {Object} objeto - Permite a inclusão de um objeto na resposta encaminhada para o cliente (opcional).
     */
    cadastroOk(mensagem=undefined, objeto=undefined) {
        mensagem = (mensagem === undefined)? "Cadastro realizado com sucesso." : mensagem
        this.res.status(201).json({mensagem: mensagem, objeto: objeto})
    }

    /**
     * Envia uma resposta de sucesso para o cliente.
     * A mensagem será retornada com o código HTTP 200 (OK)
     * @param {String} mensagem - Permite o envio de uma mensagem HTTP customizada (opcional).
     * @param {Object} objeto - Permite a inclusão de um objeto na resposta encaminhada para o cliente (opcional).
     */
    sucesso(mensagem=undefined, objeto=undefined) {
        mensagem = (mensagem === undefined)? "Operação realizada com sucesso." : mensagem
        this.res.status(200).json({mensagem: mensagem, objeto: objeto})
    }

    /**
     * Envia uma resposta de erro para o cliente.
     * @param {int} codigoHTTP - Código HTTP que a resposta conterá.
     * @param {String} mensagem - Mensagem HTTP a ser encaminhada para o cliente.
     * @param {Object} objeto - Permite a inclusão de um objeto na resposta encaminhada para o cliente (opcional).
     */
    erro(codigoHTTP, mensagem, objeto=undefined) {
        this.res.status(codigoHTTP).json({mensagem: mensagem, objeto: objeto})
    }

    /**
     * Envia uma resposta de erro para o cliente, avisando que o erro ocorreu por parte do servidor.
     * A mensagem será retornada com o código HTTP 500 (Internal Server Error)
     * @param {String} mensagem - Permite o envio de uma mensagem HTTP customizada (opcional).
     * @param {Object} objeto - Permite a inclusão de um objeto na resposta encaminhada para o cliente (opcional).
     */
    erroInterno(mensagem=undefined, objeto=undefined) {
        mensagem = (mensagem === undefined)? "Erro interno ocorrido durante o processamento da requisição. Entre em contato com o administrador ou tente novamente mais tarde." : mensagem
        this.res.status(500).json({mensagem: mensagem, objeto: objeto})
    }

} module.exports = RespostaHTTP