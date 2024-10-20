const RespostaHTTP = require('../models/resposta-http');
const Tarefa = require('../models/tarefa');

class AlteracaoMiddleware {
    // Middleware para validar os dados da tarefa ao atualizar
    static validarDadosTarefa(req, res, next) {
        const respostaHTTP = new RespostaHTTP(res);
        const { titulo, descricao, prioridade, categoria } = req.body;

        if (!titulo || !descricao || !prioridade || !categoria) {
            return respostaHTTP.erro(400, "Todos os campos são obrigatórios.");
        }

        // Se todos os dados estiverem corretos, passa para o próximo middleware
        next();
    }

    // Middleware para validar a existência de uma tarefa
    static async validarIdTarefa(req, res, next) {
        const respostaHTTP = new RespostaHTTP(res);
        const { id } = req.params;

        const tarefa = await Tarefa.consultar(id);
        if (!tarefa) {
            return respostaHTTP.erro(404, "Tarefa não encontrada.");
        }

        // Se a tarefa existir, passa para o próximo middleware
        next();
    }
}

module.exports = AlteracaoMiddleware;
