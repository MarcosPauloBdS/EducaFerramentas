# Checkpoint de contas e nuvem — 03/11/2026

Registro elaborado aproximadamente às 01h54, America/Cuiaba (05h54 UTC). Não constitui validação comunitária.

## Implementado

- Alterações somente no repositório MarcosPauloBdS/EducaFerramentas e no Supabase EducaFerramentas, ywhynggtlxqlrkshttch.
- Tabelas classrooms, students, grade_reports e exams, com proprietário por conta, RLS para todas as operações e integridade por chaves estrangeiras compostas. Permissões explícitas de leitura/escrita; acesso anônimo e TRUNCATE de authenticated revogados.
- Validação de notas/pesos e estrutura de questões também no banco, sem funções SECURITY DEFINER.
- Telas e integração com SDK oficial para login, cadastro, confirmação por e-mail, recuperação de senha e saída da sessão local.
- Salvamento e carregamento de provas, turmas, alunos e notas na conta; atualizações de provas/notas com verificação de versão para detectar conflitos entre dispositivos. Atualização explícita, sem alegação de sincronização instantânea ou suporte offline.
- Dependência supabase-js 2.118.0, versões exatas e lockfile; SDK empacotado localmente para o navegador, sem CDN de execução. Somente chave publicável no cliente.

## Verificação realizada

- Seis testes Node passaram: média ponderada, entradas inválidas, gabarito em 100 embaralhamentos, configuração do projeto, bloqueio real de leitura anônima pela API e tratamento de conflito.
- Teste transacional no banco passou para isolamento A/B em quatro tabelas, tentativas de leitura/escrita/exclusão cruzadas, troca de proprietário, referência a turma alheia, validação, escrita própria e bloqueio anônimo. Teste repetido após limitar os privilégios herdados. Tudo desfeito por rollback; consulta confirmou zero usuários de teste e zero registros nas tabelas ao final.
- Quatro chamadas reais à Data API, sem sessão, retornaram HTTP 401.
- API de Auth retornou 200, e-mail habilitado, cadastro permitido e confirmação obrigatória. Nenhum e-mail de teste foi enviado.
- Verificações de sintaxe dos módulos passaram; auditoria de dependências de produção sem vulnerabilidades conhecidas; advisors de segurança do Supabase sem alertas.
- Advisor de desempenho apontou apenas um índice novo ainda não usado. Mantido para consultas/integridade de student_id e owner_id: https://supabase.com/docs/guides/database/database-linter?lint=0005_unused_index
- Página pública anterior respondeu HTTP 200; isso não valida o novo fluxo de contas.

## Pendências explícitas

Configuração administrativa de URLs e SMTP não foi lida/alterada pelo conector. Ver docs/ativacao-contas.md. Cadastro com entrega de e-mail, recuperação completa, entrada real e persistência em dois dispositivos ainda não foram validados ponta a ponta.

A abertura da prévia local foi recusada pelo controle de acesso do navegador; nenhum contorno foi tentado. Layout, teclado e impressão não foram revisados visualmente neste checkpoint.

IA em nuvem, refinamento visual premium, tema escuro, edição completa de questões e boletins continuam para etapas futuras. Preservado cálculo de médias e impressão separada do checkpoint anterior.
