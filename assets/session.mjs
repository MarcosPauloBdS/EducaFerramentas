import {supabase} from './client.mjs';
import {$,node} from './ui.mjs';
export async function requireUser(){
  const {data,error}=await supabase.auth.getUser();
  if(error||!data.user||data.user.is_anonymous){const page=location.pathname.split('/').pop()||'index.html';location.replace('conta.html?next='+encodeURIComponent(page));throw Error('Entre na sua conta para continuar.');}
  const user=data.user;
  if($('account')){$('account').replaceChildren();node('span',user.email,$('account'));const out=node('button','Sair',$('account'),'secondary');out.onclick=async()=>{if(!confirm('Sair da conta neste dispositivo? Salve seu trabalho antes de continuar.'))return;out.disabled=true;const {error}=await supabase.auth.signOut({scope:'local'});if(error){out.disabled=false;alert('Não foi possível sair. Tente novamente.');return;}location.replace('conta.html');};}
  supabase.auth.onAuthStateChange((event,session)=>{if(!session||session.user.id!==user.id){if($('protected-content'))$('protected-content').hidden=true;location.replace('conta.html');}});
  window.addEventListener('pageshow',async event=>{if(!event.persisted)return;if($('protected-content'))$('protected-content').hidden=true;const result=await supabase.auth.getUser();if(result.error||result.data.user?.id!==user.id){location.replace('conta.html');return;}if($('protected-content'))$('protected-content').hidden=false;});
  document.addEventListener('visibilitychange',()=>{if(!document.hidden&&$('sync-hint'))$('sync-hint').textContent='Outro dispositivo pode ter alterações. Use Atualizar dados antes de editar.';});
  document.querySelectorAll('[data-auth-disabled]').forEach(el=>el.disabled=false);
  if($('gate'))$('gate').hidden=true;
  if($('protected-content'))$('protected-content').hidden=false;
  return user;
}
