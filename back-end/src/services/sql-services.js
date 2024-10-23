/**
 * @module SqlServices
 * @class SqlServices
 * @file sql-services.js
 * @author Denilson Santos
 * @description Esta classe representa um pacote de ferramentas para realizar operações no banco de dados SQL. Não pode ser instanciada.
 */

class SqlServices {

    /**
     * Realiza a conexão com o banco de dados.
     * Para fins de segurança, as credenciais necessárias para que a conexão
     * seja feita não ficam visivelmente expostas no código. Ao invés disso,
     * elas são carregadas dinâmicamente por meio das variáveis de ambiente.
     * @static
     * @returns {Client} O resultado da conexão, instanciado como um novo cliente.
     */
    static async conectar(){
        const { Pool: ConexaoSQL } = require('pg');
        const {ler} = require('../services/arquivo-services')
        return await new ConexaoSQL({
            connectionString: process.env.DB_URL,
            ssl: { ca: ler(process.env.CERTIFICADO)}
        }).connect()
    }

    /**
     * Executa um comando Sql a partir da string que for passada.
     * @static
     * @param {string} comandoSql - Comando a ser executado, em formato de string.
     * @returns {QueryResult} Retorna o Resultado, contendo todos os detalhes da operação.
     * @throws {Error} Caso o código Sql não seja executado com sucesso, um erro será disparado. Precisa tratar isso na camada superior da aplicação.
    */
    static async executar (comandoSql) {
        const controladorDb = await SqlServices.conectar()
        const resultado = await controladorDb.query(comandoSql)
        controladorDb.release()
        return resultado;
    }
    // static async executar (comandoSql) {
    //     const controladorDb = await SqlServices.conectar()
    //     let resultado;
    //     try {
    //         resultado = await controladorDb.query(comandoSql)
    //     } catch (erro) {
    //         resultado = erro
    //     } finally {
    //         controladorDb.release()
    //         return resultado
    //     }
    // }

} module.exports = SqlServices