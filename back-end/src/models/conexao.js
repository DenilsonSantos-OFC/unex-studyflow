/**
 * @class Conexão
 * @classdesc Esta classe é responsável por realizar a conexão com o banco de dados.
 *            Para fins de segurança, as credenciais necessárias para que a conexão
 *            seja feita não ficam visivelmente expostas no código. Ao invés disso,
 *            elas são carregadas dinâmicamente por meio das variáveis de ambiente.
 */

class Conexao {
    /**
     * Realiza a conexão com o banco de dados.
     * @returns {number} O resultado da soma.
     */
    async get(){
        const { Pool: ConexaoSQL } = require('pg');
        const { readFileSync: lerSync } = require('fs');
        const ler = (arquivo) => lerSync(arquivo, 'utf8');
        return await new ConexaoSQL({
            connectionString: process.env.DB_URL,
            ssl: { ca: ler(process.env.CERTIFICADO)}
        }).connect()
    }
} module.exports = Conexao