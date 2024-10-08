/**
 * @class Usuário
 * @classdesc Esta classe representa um usuário da plataforma StudyFlow.
 * @property {number} id - Identificador (único) do usuário.
 * @property {string} nome - Nome do usuário (inclui nome e sobrenome).
 * @property {string} genero - Gênero do usuário (armazenado com somente 1 caractere no banco de dados; M para masculino, F para feminino ou NULL para não-especificado).
 * @property {string} email - Email do usuário.
 * @property {string} senha - Senha do usuário (a senha pode conter até 16 caracteres, conforme limitação do banco de dados).
 * @property {Blob} img_perfil - A própria imagem, armazenada em formato binário no banco de dados.
 * @property {Date} data_nasc - Data de nascimento do usuário.
 * @property {Date} data_de_registro - Data em que o usuário se registrou na plataforma.
 */

class Usuario {

    // ------------------------------------------------------------------- //
    // -------------------------- CONSTRUTORES --------------------------- //
    // ------------------------------------------------------------------- //

    /**
     * Construtor para instanciar um novo usuário da plataforma StudyFlow.
     * Os valores para cada atributo devem ser passados manualmente.
     * @constructor
     * @param {number} id - Identificador (único) do usuário.
     * @param {string} nome - Nome do usuário (inclui nome e sobrenome).
     * @param {string} genero - Gênero do usuário (armazenado com somente 1 caractere no banco de dados, M para masculino, F para feminino ou NULL para não-especificado).
     * @param {string} email - Email do usuário.
     * @param {string} senha - Senha do usuário (a senha pode conter até 16 caracteres, conforme limitação do banco de dados).
     * @param {Blob} img_perfil - A própria imagem, armazenada em formato binário no banco de dados.
     * @param {Date} data_nasc - Data de nascimento do usuário.
     * @param {Date} data_de_registro - Data em que o usuário se registrou na plataforma.
     */
    constructor(id, nome, genero, email, senha, img_perfil, data_nasc, data_de_registro){
        this.id = id,
        this.nome = nome,
        this.genero = genero
        this.email = email
        this.senha = senha
        this.img_perfil = img_perfil
        this.data_nasc = data_nasc
        this.data_de_registro = data_de_registro
    }

    // ------------------------------------------------------------------- //
    // ----------------------- MÉTODOS ESTÁTICOS ------------------------- //
    // ------------------------------------------------------------------- //

    /**
     * Instancia um novo usuário da plataforma StudyFlow a partir do resultado de uma consulta no banco de dados.
     * @param {Object} linhaDeRetornoSql - Uma linha específica dentro do (Result) resultado Sql, obtida geralmente por meio do método .rows[INDEX]
     * @returns {Usuario} Uma nova instância de usuário construída a partir da linha Sql enviada.
     */
    static fromSql(linhaDeRetornoSql){
        return new Usuario(
            linhaDeRetornoSql.id,
            linhaDeRetornoSql.nome,
            linhaDeRetornoSql.genero,
            linhaDeRetornoSql.email,
            linhaDeRetornoSql.senha,
            linhaDeRetornoSql.img_perfil,
            linhaDeRetornoSql.data_nasc,
            linhaDeRetornoSql.data_de_registro
        )
    }

    /**
     * Consulta um usuário no banco de dados a partir de um id.
     * @static 
     * @param {number} id identificador único do usuário que será buscado no banco de dados
     * @returns {Usuario} Uma instância do usuário encontrado. Se não existir nenhum usuário com o id informado, retorna null.
     */
    static async consultar(id) {
        const Conexao = require('./conexao')
        const cliente = await new Conexao().get()
        const resultado = await cliente.query(`SELECT * FROM ${process.env.DB_ESQUEMA}.${process.env.DB_TBL_USUARIOS} WHERE id = ${id}`)
        const linha = resultado.rows[0]
        cliente.release()
        return (linha)? Usuario.fromSql(linha) : null
    }

    /**
     * Cadastra um novo usuário no banco de dados utilizando as informações passadas.
     * @param {string} nome - Nome do usuário (inclui nome e sobrenome).
     * @param {string} email - Email do usuário.
     * @param {string} senha - Senha do usuário (nova senha a ser cadastrada pode conter até 16 caracteres, conforme limitação do banco de dados).
     * @returns {Object} Retornará um objeto JSON. Este objeto é a resposta da requisição recebida, indicando se a operação foi bem-sucedida ou não. Contém o código HTTP e a mensagem de erro (caso ocorra).
    */
    static async cadastrar(nome, email, senha) {
        const SqlServices = require('../services/sql-services')
        const resultado = await SqlServices.parse(`INSERT INTO ${process.env.DB_ESQUEMA}.${process.env.DB_TBL_USUARIOS} (nome, email, senha) VALUES ('${nome}', '${email}', '${senha}');`)
        // console.log(resultado instanceof Result)
        console.log(resultado)
        const erroOcorrido = resultado instanceof Error
        if (erroOcorrido){
            console.log(resultado.detail.toString())
        }


        

        // console.log(resultado)



        // try {
        //     resultado = await cliente.query(`INSERT INTO ${process.env.DB_ESQUEMA}.${process.env.DB_TBL_USUARIOS} (nome, email, senha) VALUES ('${nome}', '${email}', '${senha}');`)
        //     const linhasNovasNaTabela = resultado.rowCount
        //     const usuarioCadastrado = linhasNovasNaTabela > 0
        //     console.log("ok")
        //     console.log(typeof(resultado))
        //     // console.log(linhasNovasNaTabela, usuarioCadastrado)
        //     // console.log(resultado)
        //     // co
        //     // console.log(resultado.detail)
        // } catch (erro) {
        //     console.log("erro")
        //     console.log(erro)
        //     // console.log(erro.detail)
        // }

        // // linha de adição
        // // pode dar erro ou não

        // cliente.release()

    }

} module.exports = Usuario