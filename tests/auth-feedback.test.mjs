import test from 'node:test';
import assert from 'node:assert/strict';
import {MIN_PASSWORD_LENGTH,validateAuthInput,authErrorNotice} from '../assets/auth-feedback.mjs';

test('cadastro e recuperação aceitam seis caracteres e rejeitam cinco',()=>{
 assert.equal(MIN_PASSWORD_LENGTH,6);
 for(const mode of ['signup','recovery']){
  assert.match(validateAuthInput({mode,email:'pessoa@dominio.com',password:'abc12',confirmation:'abc12'}).title,/6 caracteres/);
  assert.equal(validateAuthInput({mode,email:'pessoa@dominio.com',password:'abc123',confirmation:'abc123'}),null);
 }
});
test('campos vazios, formato de e-mail e confirmação têm orientação específica',()=>{
 for(const input of [{mode:'login'},{mode:'login',email:'invalido'},{mode:'login',email:'pessoa@dominio.com'},{mode:'recovery',password:'abcdef',confirmation:'diferente'}]){
  const n=validateAuthInput(input);assert.ok(n.title);assert.ok(n.help);assert.ok(n.fields.length);
 }
 assert.equal(validateAuthInput({mode:'reset',email:'pessoa@dominio.com'}),null);
});
test('credenciais incorretas ou conta inexistente têm a mesma mensagem e solução',()=>{
 const expected=authErrorNotice({code:'invalid_credentials'});
 assert.equal(expected.title,'E-mail ou senha inválidos');
 assert.match(expected.help,/Esqueci a senha/);
 assert.deepEqual(authErrorNotice({code:'user_not_found'}),expected);
 assert.deepEqual(authErrorNotice({code:'email_not_found'}),expected);
});
test('falhas do serviço e de conexão não expõem texto bruto e orientam como continuar',()=>{
 for(const e of [{code:'email_not_confirmed'},{code:'weak_password'},{code:'over_email_send_rate_limit'},{status:429},{name:'AuthRetryableFetchError'},{name:'TypeError'},{status:503},{code:'otp_expired'},{code:'same_password'},{message:'sensitive provider detail'}]){
  const n=authErrorNotice(e);assert.ok(n.title);assert.ok(n.help.length>20);assert.ok(!JSON.stringify(n).includes('sensitive provider detail'));
 }
});
