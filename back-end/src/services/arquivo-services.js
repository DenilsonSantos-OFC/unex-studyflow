/**
 * @module ArquivoServices
 * @class ArquivoServices
 * @file arquivo-services.js
 * @author Denilson Santos
 * @description Esta classe representa um pacote de ferramentas para lidar com arquivos armazenados localmente no computador. Não pode ser instanciada.
 */

const {
    existsSync: existe,
    readFileSync: ler,
    unlink: remover,
    writeFile: escreverConteudo
} = require('fs')

class ArquivoServices {
    
    /**
     * Escreve o conteúdo passado no arquivo informado.
     * Este método apaga todo o conteúdo anterior do arquivo antes de escrever o novo conteúdo.
     * @static
     * @param {string} conteudo - Conteúdo que será escrito no arquivo.
     * @param {string} arquivo - O arquivo que receberá o conteúdo. Informar o caminho completo dele. Ex: "/home/user/arquivo.txt".
     */
    static escrever(conteudo, arquivo) {
        escreverConteudo(arquivo, conteudo, (erro) => {return erro})
    }

    /**
     * Lê o arquivo e retorna o seu conteúdo.
     * Este método foi padronizado para trabalhar somente com codificação "utf-8".
     * @static
     * @param {string} arquivo - O arquivo que será lido. Informar o caminho completo dele. Ex: "/home/user/arquivo.txt".
     * @returns {string|null} O conteúdo interno do arquivo. Se o arquivo não existir, retorna null.
     */
    static ler(arquivo) {
        if (existe(arquivo))
            return ler(arquivo, 'utf8') 
        return null
    }

    /**
     * Remove um arquivo no armazenamento do dispositivo.
     * @static
     * @param {string} arquivo - O arquivo que será removido. Informar o caminho completo dele. Ex: "/home/user/arquivo.txt".
     */
    static remover(arquivo) {
        remover(arquivo, (erro) => {return erro})
    }

} module.exports = ArquivoServices