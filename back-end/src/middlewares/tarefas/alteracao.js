const RespostaHTTP = require('../../models/resposta-http');
const Tarefa = require('../../models/tarefa');

class AlteracaoMiddleware {
    // Middleware para validar os dados da tarefa ao atualizar
    static validarDadosTarefa(req, res, next) {
        const { titulo, prioridadeNv, categoriaNV} = req.body;

        if(!titulo){
            return res.status(400).json({message: "Campo título não preenchido"});
           }
           if(!prioridadeNv){
            return res.status(400).json({message: "Campo prioridade não preenchido"})
           }
           if(!categoriaNV){
            return res.status(400).json({message: "Campo categoria não preenchido"})
           }
    
            // Se todos os dados estiverem corretos, passa para o próximo middleware
            next();
    }

    // Middleware para validar a existência de uma tarefa
    static async validarIdTarefa(req, res, next) {
        const respostaHTTP = new RespostaHTTP(res);
        const {idUsuario, id} = req.params;

        const tarefa = await Tarefa.consultar(idUsuario, id);
        if (!tarefa) {
            return respostaHTTP.erro(404, "Tarefa não encontrada.");
        }

        // Se a tarefa existir, passa para o próximo middleware
        next();
    }
} module.exports = AlteracaoMiddleware;
