const Documentacao = require('./documentacao')
const Servidor = require('../models/servidor')
const swaggerJSDoc = require('swagger-jsdoc')

class DocumentacaoSwagger extends Documentacao {
    servidorLocal = new Servidor(
        'http://localhost:3000',
        'Servidor local de desenvolvimento.'
    )
    servidorDeProducao = new Servidor(
        'https://unex-studyflow.onrender.com',
        'Servidor de produção.'
    )
    rotasPraDocumentacao = ['*/routes/*.js']

    constructor() {
        super()
    }

    exportarConfigs() {
        const swaggerDefinition = {
            openapi: this.versaoOpenAPI,
            info: {
                title: this.titulo,
                version: this.versao,
                description: this.descricao},
            servers: [
                this.servidorLocal,
                this.servidorDeProducao]}
        const options = {
            swaggerDefinition,
            apis: this.rotasPraDocumentacao}
        return swaggerJSDoc(options)
    }

} module.exports = DocumentacaoSwagger