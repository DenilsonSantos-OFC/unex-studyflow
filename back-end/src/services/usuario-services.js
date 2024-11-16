/**
 * @module UsuarioServices
 * @class UsuarioServices
 * @file usuario-services.js
 * @author Denilson Santos
 * @description Esta classe representa um pacote de ferramentas para realizar o processamento de dados envolvendo o usuário. Não pode ser instanciada.
 */

const jwt = require('jsonwebtoken')
const { existsSync: existe } = require('fs')

class UsuarioServices {
    static conectoresDeNome = ["a", "e", "i", "o", "u", "da", "de", "del", "di", "do", "du", "das", "dos", "y"]
    static tempoDeExpiracaoDoToken = '90d'

    /**
     * Padroniza a data para se adequar ao formato utilizado no banco de dados.
     * Transforma a data do Javascript em uma string que o SQL consiga interpretar e armazenar como data.
     * Recomendado usar sempre que trabalhar com datas.
     * @static
     * @param {string} data - a data que será padronizada.
     * @returns {string} a data padronizada.
     * @example
     */
    static adequarData(data) {
        return data.trim()
    }

    /**
     * Padroniza o email visualmente para seguir o formato utilizado no banco de dados.
     * Todas as letras serão transformadas em minúsculas e espaços em branco no começo e no final do email serão removidos.
     * Recomendado usar sempre que trabalhar com emails.
     * @static
     * @param {string} email - o email que será padronizado.
     * @returns {string} o email padronizado.
     * @example
     * Entrada: tESTE@EMail.CoM
     * Saída: teste@email.com
     */
    static adequarEmail(email) {
        return email.trim().toLowerCase()
    }

    /**
     * Padroniza o gênero para se adequar ao formato utilizado no banco de dados.
     * Retorna somente o primeiro caractere da string, em letra minúscula.
     * Recomendado usar sempre que trabalhar com gêneros.
     * @static
     * @param {string} genero - o gênero que será padronizado.
     * @returns {string} o gênero padronizado.
     * @example
     * Entrada: "Masculino"
     * Saída: "M"
     */
    static adequarGenero(genero) {
        return genero.trim().charAt(0).toLowerCase()
    }

    /**
     * Formata o nome recebido. A primeira letra fica em maiúscula e as restantes em minúsculas.
     * @static
     * @param {string} nome - o nome que será formatado.
     * @returns {string} o nome formatado.
     * @example
     * Entrada: lucAS
     * Saida: Lucas
     */
    static adequarNome(nome) {
        return nome.charAt(0).toUpperCase() + nome.slice(1).toLowerCase()
    }

    /**
     * Padroniza o nome visualmente para seguir o formato utilizado no banco de dados.
     * Recomendado usar sempre que trabalhar com nomes.
     * @static
     * @param {string} nome - o nome que será padronizado.
     * @returns {string} o nome padronizado.
     * @example
     * Entrada: lucAS ALMEida dA silVA
     * Saída: Lucas Almeida da Silva
     */
    static adequarNomeCompleto(nome) {
        const subnomes = nome.trim().toLowerCase().split(" ")
        const conectores = UsuarioServices.conectoresDeNome
        for (let subnome of subnomes) {
            const naoEhUmConector = !conectores.includes(subnome)
            if (naoEhUmConector) {
                let index = subnomes.indexOf(subnome)
                subnome = UsuarioServices.adequarNome(subnome)
                subnomes[index] = subnome
            }
        } return subnomes.join(" ")
    }

    /**
     * Gera um token Jwt que armazene o id passado de forma cifrada.
     * O token é assinado utilizando o código secreto do servidor.
     * @param {string|number} id - o id que o token guardará de forma cifrada.
     * @returns {string} O token Jwt criptografado em formato de texto.
     */
    static gerarToken(id) {
        const payload = {id: id}
        const tempoEmDias = UsuarioServices.tempoDeExpiracaoDoToken
        const token = jwt.sign(payload, process.env.JWT_SEGREDO, {expiresIn: tempoEmDias})
        return token
    }

    /**
     * Obtém a referência para o avatar do usuário salvo no sistema de arquivos do servidor.
     * @param {string|number} idDoUsuario 
     * @returns {string|null} A localização do avatar do usuário no sistema de arquivos.
     * Se não existir nenhum avatar salvo no sistema de arquivos para o usuário, retornará null.
     */
    static obterRefDeAvatar(idDoUsuario){
        const refDoAvatar = `${process.env.IMG_PROFILES}/${idDoUsuario}.${process.env.IMG_EXT}`
        if (existe(refDoAvatar))
            return refDoAvatar
        return null
    }

    /**
     * Obtém o token Jwt dentro da requisição passada.
     * @param {Request} req O objeto de requisição de onde extrairá o token.
     * @returns {Object|null|undefined} o token Jwt decifrado a partir da requisição recebida.
     * Pode retornar null se o token obtido for inválido.
     * Caso a requisição não contenha um token, retornará undefined.
     */
    static obterToken(req) {
        const token = req.headers.authorization
        if (!token)
            return undefined
        try {
            return jwt.verify(token, process.env.JWT_SEGREDO)
        } catch (erro) {
            return null
        }
    }

} module.exports = UsuarioServices