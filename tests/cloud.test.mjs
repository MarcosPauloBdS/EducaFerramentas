import test from 'node:test';
import assert from 'node:assert/strict';
import {config} from '../assets/config.mjs';

test('configuração aponta exclusivamente ao EducaFerramentas e usa chave publicável',()=>{
  assert.equal(config.url,'https://ywhynggtlxqlrkshttch.supabase.co');
  assert.match(config.publishableKey,/^sb_publishable_/);
});
test('API real recusa leitura anônima nas quatro tabelas',async()=>{
  for(const table of ['classrooms','students','grade_reports','exams']){
    const response=await fetch(`${config.url}/rest/v1/${table}?select=id`,{headers:{apikey:config.publishableKey},signal:AbortSignal.timeout(15000)});
    assert.ok([401,403].includes(response.status),`${table}: esperado bloqueio, recebido ${response.status}`);
  }
});
