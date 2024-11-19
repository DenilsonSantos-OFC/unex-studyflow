const { config: variaveisDeAmbiente } = require('dotenv')
const { expand: expandir } = require('dotenv-expand')
expandir(variaveisDeAmbiente())

const jwt = require('jsonwebtoken')

let tokens = [
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjIiLCJpYXQiOjE3MzE3ODM3MTMsImV4cCI6MTczOTU1OTcxM30.R6D7R2cTXMGCL3dKW-fzIMOR6V5r5ApRQyB6Q_V2WNk',
]

for (let token of tokens) {
    console.log(jwt.verify(token.trim(), process.env.JWT_SEGREDO))
}