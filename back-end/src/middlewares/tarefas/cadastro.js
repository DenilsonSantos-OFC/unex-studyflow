const RespostaHTTP = require('../models/resposta-http');

class CadastroMiddleware {
    // Middleware para validar os dados da tarefa ao cadastrar
    static validarDadosTarefa(req, res, next) {
        const respostaHTTP = new RespostaHTTP(res);
        const { titulo, descricao, prioridade, categoria } = req.body;

        if (!titulo  || !prioridade || !categoria) {
            return respostaHTTP.erro(400, "Campos obrigatórios não preenchidos.");
        }

        // Se todos os dados estiverem corretos, passa para o próximo middleware
        next();
    }
} module.exports = CadastroMiddleware;