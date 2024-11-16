// Inicialização das variáveis privadas (variáveis de ambiente)
const { config: variaveisDeAmbiente } = require('dotenv')
const { expand: expandir } = require('dotenv-expand')
expandir(variaveisDeAmbiente())

// 
const jwt = require('jsonwebtoken')
let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjIiLCJpYXQiOjE3MzE3Nzg2OTMsImV4cCI6MTczOTU1NDY5M30.emlt_CpR2RhPhqe9mZQ9mHnimMHGpJ5oLSs6Yb2-oN8'

console.log(jwt.verify(token, process.env.JWT_SEGREDO))