// Inicialização das variáveis privadas (variáveis de ambiente)
const { config: variaveisDeAmbiente } = require('dotenv')
const { expand: expandir } = require('dotenv-expand')
expandir(variaveisDeAmbiente())

// Configuração das rotas
const rotasDeUsuario = require('./routes/usuario-routes')
const rotasDeTarefas = require('./routes/tarefa-routes')

// Configuração da documentação
const Swagger = require('./configs/documentacao-swagger')
const swaggerUi = require('swagger-ui-express')
const swaggerConfig = new Swagger().exportarConfigs()

// Importação do middleware para tratamento de erros
const ExecucaoMid = require('./middlewares/execucao-middleware')

// Configuração do Servidor Express
const cors = require('cors')
const express = require('express')
const app = express()
app.use(cors())
app.use(express.json())
app.use(rotasDeUsuario)
app.use(rotasDeTarefas)
app.use(ExecucaoMid.depurarErroSeOcorrer)
app.use('/perfil/imagens', express.static(process.env.IMG_PROFILES))
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerConfig))

// Inicialização do Servidor
app.listen(process.env.SRV_PORTA, () => {
    console.log(`Servidor StudyFlow rodando na porta ${process.env.SRV_PORTA}...`)
})