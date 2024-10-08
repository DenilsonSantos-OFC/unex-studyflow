class SqlServices {

    /**
     * Executa um comando Sql a partir da string que for passada
     * @param {string} comandoSql - Comando a ser executado, em formato de texto.
     * @returns {Object} Pode retornar dp
    */
    static async parse (comandoSql) {
        const Conexao = require('../models/conexao')
        const cliente = await new Conexao().get()
        let resultado;
        try {
            resultado = await cliente.query(comandoSql)
        } catch (erro) {
            resultado = erro
        } finally {
            cliente.release()
            return resultado
        }
    }

    /**
     * Verifica se a operação de insert adicionou algum novo registro no banco de dados
     * @param {} resultado - Comando a ser executado, em formato de texto.
     * @returns {Object} Pode retornar dp
    */
    static async insertOk(resultado) {
        const linhasNovasNaTabela = resultado.rowCount
        return linhasNovasNaTabela > 0
    }

} module.exports = SqlServices