/**
 * @class UsuarioController
 * @file usuario-controller.js
 * @author Denilson Santos
 * @classdesc Esta classe é um controlador especializado para o gerenciamento de requisições envolvendo o usuário da plataforma StudyFlow. Não pode ser instanciado.
 * @description
 * Os métodos desta classe devem ser aplicados somente após passar por todos os middlewares, o que envolve passar nas checagens, validações e tratamentos de dados dentro da requisição.
 * Isto quer dizer que se a requisição chegou com sucesso a este controlador, é porque todas as informações estão ok e é possível prosseguir para a operação no banco de dados.
 * Portanto, todas as informações na requisição devem ser revisadas e tratadas de forma prévia antes de chegar aqui.
 * Como é o modelo "Usuário" que interage diretamente com o banco de dados, esta classe tem como responsabilidade ditar qual ação o modelo executará no banco de dados.
 * Também, ela define qual resposta será enviada para quem enviou a requisição, o que inclui o código HTTP, uma mensagem de retorno, e adicionalmente, um objeto de retorno.
 * Por isso, é crucial interpretar os retornos obtidos a partir do banco de dados e também tratar erros que possam vir a acontecer durante a operação.
 * O que os métodos aqui têm em comum?
 * Todos eles trabalham com o par de parâmetros "req" e "res", "requisição" e "resposta", respectivamente.
 */

const RespostaHTTP = require('../models/resposta-http')
const Usuario = require('../models/usuario')
const UsuarioServices = require('../services/usuario-services')

class UsuarioController {

    static async autenticar(req, res) {
        const respostaHTTP = new RespostaHTTP(res)
        const msgOk = 'Usuário autenticado com sucesso.'
        const msgFalha = 'Credenciais inválidas.'
        const { email, senha } = req.body
        let idDoUsuario
        try {
            idDoUsuario = await Usuario.autenticar(email, senha)
        } catch (erro) {
            return respostaHTTP.enviarErroInternoPraDebug(erro)
        }
        if (!idDoUsuario)
            return respostaHTTP.enviarProibicao(msgFalha)
        respostaHTTP.registrarToken(UsuarioServices.gerarToken(idDoUsuario))
        return respostaHTTP.enviarOk(msgOk)
    }

    static async consultar(req, res) {
        const respostaHTTP = new RespostaHTTP(res)
        const msgOk = 'Usuário encontrado.'
        const msgErro = 'Usuário não localizado. Isto não deveria acontecer!'
        const idDoUsuario = UsuarioServices.obterToken(req).id
        const refDoAvatarDoPerfil = UsuarioServices.obterRefDeAvatar(idDoUsuario)
        let registroDoUsuario
        try {
            registroDoUsuario = await Usuario.consultar(idDoUsuario)
        } catch (error) {
            return respostaHTTP.enviarErroInternoPraDebug()
        }
        if (!registroDoUsuario) {
            return respostaHTTP.enviar (`ID ${idDoUsuario}: ${msgErro}`, msgErro)
        }
        return respostaHTTP.enviarOk(msgOk, {avatar: refDoAvatarDoPerfil, registro: registroDoUsuario})
    }

    static async cadastrar(req, res) {
        const respostaHTTP = new RespostaHTTP(res)
        const msgFalha = 'Usuário não foi cadastrado corretamente no banco de dados. Tente de novo.'
        const { nome, email, senha } = req.body
        let usuarioFoiCadastrado
        try {
            usuarioFoiCadastrado = await Usuario.cadastrar(nome, email, senha)
        } catch (erro) {
            return respostaHTTP.enviarErroInternoPraDebug()
        }
        if (!usuarioFoiCadastrado)
            return respostaHTTP.enviarErroInterno(msgFalha)
        return respostaHTTP.enviarOkPraCadastro()
    }

    static async alterar(req, res) {
        const respostaHTTP = new RespostaHTTP(res)
        const msgOk = 'Alteração realizada com sucesso.'
        const msgFalha = 'A alteração das informações não foram feitas corretamente no banco de dados. Tente de novo.'
        const { nome, genero, email, senha, dataDeNascimento } = req.body
        const idDoUsuario = UsuarioServices.obterToken(req).id
        let dadosForamAlterados
        try {
            dadosForamAlterados = await Usuario.alterar(idDoUsuario, nome, genero, email, senha, dataDeNascimento)
        } catch (erro) {
            return respostaHTTP.enviarErroInternoPraDebug(erro)
        }
        if (!dadosForamAlterados)
            return respostaHTTP.enviarErroInterno(msgFalha)
        return respostaHTTP.enviarOk(msgOk)
    }






    // -------------------------------------------------------------------------------------------------------- //

