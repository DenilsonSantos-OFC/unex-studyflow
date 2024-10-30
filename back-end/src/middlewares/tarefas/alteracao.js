const RespostaHTTP = require('../../models/resposta-http');
const Tarefa = require('../../models/tarefa');
const UsuarioServices = require('../../services/usuario-services');

class AlteracaoMiddleware {
    // Middleware para validar os dados da tarefa ao atualizar
    static validarDadosTarefa(req, res, next) {
        const { titulo, prioridadeNv, categoriaNV} = req.body;

        if(!titulo){
            return res.status(400).json({message: "Campo título não preenchido"});
           }
           if(!prioridadeNv == undefined || isNaN(prioridadeNv)){
            return res.status(400).json({message: "Campo prioridade não preenchido ou inválido"})
           }
           if(!categoriaNV == undefined || isNaN(prioridadeNv)){
            return res.status(400).json({message: "Campo prioridade não preenchido ou inválido"})
           }
    
            // Se todos os dados estiverem corretos, passa para o próximo middleware
            next();
    }

    // Middleware para validar a existência de uma tarefa
    static async validarIdTarefa(req, res, next) {
        const respostaHTTP = new RespostaHTTP(res);
        const {id} = req.params;
        const {id: idUsuario} = UsuarioServices.obterToken(req);

        const tarefa = await Tarefa.consultar(idUsuario, id);
        if (!tarefa) {
            return respostaHTTP.erro(404, "Tarefa não encontrada.");
        }

        // Se a tarefa existir, passa para o próximo middleware
        next();
    }
} module.exports = AlteracaoMiddleware;
