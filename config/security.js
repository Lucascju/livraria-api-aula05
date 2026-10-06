require('dotenv').config({ quiet: true });
const crypto = require('crypto');

let JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET || JWT_SECRET.length < 32) {
  // Sem segredo configurado: gera um aleatório em memória para a API funcionar
  // direto com "node server.js". Nada fica fixo no código-fonte.
  // Efeito colateral: tokens emitidos deixam de valer quando o servidor reinicia.
  JWT_SECRET = crypto.randomBytes(64).toString('hex');
  console.warn(
    '[AVISO] JWT_SECRET não definido no .env. Usando um segredo aleatório temporário.\n' +
    '        Para tokens persistentes, copie .env.example para .env e defina JWT_SECRET.'
  );
}

module.exports = {
  JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '2h',
  JWT_ALGORITHM: 'HS256',
  // Work Factor do BCrypt: custo = 2^N iterações.
  BCRYPT_SALT_ROUNDS: Number(process.env.BCRYPT_SALT_ROUNDS) || 10,
  ROLES: Object.freeze({ ADMIN: 'ADMIN', USER: 'USER' })
};
