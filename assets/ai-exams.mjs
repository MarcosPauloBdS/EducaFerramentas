import {supabase} from './client.mjs';
import {$,node} from './ui.mjs';
export function aiErrorMessage(code,retryAfter=0){
  if(code==='AI_NOT_CONFIGURED')return 'A geração por IA está em ativação. Por enquanto, crie suas questões manualmente.';
  if(code==='AUTH_REQUIRED')return 'Sua sessão expirou. Entre novamente pela opção Conta e tente gerar outra vez.';
  if(code==='USER_DAILY_LIMIT')return 'Você atingiu o limite diário de geração. Volte após a renovação da cota ou continue criando questões manualmente.';
  if(code==='PROJECT_DAILY_LIMIT')return 'A cota diária de IA do projeto terminou. Tente novamente após a renovação ou use a criação manual.';
  if(code==='COOLDOWN')return `Aguarde ${Math.max(1,Math.ceil(retryAfter||60))} segundos antes de gerar novamente. Você pode continuar na criação manual.`;
  if(code==='PROVIDER_LIMIT')return 'O serviço de IA atingiu seu limite temporário. Aguarde alguns minutos e tente novamente, sem repetir várias solicitações.';
  if(code==='INVALID_INPUT'||code==='BODY_TOO_LARGE')return 'Confira o tema, a disciplina e a quantidade de 1 a 3 questões. Use apenas conteúdo curricular e tente novamente.';
  if(code==='INVALID_OUTPUT')return 'A resposta da IA não passou pela validação. Nenhuma questão foi adicionada. Tente novamente com um tema mais específico ou crie a questão manualmente.';
  if(code==='CONTENT_CHECK_FAILED')return 'Uma verificação matemática identificou inconsistência nas alternativas ou no gabarito. Nenhuma questão foi adicionada. Tente gerar novamente ou crie a questão manualmente.';
  if(code==='PROVIDER_TIMEOUT')return 'A IA demorou além do esperado. Nenhuma questão foi adicionada. Aguarde um pouco e tente novamente ou use a criação manual.';
  if(code==='AI_CONFIGURATION')return 'A IA está temporariamente indisponível. A equipe do projeto precisa revisar a ativação; por enquanto, use a criação manual.';
  return 'Não foi possível acessar a IA agora. Confira sua conexão e tente mais tarde. A criação manual continua disponível.';
}
export function setupAI(onAdd){
  let available=false,busy=false;
  const tell=(text,focus=false)=>{$('ai-status').textContent=text;if(focus){$('ai-status').focus({preventScroll:true});$('ai-status').scrollIntoView({block:'nearest',behavior:'auto'});}};
  async function invoke(method,body){
    const {data,error}=await supabase.functions.invoke('generate-exam',{method,...(body?{body}:{})});
    if(error){let result={};try{result=await error.context.json();}catch{}throw Error(aiErrorMessage(result.code,result.retryAfter));}return data;
  }
  async function availability(){
    if(busy)return;$('check-ai').disabled=true;$('generate-ai').disabled=true;
    try{const data=await invoke('GET');available=data.available===true;tell(available?'Pronta para gerar sugestões. Revise o conteúdo antes de usar.':aiErrorMessage('AI_NOT_CONFIGURED'));}
    catch(error){available=false;tell(error.message);}
    finally{$('check-ai').disabled=false;$('generate-ai').disabled=!available;}
  }
  function showSuggestions(questions){
    $('ai-results').replaceChildren();
    for(const [i,q] of questions.entries()){
      const card=node('article','',$('ai-results'),'ai-suggestion');node('h3','Sugestão '+(i+1),card);node('p',q.statement,card);const list=node('ol','',card);list.type='A';q.options.forEach(o=>node('li',o.text,list));
      const details=node('details','',card);node('summary','Ver gabarito e justificativa',details);node('p','Resposta: '+String.fromCharCode(65+q.options.findIndex(o=>o.id===q.correctId)),details);node('p',q.explanation,details);
      const add=node('button','Adicionar à prova',card,'secondary');add.type='button';add.onclick=()=>{try{onAdd(q);add.disabled=true;add.textContent='Adicionada';tell('Questão adicionada ao rascunho. Você pode editá-la na prévia. Salve a prova na sua conta.',true);}catch(e){tell(e.message,true);}};
    }
  }
  $('ai-form').onsubmit=async e=>{
    e.preventDefault();if(busy||!available)return;
    const input={topic:$('ai-topic').value.trim(),subject:$('ai-subject').value.trim(),level:$('ai-level').value,difficulty:$('ai-difficulty').value,count:Number($('ai-count').value)};
    if(input.topic.length<3||input.topic.length>160||input.subject.length>60||!Number.isInteger(input.count)||input.count<1||input.count>3){tell(aiErrorMessage('INVALID_INPUT'),true);return;}
    if($('ai-results').children.length&&!confirm('Substituir as sugestões anteriores? As questões já adicionadas à prova serão mantidas.'))return;
    busy=true;$('ai-form').setAttribute('aria-busy','true');const controls=[...$('ai-form').querySelectorAll('input,select,button')];controls.forEach(el=>el.disabled=true);$('check-ai').disabled=true;tell('Gerando sugestões… Sua prova atual será mantida.');
    try{const data=await invoke('POST',input);if(!Array.isArray(data?.questions)||data.questions.length!==input.count)throw Error(aiErrorMessage('INVALID_OUTPUT'));showSuggestions(data.questions);tell('Sugestões prontas. Confira enunciados, alternativas e respostas antes de adicionar. Solicitações restantes hoje: '+data.remaining+'.',true);}
    catch(error){tell(error.message,true);}
    finally{busy=false;controls.forEach(el=>el.disabled=false);$('ai-form').removeAttribute('aria-busy');$('check-ai').disabled=false;$('generate-ai').disabled=!available;}
  };
  $('check-ai').onclick=availability;
  availability();
}
