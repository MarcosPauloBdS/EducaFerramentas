import {supabase} from './client.mjs';
import {$,node,check} from './ui.mjs';
export async function requireUser(){
  const {data,error}=await supabase.auth.getUser();
  if(error||!data.user||data.user.is_anonymous){location.replace('conta.html');throw Error('Entre na sua conta para continuar.');}
  const user=data.user;
  if($('account')){$('account').replaceChildren();node('span',user.email,$('account'));const out=node('button','Sair',$('account'),'secondary');out.onclick=async()=>{out.disabled=true;const {error}=await supabase.auth.signOut({scope:'local'});if(error){out.disabled=false;alert('Não foi possível sair. Tente novamente.');return;}location.replace('conta.html');};}
  supabase.auth.onAuthStateChange((event,session)=>{if(!session||session.user.id!==user.id)location.replace('conta.html');});
  document.addEventListener('visibilitychange',()=>{if(!document.hidden&&$('sync-hint'))$('sync-hint').textContent='Outro dispositivo pode ter alterações. Use Atualizar dados antes de editar.';});
  document.querySelectorAll('[data-auth-disabled]').forEach(el=>el.disabled=false);
  return user;
}
