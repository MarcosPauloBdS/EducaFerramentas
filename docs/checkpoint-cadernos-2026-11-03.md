# Cadernos e painéis de ajuda

Alteração de 03/11/2026, exclusivamente no EducaFerramentas.

## Cadernos

A revisão técnica não aparece mais na folha. O professor escolhe identificação por letras (Prova: A a D), faixas com nomes (Amarela, Azul, Vermelha, Verde) ou nenhuma identificação. Nomes acompanham as cores para que o caderno também seja reconhecido em impressão monocromática.

O embaralhamento pode ser desligado. Ligado, há de dois a quatro cadernos estáveis; não há botão para sortear ordens indefinidamente. Quatro permutações por questão partem de uma base determinística e usam deslocamentos distintos. Para questões com quatro alternativas, cada caderno tem uma ordem diferente e a alternativa correta ocupa quatro posições diferentes. Isso não constitui garantia contra cola.

As questões são salvas na ordem cadastrada. A seleção, quantidade e identificação ficam na configuração já existente da prova, sem nova tabela ou migração. Provas antigas com alternativas já embaralhadas preservam sua ordem anterior no caderno A. Cadernos B a D derivam dessa ordem. Provas antigas salvas no modo somente questões continuam sem identificação, salvo nova escolha do professor.

Prévia, PDF, Word e impressão calculam o gabarito pelo identificador da resposta correta na ordem final. Exportação conjunta gera um arquivo com cada caderno iniciando em nova página. O professor pode preparar todos os gabaritos da mesma forma. A opção somente questões remove cabeçalho, título e marca; a identificação escolhida para o caderno é independente e pode ser ocultada em sua própria seleção.

## Painéis e orientações

Cartões com título recebem botões acessíveis para recolher/expandir e abrir dicas pelo símbolo de interrogação. O estado de recolhimento é uma preferência local, por página. Campos, identificadores e controles são preservados. Editar uma questão reabre seu cartão; validação de campo também o reabre. Foram incluídos lembretes pequenos, atalhos entre edição/prévia e recolhimento dos painéis. Em telas largas, a coluna de prévia acompanha a rolagem; em telas menores, os atalhos reduzem a navegação necessária.

## Evidências e limites reais

- 40 testes automatizados passaram, incluindo proteção de acesso já existente, quatro ordens distintas e estáveis, gabarito correto, embaralhamento desligado, configuração limitada a quatro, preservação de provas antigas e saída em lote.
- Teste DOM isolado com LinkeDOM confirmou ajuda, expansão/recolhimento, reabertura para edição, preservação de todos os controles originais, ausência de IDs duplicados e preparo de quatro cadernos para impressão. Não é teste visual em navegador.
- Gerados PDFs com quatro provas e quatro gabaritos. Todas as oito páginas foram renderizadas e inspecionadas. Na amostra de frações, 6/16 aparece em C, B, A e D, respectivamente, com os gabaritos correspondentes.
- DOCX de provas e gabaritos gerados; conferência da estrutura do pacote e do conteúdo. Aparência no Word/LibreOffice e impressão física permanecem pendentes.
- Testes reais de API continuaram bloqueando visitantes sem login nas cinco tabelas. Nenhum registro de professor foi alterado para testar este checkpoint.

Continua pendente testar os novos controles em navegador e dispositivos reais, pois a prévia local foi bloqueada por permissão salva anteriormente. Não houve nova validação pedagógica ou com professores. Imagens, tabelas, fórmulas e edição livre de cabeçalhos continuam como próximos incrementos do editor; este checkpoint prioriza cadernos, identificação e usabilidade solicitados.
