# Validação real da IA — 03/11/2026

Atividade técnica observada entre aproximadamente 03h44 e 03h53, America/Cuiaba. O usuário configurou a chave no Supabase e entrou pessoalmente na conta pela prévia. O agente não recebeu, visualizou nem copiou a senha ou a chave.

## Primeira geração: conteúdo reprovado

Tema Frações equivalentes, Matemática, Fundamental II, dificuldade intermediária, uma questão. O modelo inicial openai/gpt-oss-20b devolveu “Qual das opções representa uma fração equivalente a 3/4?”, com alternativas 1/2, 6/8, 9/12 e 12/16 e gabarito B.

Embora o JSON estivesse válido e as alternativas fossem textos distintos, B, C e D representam 3/4. A resposta foi reprovada na revisão e não foi adicionada à prova. Isso demonstrou que validação estrutural não basta para garantir a correção pedagógica.

## Ajustes realizados

- Modelo inicial trocado para openai/gpt-oss-120b, mantendo a conta/plano e limites existentes.
- Instruções reforçadas para resolver a questão e testar individualmente todos os distratores.
- Checagem determinística específica de frações equivalentes simples: quando há uma fração-alvo e todas as opções são frações numéricas, calcula equivalência por produto cruzado e exige exatamente uma resposta correta na posição indicada. Enunciados negativos e formatos não cobertos ficam fora dessa checagem; não se afirma validação semântica geral.
- Testes de regressão com a saída incorreta real e com gabarito inconsistente.

## Segunda geração: exemplo revisado e aceito

O modelo 120b gerou “Qual das frações abaixo é equivalente a 3/8?”, com alternativas 6/16, 9/20, 5/12 e 7/16. Gabarito A e justificativa de simplificação por dois. Verificação direta: 6/16 = 3/8; as outras opções têm valores diferentes.

Essa questão foi adicionada ao rascunho. Ao embaralhar, 6/16 passou para B e o gabarito acompanhou B. O enunciado foi editado para “Qual das frações representa o mesmo valor de 3/8?”. A prova foi salva como **Validação da IA — Frações — 03/11/2026**, sem alterar avaliações anteriores.

Após recarregar a página e abrir a prova da biblioteca, o título e a questão editada foram recuperados. Em nova ordem, 6/16 apareceu em C e o gabarito foi C. Isso verificou geração real, revisão, adição, edição, persistência e correspondência do gabarito para esse exemplo.

## Correção adicional encontrada no fluxo

Ao reabrir uma prova, o mecanismo que bloqueava controles durante a requisição restaurava um estado antigo dos botões de impressão. Foi alterado para bloquear o fieldset durante a ação, preservando as atualizações feitas pelo renderizador. Um teste de regressão foi adicionado. A verificação final do botão no navegador é registrada no estado local do projeto.

## Contagem e limites da comprovação

Contador do projeto indicou duas solicitações reais; a interface mostrou oito restantes na cota da conta. Nenhum dado de aluno, turma ou nota foi enviado para gerar as questões. Foram usados apenas os campos curriculares descritos.

29 testes automatizados passaram após os ajustes. A função permaneceu recusando chamadas sem sessão/token válido nos testes HTTP. A primeira falha foi documentada, sem apresentá-la como resultado aprovado. Não houve teste comunitário com professor, análise de grande conjunto de questões, comparação pedagógica sistemática, uso real em dois dispositivos ou impressão física nesta atividade.

A revisão do professor continua necessária em todas as gerações. Um exemplo correto não comprova ausência de erros futuros. Fontes de modelo/saída estruturada: https://console.groq.com/docs/model/openai/gpt-oss-120b e https://console.groq.com/docs/structured-outputs .
