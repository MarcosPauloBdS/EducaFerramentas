import test from 'node:test';
import assert from 'node:assert/strict';
import {conflict,check} from '../assets/ui.mjs';
import {action} from '../assets/ui.mjs';
test('ações preservam o estado de impressão atualizado ao carregar uma prova',async()=>{
 const print={disabled:true},fieldset={disabled:false,querySelectorAll:()=>[print]},button={disabled:false,closest:selector=>selector==='fieldset'?fieldset:null};
 await action(button,async()=>{assert.equal(fieldset.disabled,true);print.disabled=false;});
 assert.equal(fieldset.disabled,false);assert.equal(print.disabled,false);
});
test('conflito entre dispositivos não é tratado como salvamento',()=>{
  assert.throws(()=>conflict([]),/outro dispositivo/);
  assert.equal(conflict([{id:'saved',version:2}]).version,2);
  assert.throws(()=>check({error:{message:'falha de rede'}}),/falha de rede/);
});
