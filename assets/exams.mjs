import {setupAI} from './ai-exams.mjs?v=20261103-ai2';
import {arrange} from './domain.mjs';
import {supabase} from './client.mjs';
import {requireUser} from './session.mjs';
import {$,node,message,action,check,conflict} from './ui.mjs?v=20261103-state2';
let questions=[],record=null,dirty=false,editingId=null;
const user=await requireUser();
const changed=()=>{dirty=true;message('Alterações no rascunho. Clique em Salvar prova na conta.');};
window.addEventListener('beforeunload',e=>{if(dirty){e.preventDefault();e.returnValue='';}});
function render(){
  const displayed=questions.map(q=>arrange(q,$('shuffle').checked));
  $('preview-title').textContent=$('title').value.trim()||'Avaliação';
  $('questions').replaceChildren();$('empty').hidden=questions.length>0;
  $('print-exam').disabled=$('print-key').disabled=questions.length===0;
  displayed.forEach((q,i)=>{const article=node('article','',$('questions'),'question');node('p',(i+1)+'. '+q.statement,article,'statement');const list=node('ol','',article);list.type='A';q.options.forEach(o=>node('li',o.text,list));node('p','Questão '+(i+1)+' — Gabarito: '+q.answer,article,'answer');const edit=node('button','Editar questão',article,'secondary no-print');edit.type='button';edit.onclick=()=>startEditing(questions.find(item=>item.id===q.id));const remove=node('button','Remover questão',article,'secondary no-print');remove.type='button';remove.onclick=()=>{questions=questions.filter(x=>x.id!==q.id);if(editingId===q.id)resetEditor();changed();render();};});
}
async function refresh(){const saved=check(await supabase.from('exams').select('id,title,version').order('created_at',{ascending:false}));$('saved-exams').replaceChildren(node('option','Selecione uma prova'));$('saved-exams').firstChild.value='';saved.forEach(r=>{const o=node('option',r.title,$('saved-exams'));o.value=r.id;});if(record)$('saved-exams').value=record.id;}
function resetEditor(){editingId=null;$('question-form').reset();$('submit-question').textContent='Adicionar questão';$('cancel-edit').hidden=true;}
function startEditing(q){if(($('statement').value.trim()||['A','B','C','D'].some(l=>$('option-'+l).value.trim()))&&!confirm('Substituir o texto ainda não adicionado no editor?'))return;editingId=q.id;$('statement').value=q.statement;q.options.forEach((o,i)=>$('option-'+String.fromCharCode(65+i)).value=o.text);$('correct').value=String.fromCharCode(65+q.options.findIndex(o=>o.id===q.correctId));$('submit-question').textContent='Salvar alterações da questão';$('cancel-edit').hidden=false;$('statement').focus();$('question-form').scrollIntoView({block:'start',behavior:'auto'});}
$('cancel-edit').onclick=resetEditor;
$('question-form').onsubmit=e=>{e.preventDefault();const statement=$('statement').value.trim();const texts=['A','B','C','D'].map(l=>$('option-'+l).value.trim());if(!statement||texts.some(t=>!t)){message('Preencha o enunciado e as quatro alternativas.');return;}if(!editingId&&questions.length>=200){message('Cada prova aceita até 200 questões.');return;}const id=editingId||crypto.randomUUID();const previous=questions.find(q=>q.id===editingId);const question={id,statement,options:texts.map((text,i)=>({id:id+'-'+i,text})),correctId:id+'-'+('ABCD'.indexOf($('correct').value)),...(previous?.source?{source:previous.source}: {})};if(editingId){questions=questions.map(q=>q.id===editingId?question:q);}else questions.push(question);resetEditor();changed();render();};
$('title').oninput=()=>{changed();$('preview-title').textContent=$('title').value.trim()||'Avaliação';};$('shuffle').onchange=()=>{changed();render();};
$('save').onclick=()=>action($('save'),async()=>{const title=$('title').value.trim();if(!title)throw Error('Informe um título para a prova.');const payload={title,questions,shuffle:$('shuffle').checked};
  if(record){record=conflict(check(await supabase.from('exams').update({...payload,version:record.version+1}).eq('id',record.id).eq('version',record.version).select('id,version')));}
  else{record=check(await supabase.from('exams').insert({...payload,owner_id:user.id}).select('id,version').single());}
  dirty=false;await refresh();message('Prova salva na sua conta.');
});
$('load').onclick=()=>action($('load'),async()=>{const id=$('saved-exams').value;if(!id)throw Error('Selecione uma prova.');if(dirty&&!confirm('Descartar o rascunho não salvo e abrir esta prova?'))return;const data=check(await supabase.from('exams').select('*').eq('id',id).single());record={id:data.id,version:data.version};questions=data.questions;resetEditor();$('title').value=data.title;$('shuffle').checked=data.shuffle;dirty=false;render();message('Prova carregada da sua conta.');});
$('refresh').onclick=()=>action($('refresh'),async()=>{await refresh();message('Lista atualizada. Abra a prova para carregar sua versão mais recente.');});
$('new').onclick=()=>{if(dirty&&!confirm('Descartar o rascunho não salvo?'))return;record=null;questions=[];dirty=false;resetEditor();$('title').value='Avaliação';$('shuffle').checked=false;$('saved-exams').value='';render();message('Nova prova. Adicione questões e salve na sua conta.');};
$('delete-exam').onclick=()=>action($('delete-exam'),async()=>{if(!record)throw Error('Abra uma prova salva antes de excluir.');if(!confirm('Excluir esta prova salva permanentemente?'))return;conflict(check(await supabase.from('exams').delete().eq('id',record.id).eq('version',record.version).select('id')));record=null;questions=[];dirty=false;resetEditor();render();await refresh();message('Prova excluída.');});
function print(mode){if(!questions.length)return;document.body.dataset.print=mode;window.print();}
$('print-exam').onclick=()=>print('exam');$('print-key').onclick=()=>print('key');window.addEventListener('afterprint',()=>delete document.body.dataset.print);
$('clear').onclick=()=>{if(questions.length&&confirm('Limpar as questões deste rascunho? A prova salva só muda quando você salvar.')){questions=[];resetEditor();changed();render();}};
try{await refresh();$('workspace').disabled=false;render();message('Sua conta está conectada.');}catch(e){message('Não foi possível carregar suas provas: '+e.message);}

setupAI(q=>{if(questions.length>=200)throw Error('A prova já tem 200 questões. Remova uma antes de adicionar outra.');questions.push(q);changed();render();});
