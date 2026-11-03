# Ativação e validação das contas

Destino exclusivo: projeto Supabase **EducaFerramentas**, referência `ywhynggtlxqlrkshttch`.

O banco e as políticas já foram aplicados. O código de login, cadastro, recuperação e persistência está preparado. A integração atual do Supabase não oferece leitura/alteração das configurações administrativas de Auth, portanto os itens abaixo ainda precisam ser conferidos no painel antes de considerar o cadastro e a recuperação validados.

## Endereço dos links de e-mail

Em Authentication → URL Configuration, configurar:

- Site URL: `https://marcospaulobds.github.io/EducaFerramentas/conta.html`
- Redirect URLs: adicionar exatamente `https://marcospaulobds.github.io/EducaFerramentas/conta.html`
- Somente para desenvolvimento local, se necessário: adicionar `http://127.0.0.1:4173/conta.html`.

Não usar curingas amplos. Manter a confirmação de e-mail habilitada. O código solicita retorno para conta.html e usa PKCE: abrir o link no mesmo navegador em que foi solicitado. Após confirmar cadastro, entrar com e-mail e senha.

Fonte: https://supabase.com/docs/guides/auth/redirect-urls

## Entrega de e-mails

A API pública confirmou cadastro por e-mail habilitado e confirmação obrigatória. A configuração SMTP privada não foi inspecionada. Se estiver usando o serviço padrão do Supabase, os destinatários ficam limitados aos membros da organização e o limite documentado em 03/11/2026 é de duas mensagens por hora. Não afirmar que qualquer professor já pode se cadastrar.

Para professores fora da organização, configurar um serviço SMTP próprio no painel do EducaFerramentas. Credenciais SMTP devem ficar somente no Supabase. Não desabilitar confirmação de e-mail como substituição da configuração. Não adicionar professores à equipe administrativa do Supabase para contornar a restrição de envio.

Fonte: https://supabase.com/docs/guides/auth/auth-smtp

## Roteiro de aceite ainda a executar com contas reais

1. Criar conta e confirmar o e-mail no mesmo navegador.
2. Entrar e verificar as ferramentas de turmas, alunos, notas e provas.
3. Recarregar e abrir os registros salvos.
4. Em outro navegador/dispositivo, entrar na mesma conta e abrir os registros; comparar os valores.
5. Tentar salvar a versão antiga de uma prova após alterá-la no outro dispositivo: deve exibir conflito, sem sobrescrever.
6. Usar uma segunda conta: não deve visualizar os registros da primeira.
7. Sair e solicitar recuperação; abrir o link, escolher nova senha e testar entrada.
8. Conferir visual e impressão da prova sem respostas e do gabarito separado.

Registrar datas reais, resultados e limitações. Os testes SQL já executados não substituem este roteiro nem representam teste comunitário com professor.
