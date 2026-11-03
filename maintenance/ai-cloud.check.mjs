import test from 'node:test';
import assert from 'node:assert/strict';
import {config} from '../assets/config.mjs';
const url=config.url+'/functions/v1/generate-exam';
test('função real bloqueia ausência de sessão e token inválido',async()=>{
 for(const token of ['', 'not-a-valid-user-token']){
  const response=await fetch(url,{headers:{apikey:config.publishableKey,...(token?{authorization:'Bearer '+token}:{})},signal:AbortSignal.timeout(20000)});
  assert.equal(response.status,401);assert.equal((await response.json()).code,'AUTH_REQUIRED');
 }
});
test('preflight real permite o site e recusa outra origem',async()=>{
 const good=await fetch(url,{method:'OPTIONS',headers:{origin:'https://marcospaulobds.github.io','Access-Control-Request-Method':'POST'},signal:AbortSignal.timeout(20000)});assert.equal(good.status,204);assert.equal(good.headers.get('Access-Control-Allow-Origin'),'https://marcospaulobds.github.io');
 const bad=await fetch(url,{method:'OPTIONS',headers:{origin:'https://other.invalid'},signal:AbortSignal.timeout(20000)});assert.equal(bad.status,403);assert.equal(bad.headers.get('Access-Control-Allow-Origin'),null);
});
