const RespostaHTTP = require('../../models/resposta-http');
const UsuarioServices = require('../../services/usuario-services');

class AutenticacaoMiddleware {
    // Middleware para verificar a autenticação do usuário
    static verificarAutenticacao(req, res, next) {
        const respostaHTTP = new RespostaHTTP(res);
        const usuarioToken = UsuarioServices.obterToken(req);

        if (!usuarioToken || !usuarioToken.id) {
            return respostaHTTP.erro(401, "Usuário não autenticado.");
        }

        // Se o usuário estiver autenticado, passa para o próximo middleware
        next();
    }
} module.exports = AutenticacaoMiddleware;
