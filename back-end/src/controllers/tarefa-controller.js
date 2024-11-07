/**
 * @class TarefaController
 * @file tarefa-controller.js
 * @author Luan Vinicius
 * @classdesc Controlador responsável pela gestão de tarefas da plataforma StudyFlow.
 * @description
 * Esta classe lida com as requisições de tarefas, como buscar, cadastrar, alterar e excluir. Ela interage diretamente com o modelo de Tarefa, realizando operações no banco de dados, e envia as respostas adequadas ao cliente.
 * Todos os métodos da classe utilizam os objetos "req" (requisição) e "res" (resposta), sendo que a requisição contém os dados necessários e a resposta é manipulada conforme o resultado da operação.
 * O controlador garante que o usuário autenticado através do token realiza ações apenas em suas próprias tarefas.
 */

const UsuarioServices = require("../services/usuario-services");
const RespostaHTTP = require("../models/resposta-http");
const Tarefa = require("../models/tarefa");

class TarefaController {

    /**
   * @method buscarTarefas
   * @static @async
   * @description
   * Recupera todas as tarefas associadas ao usuário autenticado.
   * @param {Request} req - Objeto de requisição, que contém o token de autenticação do usuário.
   * @param {Response} res - Objeto de resposta, que será manipulada pelo controlador.
   * @returns {Object} - Um objeto com o status da operação e a lista de tarefas.
   */
  static async buscarTarefas(req, res) {
    const respostaHTTP = new RespostaHTTP(res);
    try {
      // Extrai o id do usuário do token e o renomeia para idUsuario
      const { id: idUsuario } = UsuarioServices.obterToken(req);
      const tarefas = await Tarefa.listar(idUsuario);
      return respostaHTTP.enviarOk("Tarefas recuperadas com sucesso.", tarefas);
    } catch (erro) {
        return respostaHTTP.enviarErroInternoPraDebug(erro)
    }
  }

  /**
   * @method buscarTarefa
   * @static @async
   * @description
   * Recupera uma tarefa específica do usuário autenticado.
   * @param {Request} req - Objeto de requisição, contendo o ID da tarefa nos parâmetros.
   * @param {Response} res - Objeto de resposta, que será manipulada pelo controlador.
   * @returns {Object} - Um objeto com o status da operação e os detalhes da tarefa.
   */
  static async buscarTarefa(req, res) {
    const respostaHTTP = new RespostaHTTP(res);
    try {
        // Extrai o id do usuário do token e o renomeia para idUsuario
      const { id: idUsuario } = UsuarioServices.obterToken(req);
      const { id } = req.params;
      const tarefa = await Tarefa.consultar(idUsuario, id);
      if (!tarefa || tarefa.length == 0) {
        return respostaHTTP.enviarErroDeAusencia("Tarefa não encontrada.")
      }
      return respostaHTTP.enviarOk("Tarefa encontrada.", tarefa);
    } catch (erro) {
        return respostaHTTP.enviarErroInternoPraDebug(erro)
    }
  }

    /**
   * @method buscarTarefasFiltro
   * @static @async
   * @description
   * Recupera as tarefas do usuário autenticado, com a possibilidade de aplicar filtros.
   * @param {Request} req - Objeto de requisição, contendo os filtros de título e descrição como parâmetros de consulta.
   * @param {Response} res - Objeto de resposta, que será manipulada pelo controlador.
   * @returns {Object} - Um objeto com o status da operação e a lista filtrada de tarefas.
   */
  static async buscarTarefasFiltro(req, res) {
    const respostaHTTP = new RespostaHTTP(res);
    try{
      // Extrai o id do usuário do token e o renomeia para idUsuario
      const {id: idUsuario} = UsuarioServices.obterToken(req);
      const {titulo = '', descricao = ''} = req.query;
      // Chama a função que faz a busca no banco com base nos filtros fornecidos
      const tarefas = await Tarefa.listarPorFiltro(idUsuario, titulo, descricao);
      // Verifica se a busca retornou algum resultado
      if (!tarefas || tarefas.length == 0){
        return respostaHTTP.enviarErroDeAusencia("Tarefa não encontrada.")
      }
      return respostaHTTP.enviarOk("Tarefas encontradas.", tarefas);
    }
    catch (erro){
        return respostaHTTP.enviarErroInternoPraDebug(erro)
    }
  }

