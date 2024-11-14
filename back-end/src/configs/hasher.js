const crypt = require('bcryptjs')

class Hasher {
    static limiteSeguroDeCaracteres = 32
    static numDeHashsPadraoPorSenha = 10

    constructor(numDeHashingsPorSenha=undefined) {
        this.numDeHashingsPorSenha = numDeHashingsPorSenha || Hasher.numDeHashsPadraoPorSenha
    }

    hashear(senha) {
        return crypt.hashSync(senha)
    }

    comparar(senha, hash) {
        return crypt.compareSync(senha, hash)
    }

    static podeHashear(senha) {
        const numDeCaracteresNaSenha = senha.length
        return (numDeCaracteresNaSenha < Hasher.limiteSeguroDeCaracteres)
    }

} module.exports = Hasher