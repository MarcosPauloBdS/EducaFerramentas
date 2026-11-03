import {supabase} from './client.mjs';
import {$,message} from './ui.mjs';
import {validateAuthInput,authErrorNotice} from './auth-feedback.mjs';

const callback=new URL('conta.html',location.href).href;
const query=new URLSearchParams(location.search);
const next=query.get('next');
const destination=['index.html','provas.html','relatorios.html','aparencia.html'].includes(next)?next:'index.html';
let recovery=location.hash.includes('type=recovery');
const fields=['email','password','new-password','confirm-password'];
function clearFeedback(){
  $('auth-feedback').hidden=true;
  fields.forEach(id=>{$(id).removeAttribute('aria-invalid');$(id).removeAttribute('aria-describedby');});
}
function feedback(notice,kind='error'){
  clearFeedback();
  const box=$('auth-feedback');box.dataset.kind=kind;
  $('auth-feedback-title').textContent=notice.title;
  $('auth-feedback-help').textContent=notice.help;
  (notice.fields||[]).forEach(id=>{if($(id)){$(id).setAttribute('aria-invalid','true');$(id).setAttribute('aria-describedby','auth-feedback-title auth-feedback-help');}});
  box.hidden=false;box.focus({preventScroll:true});box.scrollIntoView({block:'nearest',behavior:'auto'});
}
function unwrap(result){if(result.error)throw result.error;return result.data;}
async function submit(form,mode,run){
  clearFeedback();const controls=[...form.querySelectorAll('input,button')];controls.forEach(el=>el.disabled=true);form.setAttribute('aria-busy','true');
  try{await run();}catch(error){feedback(authErrorNotice(error,mode));}finally{controls.forEach(el=>el.disabled=false);form.removeAttribute('aria-busy');}
}
function showRecovery(){recovery=true;$('password-form').hidden=false;$('auth-form').hidden=true;$('signed-in').hidden=true;message('Escolha uma nova senha para sua conta.');}
supabase.auth.onAuthStateChange(event=>{if(event==='PASSWORD_RECOVERY')showRecovery();});

$('auth-form').onsubmit=e=>{
  e.preventDefault();const mode=e.submitter?.value||'login';
  const email=$('email').value.trim(),password=$('password').value;
  const invalid=validateAuthInput({mode,email,password});if(invalid){feedback(invalid);return;}
  submit($('auth-form'),mode,async()=>{
    if(mode==='login'){
      unwrap(await supabase.auth.signInWithPassword({email,password}));location.assign(destination);return;
    }
    if(mode==='signup'){
      const data=unwrap(await supabase.auth.signUp({email,password,options:{emailRedirectTo:callback}}));
      if(data.session){location.assign(destination);return;}
      feedback({title:'Confira sua caixa de entrada.',help:'Se o cadastro puder ser concluído, você receberá um e-mail de confirmação. Confira também o spam, abra o link neste navegador e depois entre na conta.'},'success');
    }else{
      unwrap(await supabase.auth.resetPasswordForEmail(email,{redirectTo:callback}));
      feedback({title:'Confira seu e-mail.',help:'Se houver uma conta elegível, enviaremos o link de recuperação. Confira a caixa de entrada e o spam e abra o link neste mesmo navegador.'},'success');
    }
    $('password').value='';
  });
};
$('password-form').onsubmit=e=>{
  e.preventDefault();const password=$('new-password').value,confirmation=$('confirm-password').value;
  const invalid=validateAuthInput({mode:'recovery',password,confirmation});if(invalid){feedback(invalid);return;}
  submit($('password-form'),'recovery',async()=>{unwrap(await supabase.auth.updateUser({password}));$('password-form').reset();location.assign('index.html');});
};
$('sign-out').onclick=()=>submit($('signed-in'),'logout',async()=>{unwrap(await supabase.auth.signOut({scope:'local'}));location.replace('conta.html');});
document.querySelectorAll('[data-account-action]').forEach(button=>button.disabled=false);

try{
  const {data:{session},error}=await supabase.auth.getSession();
  if(error||query.has('error'))feedback(authErrorNotice(error||{code:'otp_expired'},'recovery'));
  if(recovery&&session)showRecovery();
  if(session&&!recovery){const {data,error:userError}=await supabase.auth.getUser();if(!userError&&data.user){$('signed-in').hidden=false;$('auth-form').hidden=true;$('signed-email').textContent=data.user.email;}}
}catch(error){feedback(authErrorNotice(error,'login'));}
