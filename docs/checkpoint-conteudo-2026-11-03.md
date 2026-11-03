# Cabeçalhos com logo, imagens e fórmulas

Implementação de 03/11/2026, exclusivamente no EducaFerramentas.

## Uso e comportamento

Em O documento é seu, escolha texto livre ou tabela. Dados automáticos e logo da escola contém escola, professor, disciplina, turma, data, duração, valor e envio de logo. O modelo básico insere marcadores como {{escola}}, {{professor}}, {{disciplina}}, {{aluno}}, {{turma}}, {{data}}, {{duracao}} e {{valor}}; dados vazios viram espaços de preenchimento. A data é uma escolha do professor, sem preenchimento automático pelo relógio.

Salvar como novo cabeçalho preserva texto, campos, logo e estrutura. Selecionar um modelo copia os dados para a avaliação, sem vinculação que altere outras provas. Modelos de texto antigos continuam compatíveis. A saída somente questões omite cabeçalho e logo, mantendo as imagens e fórmulas que fazem parte das questões.

Em Imagem e fórmula, cada questão aceita uma imagem com descrição acessível e largura configurável, além de uma fórmula opcional. São oferecidas fração, potência, raiz quadrada e expressão livre em texto; não há interpretação de comandos LaTeX ou cálculos automáticos. No Word, as fórmulas são equações nativas editáveis. A imagem e a fórmula entram na avaliação após adicionar ou salvar a questão; a avaliação ainda precisa ser salva na conta.

PDF, Word e impressão incluem os novos blocos. A preparação pelo botão aguarda o carregamento das imagens. A paginação do PDF agrupa questões e inicia outra página quando uma questão se dividiria, sem impedir a continuação de questões maiores que uma página. Word usa encadeamento de parágrafos; o navegador recebe blocos de questão com preferência por manter juntos. Cadernos e gabaritos continuam separados e identificados conforme a escolha do professor.

## Armazenamento e proteção

Criado bucket privado exam-media somente no projeto Supabase EducaFerramentas. Políticas permitem leitura, inserção e exclusão na pasta do próprio usuário autenticado. Não há permissão de atualização de arquivos: cada envio usa novo identificador. Bucket limita cada arquivo a 1 MiB e MIME PNG/JPEG. O cliente aceita PNG, JPG e WebP de até 5 MiB, verifica assinatura, decodifica e redimensiona antes de enviar; referências SVG, HTML e URLs externas não são aceitas. O redimensionamento também remove metadados da imagem original.

O banco guarda referências, dimensões e descrições, sem imagens base64 na configuração. Downloads privados usam a sessão da conta; os dados são incorporados ao PDF/Word no dispositivo. Remover uma referência de uma questão ou cabeçalho preserva os arquivos potencialmente usados por outros modelos da mesma conta. Gerenciamento de arquivos não utilizados é uma evolução pendente.

Migração aplicada: 20261103185805_private_exam_media_and_header_design. Acrescentado exam_headers.design; as regras de proprietário existentes foram mantidas. SQL de referência em database/private-exam-media.sql. Nenhuma avaliação ou turma existente foi alterada para testar.

## Verificação realizada

- 50 testes automatizados passaram, abrangendo os comportamentos anteriores, dados automáticos, referências de imagem, assinatura de arquivo, rejeição de SVG/URL, cópia de modelos, segurança do texto no DOM, fórmulas, leitura privada com cache e cancelamento de envio em ambiente simulado.
- Teste transacional real salvou e recuperou um modelo com design pelo proprietário e bloqueou outra conta; registro temporário revertido.
- Banco confirmou bucket privado, tamanho/MIME e políticas. A expressão da política de envio foi executada com caminhos de teste: permitiu a pasta própria e recusou outra conta, sem criar objetos de Storage.
- PDFs de exemplo com dois cadernos, quatro questões cada, logo, tabela, diagrama e os quatro tipos de fórmula foram gerados. Quatro páginas de prova e duas de gabarito foram renderizadas e inspecionadas após o ajuste de paginação. Logo e diagrama são figuras sintéticas locais identificadas como exemplo, sem material de escola ou professor real.
- DOCX de exemplo gerados; pacote inspecionado para verificar imagens, tabela, equações nativas e seções. Aparência em Word/LibreOffice permanece pendente.
- O adaptador de Worker usado na conferência de PNG é exclusivamente um teste de biblioteca no Node, sem abrir navegador, acessar sessão de professor ou contornar o bloqueio de prévia. Não faz parte do código publicado.
- Advisor não apresentou novo alerta relativo a Storage ou modelos; aviso anterior de proteção contra senhas vazadas permanece.

## Limites reais

Não foi realizado envio autenticado de arquivo pela interface, nem teste visual em navegador, celular ou leitor de tela neste checkpoint. A prévia local estava bloqueada por uma permissão salva e esse bloqueio foi respeitado. Também não houve impressão física, teste pedagógico ou validação com professores. Não confundir testes com dados simulados e inspeção de políticas com um fluxo autenticado completo de Storage.

O editor continua estruturado: uma imagem e uma fórmula por questão, tabela de cabeçalho predefinida, sem fórmulas aninhadas, LaTeX, imagens nas alternativas ou edição livre de tabelas/blocos. Próximos passos: validar os fluxos reais com a conta do usuário e ampliar a edição conforme o uso dos professores.
