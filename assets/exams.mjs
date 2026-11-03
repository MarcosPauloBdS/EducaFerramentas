import {setupQuestionExtras} from './question-extras.mjs?v=20261103-release1';
import {renderBlock,imageFit} from './rich-content.mjs?v=20261103-release1';
import {bindMedia,hydrateDocuments} from './media-service.mjs?v=20261103-release1';
import {arrangeBooklet,identify} from './booklets.mjs?v=20261103-release1';
import {revealCard} from './card-tools.mjs?v=20261103-release1';
import {preparePrint} from './print-document.mjs?v=20261103-release1';
import {setupDocument} from './document-editor.mjs?v=20261103-release1';
import {snapshot} from './document-model.mjs?v=20261103-release1';
import {setupAI} from './ai-exams.mjs?v=20261103-ai2';
import {supabase} from './client.mjs';
import {requireUser} from './session.mjs';
import {$,node,message,action,check,conflict} from './ui.mjs?v=20261103-state2';
let questions=[],displayed=[],record=null,dirty=false,editingId=null,outputVersion=crypto.randomUUID().slice(0,8),docEditor,questionExtras,legacyOrder=false;
const user=await requireUser();
const changed=()=>{dirty=true;outputVersion=crypto.randomUUID().slice(0,8);message('Alterações no rascunho. Clique em Salvar na minha conta.');};
window.addEventListener('beforeunload',e=>{if(dirty){e.preventDefault();e.returnValue='';}});
function render(){
  const layout=docEditor?.read()||{copies:4,booklet:0,idStyle:'letters'};const shuffle=$('shuffle').checked;const index=shuffle?layout.booklet:0;
  $('doc-booklet').value=String(index);$('doc-booklet').disabled=!shuffle;$('output-scope').disabled=!shuffle;if(!shuffle)$('output-scope').value='current';$('booklet-settings').hidden=!shuffle;
  [...$('doc-booklet').options].forEach((o,i)=>{o.textContent=identify(layout.idStyle==='colors'?'colors':'letters',i).text;o.hidden=i>=layout.copies;});
  displayed=arrangeBooklet(questions,index,shuffle,legacyOrder);
  $('document-version').textContent=shuffle?'Até '+layout.copies+' cadernos fixos. A prévia mostra o caderno selecionado.':'Embaralhamento desligado: a ordem cadastrada será preservada.';
  $('preview-title').textContent=$('title').value.trim()||'Avaliação';
  $('questions').replaceChildren();$('empty').hidden=questions.length>0;
  $('print-exam').disabled=$('print-key').disabled=questions.length===0;
  displayed.forEach((q,i)=>{const article=node('article','',$('questions'),'question');article.dataset.pageBreak=String(q.pageBreak===true);node('p',(i+1)+'. '+q.statement,article,'statement');if(q.formula)renderBlock(article,{formula:q.formula});if(q.image)renderBlock(article,{image:q.image,fit:imageFit(q.image,q.image.displayWidth)});const list=node('ol','',article);list.type='A';q.options.forEach(o=>node('li',o.text,list));node('pre','',article,'answer-space');node('p','Questão '+(i+1)+' — '+q.options.find(o=>o.id===q.correctId).text+' (letra '+q.answer+')',article,'answer');const tools=node('div','',article,'toolbar no-print');const edit=node('button','Editar',tools,'secondary');edit.type='button';edit.onclick=()=>startEditing(questions.find(item=>item.id===q.id));const remove=node('button','Remover',tools,'secondary');remove.type='button';remove.onclick=()=>{questions=questions.filter(x=>x.id!==q.id);if(editingId===q.id)resetEditor();changed();render();};for(const [label,delta] of [['Subir',-1],['Descer',1]]){const b=node('button',label,tools,'secondary');b.type='button';b.disabled=i+delta<0||i+delta>=questions.length;b.onclick=()=>{[questions[i],questions[i+delta]]=[questions[i+delta],questions[i]];changed();render();};}const label=node('label','',tools,'check-label');const cb=document.createElement('input');cb.type='checkbox';cb.checked=q.pageBreak===true;label.append(cb,document.createTextNode('Começar em nova página'));cb.onchange=()=>{questions.find(x=>x.id===q.id).pageBreak=cb.checked;changed();render();};});
  bindMedia($('questions'));docEditor?.preview();
}
async function refresh(){const saved=check(await supabase.from('exams').select('id,title,version').order('created_at',{ascending:false}));$('saved-exams').replaceChildren(node('option','Selecione uma prova'));$('saved-exams').firstChild.value='';saved.forEach(r=>{const o=node('option',r.title,$('saved-exams'));o.value=r.id;});if(record)$('saved-exams').value=record.id;}
function resetEditor(){editingId=null;$('question-form').reset();questionExtras?.reset();$('submit-question').textContent='Adicionar questão';$('cancel-edit').hidden=true;}
function startEditing(q){if(($('statement').value.trim()||['A','B','C','D'].some(l=>$('option-'+l).value.trim()))&&!confirm('Substituir o texto ainda não adicionado no editor?'))return;editingId=q.id;$('statement').value=q.statement;q.options.forEach((o,i)=>$('option-'+String.fromCharCode(65+i)).value=o.text);$('correct').value=String.fromCharCode(65+q.options.findIndex(o=>o.id===q.correctId));questionExtras.edit(q);$('submit-question').textContent='Salvar alterações da questão';$('cancel-edit').hidden=false;revealCard($('question-form'));$('statement').focus();$('question-form').scrollIntoView({block:'start',behavior:'auto'});}
$('cancel-edit').onclick=resetEditor;
$('question-form').onsubmit=e=>{e.preventDefault();const statement=$('statement').value.trim();const texts=['A','B','C','D'].map(l=>$('option-'+l).value.trim());if(!statement||texts.some(t=>!t)){message('Preencha o enunciado e as quatro alternativas.');return;}let extra;try{extra=questionExtras.read();}catch(e){$('question-rich-tools').open=true;$('question-media-status').textContent=e.message;$('question-media-status').tabIndex=-1;$('question-media-status').focus();message(e.message);return;}if(!editingId&&questions.length>=200){message('Cada prova aceita até 200 questões.');return;}const id=editingId||crypto.randomUUID();const previous=questions.find(q=>q.id===editingId);const question={id,statement,...extra,options:texts.map((text,i)=>({id:id+'-'+i,text})),correctId:id+'-'+('ABCD'.indexOf($('correct').value)),...(previous?.source?{source:previous.source}: {}),pageBreak:previous?.pageBreak===true};if(editingId){questions=questions.map(q=>q.id===editingId?question:q);}else questions.push(question);resetEditor();changed();render();};
$('title').oninput=()=>{changed();$('preview-title').textContent=$('title').value.trim()||'Avaliação';};$('shuffle').onchange=()=>{changed();render();};
$('save').onclick=()=>action($('save'),async()=>{if(docEditor.isBusy())throw Error('Aguarde o envio do logo antes de salvar a avaliação.');const title=$('title').value.trim();if(!title)throw Error('Informe um título para a prova.');const payload={title,questions,layout:{...docEditor.read(),version:outputVersion,cadernoMode:1,legacyOrder},shuffle:$('shuffle').checked};if(new TextEncoder().encode(JSON.stringify(payload.layout)).length>11500)throw Error('O cabeçalho ficou muito extenso. Reduza o texto ou os dados da escola e tente salvar novamente.');
  if(record){record=conflict(check(await supabase.from('exams').update({...payload,version:record.version+1}).eq('id',record.id).eq('version',record.version).select('id,version')));}
  else{record=check(await supabase.from('exams').insert({...payload,owner_id:user.id}).select('id,version').single());}
  dirty=false;await refresh();message('Prova salva na sua conta.');
});
$('load').onclick=()=>action($('load'),async()=>{const id=$('saved-exams').value;if(!id)throw Error('Selecione uma prova.');if(dirty&&!confirm('Descartar o rascunho não salvo e abrir esta prova?'))return;const data=check(await supabase.from('exams').select('*').eq('id',id).single());record={id:data.id,version:data.version};questions=data.questions;legacyOrder=data.layout?.legacyOrder===true||(data.shuffle&&!data.layout?.cadernoMode);displayed=[];outputVersion=data.layout?.version||crypto.randomUUID().slice(0,8);docEditor.apply({...data.layout,idStyle:data.layout?.idStyle||(data.layout?.clean?'none':'letters')});resetEditor();$('title').value=data.title;$('shuffle').checked=data.shuffle;dirty=false;render();message('Prova carregada da sua conta.');});
$('refresh').onclick=()=>action($('refresh'),async()=>{await refresh();message('Lista atualizada. Abra a prova para carregar sua versão mais recente.');});
$('new').onclick=()=>{if(dirty&&!confirm('Descartar o rascunho não salvo?'))return;record=null;questions=[];displayed=[];legacyOrder=false;docEditor.apply();outputVersion=crypto.randomUUID().slice(0,8);dirty=false;resetEditor();$('title').value='Avaliação';$('shuffle').checked=false;$('saved-exams').value='';render();message('Nova prova. Adicione questões e salve na sua conta.');};
$('delete-exam').onclick=()=>action($('delete-exam'),async()=>{if(!record)throw Error('Abra uma prova salva antes de excluir.');if(!confirm('Excluir esta prova salva permanentemente?'))return;conflict(check(await supabase.from('exams').delete().eq('id',record.id).eq('version',record.version).select('id')));record=null;questions=[];dirty=false;resetEditor();render();await refresh();message('Prova excluída.');});
async function print(mode){if(!questions.length)return;try{await preparePrint(await hydrateDocuments([currentSnapshot()],mode==='key'),mode==='key');}catch(e){message(e.message);}}
$('print-exam').onclick=()=>print('exam');$('print-key').onclick=()=>print('key');window.addEventListener('afterprint',()=>{delete document.body.dataset.print;document.getElementById('print-document')?.replaceChildren();});
$('clear').onclick=()=>{if(questions.length&&confirm('Limpar as questões deste rascunho? A prova salva só muda quando você salvar.')){questions=[];resetEditor();changed();render();}};
function currentSnapshot(index=$('shuffle').checked?docEditor.read().booklet:0){return snapshot($('title').value.trim()||'Avaliação',arrangeBooklet(questions,index,$('shuffle').checked,legacyOrder),{...docEditor.read(),booklet:index},outputVersion);}
questionExtras=setupQuestionExtras({onDraft:changed});
docEditor=setupDocument({getSnapshot:()=>currentSnapshot(),getAllSnapshots:()=>Array.from({length:$('shuffle').checked?docEditor.read().copies:1},(_,i)=>currentSnapshot(i)),onChange:()=>{changed();render();},onView:render});
try{await refresh();$('workspace').disabled=false;render();message('Sua conta está conectada.');}catch(e){message('Não foi possível carregar suas provas: '+e.message);}

setupAI(q=>{if(questions.length>=200)throw Error('A prova já tem 200 questões. Remova uma antes de adicionar outra.');questions.push(q);changed();render();});
