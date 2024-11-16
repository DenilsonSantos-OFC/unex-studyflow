const RespostaHTTP = require('../../models/resposta-http')
const Tarefa = require('../../models/tarefa')
const UsuarioServices = require('../../services/usuario-services')

class ChecagemMiddlewares {

    // Middleware para validar os dados da tarefa ao atualizar
    static validarDadosAtualizadosDeTarefa(req, res, next) {
        const respostaHTTP = new RespostaHTTP(res);
        const { titulo, prioridadeNv, categoriaNv } = req.body;
        const novosValores = Object.values({ titulo, prioridadeNv, categoriaNv })
        let precisaMexerNoBD
        novosValores.forEach(valor => {
            if (valor)
                precisaMexerNoBD = true})
        if (!precisaMexerNoBD)
            return respostaHTTP.enviarErro(400, "Nenhuma alteração válida foi recebida.")
        next()
    }

    // Middleware para validar a existência de uma tarefa
    static async validarIdTarefa(req, res, next) {
        const respostaHTTP = new RespostaHTTP(res);
        const { id } = req.params;
        const { id: idUsuario } = UsuarioServices.obterToken(req);
        const tarefa = await Tarefa.consultar(idUsuario, id);
        if (!tarefa) {
            return respostaHTTP.enviarErroDeAusencia("Tarefa não encontrada.")
        }
        // Se a tarefa existir, passa para o próximo middleware
        next();
    }

    // Middleware para validar os dados da tarefa ao cadastrar
    static validarNovosDadosDaTarefa(req, res, next) {
        const { titulo, prioridadeNv, categoriaNv } = req.body;
        const respostaHTTP = new RespostaHTTP(res)
        if (!titulo)
            return respostaHTTP.enviarErroDeCampoAusente("titulo")
        if (isNaN(prioridadeNv))
            return respostaHTTP.enviarErroDeDadoInvalido("prioridadeNv")
        if (isNaN(categoriaNv))
            return respostaHTTP.enviarErroDeDadoInvalido("categoriaNv")
        // Se todos os dados estiverem corretos, passa para o próximo middleware
        next();
    }

    static verificarAutenticacao(req, res, next) {
        const respostaHTTP = new RespostaHTTP(res)
        const usuarioToken = UsuarioServices.obterToken(req)
        console.log(usuarioToken)
        if (!usuarioToken || !usuarioToken.id) {
          return respostaHTTP.enviarNegacao("Usuário não autenticado.")
        }
        // Se o usuário estiver autenticado, passa para o próximo middleware
        next();
      }

} module.exports = ChecagemMiddlewares