    /**
   * @method cadastrar
   * @static @async
   * @description
   * Cadastra uma nova tarefa para o usuário autenticado.
   * @param {Request} req - Objeto de requisição, contendo os dados necessários para cadastrar a tarefa.
   * @param {Response} res - Objeto de resposta, que será manipulada pelo controlador.
   * @returns {Object} - Um objeto com o status da operação e uma mensagem de sucesso.
   */
  static async cadastrar(req, res) {
    const respostaHTTP = new RespostaHTTP(res);
    const { titulo, descricao, prioridadeNv, categoriaNv } = req.body;
    try {
        // Extrai o id do usuário do token e o renomeia para idUsuario
      const { id: idUsuario} = UsuarioServices.obterToken(req);
      const tarefaCriada = await Tarefa.cadastrar( idUsuario, titulo, descricao, prioridadeNv, categoriaNv);
      if (!tarefaCriada) {
        return respostaHTTP.enviarErroInterno("Erro ao cadastrar tarefa.");
      }
      return respostaHTTP.enviarOkPraCadastro("Tarefa cadastrada com sucesso.");
    } catch (erro) {
        return respostaHTTP.enviarErroInternoPraDebug(erro)
    }
  }

    /**
   * @method alterar
   * @static @async
   * @description
   * Altera uma tarefa existente do usuário autenticado.
   * @param {Request} req - Objeto de requisição, contendo os dados da tarefa a ser alterada.
   * @param {Response} res - Objeto de resposta, que será manipulada pelo controlador.
   * @returns {Object} - Um objeto com o status da operação e uma mensagem de sucesso ou erro.
   */
  static async alterar(req, res) {
    const respostaHTTP = new RespostaHTTP(res);
    try {
      // Extrai o id do usuário do token e o renomeia para idUsuario
      const { id: idUsuario } = UsuarioServices.obterToken(req);
      const {id} = req.params;
      const { titulo, descricao, prioridadeNv, categoriaNv } = req.body;
      const tarefaAtualizada = await Tarefa.atualizar(idUsuario, id, titulo, descricao, prioridadeNv, categoriaNv);
      if (!tarefaAtualizada) {
        return respostaHTTP.enviarErroDeAusencia("Erro ao utilizar tarefa. Tarefa não encontrada.")
      }
      return respostaHTTP.enviarOk("Tarefa alterada com sucesso.");
    } catch (erro) {
        return respostaHTTP.enviarErroInternoPraDebug(erro)
    }
  }

    /**
   * @method excluir
   * @static @async
   * @description
   * Exclui uma tarefa existente do usuário autenticado.
   * @param {Request} req - Objeto de requisição, contendo o ID da tarefa a ser excluída.
   * @param {Response} res - Objeto de resposta, que será manipulada pelo controlador.
   * @returns {Object} - Um objeto com o status da operação e uma mensagem de sucesso ou erro.
   */
  static async excluir(req, res) {
    const respostaHTTP = new RespostaHTTP(res);
    try {
      // Extrai o id do usuário do token e o renomeia para idUsuario
      const { id: idUsuario } = UsuarioServices.obterToken(req);
      const { id } = req.params;
      const tarefaRemovida = await Tarefa.remover(idUsuario, id);
      if (!tarefaRemovida) {
        return respostaHTTP.enviarErroDeAusencia("Erro ao excluir a tarefa. Tarefa não encontrada.")
      }
      return respostaHTTP.enviarOk("Tarefa excluída com sucesso!");
    } catch (erro) {
        return respostaHTTP.enviarErroInternoPraDebug(erro)
    }
  }
}
module.exports = TarefaController;
