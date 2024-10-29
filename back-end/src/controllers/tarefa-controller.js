const UsuarioServices = require('../services/usuario-services')
const RespostaHTTP = require('../models/resposta-http')
const Tarefa = require('../models/tarefa');


class TarefaController {

    static async buscarTarefas(req, res) {
        const respostaHTTP = new RespostaHTTP(res)
        try {
            const tarefas = await Tarefa.listar();
            return respostaHTTP.sucesso("Tarefas recuperadas com sucesso.", tarefas);
        }
        catch (erro) {
            console.error(erro);
            return respostaHTTP.erroInterno();
        }
    }

    static async buscarTarefa(req, res) {
        const respostaHTTP = new RespostaHTTP(res);
        try {
            const id = req.params;
            const tarefa = await Tarefa.consultar(id);
            if (!tarefa) {
                return respostaHTTP.erro(404, "Tarefa não encontrada.")
            }
            return respostaHTTP.sucesso("Tarefa encontrada", tarefa)
        }
        catch (erro) {
            console.error(erro);
            return respostaHTTP.erroInterno();
        }
    }

    static async cadastrar(req, res) {
        const respostaHTTP = new RespostaHTTP(res);
        const { titulo, descricao, prioridadeNv, categoriaNV} = req.body;
        try {
            const id = UsuarioServices.obterToken(req).id
            const tarefaCriada = await Tarefa.cadastrar(id, titulo, descricao, prioridadeNv, categoriaNV);
            if (!tarefaCriada) {
                return respostaHTTP.erroInterno("Erro ao cadastrar tarefa.");
            }
            return respostaHTTP.sucesso(201, "Tarefa cadastrada com sucesso.");
        }
        catch (erro) {
            console.error(erro)
            return respostaHTTP.erroInterno();
        }
    }

    static async alterar(req, res) {
        const respostaHTTP = new RespostaHTTP(res);
        try {
            const id = req.params;
            const { titulo, descricao, prioridadeNv, categoriaNV} = req.body
            const tarefaAtualizada = await Tarefa.atualizar(id, titulo, descricao, prioridadeNv, categoriaNV)
            if (!tarefaAtualizada) {
                return respostaHTTP.erro(404, "Erro ao utilizar tarefa. Tarefa não encontrada.");
            }
            return respostaHTTP
        }
        catch (erro) {
            console.error(erro);
            return respostaHTTP.erroInterno();
        }
    }

    static async excluir(req, res) {
        const respostaHTTP = new RespostaHTTP(res);
        try {
            const id = req.params
            const tarefaRemovida = await Tarefa.remover(id);
            if (!tarefaRemovida) {
                return respostaHTTP.erro(404, "Erro ao excluir a tarefa. Tarefa não econtrada.")
            }
            return respostaHTTP.sucesso("Tarefa excluída com sucesso!")
        }
        catch (erro) {
            console.error(erro);
            return respostaHTTP.erroInterno();
        }
    }
} module.exports = TarefaController;
