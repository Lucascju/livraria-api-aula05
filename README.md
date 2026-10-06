# 📚 Livraria API — Camada de Segurança

API RESTful de Livros e Autores (Clean Architecture) com:

1. **Armazenamento seguro de credenciais** — senhas com BCrypt (`bcrypt`, salt aleatório + work factor 10).
2. **Autenticação stateless** — JWT (HS256) no header `Authorization: Bearer <token>`.
3. **RBAC** — middlewares `autenticarToken` e `exigirRole(...)` protegendo as rotas.

## Cenários de teste

- **A — Anônimo:** lista de livros carrega (200); cadastrar livro sem login → **401**.
- **B — Leitor** (`leitor@gmail.com` / `leitor123`): comentário gravado com o nome vindo do token (201); cadastrar livro → **403**.
- **C — Admin** (`admin@livraria.com` / `admin123`): cadastrar autor e livro → **201**.

## Credenciais de laboratório

| Perfil | E-mail | Senha |
|---|---|---|
| ADMIN | admin@livraria.com | admin123 |
| USER | leitor@gmail.com | leitor123 |

## Matriz de permissões

| Método | Rota | Acesso | Sucesso | Falha |
|---|---|---|---|---|
| GET | `/api/v1/livros` | Público | 200 | — |
| GET | `/api/v1/livros/:id` | Público | 200 | — |
| POST | `/api/v1/auth/register` | Público | 201 | — |
| POST | `/api/v1/auth/login` | Público | 200 | 401 |
| POST | `/api/v1/livros/:id/comentarios` | USER ou ADMIN | 201 | 401 |
| POST | `/api/v1/autores` | ADMIN | 201 | 401 / 403 |
| POST | `/api/v1/livros` | ADMIN | 201 | 401 / 403 |

**401** = sem token, token inválido, adulterado ou expirado. **403** = autenticado, mas sem o perfil exigido.
