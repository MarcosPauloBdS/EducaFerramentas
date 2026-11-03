# Nova apresentação e acesso obrigatório — 03/11/2026

Solicitação: README para visitantes, atualização do visual, temas, menu inferior, compartilhamento e exigência de login no site publicado.

## Mudanças

- README reescrito como apresentação do projeto, sem instruções administrativas, identificadores de serviços ou detalhes de configuração. Inclui última atualização e próximos passos.
- Sistema visual Aurora com fundos de luz suave, navegação inferior e cinco temas: Aurora, Cosmos, Oceano, Amanhecer e Alto contraste. Preferências locais de tema, texto e movimento, sem armazenar dados de alunos nessas preferências.
- Áreas de trabalho ocultas no HTML até validação da conta: início, provas, turmas e aparência. A tela de entrada permanece pública. Revalidação ao restaurar página do histórico; dados continuam protegidos no banco por RLS. O HTML estático e os metadados públicos não contêm dados pessoais dos professores/alunos.
- Marca vetorial própria, favicon SVG/ICO/PNG, ícone de tela inicial e cinco imagens PNG de compartilhamento 1200 × 630. Tags Open Graph e Twitter estáticas e URLs absolutas em todas as páginas, disponíveis aos robôs sem login ou JavaScript. Conteúdo de compartilhamento é genérico, sem registros da conta.
- Layout com ajustes para telas estreitas e largas, controles com foco visível, rótulos de campos, tabela rolável com região identificada e atalho para o conteúdo. Movimento respeita prefers-reduced-motion, pode ser desligado e é removido no tema Alto contraste.

## Verificação até a preparação da publicação

Doze testes automatizados passaram, incluindo guardas de acesso com identidades simuladas, bloqueio real da API sem sessão, lógica de notas/gabaritos, metadados em cinco páginas, dimensões das imagens e contraste mínimo 4,5:1 nos pares principais de texto dos cinco temas. Não constitui certificação de acessibilidade nem teste visual completo.

Imagem principal de compartilhamento renderizada e inspecionada. Verificações de sintaxe dos módulos passaram.

O usuário informou ter configurado os links de e-mail em URL Configuration. A configuração administrativa de SMTP não foi inspecionada. Cadastro/recuperação por entrega de e-mail e uso em dois dispositivos seguem sujeitos à validação real.

Testes físicos em televisões, consoles, leitores de tela e todos os tamanhos de dispositivos não foram executados. Não alegar responsividade universal ou conformidade integral com WCAG. As verificações adicionais de publicação/navegador são registradas no estado local do projeto conforme realmente ocorrerem.

Fontes de referência: https://ogp.me/ ; https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion ; https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html
