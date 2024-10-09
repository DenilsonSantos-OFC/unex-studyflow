const { config: variaveisDeAmbiente } = require('dotenv')
const { expand: preparar } = require('dotenv-expand')

preparar(variaveisDeAmbiente())

async function main() {
    const Usuario = require('./models/usuario')
    // const usuario = await Usuario.autenticar("sadsdad@email.com", "lucas0029")
    // const usuario = await Usuario.consultar('dasd')
    // const usuario = await Usuario.cadastrar("lucas silva", "jkgasd@email.com", "lucas0029")
    // console.log(Object.getOwnPropertyNames(usuario))

    console.log(usuario)


}

main()