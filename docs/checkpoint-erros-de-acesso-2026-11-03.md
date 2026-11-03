# Mensagens de acesso — 03/11/2026

O usuário informou que conseguiu criar/acessar sua conta e usar o site no celular. Esse relato é evidência fornecida pelo usuário, não um teste presencial feito pelo agente.

Corrigidos os avisos que podiam ficar fora da área visível: agora há uma caixa de feedback dentro do cartão de acesso, com foco programático, role alert, campos associados por aria-describedby e indicação aria-invalid. Cada erro inclui um próximo passo. Valores permanecem nos campos em caso de falha; falhas desconhecidas não expõem a mensagem bruta do provedor.

Cadastro e redefinição passam a validar seis caracteres. Login com credenciais não reconhecidas apresenta “E-mail ou senha inválidos”, sem diferenciar qual campo está errado nem informar se a conta existe. Há tratamento para campos vazios, formato inválido, senhas diferentes, e-mail não confirmado, indisponibilidade, conexão, limites de tentativas e links expirados.

Verificação: 16 testes automatizados passaram, incluindo limite de cinco/seis caracteres e equivalência das mensagens de credenciais. A primeira execução do teste de rede foi bloqueada por falta de permissão de rede; após a concessão, a suíte passou. Verificação de sintaxe passou. Consulta com cadastro deliberadamente inválido (cinco caracteres e domínio reservado) foi recusada pelo Supabase com HTTP 422 e “Password should be at least 6 characters.” Não houve criação de conta nem entrega de e-mail; nenhuma configuração de senha foi alterada.

Fontes oficiais consultadas: https://supabase.com/docs/guides/auth/debugging/error-codes e https://supabase.com/docs/guides/auth/testing-auth-flows . Verificações de navegador/publicação serão registradas no estado local conforme realmente ocorrerem.
