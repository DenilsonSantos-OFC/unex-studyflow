// Inicialização das variáveis privadas (variáveis de ambiente)
const { config: variaveisDeAmbiente } = require('dotenv')
const { expand: preparar } = require('dotenv-expand')
preparar(variaveisDeAmbiente())

// Configuração das rotas
const rotasDeUsuario = require('./routes/usuario-routes')
const rotasDeTarefas = require('./routes/tarefa-routes')

// Configuração do Servidor Express
const express = require('express')
const mostrarErroInternoSeOcorrer = require('./middlewares/execucao')
const app = express()
app.use(express.json())
app.use(rotasDeUsuario)
app.use(rotasDeTarefas)
app.use(mostrarErroInternoSeOcorrer)
app.use('/perfil/imagens', express.static(process.env.IMG_PROFILES))

// Inicialização do Servidor
app.listen(process.env.SRV_PORTA, () => {
    console.log(`Servidor StudyFlow rodando na porta ${process.env.SRV_PORTA}...`)
})