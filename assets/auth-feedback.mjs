export const MIN_PASSWORD_LENGTH=6;
const notice=(title,help,fields=[])=>({title,help,fields});
export function validateAuthInput({mode,email='',password='',confirmation=''}){
  if(mode!=='recovery'){
    if(!email.trim())return notice('Informe seu e-mail.','Digite o e-mail da sua conta no campo E-mail.',['email']);
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))return notice('Confira o formato do e-mail.','Digite um endereço completo, como nome@dominio.com.',['email']);
  }
  if(mode==='reset')return null;
  const field=mode==='recovery'?'new-password':'password';
  if(!password)return notice('Informe sua senha.',mode==='login'?'Digite sua senha. Se não lembrar, escolha “Esqueci a senha”.':'Escolha uma senha com pelo menos 6 caracteres.',[field]);
  if(mode!=='login'&&password.length<MIN_PASSWORD_LENGTH)return notice('A senha precisa ter pelo menos 6 caracteres.','Adicione mais caracteres à senha e tente novamente.',[field]);
  if(mode==='recovery'&&password!==confirmation)return notice('As senhas não coincidem.','Digite a mesma senha nos dois campos e salve novamente.',['new-password','confirm-password']);
  return null;
}
export function authErrorNotice(error,mode='login'){
  const code=error?.code;
  if(code==='invalid_credentials'||(mode==='login'&&['user_not_found','email_not_found'].includes(code)))return notice('E-mail ou senha inválidos','Confira os dois campos e tente novamente. Se não lembrar a senha, escolha “Esqueci a senha”. Se ainda não tem conta, escolha “Criar conta”.',['email','password']);
  if(code==='email_not_confirmed')return notice('Confirme seu e-mail para entrar.','Abra o link de confirmação recebido, confira a pasta de spam e depois tente entrar novamente.');
  if(code==='weak_password')return notice('Esta senha não foi aceita.','Use uma senha com pelo menos 6 caracteres. Prefira uma combinação diferente de letras e números.',[mode==='recovery'?'new-password':'password']);
  if(['email_address_invalid','validation_failed'].includes(code))return notice('Não foi possível aceitar os dados informados.','Confira o endereço de e-mail e os campos preenchidos e tente novamente.',['email']);
  if(['over_request_rate_limit','over_email_send_rate_limit'].includes(code)||error?.status===429)return notice('Muitas tentativas em pouco tempo.','Aguarde alguns minutos antes de tentar novamente. Se você pediu um e-mail, confira a caixa de entrada e o spam antes de repetir.');
  if(code==='email_address_not_authorized')return notice('Não foi possível enviar o e-mail para este endereço.','O envio para novos endereços ainda precisa ser liberado pela equipe do EducaFerramentas. Tente novamente após essa liberação.');
  if(['email_exists','user_already_exists'].includes(code))return notice('Não foi possível concluir o cadastro.','Se você já criou uma conta, use “Entrar no meu espaço” ou “Esqueci a senha”. Caso contrário, confira os dados e tente novamente.');
  if(['signup_disabled','email_provider_disabled'].includes(code))return notice('O cadastro está temporariamente indisponível.','Tente mais tarde. Se já tem uma conta, use “Entrar no meu espaço”.');
  if(['otp_expired','flow_state_expired','flow_state_not_found','bad_code_verifier','session_not_found','refresh_token_not_found','refresh_token_already_used'].includes(code))return notice('Este link ou sua sessão expirou.','Volte à entrada, solicite um novo link em “Esqueci a senha” e abra-o no mesmo navegador.');
  if(code==='same_password')return notice('Escolha uma senha diferente da anterior.','Digite uma nova senha com pelo menos 6 caracteres e repita-a no campo de confirmação.',['new-password','confirm-password']);
  if(code==='reauthentication_needed')return notice('Entre novamente para alterar sua senha.','Volte à entrada e faça login. Se não lembrar a senha, solicite um novo link em “Esqueci a senha”.');
  if(error?.name==='AuthRetryableFetchError'||error?.name==='TypeError'||error?.status===0)return notice('Não foi possível conectar agora.','Confira sua conexão com a internet e tente novamente. Seus campos foram mantidos.');
  if(error?.status>=500)return notice('O serviço está temporariamente indisponível.','Aguarde alguns instantes e tente novamente. Seus campos foram mantidos.');
  return notice('Não foi possível concluir agora.','Confira sua conexão e tente novamente. Se continuar, tente mais tarde ou use “Esqueci a senha” para recuperar o acesso.');
}
