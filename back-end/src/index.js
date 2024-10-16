const express = require('express')
const rotasDeUsuario = require('./routes/usuario-routes')
const rotasDeTarefas = require('./routes/tarefa-routes')
const { config: variaveisDeAmbiente } = require('dotenv')
const { expand: preparar } = require('dotenv-expand')

preparar(variaveisDeAmbiente())

const app = express()

app.use(express.json())
app.use(rotasDeUsuario)
app.use(rotasDeTarefas)
app.use('/perfil/imagens', express.static(process.env.IMG_PROFILES))
app.use((erro, req, res, next) => {
    console.error(erro)
    res.status(500).json({mensagem: "Erro interno no servidor durante o processamento da requisição."})
})

app.listen(process.env.SRV_PORTA, () => {
    console.log(`Servidor StudyFlow rodando na porta ${process.env.SRV_PORTA}...`)
})