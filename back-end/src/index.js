const { config: variaveisDeAmbiente } = require('dotenv')
const { expand: preparar } = require('dotenv-expand')

preparar(variaveisDeAmbiente())

async function main() {
    const Usuario = require('./models/usuario')
    // const usuario = await Usuario.consultar('çlkjad')
    const usuario = await Usuario.cadastrar("lucas silva", "sadsdad@email.com", "lucas0029")
    // console.log(usuario)
}

main()