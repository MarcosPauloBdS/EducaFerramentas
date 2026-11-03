# Organização da versão 1.0

Em 03/11/2026, a pedido do responsável, a apresentação do EducaFerramentas foi atualizada para a versão 1.0.

- Removidos os avisos de uso exclusivo de alunos ou dados fictícios da página inicial, cadastro de alunos, dicas, gerador das páginas e README. As orientações agora tratam de salvar, atualizar e conferir os registros.
- Removida a identificação “EM EVOLUÇÃO” do cabeçalho e atualizada a versão do pacote para 1.0.0.
- A pasta `tests/` foi substituída por `maintenance/`. As verificações continuam disponíveis por `npm run check`, com os arquivos `.check.mjs`. Elas não são uma modalidade de uso do sistema e não são importadas pelas páginas.
- Removidos os cinco SVGs de compartilhamento sem referência no site, mantendo as imagens PNG efetivamente usadas em Open Graph e no README.
- Removido `src/exporters.mjs`, auxiliar de conferência local sem uso no build ou nas páginas. O carregador usado no site, seu código-fonte e as bibliotecas necessárias às verificações foram preservados.
- Removidas duas funções antigas de ordenação que não eram usadas pela aplicação. As verificações passaram a exercitar a mesma ordenação de cadernos usada pelo site.
- Preservados os ícones, imagens de compartilhamento usadas, fontes dos módulos, scripts de build, licenças, configuração da função de IA, SQL de estrutura e registros históricos acadêmicos.

Esta alteração de apresentação não modifica resultados históricos nem transforma verificações pendentes em verificações realizadas. Os limites registrados nos checkpoints anteriores permanecem como evidência do trabalho ocorrido. Não houve mudança de política de acesso, configuração do Supabase ou exclusão de registros de professores/alunos nesta atividade.
