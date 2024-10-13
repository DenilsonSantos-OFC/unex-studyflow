const { readFileSync: ler } = require('fs');
const { existsSync: existe } = require('fs');
const { unlink: remover } = require('fs');
const { writeFile: escreverConteudo} = require('fs')

/**
 * @module ArquivoServices
 * @class ArquivoServices
 * @file arquivo-services.js
 * @author Denilson Santos
 * @description Esta classe representa um pacote de ferramentas para lidar com arquivos armazenados localmente no computador. Não pode ser instanciada.
 */

class ArquivoServices {

    /**
     * Lê o arquivo e retorna o seu conteúdo.
     * Este método foi padronizado para trabalhar somente com codificação "utf-8".
     * @static
     * @param {string} arquivo - O arquivo que será lido. Informar o caminho completo dele. Ex: "/home/user/arquivo.txt"
     * @returns {string|null} O conteúdo interno do arquivo. Se o arquivo não existir, retorna null.
     */
    static ler(arquivo) {
        if ( existe (arquivo) ) {
            const conteudoDoArquivo = ler(arquivo, 'utf8')
            return conteudoDoArquivo
        } else {
            return null
        }
    }

    static deletar(arquivo) {
        remover(arquivo, (erro) => {
            return erro
        })
    }

    static escrever(conteudo, destino) {
        escreverConteudo(destino, conteudo, (erro) => {
            return erro
        })
    }

} module.exports = ArquivoServices