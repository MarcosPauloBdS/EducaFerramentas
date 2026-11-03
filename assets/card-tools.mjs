const guidance={
 'library-card':['Abra uma prova salva para continuar. Atualizar lista busca os registros mais recentes, mas não substitui o rascunho aberto. Salve antes de trocar de prova.','Alterações no rascunho precisam ser salvas na conta.'],
 'question-form':['Preencha o enunciado e as quatro alternativas. Marque a resposta correta pelo conteúdo cadastrado: a letra final será calculada em cada caderno. Editar aqui atualiza a questão em todos os cadernos; depois salve a avaliação.','Revise o conteúdo e a resposta correta antes de distribuir.'],
 'ai-heading':['Informe tema, disciplina e nível. Gere sugestões, confira conteúdo, alternativas, gabarito e explicação; adicione somente o que aprovar. Não informe dados pessoais de alunos. Falhas e cotas aparecem neste cartão.','A IA pode errar. A revisão do professor é indispensável.'],
 'Organize os cadernos.':['Ative ou desative Embaralhar alternativas. Ligado, escolha de dois a quatro cadernos fixos. Letras e cores identificam os mesmos cadernos; trocar a aparência não sorteia outra ordem. A prévia e a exportação usam o caderno selecionado. Desligado, a ordem cadastrada é mantida.','Sem identificação na folha? Mantenha os cadernos e seus gabaritos separados.'],
 'layout-card':['Use o cabeçalho básico ou escreva o seu. Salvar como novo cabeçalho cria um modelo reutilizável; cada prova conserva sua própria cópia. Somente questões remove cabeçalho, título e marca; a identificação dos cadernos segue a escolha em Organize os cadernos. O modo avançado controla fonte, margens e espaços.','A prévia é contínua. Confira a paginação no PDF.'],
 'export-card':['Escolha imprimir ou baixar, PDF ou Word, prova ou gabarito. Com embaralhamento ligado, exporte um caderno ou todos em um arquivo; cada um começa em outra página. Use a mesma identificação ao distribuir os gabaritos. Cores também têm nomes para permitir impressão em preto e branco.','Word pode redistribuir linhas. Para manter a paginação, prefira PDF.'],
 'class-form':['Dê um nome à turma e informe a escola, se desejar. Selecione a turma para cadastrar alunos e consultar suas notas. Uma turma deve estar vazia antes de ser excluída.','Durante a validação, cadastre alunos fictícios.'],
 'student-form':['Escolha primeiro a turma. Digite o nome e cadastre o aluno; ele ficará associado àquela turma na sua conta. Atualizar dados traz os registros salvos em outro dispositivo.','Confira a turma selecionada antes de cadastrar.'],
 'grades-form':['Escolha o aluno, preencha as notas de zero a dez e atribua os pesos. Peso vazio vale um; os pesos são relativos e não precisam somar cem. A média só considera as avaliações preenchidas. Salve para atualizar a tabela.','Nota zero é válida. A soma dos pesos precisa ser maior que zero.'],
 'Conforto também é essencial.':['Aumente o texto e desligue as luzes em movimento se preferir. As preferências de aparência ficam neste dispositivo. O tema Alto contraste pode ajudar na leitura.','As preferências de aparência são locais ao dispositivo.'],
 'Um espaço para mais pessoas.':['Navegue com Tab e Shift + Tab, use os botões com Enter ou Espaço e acompanhe o foco visível. Os painéis podem ser recolhidos sem apagar seu conteúdo.','Recolher um painel não apaga os campos preenchidos.']
};
let nextId=0;
export function revealCard(card){if(card?.dataset.collapsed==='true')card.querySelector('.card-collapse')?.click();}
export function setupCardTools(){document.querySelectorAll('section.card,form.card,article.card').forEach(card=>{
 if(card.dataset.cardTools)return;const heading=card.querySelector(':scope > h2,:scope > .section-heading');if(!heading)return;card.dataset.cardTools='true';
 const title=heading.textContent.trim(),key=card.id||heading.querySelector('h2')?.id||title;
 const info=guidance[key]||guidance[card.querySelector('form')?.id]||['Use os campos e ações deste cartão. Você pode recolhê-lo para liberar espaço sem perder o que preencheu.','Recolher preserva o conteúdo do painel.'];
 const head=document.createElement('div');head.className='card-heading';heading.before(head);head.append(heading);
 const actions=document.createElement('div');actions.className='card-actions';head.append(actions);
 const help=document.createElement('button');help.type='button';help.className='card-help-button';help.textContent='?';help.setAttribute('aria-label','Como usar: '+title);help.setAttribute('aria-expanded','false');
 const toggle=document.createElement('button');toggle.type='button';toggle.className='card-collapse';toggle.textContent='Recolher';toggle.setAttribute('aria-label','Recolher painel: '+title);actions.append(help,toggle);
 const tips=document.createElement('div');tips.id='card-tips-'+nextId++;tips.className='card-tips';tips.hidden=true;tips.textContent=info[0];help.setAttribute('aria-controls',tips.id);head.after(tips);
 const content=document.createElement('div');content.id='card-content-'+nextId++;content.className='card-content';for(const child of [...card.childNodes])if(child!==head&&child!==tips)content.append(child);tips.after(content);
 const note=document.createElement('p');note.className='card-reminder';note.textContent=info[1];content.append(note);
 const storageKey='educa:panel:'+location.pathname+':'+key;
 function setCollapsed(value){card.dataset.collapsed=String(value);content.hidden=value;toggle.setAttribute('aria-expanded',String(!value));toggle.setAttribute('aria-controls',content.id);toggle.textContent=value?'Expandir':'Recolher';toggle.setAttribute('aria-label',(value?'Expandir':'Recolher')+' painel: '+title);try{localStorage.setItem(storageKey,value?'1':'0');}catch{}}
 toggle.onclick=()=>setCollapsed(card.dataset.collapsed!=='true');help.onclick=()=>{tips.hidden=!tips.hidden;help.setAttribute('aria-expanded',String(!tips.hidden));};
 let collapsed=false;try{collapsed=localStorage.getItem(storageKey)==='1';}catch{}setCollapsed(collapsed);
 card.addEventListener('invalid',()=>{revealCard(card);},true);
 });
 const collapse=document.getElementById('collapse-panels');if(collapse)collapse.onclick=()=>{document.querySelectorAll('#workspace .card[data-collapsed=false] .card-collapse').forEach(b=>b.click());};
 const edit=document.getElementById('back-to-editor');if(edit)edit.onclick=()=>revealCard(document.getElementById('question-form'));
}
setupCardTools();
