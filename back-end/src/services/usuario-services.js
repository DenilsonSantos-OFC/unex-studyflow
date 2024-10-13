const jwt = require('jsonwebtoken')
const Usuario = require('../models/usuario')
const ArquivoServices = require('./arquivo-services')
const {join: mesclar} = require('path')
const multer = require('multer')

/**
 * @module UsuarioServices
 * @class UsuarioServices
 * @file usuario-services.js
 * @author Denilson Santos
 * @description Esta classe representa um pacote de ferramentas para realizar o processamento de dados envolvendo o usuário. Não pode ser instanciada.
 */

class UsuarioServices {
    static conectoresDeNome = ["a", "e", "i", "o", "u", "da", "de", "del", "di", "do", "du", "das", "dos", "y"]

    /**
     * Padroniza o nome visualmente para seguir o formato utilizado no banco de dados.
     * Recomendado usar sempre que trabalhar com nomes.
     * @static
     * @param {string} nome - o nome que será padronizado.
     * @returns {string} o nome padronizado
     * @example
     * Entrada: lucAS ALMEida dA silVA
     * Saída: Lucas Almeida da Silva
     */
    static adequarNome(nome) {
        const subnomes = nome.trim().toLowerCase().split(" ")
        for (let subnome of subnomes) {
            if (!UsuarioServices.conectoresDeNome.includes(subnome)) {
                let index = subnomes.indexOf(subnome)
                subnome = UsuarioServices.capitalizarNome(subnome)
                subnomes[index] = subnome
            }
        } return subnomes.join(" ")
    }

    /**
     * Padroniza o email visualmente para seguir o formato utilizado no banco de dados.
     * Todas as letras serão transformadas em minúsculas e espaços em branco no começo e no final do email serão removidos.
     * Recomendado usar sempre que trabalhar com emails.
     * @static
     * @param {string} email - o email que será padronizado.
     * @returns {string} o email padronizado
     * @example
     * Entrada: tESTE@EMail.CoM
     * Saída: teste@email.com
     */
    static adequarEmail(email) {
        return email.trim().toLowerCase()
    }

    /**
     * Padroniza a data para se adequar ao formato utilizado no banco de dados.
     * Transforma a data do Javascript em uma string que o SQL consiga interpretar e armazenar como data.
     * Recomendado usar sempre que trabalhar com datas.
     * @static
     * @param {Date} data - a data que será padronizada.
     * @returns {string} a data padronizada.
     * @example
     */
    static adequarData(data) {
        return data.trim()
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
    static capitalizarNome(nome) {
        return nome.charAt(0).toUpperCase() + nome.slice(1).toLowerCase();
    }

    static gerarToken(id) {
        const payload = {id: id}
        const token = jwt.sign(payload, process.env.JWT_SEGREDO, {expiresIn: '90d'})
        return token
    }

    static obterToken(req) {
        let token = req.headers['authorization']
        if (token === undefined)
            return undefined
        token = token.split(" ")[1]
        try {
            return jwt.verify(token, process.env.JWT_SEGREDO)
        } catch (erro) {
            return null
        }
    }

    static obterUploaderDeImgDoUsuario(req) {
        const id = UsuarioServices.obterToken(req).id
        const configDeDestino = multer.diskStorage({
            destination: process.env.IMG_PROFILES,
            filename: function (req, file, callback) {
                callback(null, id+"."+process.env.IMG_EXT)
            }
        })
        const uploader = multer({storage: configDeDestino})
        return uploader.single('img')
    }

} module.exports = UsuarioServices
