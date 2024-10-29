class CadastroMiddleware {
    // Middleware para validar os dados da tarefa ao cadastrar
    static validarDadosTarefa(req, res, next) {
        const { titulo, prioridadeNv, categoriaNV } = req.body;

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
} module.exports = CadastroMiddleware;