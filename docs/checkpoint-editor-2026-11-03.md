# Editor e documentos de avaliação

Implementação de 03/11/2026, exclusivamente no EducaFerramentas.

## Comportamento

- Escolha entre imprimir e baixar; download direto em PDF ou Word (.docx).
- Prova dos alunos e gabarito são saídas separadas. O gabarito inclui texto da resposta correta e letra na ordem final.
- A ordem de alternativas fica fixa durante a edição e exportação. Gerar nova ordem é uma ação explícita. A ordem final e a configuração da página são salvas com a prova.
- Identificador do documento acompanha prova e gabarito. Mudanças no conteúdo ou apresentação criam outro identificador. Não é hash criptográfico nem mecanismo de assinatura.
- Marca desativada por padrão; saída somente com questões disponível.
- Cabeçalhos de texto reutilizáveis por conta, com seleção, criação e exclusão de modelos. Cada prova conserva sua própria cópia do texto.
- Modo básico e ajustes avançados de fonte, tamanho, margem A4, entrelinhas, espaço entre questões e linhas de resposta. Questões podem ser movidas, editadas e iniciadas em outra página.

## Verificação realizada

- 34 testes automatizados passaram, incluindo verificação anônima das cinco tabelas e o carregador de PDF/Word com integridade das bibliotecas. Testes para preservação da ordem ao redesenhar/reabrir, resposta por texto e letra, cópia independente do documento, saída limpa e limites de configuração.
- Geração real dos arquivos pelo módulo de exportação e pelo módulo final de publicação. PDF e DOCX gerados com prova e gabarito.
- PDF de teste com duas páginas: imagens das duas páginas conferidas; quebra explícita na segunda questão. Extração confirmou 6/16 (letra B) no gabarito e ausência dessa identificação na prova dos alunos.
- DOCX aberto como pacote XML: estrutura, conteúdo, resposta correta e quebra de página verificados. A conferência visual no Word/LibreOffice permanece pendente: não há LibreOffice no runtime disponibilizado.
- Banco real: RLS ativa, leitura anônima sem permissão; teste transacional bloqueou leitura e alteração de um cabeçalho por outra conta. Registro temporário revertido.
- Advisor de segurança sem novo aviso referente à tabela. Aviso anterior de proteção contra senhas vazadas permanece.

A prévia interativa local foi bloqueada por uma permissão salva do navegador. Não foi realizado teste do clique de download, diálogo de impressão ou sincronização autenticada dos novos cabeçalhos nesta sessão. Nenhuma impressão física ou avaliação com professores foi realizada.

## Limites e próximos incrementos

A prévia na tela é contínua; o PDF mostra a paginação final. Word pode redistribuir linhas conforme as fontes disponíveis. O cabeçalho aparece no início, sem repetição automática em todas as páginas. Os ajustes existentes formam um editor estruturado, não um processador de texto completo.

Próximos incrementos: cabeçalhos com logo da escola e tabelas, campos automáticos, espaços por questão, desfazer/refazer, imagens e fórmulas, múltiplos cadernos com gabaritos associados e edição visual de blocos. Testar os downloads em dispositivos reais e a navegação com leitores de tela antes de declarar compatibilidade ampla.

Migração remota: 20261103080910_reusable_exam_headers_and_layout. SQL de referência: database/exam-document-layout.sql. Bibliotecas fixadas: pdfmake 0.3.13 e docx 9.15.1. Geração dos documentos no dispositivo, sem envio adicional do conteúdo a um conversor externo.

As bibliotecas de exportação são carregadas sob demanda pelo jsDelivr, em versões exatas e com hashes SHA-384 conferidos contra os pacotes instalados. A igualdade dos quatro arquivos do CDN foi verificada por requisições reais. O código publicado permanece pequeno; a exportação requer conexão ao CDN quando as bibliotecas ainda não estiverem carregadas. O teste isolado do carregador usa um ambiente simulado e não substitui o clique no navegador real.
