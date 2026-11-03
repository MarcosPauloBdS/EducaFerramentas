# Preparação da geração de questões — 03/11/2026

Escopo: somente repositório MarcosPauloBdS/EducaFerramentas e projeto Supabase EducaFerramentas. Assunto de templates de e-mail deixado de lado conforme solicitação do usuário.

## Entregue tecnicamente

Função generate-exam implantada. Autenticação própria com getUser, recusa de conta anônima, CORS restrito ao site, corpo limitado, validação das entradas e da saída, limite de tempo e mensagens controladas de erro. Chave do modelo somente em variável secreta do servidor; nenhuma chave real foi fornecida, copiada ou publicada pelo agente.

Groq / openai/gpt-oss-20b escolhido como configuração inicial por suportar resposta estruturada estrita e plano Free documentado. Qualidade em português e disponibilidade efetiva para esta conta ainda precisam de teste com chave real. Nenhum plano pago foi ativado.

Contadores privados com RLS e negação explícita aos papéis de cliente. Função SQL SECURITY INVOKER executável somente pelo papel de serviço no servidor; limites atômicos de 10 tentativas/conta/dia UTC, 30/projeto/dia UTC e intervalo global de 60 segundos. Não guarda tema, prompt ou dados de alunos no contador.

Interface de tema, disciplina, nível, dificuldade e uma a três sugestões. Sugestões exigem adição explícita à prova. Edição manual de questões adicionada, mantendo a resposta correta por ID. Criação manual preservada. README apresenta o estágio de ativação sem divulgar configuração administrativa.

## Evidências executadas

27 testes Node passaram. Incluem casos de autenticação, ausência de chave, corpo/origem inválidos, limites, validação de JSON, alternativas repetidas, gabarito após embaralhamento, resposta truncada e falhas do provedor. Chamadas ao modelo nesses testes são simuladas, sem qualidade pedagógica comprovada.

Teste SQL transacional de quotas passou e foi repetido após adicionar políticas explícitas. Simulou conta fictícia, restrições de papéis, intervalo, limite por conta e por projeto; tudo desfeito por rollback. Verificação após teste confirmou zero usuários de teste, zero chamadas reservadas e ausência de permissão de reserva para anon/authenticated.

Testes HTTP reais na função implantada: ausência de sessão e token inválido recusados com 401/AUTH_REQUIRED; preflight do site aceito; outra origem recusada com 403. Não houve chamada real ao modelo.

O advisor de segurança apontou proteção contra senhas vazadas desativada, preexistente nesta etapa: https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection . Contadores inicialmente geraram avisos informativos por falta de políticas; receberam negação explícita e esses avisos deixaram de aparecer.

## Pendente

Responsável criar conta Free no Groq e salvar GROQ_API_KEY nos Secrets do EducaFerramentas. Instruções em docs/ativar-ia.md. Só após uma geração real e revisão poderão ser registrados conteúdo, tempo de resposta e qualidade. Interface autenticada e fluxo completo de gerar/adicionar/editar/salvar/imprimir precisam de validação real; não declarar integração de IA validada ou teste comunitário concluído.
