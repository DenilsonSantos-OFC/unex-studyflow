class Cookie {
    nomeDoCookie = 'auth'
    tempoDeVida = 7776000000
    valor
    
    constructor(token, nomeDoCookie=undefined, tempoDeVida=undefined){
        this.nomeDoCookie = nomeDoCookie || this.nomeDoCookie
        this.tempoDeVida = tempoDeVida || this.tempoDeVida
        this.valor = token
    }

    enviar(respostaHTTP) {
        const {res} = respostaHTTP
        res.cookie(this.nomeDoCookie, this.valor, {
            httpOnly: true,
            secure: false,
            SameSite: 'None',
            maxAge: this.tempoDeVida
        })
    }
} module.exports = Cookie