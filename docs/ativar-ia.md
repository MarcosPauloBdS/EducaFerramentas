# Ativar as sugestões de questões com IA

Integração preparada em 03/11/2026 exclusivamente para EducaFerramentas.

## Ação do responsável pelo projeto

1. Abra https://console.groq.com/ e crie uma conta. Mantenha o plano Free; não é necessário ativar Developer nem cadastrar forma de pagamento para utilizar a cota gratuita do projeto. Os limites gratuitos dependem do modelo e da organização.
2. Em https://console.groq.com/keys , crie uma chave chamada EducaFerramentas. Não a envie no chat, nem a coloque no código, no template, no README ou no GitHub.
3. Abra o painel Supabase do projeto EducaFerramentas: https://supabase.com/dashboard/project/ywhynggtlxqlrkshttch/functions/secrets . Confira o nome do projeto antes de salvar.
4. Em Edge Functions → Secrets, adicione **GROQ_API_KEY**. No valor, cole a chave recém-criada. Salve. Não altere as variáveis automáticas SUPABASE_URL, SUPABASE_ANON_KEY ou SUPABASE_SERVICE_ROLE_KEY.
5. Entre no EducaFerramentas, abra Provas e use “Atualizar disponibilidade”, ou recarregue a página.
6. Gere uma questão com o tema Frações equivalentes, Fundamental II, dificuldade intermediária. Confira enunciado, quatro alternativas e gabarito; adicione ao rascunho, edite se necessário e salve a prova.

Não é necessário domínio de e-mail ou assinatura paga do modelo. A chave é única para o projeto e fica no servidor; os professores usam apenas suas contas.

## Modelo e limites iniciais

Groq, modelo openai/gpt-oss-120b, com JSON Schema estrito. A implementação valida quantidade, limites de tamanho, alternativas distintas e posição da resposta correta mesmo após uma resposta formalmente válida do modelo. Há uma checagem determinística adicional para questões simples de frações equivalentes com alternativas numéricas. Esse controle não comprova a correção de todo conteúdo pedagógico: o professor precisa revisar.

De uma a três questões por solicitação; 10 solicitações por conta/dia; 30 por projeto/dia; intervalo global mínimo de 60 segundos. Dia de cota baseado em UTC. Tentativas reservadas para enviar ao provedor contam mesmo se houver falha; falhas antes da reserva, como entrada inválida ou serviço não ativado, não consomem cota. Não há tentativas automáticas adicionais.

O plano gratuito do Groq impõe limites adicionais compartilhados pela organização. Confira os valores reais em sua conta. Não ative um plano pago para solucionar um erro de cota sem avaliar essa mudança separadamente.

## Fluxo e privacidade

Somente tema, disciplina opcional, nível, dificuldade e quantidade seguem para o provedor. O código não consulta nem transmite escolas, turmas, alunos ou notas para gerar questões. Ainda assim, não escreva dados pessoais nos campos de tema ou disciplina.

Sugestões aparecem para revisão, sem alterar a prova automaticamente. Só entram no rascunho quando o professor escolhe “Adicionar à prova”; o salvamento na conta continua explícito. IDs estáveis mantêm a correspondência entre alternativa e gabarito. Edição manual permanece disponível.

Credenciais não são retornadas ao navegador e não são registradas pelo código. Falhas do provedor são convertidas em códigos controlados, sem repassar sua resposta bruta.

## Segurança da função

A verificação JWT do gateway está desligada para compatibilidade com o modelo atual de chaves/assinaturas, mas a função autentica cada solicitação com Supabase Auth getUser(token). Requisições sem usuário válido ou com usuário anônimo são recusadas antes de consultar configuração, reservar cota ou chamar o provedor. CORS aceita o domínio público do site; requisições de servidor sem Origin também exigem o usuário válido.

O cliente administrativo existe somente no servidor, para reservar cota em uma função SQL SECURITY INVOKER com execução exclusiva de service_role. Ele não carrega dados acadêmicos. Contadores ficam em schema interno com RLS e sem permissões dos usuários; a reserva bloqueia linhas para aplicar os limites atomicamente.

## Situação da verificação

Ativação testada em 03/11/2026 pela interface real. A primeira resposta do modelo 20b teve múltiplas alternativas corretas e foi reprovada na revisão. A geração foi ajustada para o modelo 120b, com instruções reforçadas e checagem adicional de frações. Uma nova questão foi revisada, adicionada, editada e salva na conta. Isso valida esse exemplo e o fluxo observado, não a qualidade de todas as gerações. Ver docs/validacao-ia-2026-11-03.md.

O verificador de segurança do Supabase apontou proteção contra senhas vazadas desativada. Nenhuma configuração de senha foi alterada nesta etapa. Referência: https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection . A disponibilidade desse recurso depende do plano.

## Fontes consultadas

- https://console.groq.com/docs/structured-outputs
- https://console.groq.com/docs/model/openai/gpt-oss-20b
- https://console.groq.com/docs/rate-limits
- https://console.groq.com/docs/your-data
- https://supabase.com/docs/guides/functions/secrets
- https://supabase.com/docs/guides/functions/auth
