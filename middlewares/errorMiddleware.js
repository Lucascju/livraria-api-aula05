function errorHandler(err, req, res, next) {
  // JSON malformado no body
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ erro: 'JSON inválido no corpo da requisição.' });
  }

  const statusCode = err.status || 500;

  if (statusCode >= 500) {
    console.error(err);
    // Não vaza stack trace ou detalhes internos para o cliente
    return res.status(statusCode).json({ erro: 'Ocorreu um erro interno no servidor.' });
  }

  return res.status(statusCode).json({ erro: err.message });
}

module.exports = errorHandler;