    /**
     * @method autenticar
     * @static @async
     * @description
     * Lida com requisições de autenticação.
     * É responsável por chamar o recurso interno responsável por realizar esta operação no banco de dados.
     * @param {Request} req - Objeto de requisição, contendo os dados necessários.
     *    @param {string} req.body.email - Requer campo "email" especificado na requisição.
     *    @param {string} req.body.senha - Requer campo "senha" especificada na requisição.
     * @param {Response} res - Objeto da resposta, que será manipulada pelo controlador.
     * @returns {Object}
     * Um objeto criado a partir do resultado da operação, moldado pela classe RespostaHTTP.
     * Ela contém algumas informações...
     * - Código HTTP: A resposta pode ser enviada com um dos seguintes códigos HTTP abaixo...
     *   - 200 (se a autenticação for realizada com sucesso);
     *   - 403 (se as credenciais passadas na requisição forem inválidas);
     *   - 500 (se ocorrer um erro de processamento por parte do servidor).
     * - Mensagem: É única para cada código HTTP e reflete diretamente o resultado da operação.
     *   - 200: Usuário autenticado com sucesso.
     *   - 403: Credenciais inválidas.
     *   - 500: **Mensagem definidda por padrão pela aplicação**
     * - Autorização: Se a autenticação for realizada com sucesso, o objeto conterá um token registrado no cabeçalho.
     *   (Este token contém o id do usuário de forma cifrada, o que permitirá a identificação do próprio em requisições posteriores.)
    */


    /**
     * @method consultar
     * @static @async
     * @description
     * Lida com requisições de consulta.
     * É responsável por chamar o recurso interno responsável por realizar esta operação no banco de dados.
     * Só é possível o usuário consultar suas próprias informações.
     * @param {Request} req - Objeto de requisição, contendo os dados necessários.
     *    @param {string} req.headers.Authorization - Requer campo "Authorization" para autenticação e identificação do usuário.
     * @param {Response} res - Objeto da resposta, que será manipulada pelo controlador.
     * @returns {Object}
     * Um objeto criado a partir do resultado da operação, moldado pela classe RespostaHTTP.
     * - Código HTTP: Pode retornar...
     *   - 300
     *  200 (se OK), 404 (se usuário não encontrado) ou 500 (se erro no servidor).
     *                O erro 404 não deveria ocorrer em situações normais, já que o ID do usuário é obtido a partir do token,
     *                que é fornecido pelo próprio servidor. Caso esse erro ocorra, a situação deve ser estudada.
     * - Mensagem: Retornará uma mensagem sobre o resultado da operação.
     */


    /**
     * @method cadastrar
     * @static @async
     * @description
     * Lida com requisições de cadastro.
     * É responsável por chamar o recurso interno responsável por realizar esta operação no banco de dados.
     * @param {Request} req - Objeto de requisição, contendo os dados necessários.
     *    @param {string} req.body.nome - Requer campo "nome" especificado na requisição.
     *    @param {string} req.body.email - Requer campo "email" especificado na requisição (não pode ser um já registrado no banco de dados).
     *    @param {string} req.body.senha - Requer campo "senha" especificada na requisição.
     * @param {Response} res - Objeto da resposta, que será manipulada pelo controlador.
     * @returns {Object}
     * Um objeto criado a partir do resultado da operação, moldado pela classe RespostaHTTP.
     * - Código HTTP: Pode retornar 201 (se Created) ou 500 (se qualquer erro acontecer).
     * - Mensagem: Retornará uma mensagem sobre o resultado da operação.
     */


    /**
     * @method alterar
     * @static @async
     * @description
     * Lida com requisições de alteração de dados.
     * É responsável por chamar o recurso interno responsável por realizar esta operação no banco de dados.
     * Vários campos podem ser passados de forma opcional para alteração, mas não funciona com requisições sem campo nenhum. 
     * @param {Request} req - Objeto de requisição, contendo os dados que serão alterados.
     *    @param {string} req.body.nome - Pode passar o campo "nome" na requisição (opcional).
     *    @param {string} req.body.genero - Pode passar o campo "genero" na requisição (opcional).
     *    @param {string} req.body.email - Pode passar o campo "email" na requisição (opcional).
     *    @param {string} req.body.senha - Pode passar o campo "senha" na requisição (opcional).
     *    @param {string} req.body.dataDeNascimento - Pode passar o campo "dataDeNascimento" na requisição (opcional).
     * @param {Response} res - Objeto da resposta, que será manipulada pelo controlador.
     * @returns {Object}
     * Um objeto criado a partir do resultado da operação, moldado pela classe RespostaHTTP.
     * - Código HTTP: Pode retornar 200 (se OK) ou 500 (se qualquer erro acontecer).
     * - Mensagem: Retornará uma mensagem sobre o resultado da operação.
     */

    
} module.exports = UsuarioController