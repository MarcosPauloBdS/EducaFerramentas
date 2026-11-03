# Verificações de manutenção

Esta pasta reúne as verificações internas do EducaFerramentas. Elas ajudam a conferir acesso às contas, proteção dos registros, cálculos das notas, cadernos, gabaritos, cabeçalhos e arquivos exportados após alterações no código.

Esses arquivos não são carregados pelas páginas do site e não interferem no cadastro de alunos. A aplicação funciona independentemente da execução das verificações.

Para conferir o sistema no ambiente de desenvolvimento, instale as dependências do projeto e execute:

```sh
npm run check
```

O comando usa o verificador nativo do Node.js. As verificações locais usam dados simulados; as verificações de conexão consultam os bloqueios de acesso sem sessão e o comportamento de autorização da função de IA, sem gerar questões ou alterar registros de professores. Precisam de conexão para concluir essas consultas.

Os arquivos SQL são referências para conferências manuais e não são executados por esse comando. Os registros datados em `docs/` preservam as evidências e os limites do que foi verificado em cada etapa.
