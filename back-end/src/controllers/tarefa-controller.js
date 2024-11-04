const UsuarioServices = require("../services/usuario-services");
const RespostaHTTP = require("../models/resposta-http");
const Tarefa = require("../models/tarefa");

class TarefaController {
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
