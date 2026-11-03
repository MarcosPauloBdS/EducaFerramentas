# EducaFerramentas

Checkpoint de contas e nuvem: 03/11/2026. Sirva os arquivos por HTTP/HTTPS; abrir HTML diretamente pelo explorador não funciona com os módulos.

Criação manual de provas, embaralhamento opcional, prova e gabarito separados, turmas, alunos e média ponderada com seis notas. Login obrigatório para os módulos; salvamento explícito na conta. Use dados fictícios durante a validação. Para continuar em outro dispositivo, entre na mesma conta e atualize/abra os registros. Esta versão não oferece edição colaborativa em tempo real nem trabalho offline.

O backend de IA anterior foi removido. Nova IA em nuvem continua pendente. O frontend inclui somente a chave publicável do Supabase, projetada para uso no navegador. Nenhuma chave secreta ou de administração é usada. Senhas e sessões são tratadas pelo SDK oficial, com fluxo PKCE nos links de e-mail.

Destino Supabase autorizado: EducaFerramentas, ref ywhynggtlxqlrkshttch. Não utilizar outros projetos.

Instale dependências com `pnpm install --frozen-lockfile`. Gere o SDK do navegador com `pnpm build`; `assets/client.mjs` é distribuído pronto para Pages. SDK e ferramenta de build têm versões exatas no package.json e lockfile.

Testes: `pnpm test` (inclui consultas somente de leitura à API real). Teste SQL de isolamento: tests/rls.sql, exclusivamente no projeto autorizado; termina em rollback. Estrutura reproduzível: docs/schema.sql. Configuração e validação de e-mail ainda necessárias: docs/ativacao-contas.md.

Não executar scripts antigos da pasta work do chat para regenerar este código: representam etapas históricas.
