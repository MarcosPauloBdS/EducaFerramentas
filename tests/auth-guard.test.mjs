import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const source=fs.readFileSync(new URL('../assets/session.mjs',import.meta.url),'utf8').replace(/^import .*;\r?\n/gm,'');
async function loadGuard(result){
 const elements={'protected-content':{hidden:true},gate:{hidden:false}};
 const redirects=[];let callback;
 const context={supabase:{auth:{getUser:async()=>result,onAuthStateChange:fn=>{callback=fn;}}},$:id=>elements[id],node:()=>{},location:{pathname:'/EducaFerramentas/provas.html',replace:url=>redirects.push(url)},window:{addEventListener:()=>{}},document:{addEventListener:()=>{},querySelectorAll:()=>[]}};
 const names=Object.keys(context);const values=Object.values(context);
 const factory=new Function(...names,source.replace('export async function requireUser','async function requireUser')+';return requireUser;');
 return {guard:factory(...values),elements,redirects,callback:()=>callback};
}
test('sem conta e com conta anônima: redireciona sem revelar ferramentas',async()=>{
 for(const result of [{data:{user:null},error:null},{data:{user:{id:'x',is_anonymous:true}},error:null},{data:{user:null},error:new Error('offline')}]){
  const c=await loadGuard(result);await assert.rejects(c.guard(),/Entre na sua conta/);assert.equal(c.elements['protected-content'].hidden,true);assert.deepEqual(c.redirects,['conta.html?next=provas.html']);
 }
});
test('conta verificada revela o conteúdo; fim de sessão volta a ocultar',async()=>{
 const c=await loadGuard({data:{user:{id:'teacher',email:'example@example.invalid'}},error:null});await c.guard();assert.equal(c.elements['protected-content'].hidden,false);assert.equal(c.elements.gate.hidden,true);c.callback()('SIGNED_OUT',null);assert.equal(c.elements['protected-content'].hidden,true);assert.equal(c.redirects.at(-1),'conta.html');
});
