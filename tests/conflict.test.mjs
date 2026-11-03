import test from 'node:test';
import assert from 'node:assert/strict';
import {conflict,check} from '../assets/ui.mjs';
test('conflito entre dispositivos não é tratado como salvamento',()=>{
  assert.throws(()=>conflict([]),/outro dispositivo/);
  assert.equal(conflict([{id:'saved',version:2}]).version,2);
  assert.throws(()=>check({error:{message:'falha de rede'}}),/falha de rede/);
});
