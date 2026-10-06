const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_ALGORITHM } = require('../config/security');

/**
 * Autenticação stateless: valida o header "Authorization: Bearer <token>".
 * Em caso de sucesso, injeta os dados do usuário (vindos do payload assinado) em req.usuario.
 */
function autenticarToken(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ erro: 'Token de autenticação não fornecido.' });
  }

  const [esquema, token] = authHeader.split(' ');

  if (esquema !== 'Bearer' || !token) {
    return res.status(401).json({ erro: 'Formato do token inválido. Use: Authorization: Bearer <token>.' });
  }

  try {
    // algorithms fixado impede ataques de troca de algoritmo (ex.: "alg: none")
    const payload = jwt.verify(token, JWT_SECRET, { algorithms: [JWT_ALGORITHM] });

    req.usuario = {
      id: payload.sub,
      nome: payload.nome,
      role: payload.role
    };

    return next();
  } catch (error) {
    const mensagem = error.name === 'TokenExpiredError'
      ? 'Token expirado. Faça login novamente.'
      : 'Token inválido.';
    return res.status(401).json({ erro: mensagem });
  }
}

/**
 * RBAC: autoriza apenas os perfis informados.
 * Uso: exigirRole('ADMIN') ou exigirRole('ADMIN', 'USER')
 */
function exigirRole(...rolesPermitidas) {
  return (req, res, next) => {
    // Sem identidade → problema de autenticação (401), não de autorização
    if (!req.usuario) {
      return res.status(401).json({ erro: 'Usuário não autenticado.' });
    }

    if (!rolesPermitidas.includes(req.usuario.role)) {
      return res.status(403).json({
        erro: `Acesso proibido: privilégio de ${rolesPermitidas.join(' ou ')} exigido.`
      });
    }

    return next();
  };
}

module.exports = { autenticarToken, exigirRole };
