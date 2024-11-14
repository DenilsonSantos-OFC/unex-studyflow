/**
 * @class RespostaHTTP
 * @file resposta-http.js
 * @author Denilson Santos
 * @classdesc Esta classe representa a resposta HTTP a ser enviada para o cliente.
 * @description
 * A função dela é padronizar as respostas HTTP enviadas para o cliente.
 * Por isso ela acopla métodos comumente utilizados para retorno.
 * A intenção é que toda resposta retornada para o cliente siga um padrão.
 * @instance @property {Response} res - Objeto de resposta do Express.
 * @static @property {string} campoTokenNoCabecalho - Nome do campo no cabeçalho onde o token é armazenado.
 * @static @property {string} prefixoDeToken - Prefixo do token no cabeçalho.
 * @static @property {Object} msgsPadrao - Mensagens padrão para cada código HTTP.
 */

class RespostaHTTP {
    static campoTokenNoCabecalho = 'Authorization'
    static prefixoDeToken = 'Bearer'
    static msgsPadrao = {
        200: 'Operação realizada com sucesso.',
        201: 'Cadastro realizado com sucesso.',
        401: 'Não tem autorização para fazer isso.',
        403: 'Solicitação rejeitada!',
        404: 'Não encontrado.',
        500: 'Erro ao processar a requisição. Provavelmente a culpa não foi sua. Acione o administrador!',
        503: 'Recurso temporariamente indisponível. Interrompido para manutenção...'
    }

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

    // ------------------------------------------------------------------- //
    // ------------------------- AÇÕES GENÉRICAS ------------------------- //
    // ------------------------------------------------------------------- //

    /**
     * Envia a resposta HTTP para o cliente.
     * @param {number} codigoHTTP - Código HTTP que será registrado na resposta.
     * @param {string|undefined} mensagem - Mensagem personalizada que a resposta conterá (opcional).
     * @param {object|undefined} objeto - Objeto que será enviado para o cliente por meio da resposta (opcional).
     */
    enviar(codigoHTTP, mensagem=undefined, objeto=undefined) {
        this.res.status(codigoHTTP).json({mensagem: mensagem, objeto: objeto})
    }

    /**
     * Registra uma nova informação no cabeçalho da resposta.
     * @param {string} nomeDoCampo - Nome do campo aonde a informação será armazenada no cabeçalho da resposta.
     * @param {string} informacao - Informação que será armazenada no cabeçalho, dentro do campo com o nome especificado.
     */
    registrar(nomeDoCampo, informacao) {
        this.res.setHeader(nomeDoCampo, informacao)
    }

    // ------------------------------------------------------------------- //
    // ----------------------- MÉTODOS AUXILIARES ------------------------ //
    // ------------------------------------------------------------------- //

    /**
     * Envia a resposta HTTP para o cliente com uma mensagem adicional, sempre que possível.
     * Se a mensagem não for informada mas o código HTTP informado contiver uma mensagem padrão,
     * a resposta será enviada com esta mensagem padrão registrada.
     * @param {number} codigoHTTP - Código HTTP que será registrado na resposta.
     * @param {string|undefined} mensagem - Mensagem personalizada que a resposta conterá (opcional).
     * @param {object|undefined} objeto - Objeto que será enviado para o cliente por meio da resposta (opcional).
     */
    enviarComMsg(codigoHTTP, mensagem=undefined, objeto=undefined) {
        const codigosComMsgPadrao = RespostaHTTP.obterCodigosComMsgPadrao()
        const codigoPossuiMsgPadrao = codigosComMsgPadrao.includes(codigoHTTP.toString())
        const msgNaoFoiPassada = !mensagem
        if ( (msgNaoFoiPassada) && (codigoPossuiMsgPadrao))
            mensagem = RespostaHTTP.msgsPadrao[codigoHTTP]
        this.enviar(codigoHTTP, mensagem, objeto)
    }

    /**
     * Obtém um array com os códigos HTTP que possuem uma mensagem padrão definida nesta classe.
     * @returns {number[]}
     */
    static obterCodigosComMsgPadrao() {
        return Object.keys(RespostaHTTP.msgsPadrao)
    }

    // ------------------------------------------------------------------- //
    // ------------ MÉTODOS PARA RETORNAR RESPOSTAS DE SUCESSO ----------- //
    // ------------------------------------------------------------------- //

    /**
     * Envia uma resposta HTTP de sucesso para o cliente.
     * A mensagem será retornada com o código HTTP 200 (OK).
     * @param {string|undefined} mensagem - Mensagem personalizada que a resposta conterá (opcional).
     * @param {object|undefined} objeto - Objeto que será enviado para o cliente por meio da resposta (opcional).
     */
    enviarOk(mensagem=undefined, objeto=undefined) {
        const codigoHTTP = 200
        this.enviarComMsg(codigoHTTP, mensagem, objeto)
    }

    /**
     * Envia uma resposta HTTP de sucesso no cadastro para o cliente.
     * A mensagem será retornada com o código HTTP 201 (Created).
     * @param {string|undefined} mensagem - Mensagem personalizada que a resposta conterá (opcional).
     * @param {object|undefined} objeto - Objeto que será enviado para o cliente por meio da resposta (opcional).
     */
    enviarOkPraCadastro(mensagem=undefined, objeto=undefined) {
        const codigoHTTP = 201
        this.enviarComMsg(codigoHTTP, mensagem, objeto)
    }

    // ------------------------------------------------------------------- //
    // -------------- MÉTODOS PARA RETORNAR RESPOSTAS DE ERRO ------------ //
    // ------------------------------------------------------------------- //

