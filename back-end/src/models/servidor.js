class Servidor {
    host
    descricao

    constructor(host, descricao) {
        this.host = host
        this.descricao = descricao
    }

    abstrair() {
        return {
            url: this.host,
            description: this.descricao
        }
    }
} module.exports = Servidor