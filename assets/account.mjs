import {supabase} from './client.mjs';
import {$,message,check,action} from './ui.mjs';
const callback=new URL('conta.html',location.href).href;
let recovery=location.hash.includes('type=recovery');
const showRecovery=()=>{$('password-form').hidden=false;$('auth-form').hidden=true;message('Escolha uma nova senha para sua conta.');};
supabase.auth.onAuthStateChange((event)=>{if(event==='PASSWORD_RECOVERY'){recovery=true;showRecovery();}});
const query=new URLSearchParams(location.search);
const {data:{session},error:initError}=await supabase.auth.getSession();
if(initError||query.has('error'))message('O link expirou ou não pôde ser validado. Solicite outro e abra no mesmo navegador.');
if(recovery&&session)showRecovery();
if(session){$('signed-in').hidden=false;$('signed-email').textContent=session.user.email;}
$('auth-form').onsubmit=e=>{e.preventDefault();const mode=e.submitter.value;action(e.submitter,async()=>{const email=$('email').value.trim(),password=$('password').value;if(mode==='login'){if(!password)throw Error('Informe sua senha.');check(await supabase.auth.signInWithPassword({email,password}));location.assign('relatorios.html');}
else if(mode==='signup'){if(password.length<12)throw Error('Use uma senha com pelo menos 12 caracteres.');const data=check(await supabase.auth.signUp({email,password,options:{emailRedirectTo:callback}}));message(data.session?'Conta criada. Você já pode abrir suas turmas.':'Se o cadastro puder ser concluído, você receberá um e-mail de confirmação. Abra o link neste navegador e depois entre na conta.');if(data.session)location.assign('relatorios.html');}
else{check(await supabase.auth.resetPasswordForEmail(email,{redirectTo:callback}));message('Se houver uma conta elegível, enviaremos o link de recuperação. Abra neste mesmo navegador.');}$('password').value='';});};
$('password-form').onsubmit=e=>{e.preventDefault();action(e.submitter,async()=>{const password=$('new-password').value;if(password.length<12)throw Error('Use pelo menos 12 caracteres.');if(password!==$('confirm-password').value)throw Error('As senhas não coincidem.');check(await supabase.auth.updateUser({password}));$('password-form').reset();message('Senha atualizada.');location.assign('relatorios.html');});};
$('sign-out').onclick=()=>action($('sign-out'),async()=>{check(await supabase.auth.signOut({scope:'local'}));location.replace('conta.html');});
