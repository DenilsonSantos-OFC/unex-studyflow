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
     * @returns {QueryResult} (1) Retorna o Resultado, contendo todos os detalhes da operação, caso o código seja executado com sucesso.
     * @returns {Error} (2) Caso o código não seja executado com sucesso, retorna o Erro como um objeto, contendo todos os detalhes sobre a exceção.
    */
    static async executar (comandoSql) {
        const controladorDb = await SqlServices.conectar()
        let resultado;
        try {
            resultado = await controladorDb.query(comandoSql)
        } catch (erro) {
            resultado = erro
        } finally {
            controladorDb.release()
            return resultado
        }
    }

    /**
     * Verifica se a operação de insert adicionou algum novo registro no banco de dados.
     * @static
     * @param {QueryResult} resultado - O retorno obtido após o uso do método *.query().
     * @returns {boolean} Retorna um resultado positivo se no resultado passado, 1 ou mais linhas foram adicionadas. Caso contrário, retorna False.
    */
    static async insertOk(resultado) {
        const linhasNovasNaTabela = resultado.rowCount
        return linhasNovasNaTabela > 0
    }

} module.exports = SqlServices