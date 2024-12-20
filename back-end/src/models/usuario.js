/**
 * @class Usuario
 * @file usuario.js
 * @author Denilson Santos
 * @classdesc Esta classe representa um usuário da plataforma StudyFlow e lida com operações de cadastro, atualização e autenticação dos usuários.
 * @description
 * Esta classe interage diretamente com o banco de dados.
 * Ela é responsável por adicionar novos registros de usuários e também fazer alterações nos registros já existentes.
 * Ela também é a última camada antes de a operação desejada ser realizada.
 * Por isso, os argumentos recebidos por cada método aqui devem ter sido previamente tratados.
 * Além disso, erros podem acontecer durante uma interação com o banco de dados.
 * Sendo assim, os recursos que chamam os métodos daqui precisam lidar com os erros disparados.
*/

const Hasher = require('../configs/hasher')
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
     * @param {string} hashDaSenha - Hash da senha do usuário cadastrado (é suportado usar uma senha de até 32 caracteres).
     * @param {string} dataDeNascimento - Data de nascimento do usuário (formato: YYYY-MM-DD).
     * @param {string} horarioDeRegistro - Horário em que o usuário se registrou na plataforma (formato ISO 8601: YYYY-MM-DDTHH:mm:ss.sssZ, onde "T" é o separador entre data e hora, "sss" são os milissegundos e "Z" indica o fuso horário "Zulu", em UTC).
     */
    constructor(id, nome, genero, email, hashDaSenha, dataDeNascimento, horarioDeRegistro){
        this.id = id;
        this.nome = nome;
        this.genero = genero;
        this.email = email;
        this.hash = hashDaSenha;
        this.dataDeNascimento = dataDeNascimento;
        this.horarioDeRegistro = horarioDeRegistro;
    }

    // ------------------------------------------------------------------- //
    // -------------- MÉTODOS DE CONSTRUÇÃO (SECUNDÁRIOS) ---------------- //
    // ------------------------------------------------------------------- //

    /**
     * Instancia um novo usuário da plataforma StudyFlow a partir do resultado de uma consulta no banco de dados.
     * @static
     * @param {Object} linhaDeRetornoSql - Uma linha específica dentro do (QueryResult) resultado Sql, obtida geralmente por meio do método .rows[INDEX].
     * @returns {Usuario} Uma nova instância de usuário construída a partir da linha Sql enviada.
     */
    static criarUsandoSql(linhaDeRetornoSql){
        return new Usuario(
            linhaDeRetornoSql.id,
            linhaDeRetornoSql.nome,
            linhaDeRetornoSql.genero,
            linhaDeRetornoSql.email,
            linhaDeRetornoSql.hash,
            linhaDeRetornoSql.dataDeNascimento,
            linhaDeRetornoSql.horarioDeRegistro
        )
    }

    // ------------------------------------------------------------------- //
    // ----------- MÉTODOS DE OPERAÇÃO (VIA BANCO DE DADOS) -------------- //
    // ------------------------------------------------------------------- //

    /**
     * Consulta um usuário no banco de dados utilizando o id dele para buscá-lo.
     * @static @async
     * @param {number} id - Identificador único do usuário, que será buscado no banco de dados.
     * @returns {Usuario|null} A instância do usuário encontrado; se nenhum usuário com o id informado existir, retorna null.
     * @throws {Error} Erros podem ocorrer durante a interação com o banco de dados. Precisa tratá-los nas camadas de execução superiores.
     * @example
     * const usuario = await Usuario.consultar(1)
     */
    static async consultar(id) {
        const retornoDaConsulta = await SqlServices.executar(`SELECT * FROM ${process.env.DB_ESQUEMA}.${process.env.DB_TBL_USUARIOS} WHERE id = ${id}`)
        const registrosEncontrados = retornoDaConsulta.rowCount
        if (registrosEncontrados == 0)
            return null
        const registroDoUsuario = retornoDaConsulta.rows[0]
        return Usuario.criarUsandoSql(registroDoUsuario)
    }

    /**
     * Cadastra um novo usuário no banco de dados utilizando as informações passadas.
     * @static @async
     * @param {string} nome - Nome do usuário (inclui nome e sobrenome).
     * @param {string} email - Email do usuário.
     * @param {string} senha - Senha do usuário (é possível utilizar uma senha de até 32 caracteres). Somente o hash da senha será armazenado.
     * @returns {boolean} True se o cadastro for realizado com sucesso ou False se algo de errado aconteceu e o registro não foi adicionado corretamente, mesmo na ausência de erro.
     * @throws {Error} Erros podem ocorrer durante a interação com o banco de dados. Precisa tratá-los nas camadas de execução superiores.
    */
    static async cadastrar(nome, email, senha) {
        const hashDoUsuario = new Hasher().hashear(senha)
        const retornoDoCadastro = await SqlServices.executar(`INSERT INTO ${process.env.DB_ESQUEMA}.${process.env.DB_TBL_USUARIOS} (nome, email, hash) VALUES ('${nome}', '${email}', '${hashDoUsuario}');`)
        const linhasNovasAdicionadas = retornoDoCadastro.rowCount
        const registroFoiAdicionado = (linhasNovasAdicionadas > 0)
        if (registroFoiAdicionado)
            return true
        return false
    }

    /**
     * Verifica as credenciais passadas para autenticação (email e senha).
     * @static @async
     * @param {string} email - Email informado pelo usuário.
     * @param {string} senha - Senha informada pelo usuário.
     * @returns {number|null} O id do usuário que contenha as credenciais informadas. Se nenhum usuário for encontrado, retorna null.
     * @throws {Error} Erros podem ocorrer durante a interação com o banco de dados. Precisa tratá-los nas camadas de execução superiores.
    */
    static async autenticar(email, senha) {
        const retornoDaConsulta = await SqlServices.executar(`SELECT * FROM ${process.env.DB_ESQUEMA}.${process.env.DB_TBL_USUARIOS} WHERE email='${email}'`)
        const registrosEncontrados = retornoDaConsulta.rowCount
        if (!registrosEncontrados)
            return null
        const registroDoUsuario = retornoDaConsulta.rows[0]
        const hashDoUsuario = registroDoUsuario.hash
        const senhaOk = new Hasher().comparar(senha, hashDoUsuario)
        if (!senhaOk)
            return null
        const id = registroDoUsuario.id
        return id
    }

    /**
     * Altera as informações do usuário cadastradas no banco de dados utilizando as informações passadas.
     * ATENÇÃO: "null" é diferente de "undefined".
     * Enquanto "undefined" faz menção a uma variável que não teve seu valor inicializado,
     * "null" é uma atribuição direta de valor, ele deixa explícito que você atribuiu um valor nulo para a variável.
     * Pense nisso na hora de enviar os seus argumentos para este método.
     * Passe "undefined" para indicar que o parâmetro não será configurado e 
     * passe "null" quando quiser alterar o valor do parâmetro para NULL no banco de dados.
     * @static @async
     * @param {number} id - Identificador (único) do usuário que terá os dados alterados.
     * @param {string} nome - Nome do usuário (inclui nome e sobrenome).
     * @param {string} genero - Gênero do usuário (armazenado com somente 1 caractere no banco de dados, M para masculino, F para feminino ou NULL para não-especificado).
     * @param {string} email - Novo email a ser registrado.
     * @param {string} senha - Nova senha a ser armazenada (é possível utilizar uma senha de até 32 caracteres). Somente o hash da senha será armazenado.
     * @param {Date} dataDeNascimento - Data de nascimento do usuário (formato: YYYY-MM-DD).
     * @returns {boolean} True se os dados forem alterados com sucesso ou False se algo de errado aconteceu e o registro não foi alterado corretamente, mesmo na ausência de erro.
     * @throws {Error} Erros podem ocorrer durante a interação com o banco de dados. Precisa tratá-los nas camadas de execução superiores.
    */
    static async alterar(id, nome, genero, email, senha, dataDeNascimento) {
        // Ligação entre colunas e valores
        const parDeMudancas = {
            nome: nome,
            genero: genero,
            email: email,
            hash: (senha)? new Hasher().hashear(senha) : undefined,
            dataDeNascimento: dataDeNascimento
        }
        // Construção do comando parcial
        const comandoSetParcial = "SET " + Object.entries(parDeMudancas)
            .filter(([_, valor]) => valor !== undefined) // Valores não-definidos não serão incluídos na criação do comando
            .map(([chave, valor]) => valor === null ? `'${chave}'=NULL` : `"${chave}"='${valor}'`) // Une os pares de "coluna" e "atributo" corretamente (null é enviado como NULL para evitar erros de sintaxe SQL)
            .join(', '); // Junta os pares de "coluna" e "atributo" em uma string única
        // Execução SQL
        console.log(`UPDATE ${process.env.DB_ESQUEMA}.${process.env.DB_TBL_USUARIOS} ${comandoSetParcial} WHERE id=${id}`)
        const retornoDaAlteracao = await SqlServices.executar(`UPDATE ${process.env.DB_ESQUEMA}.${process.env.DB_TBL_USUARIOS} ${comandoSetParcial} WHERE id = ${id}`)
        const registrosAlterados = retornoDaAlteracao.rowCount
        if (registrosAlterados)
            return true
        return false
    }

} module.exports = Usuario