    /**
     * Envia uma resposta de erro para o cliente.
     * @param {number} codigoHTTP - Código HTTP que será registrado na resposta.
     * @param {string|undefined} mensagem - Mensagem personalizada que a resposta conterá (opcional).
     * @param {object|undefined} objeto - Objeto que será enviado para o cliente por meio da resposta (opcional).
     */
    enviarErro(codigoHTTP, mensagem, objeto=undefined) {
        this.enviarComMsg(codigoHTTP, mensagem, objeto)
    }

    /**
     * Envia uma resposta de recurso não encontrado para o cliente.
     * @param {string|undefined} mensagem - Mensagem personalizada que a resposta conterá (opcional).
     * @param {object|undefined} objeto - Objeto que será enviado para o cliente por meio da resposta (opcional).
     */
    enviarErroDeAusencia(mensagem=undefined, objeto=undefined) {
        const codigoHTTP = 404
        this.enviarComMsg(codigoHTTP, mensagem, objeto)
    }

    /**
     * Envia uma resposta de erro de campo ausente para o cliente.
     * Use este método quando algum campo necessário não for informado na requisição.
     * @param {string} nomeDoCampo - Nome do campo que faltou na requisição.
     * @param {object|undefined} objeto - Objeto que será enviado para o cliente por meio da resposta (opcional).
     */
    enviarErroDeCampoAusente(nomeDoCampo, objeto=undefined) {
        const codigoHTTP = 400
        const mensagem = `Campo "${nomeDoCampo}" não recebido pela requisição.`
        this.enviar(codigoHTTP, mensagem, objeto)
    }

    /**
     * Envia uma resposta de erro de dado inválido para cliente.
     * Use este método quando algum dado incorreto for passado pela requisição.
     * @param {string} nomeDoCampo - Nome do campo na requisição que possui o dado inválido.
     * @param {object|undefined} objeto - Objeto que será enviado para o cliente por meio da resposta (opcional).
     */
    enviarErroDeDadoInvalido(nomeDoCampo, objeto=undefined) {
        const codigoHTTP = 400
        const mensagem = `Campo "${nomeDoCampo}" preenchido de forma incorreta.`
        this.enviar(codigoHTTP, mensagem, objeto)
    }

    /**
     * Envia uma resposta de erro para o cliente, avisando que o erro ocorreu por parte do servidor.
     * A mensagem será retornada com o código HTTP 500 (Internal Server Error).
     * @param {string|undefined} mensagem - Mensagem personalizada que a resposta conterá (opcional).
     * @param {object|undefined} objeto - Objeto que será enviado para o cliente por meio da resposta (opcional).
     */
    enviarErroInterno(mensagem=undefined, objeto=undefined) {
        const codigoHTTP = 500
        this.enviarComMsg(codigoHTTP, mensagem, objeto)
    }

    /**
     * Captura o erro ocorrido durante o processamento de uma requisição e exibe no console do servidor.
     * Além disso, envia uma resposta de erro para o cliente, avisando que o erro ocorreu por parte do servidor.
     * A mensagem será retornada com o código HTTP 500 (Internal Server Error).
     * @param {Error} erro - Exceção ocorrida durante o processamento da requisição.
     * @param {string|undefined} mensagem - Mensagem personalizada que a resposta conterá (opcional).
     * @param {object|undefined} objeto - Objeto que será enviado para o cliente por meio da resposta (opcional).
     */
    enviarErroInternoPraDebug(erro, mensagem=undefined, objeto=undefined) {
        console.error(erro)
        return this.enviarErroInterno(mensagem, objeto)
    }

    // ------------------------------------------------------------------- //
    // ------------- MÉTODOS PARA RETORNAR RESPOSTAS DE ESTADO ----------- //
    // ------------------------------------------------------------------- //

    /**
     * Envia uma resposta que avisa o cliente que o recurso solicitado está em manutenção.
     * A mensagem será retornada com o código HTTP 503 (Service Unavailable).
     * @param {string|undefined} mensagem - Mensagem personalizada que a resposta conterá (opcional).
     * @param {object|undefined} objeto - Objeto que será enviado para o cliente por meio da resposta (opcional).
     */
    enviarAvisoDeManutencao(mensagem=undefined, objeto=undefined) {
        const codigoHTTP = 503
        this.enviarComMsg(codigoHTTP, mensagem, objeto)
    }

    /**
     * Envia uma resposta de negação de acesso para o cliente.
     * A mensagem será retornada com o código HTTP 401 (Unauthorized).
     * @param {string|undefined} mensagem - Mensagem personalizada que a resposta conterá (opcional).
     * @param {object|undefined} objeto - Objeto que será enviado para o cliente por meio da resposta (opcional).
     */
    enviarNegacao(mensagem=undefined, objeto=undefined) {
        const codigoHTTP = 401
        this.enviarComMsg(codigoHTTP, mensagem, objeto)
    }

    /**
     * Envia uma resposta de proibição para o cliente.
     * A mensagem será retornada com o código HTTP 403 (Forbidden).
     * @param {string|undefined} mensagem - Mensagem personalizada que a resposta conterá (opcional).
     * @param {object|undefined} objeto - Objeto que será enviado para o cliente por meio da resposta (opcional).
     */
    enviarProibicao(mensagem=undefined, objeto=undefined) {
        const codigoHTTP = 403
        this.enviarComMsg(codigoHTTP, mensagem, objeto)
    }

} module.exports = RespostaHTTP