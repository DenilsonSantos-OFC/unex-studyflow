const UsuarioServices = require("../services/usuario-services");
const RespostaHTTP = require("../models/resposta-http");
const Tarefa = require("../models/tarefa");

class TarefaController {
  static async buscarTarefas(req, res) {
    const respostaHTTP = new RespostaHTTP(res);
    try {
      // Extrai o id do usuário do token e renomeando para idUsuario
      const { id: idUsuario } = UsuarioServices.obterToken(req);
      const tarefas = await Tarefa.listar(idUsuario);
      return respostaHTTP.sucesso("Tarefas recuperadas com sucesso.", tarefas);
    } catch (erro) {
      console.error(erro);
      return respostaHTTP.erroInterno();
    }
  }

  static async buscarTarefa(req, res) {
    const respostaHTTP = new RespostaHTTP(res);
    try {
        // Extrai o id do usuário do token e renomeando para idUsuario
      const { id: idUsuario } = UsuarioServices.obterToken(req);
      const { id } = req.params;
      const tarefa = await Tarefa.consultar(idUsuario, id);
      if (!tarefa || tarefa.length == 0) {
        return respostaHTTP.erro(404, "Tarefa não encontrada.");
      }
      return respostaHTTP.sucesso("Tarefa encontrada", tarefa);
    } catch (erro) {
      console.error(erro);
      return respostaHTTP.erroInterno();
    }
  }

  static async cadastrar(req, res) {
    const respostaHTTP = new RespostaHTTP(res);
    const { titulo, descricao, prioridadeNv, categoriaNV } = req.body;
    try {
        // Extrai o id do usuário do token e renomeando para idUsuario
      const { id: idUsuario} = UsuarioServices.obterToken(req);
      const tarefaCriada = await Tarefa.cadastrar( idUsuario, titulo, descricao, prioridadeNv, categoriaNV);
      if (!tarefaCriada) {
        return respostaHTTP.erroInterno("Erro ao cadastrar tarefa.");
      }
      return respostaHTTP.cadastroOk("Tarefa cadastrada com sucesso.");
    } catch (erro) {
      console.error(erro);
      return respostaHTTP.erroInterno();
    }
  }

  static async alterar(req, res) {
    const respostaHTTP = new RespostaHTTP(res);
    try {
      // Extrai o id do usuário do token e renomeando para idUsuario
      const { id: idUsuario } = UsuarioServices.obterToken(req);
      const {id} = req.params;
      const { titulo, descricao, prioridadeNv, categoriaNV } = req.body;
      const tarefaAtualizada = await Tarefa.atualizar(idUsuario, id, titulo, descricao, prioridadeNv, categoriaNV);
      if (!tarefaAtualizada) {
        return respostaHTTP.erro(404,"Erro ao utilizar tarefa. Tarefa não encontrada.");
      }
      return respostaHTTP.sucesso("Tarefa alterada com sucesso.");
    } catch (erro) {
      console.error(erro);
      return respostaHTTP.erroInterno();
    }
  }

  static async excluir(req, res) {
    const respostaHTTP = new RespostaHTTP(res);
    try {
      // Extrai o id do usuário do token e renomeando para idUsuario
      const { id: idUsuario } = UsuarioServices.obterToken(req);
      const { id } = req.params;
      const tarefaRemovida = await Tarefa.remover(idUsuario, id);
      if (!tarefaRemovida) {
        return respostaHTTP.erro(404, "Erro ao excluir a tarefa. Tarefa não encontrada.");
      }
      return respostaHTTP.sucesso("Tarefa excluída com sucesso!");
    } catch (erro) {
      console.error(erro);
      return respostaHTTP.erroInterno();
    }
  }
}
module.exports = TarefaController;
