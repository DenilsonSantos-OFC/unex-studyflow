/**
 * @class Usuario
 * @file usuario.js
 * @classdesc Esta classe representa um usuário da plataforma StudyFlow.
 * @property {number} id - Identificador (único) do usuário.
 * @property {string} nome - Nome do usuário (inclui nome e sobrenome).
 * @property {string} genero - Gênero do usuário (armazenado com somente 1 caractere no banco de dados; M para masculino, F para feminino ou NULL para não-especificado).
 * @property {string} email - Email do usuário.
 * @property {string} senha - Senha do usuário (a senha pode conter até 16 caracteres, conforme limitação do banco de dados).
 * @property {Blob} img_perfil - A própria imagem, armazenada em formato binário no banco de dados.
 * @property {Date} data_nasc - Data de nascimento do usuário.
 * @property {Date} data_de_registro - Data em que o usuário se registrou na plataforma.
 * @author Denilson Santos
 */

const SqlServices = require('../services/sql-services')

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
     * @static
     * @param {Object} linhaDeRetornoSql - Uma linha específica dentro do (QueryResult) resultado Sql, obtida geralmente por meio do método .rows[INDEX]
     * @returns {Usuario} Uma nova instância de usuário construída a partir da linha Sql enviada.
     */
    static criarUsandoSql(linhaDeRetornoSql){
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
     * @param {number} id identificador único do usuário, que será buscado no banco de dados
     * @returns {Usuario|Error} A instância do usuário encontrado; se nenhum usuário com o id informado existir, retorna null;
     * se um erro ocorrer durante a execução do código, o próprio erro será retornado.
     */
    static async consultar(id) {
        const retornoSql = await SqlServices.executar(`SELECT * FROM ${process.env.DB_ESQUEMA}.${process.env.DB_TBL_USUARIOS} WHERE id = ${id}`)
        const ocorreuErro = (retornoSql instanceof Error)
        if ( ocorreuErro )
            return retornoSql
        const registroSql = retornoSql.rows[0]
        const usuarioNaoEncontrado = (!registroSql)
        if ( usuarioNaoEncontrado )
            return null
        return Usuario.criarUsandoSql(linha)
    }

    /**
     * Cadastra um novo usuário no banco de dados utilizando as informações passadas.
     * @static 
     * @param {string} nome - Nome do usuário (inclui nome e sobrenome).
     * @param {string} email - Email do usuário.
     * @param {string} senha - Senha do usuário (nova senha a ser cadastrada pode conter até 16 caracteres, conforme limitação do banco de dados).
     * @returns {boolean|Error} True se o cadastro for realizado com sucesso ou False se algo de errado aconteceu e o registro não foi adicionado corretamente, mesmo na ausência de erro.
     * se um erro ocorrer durante a execução do código, o próprio erro será retornado.
    */
    static async cadastrar(nome, email, senha) {
        const retornoSql = await SqlServices.executar(`INSERT INTO ${process.env.DB_ESQUEMA}.${process.env.DB_TBL_USUARIOS} (nome, email, senha) VALUES ('${nome}', '${email}', '${senha}');`)
        const ocorreuErro = (retornoSql instanceof Error)
        if ( ocorreuErro )
            return retornoSql
        const registroAdicionado = await SqlServices.insertOk(retornoSql)
        if ( registroAdicionado )
            return true
        return false
    }

    /**
     * Verifica as credenciais passadas para autenticação (email e senha).
     * O email e senha passados devem corresponder a algum registro no banco de dados.
     * @static 
     * @param {string} email - Email informado pelo usuário.
     * @param {string}senha - Senha informada pelo usuário.
     * @returns {number|null|Error} o id do usuário que bate com as credenciais informadas.
     * Se nenhum usuário for encontrado, retorna null.
     * Se um erro ocorrer durante a execução do código, o próprio erro será retornado.
    */
    static async autenticar(email, senha) {
        const retornoSql = await SqlServices.executar(`SELECT * FROM ${process.env.DB_ESQUEMA}.${process.env.DB_TBL_USUARIOS} WHERE email='${email}' AND senha='${senha}'`)
        const erroRetornado = (retornoSql instanceof Error)
        if ( erroRetornado )
            return retornoSql
        const registrosEncontrados = retornoSql.rowCount
        if (registrosEncontrados === 0)
            return null
        const registroSql = retornoSql.rows[0] 
        const usuarioId = registroSql.id
        return usuarioId
    }

} module.exports = Usuario