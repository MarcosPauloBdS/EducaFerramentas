# Checkpoint — 03/11/2026

Escopo autorizado: somente MarcosPauloBdS/EducaFerramentas e Supabase EducaFerramentas (ywhynggtlxqlrkshttch).

Removidos backend/server.js e backend/package.json da versão ativa, junto com a chamada ao serviço antigo de IA. Nenhum segredo foi copiado. Remoção de integração não equivale a revogação de token nem exclusão da conta externa; histórico Git anterior permanece.

Implementados: questões manuais; alternativas com IDs estáveis; embaralhamento opcional; prova e gabarito com estilos de impressão distintos; nomes e questões renderizados como texto; validação de notas 0–10 e pesos não negativos com soma positiva; seis notas, peso vazio igual a 1 e limites de cores originais preservados. Interface comum responsiva inicial.

Verificação executada: três testes Node passaram, incluindo 100 embaralhamentos; verificações de sintaxe de exams.mjs e grades.mjs passaram; busca na versão ativa sem referências ao provedor removido, endpoint antigo ou inserção por innerHTML/document.write. Testes de impressão, interface no navegador e dispositivos reais ainda pendentes. Não são evidências de aplicação comunitária.

Supabase: somente leitura de public no novo projeto, sem tabelas; nenhuma alteração de banco. Autenticação, RLS, persistência, tema escuro e nova IA ainda pendentes. Dados desta versão ficam em memória, com aviso visível.

