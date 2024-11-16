const { config: variaveisDeAmbiente } = require('dotenv')
const { expand: expandir } = require('dotenv-expand')
expandir(variaveisDeAmbiente())

const jwt = require('jsonwebtoken')

let tokens = [
    ' eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjIiLCJpYXQiOjE3MzE3ODEyMzQsImV4cCI6MTczOTU1NzIzNH0.ae5p-H1MFUg8ITmE3nJaxsEDEBpKzQ-0arO9WP4rvII',
]

for (let token of tokens) {
    console.log(jwt.verify(token.trim(), process.env.JWT_SEGREDO))
}